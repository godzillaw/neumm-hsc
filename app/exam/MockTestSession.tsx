'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter }     from 'next/navigation'
import MathText          from '@/components/MathText'
import { finalizeMockAttempt } from './mock-actions'
import type { MockQuestion, MockTestConfig } from './mock-actions'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

// ─── Answer tracking ──────────────────────────────────────────────────────────

interface AnswerRecord {
  questionId:     string
  position:       number
  topicPrefix:    string
  difficultyBand: number
  studentAnswer:  string | null
  questionText:   string
  optionA:        string
  optionB:        string
  optionC:        string
  optionD:        string
  startedAt:      number
  timeSecs:       number
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MockTestSession({
  attemptId,
  config,
  questions,
}: {
  attemptId: string
  config:    MockTestConfig
  questions: MockQuestion[]
}) {
  const router = useRouter()

  const totalSecs   = config.timeLimitMins * 60
  const [timeLeft,  setTimeLeft]  = useState(totalSecs)
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Track per-question answers
  const answersRef  = useRef<AnswerRecord[]>(
    questions.map((q, i) => ({
      questionId:     q.id,
      position:       i + 1,
      topicPrefix:    q.topicPrefix,
      difficultyBand: q.difficultyBand,
      studentAnswer:  null,
      questionText:   q.questionText,
      optionA:        q.optionA,
      optionB:        q.optionB,
      optionC:        q.optionC,
      optionD:        q.optionD,
      startedAt:      Date.now(),
      timeSecs:       0,
    }))
  )
  const questionStartRef = useRef(Date.now())
  const startTimeRef     = useRef(Date.now())

  // ── Countdown timer ────────────────────────────────────────────────────────
  const handleSubmitRef = useRef<((timedOut: boolean) => void) | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmitRef.current?.(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (timedOut: boolean) => {
    if (submitting) return
    setSubmitting(true)

    // Record time on current question
    const now = Date.now()
    answersRef.current[current].timeSecs = Math.round((now - questionStartRef.current) / 1000)

    const timeTakenSecs = Math.round((now - startTimeRef.current) / 1000)

    const result = await finalizeMockAttempt({
      attemptId,
      timeTakenSecs,
      timedOut,
      answers: answersRef.current,
    })

    if ('error' in result) {
      setSubmitting(false)
      return
    }

    router.push(`/exam/${attemptId}/review`)
  }, [attemptId, current, router, submitting])

  // Wire ref so timer can call it
  useEffect(() => { handleSubmitRef.current = handleSubmit }, [handleSubmit])

  // ── Navigate between questions ─────────────────────────────────────────────
  function goTo(idx: number) {
    // Save time on current question
    const now = Date.now()
    answersRef.current[current].timeSecs += Math.round((now - questionStartRef.current) / 1000)
    questionStartRef.current = now

    // Restore selection from saved answer
    setSelected(answersRef.current[idx].studentAnswer)
    setCurrent(idx)
  }

  function handleSelect(option: string) {
    setSelected(option)
    answersRef.current[current].studentAnswer = option
  }

  function handleNext() {
    if (current < questions.length - 1) {
      goTo(current + 1)
    } else {
      setShowConfirm(true)
    }
  }

  function handleSkip() {
    answersRef.current[current].studentAnswer = null
    if (current < questions.length - 1) {
      goTo(current + 1)
    } else {
      setShowConfirm(true)
    }
  }

  const q         = questions[current]
  const answered  = answersRef.current.filter(a => a.studentAnswer !== null).length
  const progress  = ((current + 1) / questions.length) * 100

  const timerColor = timeLeft <= 120 ? '#EF4444' : timeLeft <= 300 ? '#F59E0B' : '#10B981'

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080D16' }}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-white font-black text-lg">Marking your test…</p>
          <p className="text-white/40 text-sm mt-1">Generating your results</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F3FF', fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Fixed top bar ────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex flex-col">
            <p className="text-xs font-black text-gray-900 truncate max-w-[160px]">{config.title}</p>
            <p className="text-[10px] text-gray-400">Q {current + 1} of {questions.length}</p>
          </div>

          {/* Timer */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-sm"
            style={{
              background: timeLeft <= 120 ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.05)',
              color: timerColor,
            }}
          >
            <span>⏱</span>
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Submit early */}
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs font-black px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500"
          >
            Submit
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#7C3AED,#A855F7)' }}
          />
        </div>
      </div>

      {/* ── Question area ─────────────────────────────────────────────────── */}
      <div className="flex-1 pt-20 pb-32 px-4 max-w-2xl mx-auto w-full">

        {/* Topic pill */}
        <div className="flex items-center gap-2 mb-4 mt-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
            {q.topicName}
          </span>
          <span className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-full">
            Band {q.difficultyBand}
          </span>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-sm border border-purple-50 p-5 mb-5">
          <MathText
            text={q.questionText}
            as="p"
            className="text-base font-semibold text-gray-900 leading-relaxed"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          {([q.optionA, q.optionB, q.optionC, q.optionD] as string[]).map((opt, i) => {
            if (!opt) return null
            const label   = OPTION_LABELS[i].toLowerCase()
            const isChosen = selected === label
            return (
              <button
                key={label}
                onClick={() => handleSelect(label)}
                className="w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.99]"
                style={{
                  borderColor: isChosen ? '#7C3AED' : '#E5E7EB',
                  background:  isChosen ? 'rgba(124,58,237,0.07)' : 'white',
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{
                    background: isChosen ? '#7C3AED' : '#F3F4F6',
                    color:      isChosen ? 'white'   : '#6B7280',
                  }}
                >
                  {OPTION_LABELS[i]}
                </span>
                <MathText text={opt} className="flex-1 text-sm font-semibold text-gray-800" />
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Fixed bottom actions ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-500"
          >
            Skip →
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="flex-[2] py-3 rounded-2xl font-black text-sm text-white disabled:opacity-40 transition-all"
            style={{ background: selected ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : '#D1D5DB' }}
          >
            {current < questions.length - 1 ? 'Next →' : 'Finish Test →'}
          </button>
        </div>

        {/* Mini question map */}
        <div className="max-w-2xl mx-auto mt-3 flex gap-1 flex-wrap justify-center">
          {questions.map((_, i) => {
            const ans = answersRef.current[i].studentAnswer
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="w-6 h-6 rounded-md text-[10px] font-black flex items-center justify-center"
                style={{
                  background: i === current ? '#7C3AED' : ans ? '#A855F7' : '#F3F4F6',
                  color: i === current || ans ? 'white' : '#9CA3AF',
                }}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Confirm submit modal ──────────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-4xl text-center mb-3">📋</div>
            <h2 className="text-lg font-black text-gray-900 text-center mb-1">Submit test?</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              {answered} of {questions.length} questions answered.{' '}
              {questions.length - answered > 0 && `${questions.length - answered} will be marked as skipped.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-600"
              >
                Keep going
              </button>
              <button
                onClick={() => { setShowConfirm(false); void handleSubmit(false) }}
                className="flex-1 py-3 rounded-2xl font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
              >
                Submit →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
