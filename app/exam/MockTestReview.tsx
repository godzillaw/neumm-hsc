'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter }                    from 'next/navigation'
import MathText                         from '@/components/MathText'
import { chatWithTutorReview }          from '@/lib/actions/tutor'
import type { MockTestResult, MockAnswerResult } from './mock-actions'
import type { ChatMessage }             from '@/lib/actions/tutor'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bandColor(band: number): string {
  if (band >= 5) return '#10B981'
  if (band >= 3) return '#F59E0B'
  return '#EF4444'
}

function readinessConfig(r: 'ready' | 'nearly' | 'needs_work') {
  return r === 'ready'
    ? { icon: '✅', label: 'Ready',        color: '#10B981', bg: 'rgba(16,185,129,0.08)' }
    : r === 'nearly'
    ? { icon: '⚠️',  label: 'Nearly there', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' }
    : { icon: '❌',  label: 'Needs work',   color: '#EF4444', bg: 'rgba(239,68,68,0.08)' }
}

function formatTime(secs: number): string {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

const OPTION_LABELS = ['A','B','C','D'] as const

function scoreLabel(answer: MockAnswerResult): { text: string; color: string; bg: string } {
  if (answer.isSkipped)  return { text: 'Skipped',      color: '#9CA3AF', bg: '#F3F4F6' }
  if (answer.isCorrect)  return { text: 'Correct 100%', color: '#10B981', bg: 'rgba(16,185,129,0.1)' }
  // open-ended "on paper" or "attempted" — can't auto-grade, treat as partial
  if (answer.studentAnswer === 'on_paper' || answer.studentAnswer === 'attempted')
    return { text: 'Partial',       color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' }
  return { text: 'Incorrect 0%',  color: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
}

// ─── Question row ─────────────────────────────────────────────────────────────

function QuestionRow({
  answer,
  index,
  onAsk,
}: {
  answer:  MockAnswerResult
  index:   number
  onAsk:   (q: MockAnswerResult) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const opts  = [answer.optionA, answer.optionB, answer.optionC, answer.optionD]
  const score = scoreLabel(answer)
  const isMCQ = opts.some(Boolean)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        {/* Score badge */}
        <span
          className="text-[11px] font-black px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap"
          style={{ background: score.bg, color: score.color }}
        >
          {score.text}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-400 truncate">
            Q{index + 1} · {answer.topicName} · Band {answer.difficultyBand}
          </p>
          <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
            {answer.questionText.slice(0, 80)}{answer.questionText.length > 80 ? '…' : ''}
          </p>
        </div>
        <span className="text-gray-400 shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          {/* Full question */}
          <div className="mt-3 mb-4">
            <MathText text={answer.questionText} className="text-sm font-semibold text-gray-800 leading-relaxed" />
          </div>

          {/* MCQ options */}
          {isMCQ && (
            <div className="space-y-2 mb-4">
              {opts.map((opt, i) => {
                if (!opt) return null
                const label     = OPTION_LABELS[i].toLowerCase()
                const isCorrect = label === answer.correctAnswer
                const isStudent = label === answer.studentAnswer
                return (
                  <div
                    key={label}
                    className="flex items-start gap-2 p-3 rounded-xl border"
                    style={{
                      borderColor: isCorrect ? '#10B981' : isStudent && !isCorrect ? '#EF4444' : '#F3F4F6',
                      background:  isCorrect ? 'rgba(16,185,129,0.06)' : isStudent && !isCorrect ? 'rgba(239,68,68,0.04)' : '#FAFAFA',
                    }}
                  >
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                      style={{
                        background: isCorrect ? '#10B981' : isStudent && !isCorrect ? '#EF4444' : '#E5E7EB',
                        color: isCorrect || (isStudent && !isCorrect) ? 'white' : '#9CA3AF',
                      }}>
                      {OPTION_LABELS[i]}
                    </span>
                    <MathText text={opt} className="flex-1 text-sm text-gray-700" />
                    {isCorrect  && <span className="text-xs font-black text-green-600 shrink-0">✓ Correct</span>}
                    {isStudent && !isCorrect && <span className="text-xs font-black text-red-500 shrink-0">Your answer</span>}
                  </div>
                )
              })}
            </div>
          )}

          {/* Where you went wrong — only for incorrect MCQ */}
          {!answer.isCorrect && !answer.isSkipped && isMCQ && answer.studentAnswer && (
            <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#EF4444' }}>
                Where you went wrong
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                You chose <strong>{answer.studentAnswer.toUpperCase()}</strong> but the correct answer is <strong>{answer.correctAnswer.toUpperCase()}</strong>.
                {answer.explanation
                  ? ' See the step-by-step explanation below.'
                  : ' Review the working method for this type of question.'}
              </p>
            </div>
          )}

          {/* Step-by-step explanation */}
          {answer.explanation ? (
            <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: '#7C3AED' }}>
                Step-by-step solution
              </p>
              <MathText text={answer.explanation} className="text-sm text-gray-700 leading-relaxed" />
            </div>
          ) : (
            <div className="rounded-xl p-4 mb-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>
                Solution
              </p>
              <p className="text-sm text-gray-500">
                Correct answer: <strong style={{ color: '#10B981' }}>{answer.correctAnswer.toUpperCase()}</strong>.
                Ask the AI Tutor for a full worked solution.
              </p>
            </div>
          )}

          {/* Ask tutor */}
          <button
            onClick={() => onAsk(answer)}
            className="w-full py-2.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}
          >
            👩‍🏫 Ask AI Tutor about this question →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel({
  onClose,
  messages,
  setMessages,
  context,
}: {
  onClose:     () => void
  messages:    ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  context:     string
}) {
  const [input,   setInput]   = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [messages])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)
    const userMsg: ChatMessage = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    const reply = await chatWithTutorReview(context, updated)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: '#080D16', fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={onClose} className="text-white/60 hover:text-white text-lg font-black">←</button>
        <div className="flex-1">
          <p className="font-black text-white">AI Tutor</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Ask anything — keep chatting until you fully understand</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👩‍🏫</div>
            <p className="font-black text-white mb-1">Ask me anything</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ask about any question from this test, a method,<br/>or why an answer is right or wrong.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                🏫
              </div>
            )}
            <div
              className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={m.role === 'user'
                ? { background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white' }
                : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.9)' }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
              🏫
            </div>
            <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-white/10 flex gap-2"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && void send()}
          placeholder="Type your question…"
          className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold outline-none"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 16 }}
        />
        <button
          onClick={() => void send()}
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-2xl flex items-center justify-center disabled:opacity-40 shrink-0"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
        >
          <span className="text-white font-black">↑</span>
        </button>
      </div>
    </div>
  )
}

// ─── Main Review ──────────────────────────────────────────────────────────────

export default function MockTestReview({ result }: { result: MockTestResult }) {
  const router = useRouter()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [showChat,     setShowChat]     = useState(false)

  const chatContext = `Mock test: "${result.title}" (${result.mode}). Score: ${result.scorePct}%, Predicted Band ${result.predictedBand}. ${result.answers.length} questions, ${result.answers.filter(a=>a.isCorrect).length} correct, ${result.answers.filter(a=>!a.isCorrect&&!a.isSkipped).length} incorrect. Questions: ${result.answers.map((a,i)=>`Q${i+1}: ${a.questionText} [Correct: ${a.correctAnswer}, Student: ${a.studentAnswer ?? 'skipped'}]`).join(' | ')}`

  function handleAsk(answer: MockAnswerResult) {
    const pos = result.answers.indexOf(answer) + 1
    const intro: ChatMessage = {
      role: 'assistant',
      content: `Sure! Let's look at **Question ${pos}**: "${answer.questionText}"\n\nYou answered **${answer.studentAnswer?.toUpperCase() ?? 'nothing (skipped)'}** — the correct answer is **${answer.correctAnswer.toUpperCase()}**.\n\n${answer.explanation ?? 'Ask me to walk through the solution step by step.'}\n\nWhat would you like me to explain?`,
    }
    // Append to existing conversation rather than reset
    setChatMessages(prev => prev.length > 0
      ? [...prev, { role: 'user', content: `Can you explain Question ${pos}?` }, intro]
      : [intro]
    )
    setShowChat(true)
  }

  const correct = result.answers.filter(a => a.isCorrect).length
  const wrong   = result.answers.filter(a => !a.isCorrect && !a.isSkipped).length
  const skipped = result.answers.filter(a => a.isSkipped).length

  const readinessEntries = Object.entries(result.readiness)

  const modeLabel = result.mode === 'school_test'  ? '🏫 School Test'
    : result.mode === 'hsc_trial'  ? '📋 HSC Trial'
    : result.mode === 'naplan_y9'  ? '📐 NAPLAN Y9'
    : result.mode === 'prelim_y11' ? '📓 Prelim Y11'
    : '🎓 HSC'

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', background: '#F7F3FF' }}>
      <div className="px-5 md:px-8 py-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-bold text-gray-400">{modeLabel} · Attempt {result.attemptNumber}</span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">{result.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Completed in {formatTime(result.timeTakenSecs)}</p>
        </div>

        {/* Score hero */}
        <div className="rounded-3xl p-6 mb-5 text-white" style={{ background: 'linear-gradient(135deg,#0F0F14,#1A1A2E)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-4xl font-black">{result.scorePct}%</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {correct}/{result.answers.length} correct
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: bandColor(result.predictedBand) }}>
                Band {result.predictedBand}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Predicted</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>
              ✓ {correct} correct
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
              ✗ {wrong} wrong
            </span>
            {skipped > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(156,163,175,0.2)', color: '#D1D5DB' }}>
                — {skipped} skipped
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              ⏱ {formatTime(result.timeTakenSecs)}
            </span>
          </div>
        </div>

        {/* Per-topic readiness */}
        {readinessEntries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#666672' }}>
              Topic readiness
            </p>
            <div className="space-y-2">
              {readinessEntries.map(([prefix, r]) => {
                const cfg    = readinessConfig(r)
                const bucket = result.answers.filter(a => a.topicPrefix === prefix)
                const c      = bucket.filter(a => a.isCorrect).length
                return (
                  <div key={prefix} className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl" style={{ background: cfg.bg }}>
                    <div className="flex items-center gap-2">
                      <span>{cfg.icon}</span>
                      <span className="text-sm font-bold text-gray-800">
                        {bucket[0]?.topicName ?? prefix}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{c}/{bucket.length}</span>
                      <span className="text-xs font-black" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Question review — no filter, all shown */}
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#666672' }}>
            Question review
          </p>
          <div className="space-y-2">
            {result.answers.map((a, i) => (
              <QuestionRow
                key={a.questionId}
                answer={a}
                index={i}
                onAsk={handleAsk}
              />
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/exam')}
            className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-600"
          >
            ← New Test
          </button>
          <button
            onClick={() => router.push('/exam/history')}
            className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-600"
          >
            📋 History
          </button>
          <button
            onClick={() => setShowChat(true)}
            className="flex-1 py-3 rounded-2xl font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}
          >
            👩‍🏫 Tutor
          </button>
        </div>
      </div>

      {showChat && (
        <ChatPanel
          onClose={() => setShowChat(false)}
          messages={chatMessages}
          setMessages={setChatMessages}
          context={chatContext}
        />
      )}
    </div>
  )
}
