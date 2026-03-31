'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter }                                 from 'next/navigation'
import {
  startExam, finalizeExam,
  type ExamQuestion, type ExamSubmission,
  type ExamResult, type TopicResult,
} from './actions'
import { EXAM_CATEGORIES } from './categories'

// ─── Constants ────────────────────────────────────────────────────────────────

const FULL_EXAM_QUESTIONS  = 40
const TOPIC_EXAM_QUESTIONS = 15
const FULL_EXAM_SECONDS    = 60 * 60   // 60 min
const TOPIC_EXAM_SECONDS   = 20 * 60   // 20 min

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function bandColor(band: number): string {
  if (band >= 5) return '#10B981'
  if (band >= 3) return '#F59E0B'
  return '#EF4444'
}

function accuracyColor(accuracy: number): string {
  if (accuracy >= 0.8) return '#10B981'
  if (accuracy >= 0.5) return '#F59E0B'
  return '#EF4444'
}

// ─── Topic selector ───────────────────────────────────────────────────────────

function TopicSelector({
  categoryMastery,
  onSelect,
}: {
  categoryMastery: Record<string, number>
  onSelect: (config: { prefixes: string[]; count: number; seconds: number; label: string }) => void
}) {
  return (
    <div className="px-5 md:px-10 py-6 md:py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Exam Mode</h1>
      <p className="text-sm text-gray-400 mb-7">
        Band 4–6 questions only. No hints. Explanations shown after submission.
      </p>

      {/* Full exam card */}
      <button
        onClick={() => onSelect({
          prefixes: [],
          count:    FULL_EXAM_QUESTIONS,
          seconds:  FULL_EXAM_SECONDS,
          label:    'Full HSC Exam',
        })}
        className="w-full text-left rounded-2xl p-5 mb-6 transition-all active:scale-[0.99]"
        style={{ background: 'linear-gradient(135deg, #185FA5 0%, #1a74c8 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-200 uppercase tracking-wide mb-1">
              Recommended
            </p>
            <h2 className="text-xl font-bold text-white">Full HSC Exam</h2>
            <p className="text-sm text-blue-200 mt-1">
              {FULL_EXAM_QUESTIONS} questions · All topics · 60 minutes
            </p>
          </div>
          <span className="text-4xl">📋</span>
        </div>
      </button>

      {/* Category grid */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
        Or practise a specific topic
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXAM_CATEGORIES.map(cat => {
          const mastery = categoryMastery[cat.name] ?? -1
          return (
            <button
              key={cat.name}
              onClick={() => onSelect({
                prefixes: cat.prefixes,
                count:    TOPIC_EXAM_QUESTIONS,
                seconds:  TOPIC_EXAM_SECONDS,
                label:    cat.name,
              })}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-left transition-all hover:border-blue-200 hover:shadow active:scale-[0.98]"
            >
              <div
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: '#EEF4FB', color: '#185FA5' }}
              >
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.prefixes.length} topics · 20 min</p>
              </div>
              {/* Mastery indicator */}
              {mastery >= 0 && (
                <div
                  className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: mastery >= 80 ? '#D1FAE5' : mastery >= 50 ? '#FEF3C7' : '#FEE2E2',
                    color:           mastery >= 80 ? '#065F46' : mastery >= 50 ? '#92400E' : '#991B1B',
                  }}
                >
                  {mastery}%
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Exam results screen ──────────────────────────────────────────────────────

function ResultsScreen({
  result,
  examLabel,
  onRetry,
}: {
  result:    ExamResult
  examLabel: string
  onRetry:   () => void
}) {
  const router        = useRouter()
  const [showReview, setShowReview] = useState(false)
  const accuracyPct   = Math.round(result.accuracy * 100)
  const bandCol       = bandColor(result.predicted_hsc_band)

  return (
    <div className="px-5 md:px-10 py-8 max-w-3xl mx-auto pb-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Exam complete · {examLabel}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Your Results</h1>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm font-semibold text-gray-400 hover:text-gray-600"
        >
          Dashboard →
        </button>
      </div>

      {/* Score banner — stacks vertically on mobile to avoid cramped layout */}
      <div
        className="rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
        style={{ background: 'linear-gradient(135deg, #185FA5 0%, #1a74c8 100%)' }}
      >
        {/* Score circle */}
        <div className="shrink-0 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <span className="text-3xl font-black text-white leading-none">{accuracyPct}%</span>
            <span className="text-xs text-blue-200 mt-0.5">{result.correct}/{result.total}</span>
          </div>
        </div>
        {/* Metrics */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-blue-200 text-sm">Predicted HSC Band</span>
            <span
              className="text-sm font-black px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: bandCol, color: '#fff' }}
            >
              Band {result.predicted_hsc_band}
            </span>
          </div>
          {/* Band bar */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map(b => (
              <div
                key={b}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: b <= result.predicted_hsc_band
                    ? bandCol
                    : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          <p className="text-xs text-blue-200 mt-1.5">
            Based on performance across {result.by_topic.length} topic
            {result.by_topic.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* By-topic breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Topic breakdown</h2>
        <div className="space-y-4">
          {result.by_topic.map(topic => (
            <TopicResultRow key={topic.topic_prefix} topic={topic} />
          ))}
        </div>
        {result.by_topic.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No answers recorded.</p>
        )}
      </div>

      {/* Review answers toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <button
          onClick={() => setShowReview(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-gray-800"
        >
          <span>Review answers ({result.total})</span>
          <svg
            className="w-4 h-4 text-gray-400 transition-transform"
            style={{ transform: showReview ? 'rotate(180deg)' : 'none' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showReview && (
          <div className="border-t border-gray-50 divide-y divide-gray-50">
            {result.question_results.map((qr, i) => (
              <div key={qr.id} className="px-5 py-4">
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: qr.is_correct ? '#D1FAE5' : '#FEE2E2',
                      color:           qr.is_correct ? '#065F46' : '#991B1B',
                    }}
                  >
                    {qr.is_correct ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 mb-1">
                      Q{i + 1} · {qr.topic_name} · Band {qr.difficulty_band}
                    </p>
                    <p className="text-sm text-gray-700">{qr.content.question_text}</p>
                  </div>
                </div>
                {/* Options */}
                <div className="ml-7 grid grid-cols-1 gap-1 mb-2">
                  {(['a', 'b', 'c', 'd'] as const).map(opt => {
                    const text     = qr.content[`option_${opt}`]
                    const isCorrect = opt === qr.correct_answer
                    const isSelected = opt === qr.selected_option
                    return (
                      <div
                        key={opt}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs"
                        style={{
                          backgroundColor:
                            isCorrect  ? '#D1FAE5' :
                            isSelected ? '#FEE2E2' : '#F9FAFB',
                          color:
                            isCorrect  ? '#065F46' :
                            isSelected ? '#991B1B' : '#6B7280',
                          fontWeight: (isCorrect || isSelected) ? 600 : 400,
                        }}
                      >
                        <span className="uppercase font-bold">{opt}.</span>
                        <span>{text}</span>
                        {isCorrect  && <span className="ml-auto">✓ correct</span>}
                        {isSelected && !isCorrect && <span className="ml-auto">✗ your answer</span>}
                      </div>
                    )
                  })}
                </div>
                {/* Explanation */}
                {qr.explanation && (
                  <div
                    className="ml-7 rounded-lg p-2.5 text-xs text-gray-600"
                    style={{ backgroundColor: '#F0F6FF', borderLeft: '3px solid #185FA5' }}
                  >
                    {qr.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 min-h-[48px]"
        >
          Take another exam
        </button>
        <button
          onClick={() => router.push('/practice')}
          className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white min-h-[48px]"
          style={{ backgroundColor: '#185FA5' }}
        >
          Practice weak topics →
        </button>
      </div>
    </div>
  )
}

function TopicResultRow({ topic }: { topic: TopicResult }) {
  const pct     = Math.round(topic.accuracy * 100)
  const acColor = accuracyColor(topic.accuracy)
  const delta   = topic.practice_confidence >= 0
    ? pct - topic.practice_confidence
    : null

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-gray-700 truncate">{topic.topic_name}</p>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {delta !== null && (
            <span
              className="text-xs font-semibold"
              style={{ color: delta >= 0 ? '#10B981' : '#EF4444' }}
            >
              {delta >= 0 ? `+${delta}` : delta} vs practice
            </span>
          )}
          <span className="text-xs font-bold" style={{ color: acColor }}>
            {topic.correct}/{topic.total}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: bandColor(topic.exam_band) + '22',
              color:            bandColor(topic.exam_band),
            }}
          >
            Band {topic.exam_band}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: acColor }}
        />
      </div>
    </div>
  )
}

// ─── Active exam ──────────────────────────────────────────────────────────────

function ActiveExam({
  userId,
  sessionId,
  questions,
  durationSeconds,
  examLabel,
  onComplete,
}: {
  userId:          string
  sessionId:       string
  questions:       ExamQuestion[]
  durationSeconds: number
  examLabel:       string
  onComplete:      (result: ExamResult) => void
}) {
  const [currentIndex,  setCurrentIndex]  = useState(0)
  const [answers,       setAnswers]       = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds)
  const [submitting,    setSubmitting]    = useState(false)
  const sessionStartMs                    = useRef(Date.now())
  const timerRef                          = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoSubmitRef                     = useRef(false)

  const question    = questions[currentIndex]
  const totalQ      = questions.length
  const answered    = Object.keys(answers).length
  const isLast      = currentIndex === totalQ - 1
  const isUrgent    = timeRemaining <= 300   // last 5 min
  const isCritical  = timeRemaining <= 60    // last 60 sec

  // ── Auto-submit when timer hits 0 ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (submitting || autoSubmitRef.current) return
    autoSubmitRef.current = true
    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)

    const submissions: ExamSubmission[] = questions.map(q => ({
      question_id:     q.id,
      selected_option: answers[q.id] ?? null,
    }))

    const durationMs = Date.now() - sessionStartMs.current
    const result     = await finalizeExam(userId, sessionId, submissions, durationMs)
    onComplete(result)
  }, [submitting, questions, answers, userId, sessionId, onComplete])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          if (!autoSubmitRef.current) handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [handleSubmit])

  const selectOption = (opt: string) => {
    if (submitting) return
    setAnswers(prev => ({ ...prev, [question.id]: opt }))
  }

  const OPTIONS: Array<{ key: 'a' | 'b' | 'c' | 'd'; label: string }> = [
    { key: 'a', label: 'A' },
    { key: 'b', label: 'B' },
    { key: 'c', label: 'C' },
    { key: 'd', label: 'D' },
  ]

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Exam header bar ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-4 px-5 md:px-10 py-3 border-b border-gray-100 bg-white"
      >
        {/* Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-400">
              {examLabel}
            </p>
            <p className="text-xs font-semibold text-gray-400">
              {answered}/{totalQ} answered
            </p>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(answered / totalQ) * 100}%`, backgroundColor: '#185FA5' }}
            />
          </div>
        </div>

        {/* Timer */}
        <div
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm"
          style={{
            backgroundColor: isCritical ? '#FEF2F2' : isUrgent ? '#FEF3C7' : '#F3F4F6',
            color:           isCritical ? '#DC2626'  : isUrgent ? '#B45309' : '#374151',
          }}
        >
          {isCritical && <span className="animate-pulse">⏰</span>}
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* ── Question panel ── */}
      <div className="flex-1 px-5 md:px-10 py-7 max-w-2xl">

        {/* Question number + topic */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#EEF4FB', color: '#185FA5' }}
          >
            {question.topic_name}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            Band {question.difficulty_band}
          </span>
          <span className="ml-auto text-xs text-gray-400 font-medium">
            Q{currentIndex + 1} of {totalQ}
          </span>
        </div>

        {/* Question text */}
        <p className="text-base font-medium text-gray-900 leading-relaxed mb-6">
          {question.content.question_text}
        </p>

        {/* Options */}
        <div className="space-y-2.5 mb-8">
          {OPTIONS.map(opt => {
            const optText  = question.content[`option_${opt.key}` as keyof typeof question.content]
            const selected = answers[question.id] === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => selectOption(opt.key)}
                disabled={submitting}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all min-h-[52px]"
                style={{
                  borderColor:     selected ? '#185FA5' : '#E5E7EB',
                  backgroundColor: selected ? '#EEF4FB' : '#FFFFFF',
                  color:           selected ? '#185FA5' : '#374151',
                }}
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: selected ? '#185FA5' : '#F3F4F6',
                    color:           selected ? '#FFFFFF'  : '#6B7280',
                  }}
                >
                  {opt.label}
                </span>
                <span className="text-sm font-medium flex-1">{optText}</span>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={submitting}
              className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 min-h-[44px]"
            >
              ← Back
            </button>
          )}

          {!isLast ? (
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all min-h-[44px]"
              style={{ backgroundColor: '#185FA5' }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all min-h-[44px]"
              style={{ backgroundColor: submitting ? '#9CA3AF' : '#10B981' }}
            >
              {submitting ? 'Submitting…' : `Submit Exam (${answered}/${totalQ} answered)`}
            </button>
          )}
        </div>

        {/* No-hints notice */}
        <p className="text-xs text-gray-300 text-center mt-6">
          Exam mode — hints and explanations are hidden until submission
        </p>
      </div>

      {/* ── Mini progress dots (bottom nav for larger exams) ── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max mx-auto">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className="w-6 h-6 rounded transition-all"
              style={{
                backgroundColor:
                  i === currentIndex ? '#185FA5' :
                  answers[q.id]      ? '#10B981' : '#E5E7EB',
              }}
              title={`Q${i + 1}`}
              aria-label={`Question ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ExamSession({
  userId,
  categoryMastery,
}: {
  userId:          string
  categoryMastery: Record<string, number>
}) {
  type Phase = 'selecting' | 'loading' | 'active' | 'results'

  const [phase,       setPhase]       = useState<Phase>('selecting')
  const [loadError,   setLoadError]   = useState<string | null>(null)
  const [examLabel,   setExamLabel]   = useState('')
  const [sessionId,   setSessionId]   = useState('')
  const [questions,   setQuestions]   = useState<ExamQuestion[]>([])
  const [examSeconds, setExamSeconds] = useState(FULL_EXAM_SECONDS)
  const [result,      setResult]      = useState<ExamResult | null>(null)

  const handleSelectConfig = async (config: {
    prefixes: string[]
    count:    number
    seconds:  number
    label:    string
  }) => {
    setPhase('loading')
    setLoadError(null)
    setExamLabel(config.label)
    setExamSeconds(config.seconds)

    const res = await startExam(
      userId,
      config.prefixes,
      config.count,
      config.seconds,
      config.label,
    )

    if ('error' in res) {
      setLoadError(res.error)
      setPhase('selecting')
      return
    }

    setSessionId(res.sessionId)
    setQuestions(res.questions)
    setPhase('active')
  }

  const handleComplete = (r: ExamResult) => {
    setResult(r)
    setPhase('results')
  }

  const handleRetry = () => {
    setResult(null)
    setQuestions([])
    setSessionId('')
    setPhase('selecting')
  }

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#185FA5', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-semibold text-gray-600">Preparing your exam…</p>
          <p className="text-xs text-gray-400">{examLabel}</p>
        </div>
      </div>
    )
  }

  if (phase === 'selecting') {
    return (
      <>
        {loadError && (
          <div className="mx-5 md:mx-10 mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {loadError}
          </div>
        )}
        <TopicSelector
          categoryMastery={categoryMastery}
          onSelect={handleSelectConfig}
        />
      </>
    )
  }

  if (phase === 'active') {
    return (
      <ActiveExam
        userId={userId}
        sessionId={sessionId}
        questions={questions}
        durationSeconds={examSeconds}
        examLabel={examLabel}
        onComplete={handleComplete}
      />
    )
  }

  // results
  return result ? (
    <ResultsScreen
      result={result}
      examLabel={examLabel}
      onRetry={handleRetry}
    />
  ) : null
}
