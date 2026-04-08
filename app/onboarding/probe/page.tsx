'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import NeummLogo from '@/components/NeummLogo'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Question {
  id: string
  outcome_id: string
  nesa_outcome_code: string
  difficulty_band: number
  content_json: {
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
  }
  correct_answer: string
  explanation: string
}

interface ProbeAnswer {
  question_id: string
  outcome_id: string
  difficulty_band: number
  selected: string
  correct: string
  is_correct: boolean
  time_ms: number
}

// 8 probe questions: two each at the key decision bands (3 and 5)
const TARGET_BANDS = [1, 2, 3, 3, 4, 5, 5, 6]

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
const OPTION_KEYS  = ['a', 'b', 'c', 'd'] as const

// ─── Course inference ──────────────────────────────────────────────────────────
function assignCourse(answers: ProbeAnswer[]): string {
  const byBand: Record<number, boolean[]> = {}
  for (const a of answers) {
    if (!byBand[a.difficulty_band]) byBand[a.difficulty_band] = []
    byBand[a.difficulty_band].push(a.is_correct)
  }
  const allOk  = (band: number) => (byBand[band] ?? [true]).every(Boolean)
  const anyBad = (band: number) => (byBand[band] ?? []).some(c => !c)

  // Priority order — most restrictive first
  if (anyBad(1) || anyBad(2) || anyBad(3)) return 'Standard'
  if ([1,2,3,4].every(allOk) && anyBad(5))  return 'Advanced'
  if ([1,2,3,4,5].every(allOk) && anyBad(6)) return 'Extension 1'
  if ([1,2,3,4,5,6].every(allOk))           return 'Extension 2'
  return 'Standard'
}

// ─── Phase type ────────────────────────────────────────────────────────────────
type Phase = 'loading' | 'active' | 'feedback' | 'saving' | 'error'

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProbePage() {
  const router = useRouter()
  const [phase, setPhase]         = useState<Phase>('loading')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers]     = useState<ProbeAnswer[]>([])
  const [selected, setSelected]   = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const startRef = useRef<number>(0)

  // ── Load questions ────────────────────────────────────────────────────────
  useEffect(() => { loadProbeQuestions() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadProbeQuestions() {
    try {
      const supabase = createSupabaseBrowserClient()

      // Fetch a pool per band so we can pick without repetition
      const uniqueBands = [1, 2, 3, 4, 5, 6]
      const pool: Record<number, Question[]> = {}

      await Promise.all(uniqueBands.map(async (band) => {
        const { data, error } = await supabase
          .from('questions')
          .select('id, outcome_id, nesa_outcome_code, difficulty_band, content_json, correct_answer, explanation')
          .eq('difficulty_band', band)
          .limit(10)

        if (error) throw error
        // Shuffle client-side
        pool[band] = (data ?? []).sort(() => Math.random() - 0.5)
      }))

      // Build the 8-question probe without repeating question IDs
      const probe: Question[] = []
      const used = new Set<string>()
      const cursor: Record<number, number> = {}

      for (const band of TARGET_BANDS) {
        const available = pool[band] ?? []
        // advance cursor past already-used ids
        if (!cursor[band]) cursor[band] = 0
        while (cursor[band] < available.length && used.has(available[cursor[band]].id)) {
          cursor[band]++
        }
        if (cursor[band] < available.length) {
          const q = available[cursor[band]]
          probe.push(q)
          used.add(q.id)
          cursor[band]++
        }
      }

      if (probe.length === 0) {
        setLoadError('No questions found. Please contact support.')
        setPhase('error')
        return
      }

      setQuestions(probe)
      setPhase('active')
      startRef.current = Date.now()
    } catch (err) {
      console.error(err)
      setLoadError('Failed to load questions. Please refresh.')
      setPhase('error')
    }
  }

  // ── Handle answer selection ───────────────────────────────────────────────
  function handleSelect(optionKey: string) {
    if (phase !== 'active' || selected) return

    const timeMs  = Date.now() - startRef.current
    const q       = questions[currentIdx]
    const correct = q.correct_answer.toLowerCase()
    const isOk    = optionKey === correct

    setSelected(optionKey)
    setPhase('feedback')

    const newAnswers: ProbeAnswer[] = [
      ...answers,
      {
        question_id: q.id,
        outcome_id:  q.outcome_id,
        difficulty_band: q.difficulty_band,
        selected: optionKey,
        correct,
        is_correct: isOk,
        time_ms: timeMs,
      },
    ]
    setAnswers(newAnswers)
  }

  // ── Finish & save ─────────────────────────────────────────────────────────
  async function finishProbe(finalAnswers: ProbeAnswer[]) {
    setPhase('saving')
    const supabase = createSupabaseBrowserClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const course = assignCourse(finalAnswers)
    const now    = new Date().toISOString()

    // 1 — Update student_profiles
    await supabase.from('student_profiles').upsert(
      { user_id: user.id, course, placement_probe_completed: true },
      { onConflict: 'user_id' }
    )

    // 2 — Seed mastery_map (one row per probe question)
    const masteryRows = finalAnswers.map((a) => {
      const dayMs   = 24 * 60 * 60 * 1000
      const reviewIn = a.is_correct ? 3 * dayMs : 1 * dayMs
      return {
        user_id:          user.id,
        outcome_id:       a.outcome_id,
        status:           a.is_correct ? 'learning' : 'needs_work',
        confidence_pct:   a.is_correct ? 50 : 5,
        last_tested_at:   now,
        next_review_at:   new Date(Date.now() + reviewIn).toISOString(),
        difficulty_band:  a.difficulty_band,
        predicted_hsc_band: a.is_correct
          ? parseFloat(a.difficulty_band.toFixed(1))
          : Math.max(1, a.difficulty_band - 1) * 1.0,
      }
    })

    await supabase.from('mastery_map').upsert(masteryRows, {
      onConflict: 'user_id,outcome_id',
    })

    // 3 — Save probe attempts to error_log (wrong answers only)
    const errorRows = finalAnswers
      .filter(a => !a.is_correct)
      .map(a => ({
        user_id:           user.id,
        question_id:       a.question_id,
        outcome_id:        a.outcome_id,
        error_type:        'probe_incorrect',
        hint_used:         false,
        time_to_respond_ms: a.time_ms,
      }))

    if (errorRows.length > 0) {
      await supabase.from('error_log').insert(errorRows)
    }

    router.push('/onboarding/map')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const progress = questions.length > 0
    ? Math.round(((phase === 'saving' ? questions.length : currentIdx) / questions.length) * 100)
    : 0

  // Loading
  if (phase === 'loading') {
    return (
      <Screen>
        <div className="flex flex-col items-center gap-4">
          <NeummLogo size={44} />
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <SpinnerIcon color="#FFDA00" />
            Preparing your placement probe…
          </div>
        </div>
      </Screen>
    )
  }

  // Error
  if (phase === 'error') {
    return (
      <Screen>
        <div
          className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-sm"
          style={{ border: '1.5px solid #F0E980' }}
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6">{loadError}</p>
          <button
            onClick={() => { setPhase('loading'); loadProbeQuestions() }}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{ background: '#FFDA00', color: '#0F0F14' }}
          >
            Try again
          </button>
        </div>
      </Screen>
    )
  }

  // Saving
  if (phase === 'saving') {
    const course = assignCourse(answers)
    const correct = answers.filter(a => a.is_correct).length
    return (
      <Screen>
        <div
          className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-sm"
          style={{ border: '1.5px solid #F0E980' }}
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Probe complete!</h2>
          <p className="text-sm text-gray-500 mb-6">
            {correct} of {answers.length} correct
          </p>
          <div
            className="rounded-xl px-6 py-4 mb-6"
            style={{ backgroundColor: '#FFFBF0', border: '1.5px solid #F0E980' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#0F0F14' }}>
              Recommended course
            </p>
            <p className="text-2xl font-bold" style={{ color: '#0F0F14' }}>{course}</p>
            <p className="text-xs text-gray-500 mt-1">Mathematics</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <SpinnerIcon color="#FFDA00" />
            Building your mastery map…
          </div>
        </div>
      </Screen>
    )
  }

  // Active / feedback
  const q        = questions[currentIdx]
  const optionBg = (key: string) => {
    if (!selected) return '#FFFFFF'
    if (key === q.correct_answer.toLowerCase()) return '#D1FAE5' // green
    if (key === selected && !q.correct_answer.toLowerCase().includes(key)) return '#FEE2E2' // red
    return '#FFFFFF'
  }
  const optionBorder = (key: string) => {
    if (!selected) return '#E5E7EB'
    if (key === q.correct_answer.toLowerCase()) return '#10B981'
    if (key === selected) return '#EF4444'
    return '#E5E7EB'
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFBF0', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-0">
        <div className="flex items-center justify-between mb-3">
          <NeummLogo size={28} />
          <span className="text-xs font-black" style={{ color: '#0F0F14' }}>
            {currentIdx + 1} / {questions.length}
          </span>
          {/* Band pill */}
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#FFDA00', color: '#0F0F14' }}
          >
            Band {q.difficulty_band}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#FFDA00' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-6 pb-8 gap-6">

        {/* Metadata chips */}
        <div className="flex gap-2 flex-wrap">
          {/* Outcome chip: dark bg so white text is readable */}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: '#0F0F14' }}
          >
            {q.nesa_outcome_code}
          </span>
          {/* Difficulty chip: yellow bg with dark text */}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#F0E980', color: '#0F0F14' }}
          >
            Difficulty {q.difficulty_band}
          </span>
        </div>

        {/* Question */}
        <div
          className="bg-white rounded-2xl shadow-sm px-5 py-5"
          style={{ border: '1.5px solid #F0E980' }}
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Question</p>
          <p className="text-gray-900 text-base leading-relaxed font-medium">
            {q.content_json.question_text}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {OPTION_KEYS.map((key, i) => {
            const text = q.content_json[`option_${key}` as keyof typeof q.content_json]
            const isCorrectSelected = selected && key === q.correct_answer.toLowerCase()
            const isWrongSelected   = selected === key && !isCorrectSelected

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={!!selected}
                className="w-full text-left rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] disabled:cursor-default"
                style={{
                  minHeight: 56,
                  borderColor: optionBorder(key),
                  backgroundColor: optionBg(key),
                }}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Label circle */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all"
                    style={{
                      backgroundColor: isCorrectSelected
                        ? '#10B981'
                        : isWrongSelected
                        ? '#EF4444'
                        : selected
                        ? '#F3F4F6'
                        : '#FFFBF0',
                      color: isCorrectSelected || isWrongSelected ? '#FFFFFF' : '#0F0F14',
                    }}
                  >
                    {OPTION_LABELS[i]}
                  </div>

                  <span
                    className="text-sm font-medium leading-snug"
                    style={{
                      color: isCorrectSelected
                        ? '#065F46'
                        : isWrongSelected
                        ? '#991B1B'
                        : '#111827',
                    }}
                  >
                    {text}
                  </span>

                  {/* Tick / cross */}
                  {isCorrectSelected && (
                    <svg className="ml-auto shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isWrongSelected && (
                    <svg className="ml-auto shrink-0 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation (shown after answer) */}
        {selected && (
          <div
            className="rounded-2xl px-5 py-4 border"
            style={{
              backgroundColor: '#F0FDF4',
              borderColor: '#86EFAC',
            }}
          >
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">Explanation</p>
            <p className="text-sm text-green-900 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Next question button */}
        {selected && (
          <button
            onClick={() => {
              const next = currentIdx + 1
              if (next < questions.length) {
                setCurrentIdx(next)
                setSelected(null)
                setPhase('active')
                startRef.current = Date.now()
              } else {
                finishProbe(answers)
              }
            }}
            className="w-full py-3.5 rounded-2xl text-sm font-black transition-all active:scale-[0.98]"
            style={{ background: '#FFDA00', color: '#0F0F14' }}
          >
            {currentIdx + 1 < questions.length ? 'Next question →' : 'See my results →'}
          </button>
        )}

        {/* Tap prompt (no answer yet) */}
        {!selected && (
          <p className="text-center text-xs text-gray-400 mt-auto">
            Tap an answer to continue
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#FFFBF0', fontFamily: "'Nunito', sans-serif" }}
    >
      {children}
    </div>
  )
}

function SpinnerIcon({ color = 'currentColor', className = '' }: { color?: string; className?: string }) {
  return (
    <svg className={`animate-spin h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" style={{ color }}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
