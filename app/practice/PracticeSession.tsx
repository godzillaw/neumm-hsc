'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getNextQuestion, submitAnswer }              from './actions'
import { getHint, getExplanation, chatWithTutor }     from '@/lib/actions/tutor'
import { logLearningEvent }                           from '@/lib/actions/events'
import type { PracticeQuestion, SubmitResult }         from './actions'
import type { ChatMessage }                            from '@/lib/actions/tutor'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'ready' | 'submitting' | 'answered'

// ─── Helpers ────────────────────────────────────────────────────────────────────

const OPTIONS: Array<{ key: 'a' | 'b' | 'c' | 'd'; label: string }> = [
  { key: 'a', label: 'A' }, { key: 'b', label: 'B' },
  { key: 'c', label: 'C' }, { key: 'd', label: 'D' },
]

function bandEmoji(band: number): string {
  return ['⚡','🔥','💪','🎯','🚀','⭐'][band - 1] ?? '📚'
}

function confidenceColor(c: number) {
  return c >= 80 ? '#10B981' : c >= 50 ? '#F59E0B' : '#EF4444'
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

// ─── Streak Toast ────────────────────────────────────────────────────────────

function StreakToast({ streak, visible }: { streak: number; visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl text-white font-black text-sm pointer-events-none"
      style={{ transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#FF6B35,#FF8C42)', animation: 'streakToastIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards' }}>
      🔥 {streak} day streak!
    </div>
  )
}

// ─── Chat Window ─────────────────────────────────────────────────────────────

function ChatWindow({
  messages,
  loading,
  onSend,
}: {
  messages:   ChatMessage[]
  loading:    boolean
  onSend:     (msg: string) => void
}) {
  const [input, setInput]   = useState('')
  const bottomRef           = useRef<HTMLDivElement>(null)
  const inputRef            = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    onSend(text)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages or empty state */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
            <div className="text-4xl mb-3">🤖</div>
            <p className="font-black text-gray-800 text-base">Neumm Helper</p>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              Ask me anything about this question,<br/>or hit <strong>💡 Hint</strong> for a nudge!
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                🤖
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
              {m.role === 'assistant'
                ? m.content.split('\n').filter(Boolean).map((line, j) => {
                    const isStep = /^\d+\./.test(line.trim())
                    return isStep
                      ? <div key={j} className="flex gap-2 mb-1.5">
                          <span className="w-5 h-5 rounded-full text-xs font-black flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white' }}>
                            {line.trim().match(/^(\d+)\./)?.[1]}
                          </span>
                          <p className="text-gray-700">{line.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                      : <p key={j} className="text-gray-700 mb-1">{line}</p>
                  })
                : <p>{m.content}</p>
              }
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>🤖</div>
            <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: '#7C3AED', animationDelay: `${i*0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-purple-50">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask me anything…"
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300 disabled:opacity-50"
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-30 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Mastery Panel ─────────────────────────────────────────────────────────────

const STATUS_META = {
  mastered: { label: 'Mastered 🏆', bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  shaky:    { label: 'Shaky 🔶',    bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  gap:      { label: 'Gap 📚',      bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
} as const

function MasteryPanel({ prevConf, newConf, delta, newStatus, predictedHscBand }:
  { prevConf: number; newConf: number; delta: number; newStatus: 'mastered'|'shaky'|'gap'; predictedHscBand: number }) {
  const positive = delta > 0
  const meta     = STATUS_META[newStatus]
  return (
    <div className="rounded-2xl p-3.5 flex flex-col gap-2.5 animate-slide-up"
      style={{ background: 'linear-gradient(135deg, #F7F3FF, #FDF2F8)', border: '1px solid #E9D5FF' }}>
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{ background: positive ? '#D1FAE5' : '#FEE2E2', color: positive ? '#065F46' : '#991B1B' }}>
          {positive ? '+' : ''}{delta}
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 rounded-full opacity-30"
            style={{ width: `${prevConf}%`, backgroundColor: meta.dot }} />
          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{ width: `${newConf}%`, backgroundColor: meta.dot }} />
        </div>
        <span className="text-xs font-black shrink-0" style={{ color: meta.dot }}>{newConf}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: meta.bg, color: meta.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
          {meta.label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Band</span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5,6].map(b => (
              <div key={b} className="w-3 h-3 rounded-sm transition-colors duration-500"
                style={{ backgroundColor: b <= predictedHscBand ? '#7C3AED' : '#E5E7EB' }} />
            ))}
          </div>
          <span className="text-xs font-black text-gray-600">{predictedHscBand}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function PracticeSession({
  userId,
  sessionId: initialSessionId,
  topicFilter,
}: {
  userId:       string
  sessionId:    string
  topicFilter?: string | null
  questionsRemaining?: number
  dailyLimit?:         number
}) {
  const [phase,          setPhase]          = useState<Phase>('loading')
  const [question,       setQuestion]       = useState<PracticeQuestion | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [result,         setResult]         = useState<SubmitResult | null>(null)
  const [hintUsed,       setHintUsed]       = useState(false)
  const [hintCount,      setHintCount]      = useState(0)
  const [sessionId]                         = useState(initialSessionId)
  const [sessionCount,   setSessionCount]   = useState(0)
  const [elapsed,        setElapsed]        = useState(0)
  const startMsRef                          = useRef<number>(0)
  const timerRef                            = useRef<ReturnType<typeof setInterval> | null>(null)
  const questionCount                       = useRef(0)

  // Chat state
  const [chatMessages,  setChatMessages]    = useState<ChatMessage[]>([])
  const [chatLoading,   setChatLoading]     = useState(false)
  const [showChatPanel, setShowChatPanel]   = useState(false)

  // Streak
  const [streakToastVisible, setStreakToastVisible] = useState(false)
  const [toastStreak,        setToastStreak]        = useState(0)
  const toastTimerRef                               = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Session tracking
  const sessionStartMsRef = useRef(Date.now())
  const sessionAnswersRef = useRef(0)
  const sessionCorrectRef = useRef(0)
  const sessionEndedRef   = useRef(false)

  const endSession = useCallback(() => {
    if (sessionEndedRef.current) return
    sessionEndedRef.current = true
    const duration_ms = Date.now() - sessionStartMsRef.current
    const questions_attempted = sessionAnswersRef.current
    const accuracy_pct = questions_attempted > 0
      ? Math.round((sessionCorrectRef.current / questions_attempted) * 100) : 0
    void logLearningEvent(userId, 'session_ended', { duration_ms, questions_attempted, accuracy_pct })
  }, [userId])

  const loadNext = useCallback(async () => {
    setPhase('loading')
    setSelectedOption(null)
    setResult(null)
    setHintUsed(false)
    setHintCount(0)
    setChatMessages([])
    setShowChatPanel(false)
    setElapsed(0)

    let q = await getNextQuestion(userId, topicFilter ?? undefined)

    // No questions exist yet → call generation API, then retry
    if (!q && topicFilter) {
      try {
        const base = typeof window !== 'undefined' ? window.location.origin : ''
        const genRes = await fetch(`${base}/math-nsw/app/api/generate-questions`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ topic: topicFilter }),
        })
        const genJson = await genRes.json().catch(() => ({})) as Record<string, unknown>
        console.log('[PracticeSession] Generation response:', genRes.status, genJson)

        if (genRes.ok || genJson.status === 'already_exists') {
          // Small delay to let DB propagate, then retry
          await new Promise(r => setTimeout(r, 500))
          q = await getNextQuestion(userId, topicFilter)
        }
      } catch (genErr) {
        console.error('[PracticeSession] Generation call failed:', genErr)
      }
    }

    setQuestion(q)
    setPhase('ready')  // if q is null, the !question guard below handles it
    startMsRef.current = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startMsRef.current) / 1000)), 1000)
    questionCount.current += 1
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, topicFilter])

  useEffect(() => { loadNext() }, [loadNext])

  useEffect(() => () => {
    if (timerRef.current)      clearInterval(timerRef.current)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    endSession()
  }, [endSession])

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!question || !selectedOption || phase !== 'ready') return
    if (timerRef.current) clearInterval(timerRef.current)
    const timeMs = Date.now() - startMsRef.current
    setPhase('submitting')
    const res = await submitAnswer({
      userId, sessionId, questionId: question.id, masteryOutcomeId: question.mastery_outcome_id,
      difficultyBand: question.difficulty_band, selectedOption,
      correctAnswer: question.correct_answer, hintUsed, timeMs,
      explanation: question.explanation, step_by_step: question.step_by_step,
    })
    setResult(res)
    setPhase('answered')
    setSessionCount(c => c + 1)
    sessionAnswersRef.current += 1
    if (res.isCorrect) sessionCorrectRef.current += 1
    if (res.streakUpdated && res.newStreak >= 1) {
      try { localStorage.setItem('neumm_streak_anim', JSON.stringify({ from: Math.max(0, res.newStreak-1), to: res.newStreak, ts: Date.now() })) } catch {}
      setToastStreak(res.newStreak)
      setStreakToastVisible(true)
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      toastTimerRef.current = setTimeout(() => setStreakToastVisible(false), 3200)
    }
  }

  // ── Hint (starts chat with AI hint as first message) ────────────────────────
  async function handleHint() {
    if (!question) return
    setHintUsed(true)
    setHintCount(prev => prev + 1)
    setChatLoading(true)
    setShowChatPanel(true)
    const { hint } = await getHint(question.id, selectedOption ?? '', hintCount + 1)
    const aiMsg: ChatMessage = { role: 'assistant', content: hint }
    setChatMessages([aiMsg])
    setChatLoading(false)
  }

  // ── Explanation (starts/extends chat with explanation) ───────────────────────
  async function handleExplanation() {
    if (!question) return
    setChatLoading(true)
    setShowChatPanel(true)
    void logLearningEvent(userId, 'explanation_viewed', { question_id: question.id, outcome_id: question.mastery_outcome_id })
    const { explanation } = await getExplanation(question.id)
    const aiMsg: ChatMessage = { role: 'assistant', content: explanation }
    setChatMessages(prev => [...prev, aiMsg])
    setChatLoading(false)
  }

  // ── Free-form chat ───────────────────────────────────────────────────────────
  async function handleChatSend(text: string) {
    if (!question) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...chatMessages, userMsg]
    setChatMessages(updatedMessages)
    setChatLoading(true)
    const { reply } = await chatWithTutor(question.id, updatedMessages)
    const aiMsg: ChatMessage = { role: 'assistant', content: reply }
    setChatMessages(prev => [...prev, aiMsg])
    setChatLoading(false)
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-bounce-in"
            style={{ background: 'linear-gradient(135deg,#FFDA00,#FF6B35)' }}>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#666672' }}>
            {topicFilter ? 'Generating questions for this topic…' : 'Finding your next challenge…'}
          </p>
          {topicFilter && (
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              First time for this topic — this takes ~15 seconds
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!question) {
    endSession()
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center animate-pop-in max-w-sm">
          {topicFilter ? (
            <>
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-xl font-black" style={{ color: '#0F0F14' }}>Questions coming soon!</h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#666672' }}>
                We&apos;re still generating questions for <strong style={{ color: '#FF6B35' }}>
                  {topicFilter.replace(/-B\d+$/, '')}
                </strong>. Check back soon or try another topic.
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-5 px-6 py-3 rounded-2xl text-sm font-black"
                style={{ background: '#FFDA00', color: '#0F0F14' }}
              >
                ← Back to Progress
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-black text-gray-900">You crushed it!</h2>
              <p className="text-sm text-gray-500 mt-1">New questions coming soon. Check back tomorrow!</p>
            </>
          )}
        </div>
      </div>
    )
  }

  const { content, difficulty_band, topic_name, current_confidence, nesa_outcome_code } = question
  const isAnswered    = phase === 'answered'
  const isSubmitting  = phase === 'submitting'
  const isInteractive = phase === 'ready'

  const chatPanel = (
    <ChatWindow
      messages={chatMessages}
      loading={chatLoading}
      onSend={handleChatSend}
    />
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F3FF 0%, #FDF2F8 60%, #F0FDF4 100%)' }}>

      {/* ── Left: Question Panel ─────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col px-5 md:px-8 py-6 md:max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black px-3 py-1.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
              {bandEmoji(difficulty_band)} Band {difficulty_band}
            </span>
            <span className="text-xs font-bold px-2.5 py-1.5 rounded-full bg-white border border-purple-100 text-violet-700">
              {topic_name}
            </span>
            {nesa_outcome_code && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-400">
                {nesa_outcome_code}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-gray-400 bg-white rounded-full px-3 py-1 border border-gray-100">
              ⏱ {formatMs(elapsed * 1000)}
            </span>
            {/* Chat button mobile */}
            <button onClick={() => setShowChatPanel(true)}
              className="md:hidden flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full text-white min-h-[32px]"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
              🤖 Tutor
              {chatMessages.length > 0 && (
                <span className="bg-white text-violet-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Confidence bar */}
        {isInteractive && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-gray-400">Confidence</span>
            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-100">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${current_confidence}%`, backgroundColor: confidenceColor(current_confidence) }} />
            </div>
            <span className="text-xs font-black" style={{ color: confidenceColor(current_confidence) }}>
              {current_confidence}%
            </span>
          </div>
        )}

        {/* Topic + progress bar */}
        {question && (
          <div className="pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-xs font-black"
                  style={{ background: '#FFDA00', color: '#0F0F14' }}>
                  ⚡ {question.outcome_id.replace(/-B\d+$/, '')}
                </div>
                {topicFilter && (
                  <span className="text-xs font-semibold" style={{ color: '#666672' }}>
                    filtered
                  </span>
                )}
              </div>
              <span className="text-xs font-black" style={{ color: '#666672' }}>
                {sessionCount} done
              </span>
            </div>
          </div>
        )}

        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-sm border border-purple-50 p-5 mb-4 animate-fade-in-up">
          <p className="text-base md:text-lg font-semibold text-gray-900 leading-relaxed">
            {content.question_text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {OPTIONS.map(opt => {
            const optText  = content[`option_${opt.key}` as keyof typeof content]
            const isSel    = selectedOption === opt.key
            const isCorrect = result?.correctAnswer === opt.key
            let border = '#E9D5FF', bg = '#FFFFFF', text = '#374151', labelBg = '#F3F0FF', labelColor = '#7C3AED'
            if ((isInteractive || isSubmitting) && isSel) {
              border = '#7C3AED'; bg = '#EDE9FE'; labelBg = 'linear-gradient(135deg,#7C3AED,#A855F7)'; labelColor = '#FFFFFF'
            }
            if (isAnswered) {
              if (isCorrect) { border = '#10B981'; bg = '#F0FDF4'; labelBg = '#10B981'; labelColor = '#FFFFFF'; text = '#065F46' }
              else if (isSel) { border = '#EF4444'; bg = '#FEF2F2'; labelBg = '#EF4444'; labelColor = '#FFFFFF'; text = '#991B1B' }
            }
            return (
              <button key={opt.key}
                onClick={() => { if (isInteractive) setSelectedOption(opt.key) }}
                disabled={!isInteractive}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-left min-h-[54px] active:scale-[0.98]"
                style={{ borderColor: border, backgroundColor: bg, color: text }}>
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
                  style={{ background: labelBg, color: labelColor }}>
                  {opt.label}
                </span>
                <span className="flex-1 text-sm font-semibold">{optText}</span>
                {isAnswered && isCorrect && <span className="text-lg">✅</span>}
                {isAnswered && isSel && !isCorrect && <span className="text-lg">❌</span>}
              </button>
            )
          })}
        </div>

        {/* Action buttons */}
        {isInteractive ? (
          <div className="flex items-center gap-3">
            <button onClick={handleHint}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-purple-200 bg-white text-sm font-black text-violet-700 hover:bg-purple-50 transition-all min-h-[48px]">
              💡 Hint
              {hintCount > 0 && (
                <span className="text-xs bg-violet-100 text-violet-700 rounded-full w-5 h-5 flex items-center justify-center font-black">
                  {hintCount}
                </span>
              )}
            </button>
            <button onClick={handleSubmit} disabled={!selectedOption}
              className="btn-gradient flex-1 py-3 rounded-2xl text-sm font-black min-h-[48px]">
              {selectedOption ? 'Submit Answer ✨' : 'Pick an option first…'}
            </button>
          </div>
        ) : isSubmitting ? (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} />
            <span className="text-sm font-semibold text-gray-500">Checking…</span>
          </div>
        ) : (
          <div className="space-y-3">
            {result && (
              <>
                <div className="flex items-center gap-2 rounded-2xl px-4 py-3 animate-pop-in"
                  style={{ background: result.isCorrect ? 'linear-gradient(135deg,#D1FAE5,#A7F3D0)' : 'linear-gradient(135deg,#FEE2E2,#FECACA)', border: `1px solid ${result.isCorrect ? '#6EE7B7' : '#FCA5A5'}` }}>
                  <span className="text-2xl">{result.isCorrect ? '🎯' : '💪'}</span>
                  <div>
                    <p className="text-sm font-black" style={{ color: result.isCorrect ? '#065F46' : '#991B1B' }}>
                      {result.isCorrect ? 'Nailed it!' : 'Not quite — you got this next time!'}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: result.isCorrect ? '#10B981' : '#EF4444' }}>
                      {result.isCorrect ? `+${result.delta}` : `${result.delta}`} confidence
                    </p>
                  </div>
                </div>
                <MasteryPanel prevConf={result.prevConfidence} newConf={result.newConfidence}
                  delta={result.delta} newStatus={result.newStatus} predictedHscBand={result.predictedHscBand} />
              </>
            )}
            <div className="flex gap-3">
              <button onClick={handleExplanation}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-purple-200 bg-white text-sm font-black text-violet-700 hover:bg-purple-50 transition-all min-h-[48px]">
                📖 Explain
              </button>
              <button onClick={loadNext}
                className="btn-gradient flex-1 py-3 rounded-2xl text-sm font-black min-h-[48px]">
                Next Question →
              </button>
            </div>
          </div>
        )}

        {/* Session stats */}
        <p className="text-xs text-gray-300 text-center mt-5 font-medium">
          {sessionAnswersRef.current > 0
            ? `${sessionAnswersRef.current} answered · ${Math.round((sessionCorrectRef.current / sessionAnswersRef.current) * 100)}% accuracy 🎯`
            : `Question ${questionCount.current}`}
        </p>

        {/* Chat popup — full-screen on mobile, floating on desktop */}
        {showChatPanel && (
          <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[360px] md:h-[520px] z-50 flex flex-col rounded-none md:rounded-3xl shadow-2xl overflow-hidden"
            style={{ background: 'white', border: '1px solid #EDE9FE' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <p className="text-sm font-black text-white">Neumm Helper</p>
              </div>
              <button onClick={() => setShowChatPanel(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-colors">
                ✕
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-hidden flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom,0px)' }}>
              {chatPanel}
            </div>
          </div>
        )}

        {/* Floating chat button (desktop only, hidden on mobile since header button handles it) */}
        {!showChatPanel && (
          <button onClick={() => setShowChatPanel(true)}
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-black shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
            🤖 AI Tutor
            {chatMessages.length > 0 && (
              <span className="bg-white text-violet-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
                {chatMessages.length}
              </span>
            )}
          </button>
        )}
      </div>

      <StreakToast streak={toastStreak} visible={streakToastVisible} />
    </div>
  )
}
