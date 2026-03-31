'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getNextQuestion, submitAnswer }              from './actions'
import { getHint, getExplanation }                   from '@/lib/actions/tutor'
import { logLearningEvent }                          from '@/lib/actions/events'
import type { PracticeQuestion, SubmitResult }        from './actions'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'ready' | 'submitting' | 'answered'
type TutorMode = 'idle' | 'hint' | 'explanation'

// ─── Streak toast ──────────────────────────────────────────────────────────────

function StreakToast({ streak, visible }: { streak: number; visible: boolean }) {
  if (!visible) return null
  return (
    <div
      className="fixed bottom-24 md:bottom-8 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full shadow-2xl text-white font-bold text-sm pointer-events-none"
      style={{
        transform: 'translateX(-50%)',
        backgroundColor: '#EF4444',
        animation: 'streakToastIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards',
      }}
    >
      <span style={{ fontSize: 20 }}>🔥</span>
      <span>{streak} day streak!</span>
    </div>
  )
}

const OPTIONS: Array<{ key: 'a' | 'b' | 'c' | 'd'; label: string }> = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C' },
  { key: 'd', label: 'D' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────────

function bandLabel(band: number): string {
  const labels: Record<number, string> = {
    1: 'Band 1 — Foundation',
    2: 'Band 2 — Working',
    3: 'Band 3 — Competent',
    4: 'Band 4 — Solid',
    5: 'Band 5 — Advanced',
    6: 'Band 6 — Expert',
  }
  return labels[band] ?? `Band ${band}`
}

function confidenceColor(conf: number): string {
  if (conf >= 80) return '#10B981'
  if (conf >= 50) return '#F59E0B'
  return '#EF4444'
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

// ─── Mastery update panel ─────────────────────────────────────────────────────
//
// Shown after every submission. Animates from prevConf → newConf and
// colour-codes the status chip. Also shows the predicted HSC band.

const STATUS_META = {
  mastered: { label: 'Mastered', bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  shaky:    { label: 'Shaky',    bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  gap:      { label: 'Gap',      bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
} as const

function MasteryUpdatePanel({
  prevConf,
  newConf,
  delta,
  newStatus,
  predictedHscBand,
}: {
  prevConf:         number
  newConf:          number
  delta:            number
  newStatus:        'mastered' | 'shaky' | 'gap'
  predictedHscBand: number
}) {
  const positive = delta > 0
  const meta     = STATUS_META[newStatus]
  const barColor = meta.dot

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2.5"
      style={{ backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}
    >
      {/* Row 1: delta chip + confidence bar */}
      <div className="flex items-center gap-2.5">
        {/* Delta */}
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{
            backgroundColor: positive ? '#D1FAE5' : '#FEE2E2',
            color:            positive ? '#065F46' : '#991B1B',
          }}
        >
          {positive ? '+' : ''}{delta}
        </span>

        {/* Bar: prev → new (CSS transition handles animation) */}
        <div className="flex-1 flex items-center gap-1.5">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
            {/* Previous confidence ghost */}
            <div
              className="absolute inset-y-0 left-0 rounded-full opacity-30"
              style={{ width: `${prevConf}%`, backgroundColor: barColor }}
            />
            {/* New confidence (animates in) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${newConf}%`, backgroundColor: barColor }}
            />
          </div>
          <span className="text-xs font-bold shrink-0" style={{ color: barColor }}>
            {newConf}%
          </span>
        </div>
      </div>

      {/* Row 2: status chip + HSC band */}
      <div className="flex items-center justify-between">
        {/* Status */}
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: meta.bg, color: meta.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: meta.dot }}
          />
          {meta.label}
        </span>

        {/* Predicted HSC band */}
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-gray-400">Predicted band</p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5, 6].map(b => (
              <div
                key={b}
                className="w-3 h-3 rounded-sm transition-colors duration-500"
                style={{
                  backgroundColor: b <= predictedHscBand ? '#185FA5' : '#E5E7EB',
                }}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-600">
            Band {predictedHscBand}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Tutor Panel ────────────────────────────────────────────────────────────────

function TutorPanel({
  mode,
  tutorText,
  tutorLoading,
}: {
  mode:        TutorMode
  tutorText:   string
  tutorLoading: boolean
}) {
  if (mode === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: '#EEF4FB' }}>
          <svg className="w-6 h-6" style={{ color: '#185FA5' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-500">Neumm Tutor</p>
        <p className="text-xs text-gray-400 mt-1">
          {"Tap \"I need a hint\" if you're stuck, or submit your answer to see a full explanation."}
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#185FA5' }}>
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-xs font-bold text-gray-700">
          {mode === 'hint' ? 'Tutor Hint' : 'Step-by-step explanation'}
        </p>
      </div>

      {tutorLoading ? (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: '#185FA5', animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">Thinking…</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {mode === 'explanation' ? (
            // Render numbered steps
            <div className="space-y-2.5">
              {tutorText.split('\n').filter(l => l.trim()).map((line, i) => {
                const isStep = /^\d+\./.test(line.trim())
                return isStep ? (
                  <div key={i} className="flex gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: '#EEF4FB', color: '#185FA5' }}
                    >
                      {line.trim().match(/^(\d+)\./)?.[1]}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {line.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ) : (
                  <p key={i} className="text-xs text-gray-500 italic mt-2">{line}</p>
                )
              })}
            </div>
          ) : (
            <div
              className="rounded-xl p-3 text-sm text-gray-700 leading-relaxed"
              style={{ backgroundColor: '#F0F6FF', borderLeft: '3px solid #185FA5' }}
            >
              {tutorText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function PracticeSession({
  userId,
  sessionId: initialSessionId,
  questionsRemaining: initialRemaining = -1,
  dailyLimit = -1,
}: {
  userId:              string
  sessionId:           string
  questionsRemaining?: number   // -1 = unlimited
  dailyLimit?:         number
}) {
  const [phase,          setPhase]          = useState<Phase>('loading')
  const [question,       setQuestion]       = useState<PracticeQuestion | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [result,         setResult]         = useState<SubmitResult | null>(null)
  const [hintUsed,       setHintUsed]       = useState(false)
  const [hintCount,      setHintCount]      = useState(0)
  const [tutorMode,      setTutorMode]      = useState<TutorMode>('idle')
  const [tutorText,      setTutorText]      = useState('')
  const [tutorLoading,   setTutorLoading]   = useState(false)
  const [sessionId]                         = useState(initialSessionId)
  const [elapsed,        setElapsed]        = useState(0)     // seconds displayed
  const startMsRef                          = useRef<number>(0)
  const timerRef                            = useRef<ReturnType<typeof setInterval> | null>(null)
  const questionCount                       = useRef(0)
  const [showMobileTutor, setShowMobileTutor] = useState(false)
  const [streakToastVisible, setStreakToastVisible] = useState(false)
  const [toastStreak,        setToastStreak]        = useState(0)
  const toastTimerRef                               = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [remaining,          setRemaining]          = useState(initialRemaining)
  const [limitReached,       setLimitReached]       = useState(false)

  // ── Session-level event tracking refs ───────────────────────────────────────
  // These live in refs (not state) so they're always current inside callbacks
  // and cleanup handlers without causing re-renders.
  const sessionStartMsRef    = useRef(Date.now())   // wall-clock start of session
  const sessionAnswersRef    = useRef(0)             // questions answered this session
  const sessionCorrectRef    = useRef(0)             // correct answers this session
  const sessionEndedRef      = useRef(false)         // guard against double-firing

  // ── Load next question ──────────────────────────────────────────────────────
  const loadNext = useCallback(async () => {
    setPhase('loading')
    setSelectedOption(null)
    setResult(null)
    setHintUsed(false)
    setHintCount(0)
    setTutorMode('idle')
    setTutorText('')
    setShowMobileTutor(false)
    setElapsed(0)

    const q = await getNextQuestion(userId)

    // null can mean "daily limit hit" or "bank exhausted"
    if (!q) {
      // If we have a finite limit and remaining is 0, treat as daily cap
      if (dailyLimit !== -1 && remaining === 0) {
        setLimitReached(true)
        setPhase('loading')
        return
      }
    }

    setQuestion(q)
    setPhase(q ? 'ready' : 'loading')

    // Start timer
    startMsRef.current = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startMsRef.current) / 1000))
    }, 1000)
    questionCount.current += 1
  }, [userId])

  useEffect(() => { loadNext() }, [loadNext])

  // ── Session end logger ──────────────────────────────────────────────────────
  //
  // Fires session_ended exactly once — guarded by sessionEndedRef.
  // Called from: component unmount, question bank exhausted, daily limit hit.

  const endSession = useCallback(() => {
    if (sessionEndedRef.current) return
    sessionEndedRef.current = true

    const duration_ms         = Date.now() - sessionStartMsRef.current
    const questions_attempted = sessionAnswersRef.current
    const correct             = sessionCorrectRef.current
    const accuracy_pct        = questions_attempted > 0
      ? Math.round((correct / questions_attempted) * 100)
      : 0

    void logLearningEvent(userId, 'session_ended', {
      duration_ms,
      questions_attempted,
      accuracy_pct,
    })
  }, [userId])

  useEffect(() => {
    return () => {
      if (timerRef.current)      clearInterval(timerRef.current)
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      // Best-effort: fires on unmount (navigation away, tab close, etc.)
      endSession()
    }
  }, [endSession])

  // ── Submit answer ───────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!question || !selectedOption || phase !== 'ready') return

    if (timerRef.current) clearInterval(timerRef.current)
    const timeMs = Date.now() - startMsRef.current

    setPhase('submitting')

    const res = await submitAnswer({
      userId,
      sessionId,
      questionId:       question.id,
      masteryOutcomeId: question.mastery_outcome_id,
      difficultyBand:   question.difficulty_band,
      selectedOption,
      correctAnswer:    question.correct_answer,
      hintUsed,
      timeMs,
      explanation:      question.explanation,
      step_by_step:     question.step_by_step,
    })

    setResult(res)
    setPhase('answered')

    // ── Track remaining questions ───────────────────────────────────────────────
    setRemaining(prev => (prev === -1 ? -1 : Math.max(0, prev - 1)))

    // ── Update session-level accuracy refs for session_ended event ──────────────
    sessionAnswersRef.current += 1
    if (res.isCorrect) sessionCorrectRef.current += 1

    // ── Streak celebration ──────────────────────────────────────────────────────
    if (res.streakUpdated && res.newStreak >= 1) {
      // Write animation payload to localStorage for dashboard to pick up
      try {
        localStorage.setItem('neumm_streak_anim', JSON.stringify({
          from: Math.max(0, res.newStreak - 1),
          to:   res.newStreak,
          ts:   Date.now(),
        }))
      } catch {}

      // Show toast
      setToastStreak(res.newStreak)
      setStreakToastVisible(true)
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      toastTimerRef.current = setTimeout(() => setStreakToastVisible(false), 3200)
    }
  }

  // ── Hint ────────────────────────────────────────────────────────────────────
  async function handleHint() {
    if (!question) return
    setHintUsed(true)
    setHintCount(prev => prev + 1)
    setTutorMode('hint')
    setTutorLoading(true)
    setShowMobileTutor(true)

    const { hint } = await getHint(
      question.id,
      selectedOption ?? '',
      hintCount + 1,
    )
    setTutorText(hint)
    setTutorLoading(false)
  }

  // ── AI Explanation ──────────────────────────────────────────────────────────
  async function handleExplanation() {
    if (!question) return
    setTutorMode('explanation')
    setTutorLoading(true)
    setShowMobileTutor(true)

    // Log explanation_viewed immediately when the student requests it
    void logLearningEvent(userId, 'explanation_viewed', {
      question_id: question.id,
      outcome_id:  question.mastery_outcome_id,
    })

    const { explanation } = await getExplanation(question.id)
    setTutorText(explanation)
    setTutorLoading(false)
  }

  // ── Visual event handlers ────────────────────────────────────────────────────
  //
  // Called by visual aid components (diagrams, worked examples, etc.) when built.
  // Logging fires immediately; the component handles its own display state.

  const handleVisualOpened = useCallback((visualType: string) => {
    if (!question) return
    void logLearningEvent(userId, 'visual_opened', {
      visual_type: visualType,
      outcome_id:  question.mastery_outcome_id,
    })
  }, [userId, question])

  const handleVisualSkipped = useCallback((visualType: string, timeOnVisualMs: number) => {
    void logLearningEvent(userId, 'visual_skipped', {
      visual_type:        visualType,
      time_on_visual_ms:  timeOnVisualMs,
      outcome_id:         question?.mastery_outcome_id,
    })
  }, [userId, question])

  // ── Topic override handler ───────────────────────────────────────────────────
  //
  // Called if a topic-selector UI is added. Logs the navigation decision with
  // both source and target outcomes so the Intelligence Layer can measure
  // self-directed learning patterns.

  const handleTopicOverride = useCallback((fromOutcomeId: string, toOutcomeId: string) => {
    void logLearningEvent(userId, 'topic_overridden', {
      from_outcome_id: fromOutcomeId,
      to_outcome_id:   toOutcomeId,
    })
  }, [userId])

  // Suppress "unused" warnings — these are consumed by future child components
  void handleVisualOpened
  void handleVisualSkipped
  void handleTopicOverride

  // ─── Render ───────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }} />
          <p className="text-sm text-gray-400">Loading question…</p>
        </div>
      </div>
    )
  }

  // ── Daily limit reached mid-session ────────────────────────────────────────
  if (limitReached) {
    endSession()
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
          <span className="text-4xl mb-4 block">⚡</span>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {"That's your lot for today!"}
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {`You've used all ${dailyLimit} questions for today. Great work — come back tomorrow or upgrade for more.`}
          </p>
          <a
            href="/account/upgrade"
            className="inline-block w-full py-3 rounded-xl font-bold text-sm text-white text-center"
            style={{ backgroundColor: '#185FA5' }}
          >
            Upgrade for unlimited →
          </a>
        </div>
      </div>
    )
  }

  if (!question) {
    // Bank fully exhausted — log session end
    endSession()
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-lg font-bold text-gray-900">{"You've answered every question!"}</h2>
          <p className="text-sm text-gray-500 mt-1">New questions will be added soon. Check back tomorrow!</p>
        </div>
      </div>
    )
  }

  const { content, difficulty_band, topic_name, current_confidence, nesa_outcome_code } = question
  const isAnswered    = phase === 'answered'
  const isSubmitting  = phase === 'submitting'
  const isInteractive = phase === 'ready'

  return (
    <div className="flex min-h-screen">

      {/* ── Left: Question Panel ── */}
      <div className="flex-1 min-w-0 flex flex-col px-5 md:px-8 py-7 md:max-w-2xl">

        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-5">
          {/* Topic + band badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#EEF4FB', color: '#185FA5' }}
            >
              {topic_name}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
              {bandLabel(difficulty_band)}
            </span>
            {nesa_outcome_code && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 text-gray-400">
                {nesa_outcome_code}
              </span>
            )}
          </div>

          {/* Right-side controls: remaining pill + timer */}
          <div className="flex items-center gap-3">
            {/* Daily remaining pill — shown only when capped */}
            {dailyLimit !== -1 && remaining !== -1 && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: remaining <= 2 ? '#FEF2F2' : '#F3F4F6',
                  color:            remaining <= 2 ? '#EF4444'  : '#6B7280',
                }}
              >
                ⚡ {remaining} left
              </span>
            )}
            {/* Timer */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatMs(elapsed * 1000)}
            </div>
          </div>
        </div>

        {/* ── Confidence bar (before answer) ── */}
        {isInteractive && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">Topic confidence</span>
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${current_confidence}%`,
                  backgroundColor: confidenceColor(current_confidence),
                }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: confidenceColor(current_confidence) }}>
              {current_confidence}%
            </span>
          </div>
        )}

        {/* ── Question text ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="text-base md:text-lg font-medium text-gray-900 leading-relaxed">
            {content.question_text}
          </p>
        </div>

        {/* ── Options ── */}
        <div className="space-y-2.5 mb-5">
          {OPTIONS.map(opt => {
            const optText = content[`option_${opt.key}` as keyof typeof content]
            const isSelected = selectedOption === opt.key
            const isCorrect  = result?.correctAnswer === opt.key

            let borderColor = '#E5E7EB'
            let bgColor     = '#FFFFFF'
            let textColor   = '#374151'
            let labelBg     = '#F9FAFB'
            let labelColor  = '#6B7280'

            if ((isInteractive || isSubmitting) && isSelected) {
              borderColor = '#185FA5'
              bgColor     = '#F0F6FF'
              labelBg     = '#185FA5'
              labelColor  = '#FFFFFF'
            }

            if (isAnswered) {
              if (isCorrect) {
                borderColor = '#10B981'
                bgColor     = '#F0FDF4'
                labelBg     = '#10B981'
                labelColor  = '#FFFFFF'
                textColor   = '#065F46'
              } else if (isSelected && !isCorrect) {
                borderColor = '#EF4444'
                bgColor     = '#FEF2F2'
                labelBg     = '#EF4444'
                labelColor  = '#FFFFFF'
                textColor   = '#991B1B'
              }
            }

            return (
              <button
                key={opt.key}
                onClick={() => { if (isInteractive) setSelectedOption(opt.key) }}
                disabled={!isInteractive}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left min-h-[52px]"
                style={{ borderColor, backgroundColor: bgColor, color: textColor }}
              >
                {/* Option label bubble */}
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                  style={{ backgroundColor: labelBg, color: labelColor }}
                >
                  {opt.label}
                </span>
                <span className="flex-1 text-sm font-medium">{optText}</span>

                {/* Result icon */}
                {isAnswered && isCorrect && (
                  <svg className="shrink-0 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <svg className="shrink-0 w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Action buttons ── */}
        {isInteractive ? (
          <div className="flex items-center gap-3">
            {/* Hint */}
            <button
              onClick={handleHint}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-all min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              I need a hint
              {hintCount > 0 && (
                <span className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EEF4FB', color: '#185FA5' }}>
                  {hintCount}
                </span>
              )}
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 min-h-[44px]"
              style={{ backgroundColor: '#185FA5', color: '#FFFFFF' }}
            >
              Submit Answer
            </button>
          </div>
        ) : isSubmitting ? (
          /* Checking state */
          <div className="flex items-center justify-center gap-2 py-3">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }} />
            <span className="text-sm text-gray-500">Checking answer…</span>
          </div>
        ) : (
          /* Post-answer actions */
          <div className="space-y-2.5">
            {/* Correct / incorrect banner + real-time mastery update */}
            {result && (
              <>
                {/* Banner */}
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                  style={{
                    backgroundColor: result.isCorrect ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${result.isCorrect ? '#BBF7D0' : '#FECACA'}`,
                  }}
                >
                  <span
                    className="text-base font-bold"
                    style={{ color: result.isCorrect ? '#15803D' : '#DC2626' }}
                  >
                    {result.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </span>
                  <span
                    className="text-xs font-medium ml-auto"
                    style={{ color: result.isCorrect ? '#15803D' : '#DC2626' }}
                  >
                    {result.isCorrect
                      ? `+${result.delta} confidence`
                      : `${result.delta} confidence`}
                  </span>
                </div>

                {/* Real-time mastery update panel */}
                <MasteryUpdatePanel
                  prevConf={result.prevConfidence}
                  newConf={result.newConfidence}
                  delta={result.delta}
                  newStatus={result.newStatus}
                  predictedHscBand={result.predictedHscBand}
                />
              </>
            )}

            <div className="flex gap-3">
              {/* Explanation (AI) */}
              <button
                onClick={handleExplanation}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-all min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Show explanation
              </button>

              {/* Next question */}
              <button
                onClick={loadNext}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all min-h-[44px]"
                style={{ backgroundColor: '#185FA5', color: '#FFFFFF' }}
              >
                Next Question →
              </button>
            </div>
          </div>
        )}

        {/* ── Mobile tutor: full-screen overlay (hidden on md+ where side panel takes over) ── */}
        {/* Keyboard-aware: fixed inset-0 fills the visual viewport. On iOS the keyboard
            shrinks the visual viewport, so the panel naturally sits above it.
            Safe-area-inset-bottom keeps the close button clear of the home indicator. */}
        {showMobileTutor && (
          <div
            className="md:hidden fixed inset-0 z-50 flex flex-col bg-white"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#185FA5' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {tutorMode === 'hint' ? 'Tutor Hint' : 'Step-by-step Explanation'}
                </p>
              </div>
              <button
                onClick={() => setShowMobileTutor(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200"
                aria-label="Close tutor"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <TutorPanel mode={tutorMode} tutorText={tutorText} tutorLoading={tutorLoading} />
            </div>
            {/* Footer CTA: go back to question */}
            <div className="px-5 py-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setShowMobileTutor(false)}
                className="w-full py-3 rounded-xl text-sm font-bold text-white min-h-[44px]"
                style={{ backgroundColor: '#185FA5' }}
              >
                Back to question
              </button>
            </div>
          </div>
        )}

        {/* ── Session progress (subtle footer) ── */}
        <p className="text-xs text-gray-300 text-center mt-6">
          {sessionAnswersRef.current > 0
            ? `${sessionAnswersRef.current} answered · ${Math.round((sessionCorrectRef.current / sessionAnswersRef.current) * 100)}% accurate this session`
            : `Question ${questionCount.current} this session`
          }
        </p>
      </div>

      {/* ── Right: Tutor Panel (desktop only) ── */}
      <aside
        className="hidden md:flex flex-col shrink-0 bg-white border-l border-gray-100"
        style={{ width: 280, minHeight: '100vh' }}
      >
        <div className="px-5 py-5 border-b border-gray-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Neumm Tutor</p>
        </div>
        <div className="flex-1">
          <TutorPanel mode={tutorMode} tutorText={tutorText} tutorLoading={tutorLoading} />
        </div>
      </aside>

      {/* ── Streak toast (portal-like fixed overlay) ── */}
      <StreakToast streak={toastStreak} visible={streakToastVisible} />

      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes streakToastIn {
          0%   { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.88); }
          60%  { opacity: 1; transform: translateX(-50%) translateY(-4px)  scale(1.04); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  )
}
