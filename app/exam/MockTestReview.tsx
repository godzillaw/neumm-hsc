'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter }                    from 'next/navigation'
import MathText                         from '@/components/MathText'
import { chatWithTutorReview, generateTopicFeedback } from '@/lib/actions/tutor'
import type { MockTestResult, MockAnswerResult } from './mock-actions'
import type { ChatMessage, TopicFeedback } from '@/lib/actions/tutor'

// ─── Inline math + rich text helpers (mirrors PracticeSession) ───────────────

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const re = /(\$[^$\n]+?\$|\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g
  let last = 0
  let m = re.exec(text)
  while (m !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const raw = m[1]
    if (raw.startsWith('$') && raw.endsWith('$') && raw.length > 2) {
      parts.push(<MathText key={m.index} text={raw} />)
    } else if (raw.startsWith('**')) {
      parts.push(<strong key={m.index} className="font-black" style={{ color: 'rgba(255,255,255,0.95)' }}>{raw.slice(2,-2)}</strong>)
    } else if (raw.startsWith('*')) {
      parts.push(<em key={m.index} className="italic">{raw.slice(1,-1)}</em>)
    } else {
      parts.push(<code key={m.index} className="rounded px-1 py-0.5 text-[12px] font-mono" style={{ background: 'rgba(124,58,237,0.25)', color: '#C4B5FD' }}>{raw.slice(1,-1)}</code>)
    }
    last = m.index + raw.length
    m = re.exec(text)
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function RichBody({ text }: { text: string }) {
  const lines = text.split('\n').filter(l => l.trim())
  return (
    <>
      {lines.map((line, i) => {
        const t = line.trim()
        if (t.startsWith('$$') && t.endsWith('$$') && t.length > 4) {
          return <div key={i} className="flex justify-center my-3 px-2"><MathText text={t} style={{ color: 'white' }} /></div>
        }
        return (
          <p key={i} className={`text-sm leading-relaxed ${i > 0 ? 'mt-1.5' : ''}`} style={{ color: 'rgba(255,255,255,0.8)' }}>
            {renderInline(t)}
          </p>
        )
      })}
    </>
  )
}

// ─── InlineSteps — identical renderer to PracticeSession ─────────────────────

function InlineSteps({ steps }: { steps: string[] }) {
  if (!steps || steps.length === 0) return null
  let sectionNum = 0
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Step-by-step solution
        </p>
      </div>
      <div className="px-5 py-4">
        {steps.map((step, i) => {
          const trimmed = step.trim()

          if (/^✅\s*(Final Answer|Answer):?/i.test(trimmed)) {
            const body = trimmed.replace(/^✅\s*(Final Answer|Answer):?\s*/i, '')
            return (
              <div key={i} className="rounded-xl px-4 py-3.5 mt-4" style={{ background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.3)' }}>
                <p className="text-[11px] font-black uppercase tracking-wide mb-1.5" style={{ color: '#34D399' }}>✅ Final Answer</p>
                <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{renderInline(body)}</p>
              </div>
            )
          }

          if (/^⚠️?\s*(Common mistake|Watch out|Note):?/i.test(trimmed)) {
            const body = trimmed.replace(/^⚠️?\s*(Common mistake|Watch out|Note):?\s*/i, '')
            return (
              <div key={i} className="rounded-xl px-4 py-3 mt-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.2)' }}>
                <p className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color: '#FBBF24' }}>⚠️ Common Mistake</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{renderInline(body)}</p>
              </div>
            )
          }

          if (/^(💡|Tip):?/i.test(trimmed)) {
            const body = trimmed.replace(/^(💡|Tip):?\s*/i, '')
            return (
              <div key={i} className="rounded-xl px-4 py-3 mt-3" style={{ background: 'rgba(96,165,250,0.08)', border: '1.5px solid rgba(96,165,250,0.15)' }}>
                <p className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color: '#60A5FA' }}>💡 Tip</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{renderInline(body)}</p>
              </div>
            )
          }

          const sectionMatch = trimmed.match(/^\*\*(\d+)\.\s+(.+?)\*\*([\s\S]*)$/)
          if (sectionMatch) {
            sectionNum++
            const title = sectionMatch[2].trim()
            const body  = sectionMatch[3].trim()
            return (
              <div key={i} className={i > 0 ? 'pt-5 mt-1' : 'pt-1'} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.22)' }}>{sectionNum}</p>
                <p className="text-sm font-black text-white mb-2.5">{title}</p>
                {body && <RichBody text={body} />}
              </div>
            )
          }

          sectionNum++
          return (
            <div key={i} className="flex gap-3 py-3" style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg,#6D28D9,#A855F7)', color: 'white' }}>
                {sectionNum}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {renderInline(trimmed)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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

// ─── Topic Feedback Card ──────────────────────────────────────────────────────

function TopicFeedbackCard({
  topicName, correct, total, cfg, answers,
}: {
  prefix:    string
  topicName: string
  correct:   number
  total:     number
  cfg:       ReturnType<typeof readinessConfig>
  answers:   MockAnswerResult[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [feedback,  setFeedback] = useState<TopicFeedback | null>(null)
  const [loading,   setLoading]  = useState(false)

  async function handleExpand() {
    setExpanded(e => !e)
    if (!feedback && !loading) {
      setLoading(true)
      const fb = await generateTopicFeedback({
        topicName,
        correct,
        total,
        questions: answers.map(a => ({
          text:          a.questionText,
          isCorrect:     a.isCorrect,
          isSkipped:     a.isSkipped,
          band:          a.difficultyBand,
          studentAnswer: a.studentAnswer,
          correctAnswer: a.correctAnswer,
        })),
      })
      setFeedback(fb)
      setLoading(false)
    }
  }

  const feedbackSections = feedback ? [
    { icon: '✅', label: 'What you did well',     text: feedback.strengths,   color: '#10B981', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.2)' },
    { icon: '🔍', label: 'Where the gaps are',    text: feedback.gaps,        color: '#7C3AED', bg: 'rgba(124,58,237,0.05)', border: 'rgba(124,58,237,0.15)' },
    { icon: '⚠️', label: 'What needs improvement', text: feedback.improvement, color: '#F59E0B', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
    { icon: '🎯', label: 'What to do next',        text: feedback.nextSteps,   color: '#2563EB', bg: 'rgba(37,99,235,0.05)',  border: 'rgba(37,99,235,0.15)' },
  ] : []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => void handleExpand()}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">{cfg.icon}</span>
          <span className="text-sm font-bold text-gray-800">{topicName}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400">{correct}/{total}</span>
          <span className="text-xs font-black" style={{ color: cfg.color }}>{cfg.label}</span>
          <span className="text-gray-400 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded feedback */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          {loading ? (
            <div className="py-6 flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
              <p className="text-xs text-gray-400 font-semibold">Analysing your performance…</p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {feedbackSections.map(s => (
                <div key={s.label} className="rounded-xl p-3.5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <p className="text-[11px] font-black uppercase tracking-wider mb-1.5" style={{ color: s.color }}>
                    {s.icon} {s.label}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
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

          {/* Step-by-step solution — rich InlineSteps if available, fallback to explanation text */}
          <div className="mb-4">
            {answer.stepByStep && answer.stepByStep.length > 0
              ? <InlineSteps steps={answer.stepByStep} />
              : answer.explanation
              ? (
                <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
                  <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: '#7C3AED' }}>Solution</p>
                  <MathText text={answer.explanation} className="text-sm text-gray-700 leading-relaxed" />
                </div>
              ) : (
                <div className="rounded-xl p-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <p className="text-sm text-gray-500">
                    Correct answer: <strong style={{ color: '#10B981' }}>{answer.correctAnswer.toUpperCase()}</strong>. Ask the AI Tutor for a full worked solution.
                  </p>
                </div>
              )
            }
          </div>

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

        {/* Per-topic readiness — expandable with AI feedback */}
        {readinessEntries.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#666672' }}>
              Topic readiness
            </p>
            <div className="space-y-2">
              {readinessEntries.map(([prefix, r]) => {
                const cfg    = readinessConfig(r)
                const bucket = result.answers.filter(a => a.topicPrefix === prefix)
                const c      = bucket.filter(a => a.isCorrect).length
                const name   = bucket[0]?.topicName ?? prefix
                return (
                  <TopicFeedbackCard
                    key={prefix}
                    prefix={prefix}
                    topicName={name}
                    correct={c}
                    total={bucket.length}
                    cfg={cfg}
                    answers={bucket}
                  />
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
