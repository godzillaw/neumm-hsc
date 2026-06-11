'use client'

import { useState, useRef } from 'react'
import { useRouter }        from 'next/navigation'
import MathText             from '@/components/MathText'
import { chatWithTutorReview } from '@/lib/actions/tutor'
import type { MockTestResult, MockAnswerResult } from './mock-actions'
import type { ChatMessage } from '@/lib/actions/tutor'

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
  const opts = [answer.optionA, answer.optionB, answer.optionC, answer.optionD]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
          style={{
            background: answer.isSkipped ? '#F3F4F6'
              : answer.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: answer.isSkipped ? '#9CA3AF'
              : answer.isCorrect ? '#10B981' : '#EF4444',
          }}>
          {answer.isSkipped ? '—' : answer.isCorrect ? '✓' : '✗'}
        </div>
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
          <div className="mt-3 mb-3">
            <MathText text={answer.questionText} className="text-sm font-semibold text-gray-800 leading-relaxed" />
          </div>

          {/* Options */}
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
                  {isCorrect && <span className="text-xs font-black text-green-600 shrink-0">✓ Correct</span>}
                  {isStudent && !isCorrect && <span className="text-xs font-black text-red-500 shrink-0">Your answer</span>}
                </div>
              )
            })}
          </div>

          {/* Explanation */}
          {answer.explanation && (
            <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: 'rgba(124,58,237,0.6)' }}>
                Explanation
              </p>
              <MathText text={answer.explanation} className="text-sm text-gray-700 leading-relaxed" />
            </div>
          )}

          {/* Ask tutor */}
          <button
            onClick={() => onAsk(answer)}
            className="text-xs font-black px-4 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}
          >
            👩‍🏫 Ask AI Tutor about this →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel({
  onClose,
  initialMessages,
  context,
}: {
  onClose:         () => void
  initialMessages: ChatMessage[]
  context:         string
}) {
  const [messages,  setMessages]  = useState<ChatMessage[]>(initialMessages)
  const [input,     setInput]     = useState('')
  const [sending,   setSending]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)
    const userMsg: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    const reply = await chatWithTutorReview(context, updatedMessages)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setSending(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: '#080D16', fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button onClick={onClose} className="text-white/60 hover:text-white text-lg">←</button>
        <p className="font-black text-white">AI Tutor</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={m.role === 'user'
                ? { background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white' }
                : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.9)' }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-3 border-t border-white/10 flex gap-2"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && void send()}
          placeholder="Ask about any question…"
          className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold outline-none"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 16 }}
        />
        <button
          onClick={() => void send()}
          disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-2xl flex items-center justify-center disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
        >
          <span className="text-white text-lg">↑</span>
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
  const [filter,       setFilter]       = useState<'all' | 'wrong' | 'skipped'>('all')

  const chatContext = `Mock test: "${result.title}" (${result.mode}). Score: ${result.scorePct}%, Predicted Band ${result.predictedBand}. ${result.answers.length} questions total, ${result.answers.filter(a=>a.isCorrect).length} correct.`

  function handleAsk(answer: MockAnswerResult) {
    const preload: ChatMessage = {
      role: 'assistant',
      content: `Let's go through Question ${answer.position}: "${answer.questionText}"\n\nYou answered **${answer.studentAnswer?.toUpperCase() ?? 'nothing'}** — the correct answer is **${answer.correctAnswer.toUpperCase()}**.\n\n${answer.explanation}\n\nWhat would you like me to explain further?`,
    }
    setChatMessages([preload])
    setShowChat(true)
  }

  const correct  = result.answers.filter(a => a.isCorrect).length
  const wrong    = result.answers.filter(a => !a.isCorrect && !a.isSkipped).length
  const skipped  = result.answers.filter(a => a.isSkipped).length

  const filtered = result.answers.filter(a => {
    if (filter === 'wrong')   return !a.isCorrect && !a.isSkipped
    if (filter === 'skipped') return a.isSkipped
    return true
  })

  const readinessEntries = Object.entries(result.readiness)

  const modeLabel = result.mode === 'school_test' ? '🏫 School Test'
    : result.mode === 'hsc_trial' ? '📋 HSC Trial' : '🎓 HSC'

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', background: '#F7F3FF' }}>

      {/* ── Report card ───────────────────────────────────────────────────── */}
      <div className="px-5 md:px-8 py-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-bold text-gray-400">{modeLabel} · Attempt {result.attemptNumber}</span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">{result.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Completed in {formatTime(result.timeTakenSecs)}
          </p>
        </div>

        {/* Score hero */}
        <div
          className="rounded-3xl p-6 mb-5 text-white"
          style={{ background: 'linear-gradient(135deg,#0F0F14,#1A1A2E)' }}
        >
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

          {/* Stat pills */}
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

        {/* Question review */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#666672' }}>
              Question review
            </p>
            <div className="flex gap-1">
              {(['all', 'wrong', 'skipped'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="text-xs font-black px-2.5 py-1 rounded-lg capitalize"
                  style={{
                    background: filter === f ? '#7C3AED' : '#F3F4F6',
                    color:      filter === f ? 'white'   : '#6B7280',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map((a) => (
              <QuestionRow
                key={a.questionId}
                answer={a}
                index={result.answers.indexOf(a)}
                onAsk={handleAsk}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                {filter === 'wrong' ? 'No wrong answers 🎉' : 'No skipped questions 🎉'}
              </p>
            )}
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

      {/* Chat panel */}
      {showChat && (
        <ChatPanel
          onClose={() => setShowChat(false)}
          initialMessages={chatMessages}
          context={chatContext}
        />
      )}
    </div>
  )
}
