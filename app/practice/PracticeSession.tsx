'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter }                                  from 'next/navigation'
import { getNextQuestion, submitAnswer }              from './actions'
import { getHint, chatWithTutor, getConceptExplanation, getConceptVideo, assessOpenAnswer } from '@/lib/actions/tutor'
import { goToCheckout } from '@/lib/goToCheckout'
import { logLearningEvent }                           from '@/lib/actions/events'
import { awardQuestionPoints, checkAndAwardStageCompletion } from '@/lib/actions/gamification'
import { findStage }                                  from '@/lib/curriculum'
import type { ExplanationBlock }                       from '@/lib/curriculum'
import { POINTS }                                     from '@/lib/gamification-constants'
import AIDisclosureBanner                              from '@/components/tutor/AIDisclosureBanner'
import WorkingInput                                   from '@/components/WorkingInput'
import MathText                                        from '@/components/MathText'
import DiagramRenderer, { extractDiagramSpec }         from '@/components/DiagramRenderer'
import type { DiagramSpec }                             from '@/components/DiagramRenderer'
import type { PracticeQuestion, SubmitResult }         from './actions'
import type { ChatMessage, ConceptVideo, AssessOpenAnswerResult } from '@/lib/actions/tutor'
import dynamic from 'next/dynamic'

const AreaModelVisual       = dynamic(() => import('@/components/visuals/AreaModelVisual'),       { ssr: false })
const NumberLineVisual      = dynamic(() => import('@/components/visuals/NumberLineVisual'),      { ssr: false })
const FunctionMachineVisual = dynamic(() => import('@/components/visuals/FunctionMachineVisual'), { ssr: false })

const STAGE_VISUALS: Record<string, React.ComponentType<{ color?: string }>> = {
  'y11-ext1-l1-s1a': AreaModelVisual,
  'y11-ext1-l2-s2a': NumberLineVisual,
  'y11-ext1-l3-s3a': FunctionMachineVisual,
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'ready' | 'submitting' | 'answered'

// ─── Image compression ────────────────────────────────────────────────────────
//
// Resizes + JPEG-compresses the student's working image client-side before
// sending to the server action.  This cuts payload from ~1-3 MB to ~50-150 KB,
// reducing API latency by 3-10×.
//
// PNG magic bytes in base64 → "iVBOR"  (\x89PNG)
// JPEG magic bytes           → "/9j/"   (\xFF\xD8\xFF)

function compressImageForAI(rawBase64: string): Promise<string> {
  return new Promise(resolve => {
    const mimeType = rawBase64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg'
    const img      = new window.Image()
    img.onload = () => {
      const MAX = 1024   // max dimension — sufficient for Claude to read handwriting
      let w = img.naturalWidth  || img.width  || MAX
      let h = img.naturalHeight || img.height || MAX
      if (w > MAX || h > MAX) {
        if (w >= h) { h = Math.round(h * MAX / w); w = MAX }
        else        { w = Math.round(w * MAX / h); h = MAX }
      }
      const c   = document.createElement('canvas')
      c.width   = w
      c.height  = h
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      // Always output JPEG — matches the media_type sent to Anthropic
      resolve(c.toDataURL('image/jpeg', 0.78).split(',')[1] ?? rawBase64)
    }
    img.onerror = () => resolve(rawBase64)   // fallback: send original on error
    img.src = `data:${mimeType};base64,${rawBase64}`
  })
}

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

// ─── XP Toast ─────────────────────────────────────────────────────────────────

function XPToast({ delta, visible }: { delta: number; visible: boolean }) {
  if (!visible) return null
  const positive = delta > 0
  return (
    <div
      className="fixed top-20 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl text-white font-black text-sm pointer-events-none"
      style={{
        background: positive
          ? 'linear-gradient(135deg,#10B981,#059669)'
          : 'linear-gradient(135deg,#EF4444,#DC2626)',
        animation: 'streakToastIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards',
      }}
    >
      <span className="text-lg">{positive ? '⚡' : '💔'}</span>
      <span>{positive ? `+${delta}` : delta} XP</span>
    </div>
  )
}

// ─── Stage / Level Complete Modal ─────────────────────────────────────────────

interface CompletionData {
  stageName:     string
  stagePoints:   number
  levelComplete: boolean
  levelName:     string
  levelPoints:   number
}

function StageCompleteModal({
  data,
  onContinue,
  onViewMission,
}: {
  data:          CompletionData
  onContinue:    () => void
  onViewMission: () => void
}) {
  const [phase, setPhase] = useState<'stage' | 'level'>('stage')

  useEffect(() => {
    if (!data.levelComplete) return
    const t = setTimeout(() => setPhase('level'), 2500)
    return () => clearTimeout(t)
  }, [data.levelComplete])

  if (phase === 'level' && data.levelComplete) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-4 pb-6 md:pb-0"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-pop-in">
          <div className="px-6 pt-8 pb-6 text-center"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)' }}>
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <p className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">Level Complete!</p>
            <h2 className="text-2xl font-black text-white leading-tight">{data.levelName}</h2>
          </div>
          <div className="px-6 pt-5 pb-6 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '2px solid #FCD34D' }}>
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-2xl font-black text-amber-600">
                  +{data.levelPoints + data.stagePoints} XP
                </p>
                <p className="text-xs text-amber-500">
                  Stage +{data.stagePoints} · Level bonus +{data.levelPoints}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              You&apos;ve mastered every stage in this level. The next level is now unlocked!
            </p>
            <div className="space-y-2">
              <button
                onClick={onViewMission}
                className="w-full py-3.5 rounded-2xl font-black text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)' }}
              >
                View Mission Map 🗺️
              </button>
              <button
                onClick={onContinue}
                className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Keep practicing →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-4 pb-6 md:pb-0"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-pop-in">
        <div className="px-6 pt-8 pb-6 text-center"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
          <div className="text-6xl mb-3 animate-bounce">🎯</div>
          <p className="text-xs font-black text-purple-200 uppercase tracking-widest mb-1">Stage Complete!</p>
          <h2 className="text-2xl font-black text-white leading-tight">{data.stageName}</h2>
        </div>
        <div className="px-6 pt-5 pb-6 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', border: '2px solid #DDD6FE' }}>
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-2xl font-black text-violet-600">+{data.stagePoints} XP</p>
              <p className="text-xs text-violet-400">Stage bonus earned</p>
            </div>
          </div>
          {data.levelComplete && (
            <div className="rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-2"
              style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D' }}>
              <span className="text-lg">🏆</span>
              <p className="text-xs font-black text-amber-700">
                Level complete! +{data.levelPoints} XP bonus coming…
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            You&apos;ve mastered this stage. Next stage is now unlocked!
          </p>
          <div className="space-y-2">
            <button
              onClick={onViewMission}
              className="w-full py-3.5 rounded-2xl font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
            >
              View Mission Map 🗺️
            </button>
            <button
              onClick={onContinue}
              className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Keep practicing →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Inline markdown + math renderer ────────────────────────────────────────
// Handles $math$, **bold**, *italic*, `code` inside a single line of text.

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // Order matters: $...$ before **bold** so math delimiters aren't split
  const re = /(\$[^$\n]+?\$|\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g
  let last = 0
  let m = re.exec(text)
  while (m !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const raw = m[1]
    if (raw.startsWith('$') && raw.endsWith('$') && raw.length > 2) {
      // Inline math — use MathText (imports katex internally)
      parts.push(<MathText key={m.index} text={raw} />)
    } else if (raw.startsWith('**')) {
      parts.push(
        <strong key={m.index} className="font-black" style={{ color: '#1F2937' }}>
          {raw.slice(2, -2)}
        </strong>
      )
    } else if (raw.startsWith('*')) {
      parts.push(<em key={m.index} className="italic">{raw.slice(1, -1)}</em>)
    } else {
      parts.push(
        <code key={m.index} className="rounded px-1 py-0.5 text-[12px] font-mono"
          style={{ background: '#EDE9FE', color: '#6D28D9' }}>
          {raw.slice(1, -1)}
        </code>
      )
    }
    last = m.index + raw.length
    m = re.exec(text)
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
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
            <div className="text-4xl mb-3">👩‍🏫</div>
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
                👩‍🏫
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
              {m.role === 'assistant'
                ? m.content.split('\n').filter(Boolean).map((line, j) => {
                    const trimmed  = line.trim()
                    const stepMatch = trimmed.match(/^(\d+)\.\s*(.*)$/)
                    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ')
                    if (stepMatch) {
                      return (
                        <div key={j} className="flex gap-2 mb-2">
                          <span className="w-5 h-5 rounded-full text-xs font-black flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white' }}>
                            {stepMatch[1]}
                          </span>
                          <p className="text-gray-700 leading-relaxed">{renderInline(stepMatch[2])}</p>
                        </div>
                      )
                    }
                    if (isBullet) {
                      return (
                        <div key={j} className="flex gap-2 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: '#7C3AED' }} />
                          <p className="text-gray-700 leading-relaxed">{renderInline(trimmed.replace(/^[-•]\s*/, ''))}</p>
                        </div>
                      )
                    }
                    return (
                      <p key={j} className="text-gray-700 mb-1.5 leading-relaxed">
                        {renderInline(trimmed)}
                      </p>
                    )
                  })
                : <p className="leading-relaxed">{m.content}</p>
              }
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>👩‍🏫</div>
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

// ─── Inline Steps ─────────────────────────────────────────────────────────────
// ─── RichBody — renders multi-line body text with display math support ──────────
//
// Each line is checked:
//   $$...$$  → centered display math block
//   otherwise → inline rendering (bold, $math$, code)

function RichBody({ text }: { text: string }) {
  const lines = text.split('\n').filter(l => l.trim())
  return (
    <>
      {lines.map((line, i) => {
        const t = line.trim()
        if (t.startsWith('$$') && t.endsWith('$$') && t.length > 4) {
          return (
            <div key={i} className="flex justify-center my-3 px-2">
              <MathText text={t} style={{ color: 'white' }} />
            </div>
          )
        }
        return (
          <p key={i} className={`text-sm leading-relaxed ${i > 0 ? 'mt-1.5' : ''}`}
            style={{ color: 'rgba(255,255,255,0.8)' }}>
            {renderInline(t)}
          </p>
        )
      })}
    </>
  )
}

// ─── InlineSteps — dark-themed rich worked solution panel ────────────────────

function InlineSteps({ steps }: { steps: string[] }) {
  if (!steps || steps.length === 0) return null

  let sectionNum = 0

  return (
    <div className="rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>

      {/* Header */}
      <div className="px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Step-by-step solution
        </p>
      </div>

      <div className="px-5 py-4">
        {steps.map((step, i) => {
          const trimmed = step.trim()

          // ── ✅ Final Answer
          if (/^✅\s*(Final Answer|Answer):?/i.test(trimmed)) {
            const body = trimmed.replace(/^✅\s*(Final Answer|Answer):?\s*/i, '')
            return (
              <div key={i} className="rounded-xl px-4 py-3.5 mt-4 animate-fade-in-up"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.3)', animationDelay: `${i * 0.07}s` }}>
                <p className="text-[11px] font-black uppercase tracking-wide mb-1.5" style={{ color: '#34D399' }}>✅ Final Answer</p>
                <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{renderInline(body)}</p>
              </div>
            )
          }

          // ── ⚠️ Common mistake
          if (/^⚠️?\s*(Common mistake|Watch out|Note):?/i.test(trimmed)) {
            const body = trimmed.replace(/^⚠️?\s*(Common mistake|Watch out|Note):?\s*/i, '')
            return (
              <div key={i} className="rounded-xl px-4 py-3 mt-3 animate-fade-in-up"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.2)', animationDelay: `${i * 0.07}s` }}>
                <p className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color: '#FBBF24' }}>⚠️ Common Mistake</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{renderInline(body)}</p>
              </div>
            )
          }

          // ── 💡 Tip
          if (/^(💡|Tip):?/i.test(trimmed)) {
            const body = trimmed.replace(/^(💡|Tip):?\s*/i, '')
            return (
              <div key={i} className="rounded-xl px-4 py-3 mt-3 animate-fade-in-up"
                style={{ background: 'rgba(96,165,250,0.08)', border: '1.5px solid rgba(96,165,250,0.15)', animationDelay: `${i * 0.07}s` }}>
                <p className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color: '#60A5FA' }}>💡 Tip</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{renderInline(body)}</p>
              </div>
            )
          }

          // ── 📊 Visual / Diagram
          if (/^(📊|📐|📈)\s*(Visual|Graph|Chart|Diagram):?/i.test(trimmed)) {
            const raw = trimmed.replace(/^(📊|📐|📈)\s*(Visual|Graph|Chart|Diagram):?\s*/i, '')
            const { spec, text: descText } = extractDiagramSpec(raw)
            return (
              <div key={i} className="rounded-xl overflow-hidden mt-4 animate-fade-in-up"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', animationDelay: `${i * 0.07}s` }}>
                <p className="text-[11px] font-black px-4 pt-3 pb-1.5 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>📊 Visual</p>
                {spec && <div className="px-3 pb-1"><DiagramRenderer spec={spec as DiagramSpec} /></div>}
                {descText && (
                  <p className="text-xs leading-relaxed px-4 pb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {renderInline(descText)}
                  </p>
                )}
              </div>
            )
          }

          // ── **N. Section title** — rich section with body content on next line(s)
          const sectionMatch = trimmed.match(/^\*\*(\d+)\.\s+(.+?)\*\*([\s\S]*)$/)
          if (sectionMatch) {
            sectionNum++
            const title = sectionMatch[2].trim()
            const body  = sectionMatch[3].trim()
            return (
              <div key={i}
                className={`animate-fade-in-up ${i > 0 ? 'pt-5 mt-1' : 'pt-1'}`}
                style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', animationDelay: `${i * 0.07}s` }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  {sectionNum}
                </p>
                <p className="text-sm font-black text-white mb-2.5">{title}</p>
                {body && <RichBody text={body} />}
              </div>
            )
          }

          // ── Plain numbered step (fallback for old-format questions)
          sectionNum++
          return (
            <div key={i} className="flex gap-3 py-3 animate-fade-in-up"
              style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', animationDelay: `${i * 0.07}s` }}>
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

// ─── Inline Ask ───────────────────────────────────────────────────────────────

const QUICK_ASKS = [
  'Why this method?',
  'Simpler example?',
  "Why is my answer wrong?",
]

function InlineAsk({ onAsk }: { onAsk: (text: string) => void }) {
  const [text, setText]   = useState('')
  const inputRef          = useRef<HTMLInputElement>(null)

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    onAsk(trimmed)
  }

  return (
    <div className="rounded-2xl p-3.5" style={{ background: '#F5F3FF', border: '1.5px solid #EDE9FE' }}>
      <p className="text-[11px] font-black mb-2.5" style={{ color: '#7C3AED' }}>
        💬 Ask the tutor about this solution
      </p>
      {/* Quick-tap suggestion chips */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {QUICK_ASKS.map(s => (
          <button key={s}
            onClick={() => { setText(s); inputRef.current?.focus() }}
            className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95"
            style={{ background: 'white', border: '1.5px solid #DDD6FE', color: '#7C3AED' }}>
            {s}
          </button>
        ))}
      </div>
      {/* Free-text input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="e.g. Why did we use chain rule here?"
          className="flex-1 text-sm bg-white rounded-xl px-3 py-2.5 outline-none transition-all focus:ring-2 focus:ring-violet-200"
          style={{ border: '1.5px solid #DDD6FE', color: '#374151' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="px-4 py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-30 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
          Ask →
        </button>
      </div>
    </div>
  )
}

// ─── Rich ExplanationBlock renderer ──────────────────────────────────────────

function RenderBlock({ block }: { block: ExplanationBlock }) {
  switch (block.type) {
    case 'text':
      return <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{block.body}</p>

    case 'formula':
      return (
        <div className="rounded-xl px-4 py-3 my-1" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
          {block.label && (
            <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: 'rgba(167,139,250,0.7)' }}>{block.label}</p>
          )}
          <MathText text={`$$${block.latex}$$`} className="text-white text-center block" />
        </div>
      )

    case 'rules':
      return (
        <div className="rounded-xl px-4 py-3 my-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {block.heading && <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{block.heading}</p>}
          <ul className="space-y-1.5">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span className="mt-0.5 shrink-0 text-violet-400">•</span>
                <MathText text={item} />
              </li>
            ))}
          </ul>
        </div>
      )

    case 'steps':
      return (
        <div className="rounded-xl px-4 py-3 my-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {block.heading && <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{block.heading}</p>}
          <ol className="space-y-1.5 list-none">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                  style={{ background: 'rgba(124,58,237,0.4)', color: '#C4B5FD' }}>{i + 1}</span>
                <MathText text={item} />
              </li>
            ))}
          </ol>
        </div>
      )

    case 'example':
      return (
        <div className="rounded-xl px-4 py-3 my-1" style={{ background: 'rgba(56,178,172,0.1)', border: '1px solid rgba(56,178,172,0.25)' }}>
          <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: 'rgba(94,234,212,0.7)' }}>Worked Example</p>
          <MathText text={block.question} className="text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.9)' }} />
          <ol className="space-y-1 list-none mt-2">
            {block.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <span className="shrink-0 font-black text-teal-400 mt-0.5">{i + 1}.</span>
                <MathText text={step} />
              </li>
            ))}
          </ol>
        </div>
      )

    case 'tip':
      return (
        <div className="rounded-xl px-4 py-3 my-1 flex gap-3" style={{ background: 'rgba(255,218,0,0.07)', border: '1.5px solid rgba(255,218,0,0.2)' }}>
          <span className="text-lg shrink-0">💡</span>
          <MathText text={block.body} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }} />
        </div>
      )

    case 'table':
      return (
        <div className="rounded-xl overflow-hidden my-1" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.2)' }}>
                {block.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(196,181,253,0.8)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <MathText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}

// ─── Stage Intro Screen ─────────────────────────────────────────────────────────

function StageIntroScreen({ stageId, onStart }: { stageId: string; onStart: () => void }) {
  const info = findStage(stageId)
  if (!info) { onStart(); return null }
  const { stage, level } = info

  return (
    <div
      className="min-h-screen flex flex-col items-center px-5 py-8"
      style={{ background: '#080D16', fontFamily: "'Nunito', sans-serif", overflowY: 'auto' }}
    >
      <div className="w-full max-w-lg">
        {/* Level badge */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${level.color}22`, border: `2px solid ${level.color}55` }}
          >
            {level.emoji}
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {level.title}
            </p>
            <h1 className="text-xl font-black text-white leading-tight">
              Stage {stage.code}: {stage.title}
            </h1>
          </div>
        </div>

        {/* Rich content blocks — or fallback to plain explanation text */}
        {stage.content && stage.content.length > 0 ? (
          <div className="space-y-3 mb-4">
            {stage.content.map((block, i) => (
              <RenderBlock key={i} block={block} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              What you&apos;ll learn
            </p>
            <p className="text-sm leading-relaxed text-white">{stage.explanation}</p>
          </div>
        )}

        {/* Interactive visual — dual coding for supported stages */}
        {STAGE_VISUALS[stage.stageId] && (() => {
          const Visual = STAGE_VISUALS[stage.stageId]
          return <div className="mb-4"><Visual color={level.color} /></div>
        })()}

        {/* Video — only shown when videoHint is set */}
        {stage.videoHint && (
          <div className="mb-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base">▶️</span>
              <p className="text-[11px] font-black uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Watch first — Eddie Woo explains it live
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)', aspectRatio: '16/9' }}>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${stage.videoHint}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${stage.title} — Eddie Woo`}
              />
            </div>
          </div>
        )}

        {/* XP reward strip */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-6"
          style={{ background: 'rgba(255,218,0,0.07)', border: '1.5px solid rgba(255,218,0,0.2)' }}
        >
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-black text-white">
              Complete this stage →{' '}
              <span style={{ color: '#FFDA00' }}>+{POINTS.STAGE_COMPLETE} XP</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              +{POINTS.CORRECT} XP per correct answer along the way
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-black text-base transition-all active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)', color: 'white', minHeight: 56 }}
        >
          Start Practising →
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

// Tiers that include full AI features (hints + concept explainer + tutor chat)
// basic (paid), basic_trial, pro_trial, and pro all get full access.
const PRO_AI_TIERS = new Set(['pro', 'basic', 'basic_trial', 'pro_trial'])

export default function PracticeSession({
  userId,
  sessionId: initialSessionId,
  topicFilter,
  yearGroup,
  tier = 'pro',   // default to full access if tier not passed
  stageId,
  questionsToday  = 0,
  isTrial         = false,
  dailyLimit      = -1,
  aiDisclosureDismissed = false,
}: {
  userId:       string
  sessionId:    string
  topicFilter?: string | null
  yearGroup?:   string | null
  tier?:        string
  stageId?:     string | null
  questionsToday?: number
  isTrial?:        boolean
  dailyLimit?:     number
  aiDisclosureDismissed?: boolean
}) {
  const router = useRouter()
  const [phase,          setPhase]          = useState<Phase>('loading')
  const [question,       setQuestion]       = useState<PracticeQuestion | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [result,         setResult]         = useState<SubmitResult | null>(null)
  const [hintUsed,       setHintUsed]       = useState(false)
  const [hintCount,      setHintCount]      = useState(0)
  const [showAIDisclosure, setShowAIDisclosure] = useState(!aiDisclosureDismissed)
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

  // Concept explanation state
  const [conceptText,    setConceptText]    = useState<string | null>(null)
  const [conceptLoading, setConceptLoading] = useState(false)
  const [showConcept,    setShowConcept]    = useState(false)

  // Video state (loaded in parallel with concept explanation)
  const [videoData,        setVideoData]        = useState<ConceptVideo | null>(null)
  const [videoLoading,     setVideoLoading]     = useState(false)
  const [videoSearchQuery, setVideoSearchQuery] = useState('')

  // Open-response working input
  const [workingBase64,       setWorkingBase64]       = useState<string | null>(null)
  const [openFeedback,        setOpenFeedback]        = useState<AssessOpenAnswerResult | null>(null)
  const [openFeedbackLoading, setOpenFeedbackLoading] = useState(false)

  // Streak
  const [streakToastVisible, setStreakToastVisible] = useState(false)
  const [toastStreak,        setToastStreak]        = useState(0)
  const toastTimerRef                               = useRef<ReturnType<typeof setTimeout> | null>(null)

  // XP Toast
  const [xpToastVisible, setXPToastVisible] = useState(false)
  const [xpToastDelta,   setXPToastDelta]   = useState(0)
  const xpToastTimerRef                     = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stage / Level complete modal
  const [completionData,     setCompletionData]     = useState<CompletionData | null>(null)
  const [showStageComplete,  setShowStageComplete]  = useState(false)

  // Stage intro screen — show when entering a stage
  const [showStageIntro,     setShowStageIntro]     = useState(!!stageId)

  // Trial soft banner (shown every 5 questions during trial)
  const [showTrialBanner,      setShowTrialBanner]      = useState(false)
  // Trial hard-limit modal (shown when trial daily cap hit mid-session)
  const [showTrialLimitModal,  setShowTrialLimitModal]  = useState(false)
  // Loading state for checkout buttons inside the mid-session modal
  const [checkoutLoading,      setCheckoutLoading]      = useState<'basic' | 'pro' | null>(null)

  // Session tracking
  const sessionStartMsRef = useRef(Date.now())
  const sessionAnswersRef = useRef(0)
  const sessionCorrectRef = useRef(0)
  const sessionEndedRef   = useRef(false)

  // Feature access based on tier
  // Trials + Pro → full AI. Paid Basic → hints only.
  const hasProAI = PRO_AI_TIERS.has(tier)

  // Retry: when wrong, load another question from the same topic prefix
  const retryTopicRef = useRef<string | null>(null)

  // Adaptive difficulty: starts at band 3 (medium), goes up on correct, down on wrong
  const adaptiveBandRef = useRef<number>(3)

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
    setConceptText(null)
    setConceptLoading(false)
    setShowConcept(false)
    setVideoData(null)
    setVideoLoading(false)
    setVideoSearchQuery('')
    setElapsed(0)
    setWorkingBase64(null)
    setOpenFeedback(null)
    setOpenFeedbackLoading(false)

    // Consume retry topic (set when user got previous question wrong).
    // Always strip any band suffix (e.g. "MA-TRIG-01-B3" → "MA-TRIG-01")
    // so getNextQuestion receives a clean topic prefix.
    const rawTopic = retryTopicRef.current ?? topicFilter ?? undefined
    retryTopicRef.current = null
    const effectiveTopic = rawTopic ? rawTopic.replace(/-B\d+$/, '') : undefined

    const targetBand = adaptiveBandRef.current

    let q = await getNextQuestion(userId, effectiveTopic, targetBand)

    // No questions exist yet → call generation API, then retry
    if (!q && effectiveTopic) {
      try {
        const base = typeof window !== 'undefined' ? window.location.origin : ''
        const genRes = await fetch(`${base}/math-nsw/app/api/generate-questions`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ topic: effectiveTopic, yearGroup: yearGroup ?? 'year_12' }),
        })
        const genJson = await genRes.json().catch(() => ({})) as Record<string, unknown>
        console.log('[PracticeSession] Generation response:', genRes.status, genJson)

        if (genRes.ok || genJson.status === 'already_exists') {
          // Small delay to let DB propagate, then retry
          await new Promise(r => setTimeout(r, 500))
          q = await getNextQuestion(userId, effectiveTopic, targetBand)
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

  const hasLoadedOnceRef = useRef(false)
  useEffect(() => {
    if (!showStageIntro && !hasLoadedOnceRef.current) {
      hasLoadedOnceRef.current = true
      loadNext()
    }
  }, [loadNext, showStageIntro])

  useEffect(() => () => {
    if (timerRef.current)      clearInterval(timerRef.current)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    if (xpToastTimerRef.current) clearTimeout(xpToastTimerRef.current)
    endSession()
  }, [endSession])

  // ── Shared post-answer gamification ─────────────────────────────────────────
  async function handlePostAnswer(res: SubmitResult) {
    setResult(res)
    setPhase('answered')
    setSessionCount(c => c + 1)
    sessionAnswersRef.current += 1
    if (res.isCorrect) sessionCorrectRef.current += 1

    // ── Adaptive difficulty adjustment ───────────────────────────────────────
    // Correct → harder next question (band +1, max 6)
    // Wrong   → easier next question  (band -1, min 1)
    if (res.isCorrect) {
      adaptiveBandRef.current = Math.min(6, adaptiveBandRef.current + 1)
    } else {
      adaptiveBandRef.current = Math.max(1, adaptiveBandRef.current - 1)
    }

    // Trial daily-limit check (mid-session)
    if (isTrial && dailyLimit > 0) {
      const totalDone = questionsToday + sessionAnswersRef.current
      if (totalDone >= dailyLimit) {
        setShowTrialLimitModal(true)
      } else if (totalDone > 0 && totalDone % 5 === 0) {
        setShowTrialBanner(true)
      }
    }

    // Streak toast
    if (res.streakUpdated && res.newStreak >= 1) {
      try {
        localStorage.setItem('neumm_streak_anim',
          JSON.stringify({ from: Math.max(0, res.newStreak - 1), to: res.newStreak, ts: Date.now() }))
      } catch {}
      setToastStreak(res.newStreak)
      setStreakToastVisible(true)
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      toastTimerRef.current = setTimeout(() => setStreakToastVisible(false), 3200)
    }

    // Award XP and show toast
    try {
      const { pointsDelta } = await awardQuestionPoints(userId, res.isCorrect)
      setXPToastDelta(pointsDelta)
      setXPToastVisible(true)
      if (xpToastTimerRef.current) clearTimeout(xpToastTimerRef.current)
      xpToastTimerRef.current = setTimeout(() => setXPToastVisible(false), 2500)

      // Check stage completion if we're in a stage context and got it right
      if (res.isCorrect && stageId) {
        const completion = await checkAndAwardStageCompletion(userId, stageId)
        if (completion.stageComplete) {
          setCompletionData({
            stageName:     completion.stageName,
            stagePoints:   completion.stagePoints,
            levelComplete: completion.levelComplete,
            levelName:     completion.levelName,
            levelPoints:   completion.levelPoints,
          })
          setShowStageComplete(true)
        }
      }
    } catch (err) {
      console.error('[PracticeSession] gamification error:', err)
    }
  }

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
    await handlePostAnswer(res)
  }

  // ── Open-response submit ────────────────────────────────────────────────────
  async function handleOpenSubmit() {
    if (!question || !workingBase64 || phase !== 'ready') return
    if (timerRef.current) clearInterval(timerRef.current)
    const timeMs = Date.now() - startMsRef.current
    setPhase('submitting')
    setOpenFeedbackLoading(true)

    // Compress image client-side before sending — reduces payload from ~1-3 MB to
    // ~50-150 KB, cutting API latency by 3-10×.  Always outputs JPEG.
    const compressedImage = await compressImageForAI(workingBase64)

    // Assess working image with Claude vision (haiku — fast)
    const assessment = await assessOpenAnswer({
      questionText:       question.content.question_text,
      modelAnswer:        question.content.model_answer,
      solutionSteps:      question.step_by_step,
      marks:              question.content.marks,
      markingCriteria:    question.content.marking_criteria,
      workingImageBase64: compressedImage,
    })
    setOpenFeedback(assessment)
    setOpenFeedbackLoading(false)

    // Map AI result to selectedOption / correctAnswer so submitAnswer works
    const res = await submitAnswer({
      userId, sessionId, questionId: question.id,
      masteryOutcomeId: question.mastery_outcome_id,
      difficultyBand:   question.difficulty_band,
      selectedOption:   assessment.isCorrect ? 'open_correct' : 'open_wrong',
      correctAnswer:    'open_correct',
      hintUsed, timeMs,
      explanation:  question.explanation,
      step_by_step: question.step_by_step,
    })
    await handlePostAnswer({ ...res, isCorrect: assessment.isCorrect })
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

  // ── Explain concept ──────────────────────────────────────────────────────────
  async function handleExplainConcept() {
    if (!question) return
    // Basic plan — redirect to upgrade
    if (!hasProAI) {
      window.location.href = '/math-nsw/app/account/upgrade?reason=limit'
      return
    }
    if (showConcept && conceptText) { setShowConcept(false); return }
    setShowConcept(true)
    if (conceptText) return   // already loaded — just re-open

    setConceptLoading(true)
    setVideoLoading(true)

    // Use the topic name as the YouTube search key (always available, no API wait needed)
    const ytTopic = question.topic_name ?? question.outcome_id.replace(/-B\d+$/, '')

    // Fire both requests simultaneously; update state independently so concept
    // text appears as soon as it's ready without waiting for YouTube.
    const conceptPromise = getConceptExplanation(question.id)
    const videoPromise   = getConceptVideo(ytTopic)

    conceptPromise.then(({ concept }) => {
      setConceptText(concept)
      setConceptLoading(false)
    }).catch(() => setConceptLoading(false))

    videoPromise.then(({ video, searchQuery }) => {
      setVideoData(video)
      setVideoSearchQuery(searchQuery)
      setVideoLoading(false)
    }).catch(() => setVideoLoading(false))

    await Promise.all([conceptPromise, videoPromise])
  }

  // ── Free-form chat ───────────────────────────────────────────────────────────
  async function handleChatSend(text: string) {
    if (!question) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...chatMessages, userMsg]
    setChatMessages(updatedMessages)
    setChatLoading(true)
    const { reply } = await chatWithTutor(question.id, updatedMessages)
    // Server returns sentinel when tier is Basic
    if (reply === '__UPGRADE_REQUIRED__') {
      window.location.href = '/math-nsw/app/account/upgrade?reason=limit'
      return
    }
    const aiMsg: ChatMessage = { role: 'assistant', content: reply }
    setChatMessages(prev => [...prev, aiMsg])
    setChatLoading(false)
  }

  // ── Inline ask (opens chat pre-populated with their question) ────────────────
  function handleInlineAsk(text: string) {
    setShowChatPanel(true)
    void handleChatSend(text)
  }

  // ── Stage intro ───────────────────────────────────────────────────────────────
  if (showStageIntro && stageId) {
    return (
      <StageIntroScreen
        stageId={stageId}
        onStart={() => {
          setShowStageIntro(false)
          // Only load first question if we haven't started yet
          if (!question && phase !== 'loading') void loadNext()
        }}
      />
    )
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

      {/* ── Trial soft upgrade banner (every 5 questions) ─────────── */}
      {showTrialBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
          style={{ background: 'linear-gradient(90deg,#7C3AED,#A855F7)', color: '#fff' }}>
          <span className="font-semibold text-xs sm:text-sm">
            ⚡ Enjoying Neumm? Upgrade to Basic or Pro for more daily questions.
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => void goToCheckout('pro')}
              className="text-xs font-black px-3 py-1 rounded-full bg-white"
              style={{ color: '#7C3AED' }}>
              Upgrade →
            </button>
            <button
              onClick={() => setShowTrialBanner(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Trial mid-session limit modal ──────────────────────────── */}
      {showTrialLimitModal && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full sm:max-w-xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ maxHeight: '92vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom,0px)' }}>
            <div className="px-6 pt-7 pb-5 text-center border-b border-gray-100">
              <div className="text-5xl mb-3">⚡</div>
              <h2 className="text-xl font-black text-gray-900">You&apos;ve used all {dailyLimit} trial questions today</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                Upgrade to keep practising. Resets at midnight UTC.<br/>
                Your progress, XP and streak are all saved.
              </p>
            </div>
            <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-4">
              {[
                { id: 'basic', name: 'Basic', price: '$29.00', period: '/month (GST incl.)', color: '#185FA5',
                  features: ['30 questions per day', 'AI hints, concept explainer & tutor chat', 'AI step-by-step marking', 'Mission roadmap & XP', 'Adaptive difficulty', 'Streak tracking'] },
                { id: 'pro',   name: 'Pro',   price: '$49.00', period: '/month (GST incl.)', color: '#7C3AED', badge: 'Most popular',
                  features: ['Unlimited questions', 'Mission roadmap & XP', 'Adaptive difficulty', 'Full AI tutor', 'Streak tracking', 'Priority support'] },
              ].map(plan => (
                <div key={plan.id} className="flex-1 rounded-2xl border-2 p-5 flex flex-col relative"
                  style={{ borderColor: plan.color }}>
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: plan.color }}>{plan.badge}</span>
                  )}
                  <p className="font-black text-gray-900 text-base">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1 mb-4">
                    <span className="text-3xl font-extrabold" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-xs text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-0.5 shrink-0" style={{ color: plan.color }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => void goToCheckout(plan.id as 'basic' | 'pro', v => setCheckoutLoading(v ? plan.id as 'basic' | 'pro' : null))}
                    disabled={checkoutLoading !== null}
                    className="block w-full py-3 rounded-xl font-black text-sm text-white text-center disabled:opacity-70"
                    style={{ backgroundColor: plan.color }}>
                    {checkoutLoading === plan.id ? 'Redirecting…' : `Choose ${plan.name} →`}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 pb-5">Cancel anytime · No lock-in</p>
            <div className="text-center pb-6">
              <a href="/dashboard/mission" className="text-xs font-semibold text-gray-400 hover:text-gray-600">
                ← Back to mission
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Left: Question Panel ─────────────────────────────────── */}
      {/* max-w-2xl only kicks in on lg (1024px+) so iPad portrait gets full width */}
      {/* pb-28 on mobile leaves room above the fixed MobileBottomNav (~80px) */}
      <div className={`flex-1 min-w-0 flex flex-col px-5 md:px-8 py-6 pb-28 md:pb-8 lg:max-w-2xl${showTrialBanner ? ' mt-10' : ''}`}>

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
            {stageId && (
              <button
                onClick={() => setShowStageIntro(true)}
                className="text-xs font-black px-3 py-1 rounded-full border transition-colors"
                style={{ background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.25)', color: '#7C3AED' }}
                title="Review concept intro"
              >
                📖 Intro
              </button>
            )}
            <span className="text-xs font-mono font-semibold text-gray-400 bg-white rounded-full px-3 py-1 border border-gray-100">
              ⏱ {formatMs(elapsed * 1000)}
            </span>
            {/* Chat button mobile */}
            {hasProAI ? (
              <button onClick={() => setShowChatPanel(true)}
                className="md:hidden flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full text-white min-h-[32px]"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                👩‍🏫 Tutor
                {chatMessages.length > 0 && (
                  <span className="bg-white text-violet-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">
                    {chatMessages.length}
                  </span>
                )}
              </button>
            ) : (
              <a href="/math-nsw/app/account/upgrade?reason=limit"
                className="md:hidden flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full min-h-[32px]"
                style={{ background: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>
                🔒 Pro Tutor
              </a>
            )}
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
          {/* Rendered diagram (cartesian / triangle / numberline / circle) */}
          {question.content.diagram_spec && (
            <DiagramRenderer
              spec={question.content.diagram_spec as unknown as DiagramSpec}
              className="mb-4"
            />
          )}
          <MathText
            text={content.question_text}
            as="p"
            className="text-base md:text-lg font-semibold text-gray-900 leading-relaxed"
          />
        </div>

        {/* Diagram text description (shown only when there is no renderable spec) */}
        {question.content.diagram && !question.content.diagram_spec && (
          <div className="rounded-2xl px-4 py-3 mb-3 flex items-start gap-2 animate-fade-in-up"
            style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
            <span className="text-lg shrink-0">📐</span>
            <MathText text={question.content.diagram} as="p" className="text-sm font-medium leading-relaxed" style={{ color: '#14532D' }} />
          </div>
        )}

        {/* Options (MC) or WorkingInput (open) */}
        {question.question_type === 'open' ? (
          <div className="mb-5 space-y-2">
            {/* Marks badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
                {question.content.marks} {question.content.marks === 1 ? 'mark' : 'marks'}
              </span>
              <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>
                Show all working below
              </span>
            </div>
            {/* Canvas / photo input */}
            {(isInteractive || isSubmitting) && !isAnswered ? (
              <WorkingInput
                onChange={setWorkingBase64}
                disabled={isSubmitting}
              />
            ) : isAnswered && workingBase64 ? (
              /* Show submitted working thumbnail after answering */
              <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: '#DDD6FE' }}>
                <div className="px-3 py-1.5 text-xs font-black"
                  style={{ background: 'linear-gradient(135deg,#F5F3FF,#FDF2F8)', borderBottom: '1px solid #EDE9FE', color: '#7C3AED' }}>
                  Your submitted working
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:image/png;base64,${workingBase64}`} alt="Your working"
                  className="w-full object-contain max-h-48"
                  style={{ background: '#FFF' }} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2.5 mb-5">
            {OPTIONS.map(opt => {
              const optText  = content[`option_${opt.key}` as keyof typeof content]
              const isSel    = selectedOption === opt.key
              const isCorr   = result?.correctAnswer === opt.key
              let border = '#E9D5FF', bg = '#FFFFFF', text = '#374151', labelBg = '#F3F0FF', labelColor = '#7C3AED'
              if ((isInteractive || isSubmitting) && isSel) {
                border = '#7C3AED'; bg = '#EDE9FE'; labelBg = 'linear-gradient(135deg,#7C3AED,#A855F7)'; labelColor = '#FFFFFF'
              }
              if (isAnswered) {
                if (isCorr)      { border = '#10B981'; bg = '#F0FDF4'; labelBg = '#10B981'; labelColor = '#FFFFFF'; text = '#065F46' }
                else if (isSel)  { border = '#EF4444'; bg = '#FEF2F2'; labelBg = '#EF4444'; labelColor = '#FFFFFF'; text = '#991B1B' }
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
                  <MathText text={String(optText ?? '')} className="flex-1 text-sm font-semibold" />
                  {isAnswered && isCorr && <span className="text-lg">✅</span>}
                  {isAnswered && isSel && !isCorr && <span className="text-lg">❌</span>}
                </button>
              )
            })}
          </div>
        )}

        {/* Concept Explanation Panel */}
        {isInteractive && showConcept && (
          <div className="rounded-2xl border-2 overflow-hidden mb-1 animate-pop-in"
            style={{ borderColor: '#C7D2FE', background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)' }}>

            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid #C7D2FE', background: 'rgba(99,102,241,0.07)' }}>
              <div className="flex items-center gap-2">
                <span className="text-base">📖</span>
                <span className="text-xs font-black" style={{ color: '#4338CA' }}>Concept Explanation</span>
              </div>
              <button onClick={() => setShowConcept(false)}
                className="text-xs font-bold px-2 py-1 rounded-lg transition-all hover:bg-indigo-100"
                style={{ color: '#6366F1' }}>✕ Close</button>
            </div>

            {/* Concept text */}
            <div className="px-4 py-3">
              {conceptLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }} />
                  <span className="text-xs font-semibold" style={{ color: '#6366F1' }}>
                    Explaining the concept…
                  </span>
                </div>
              ) : conceptText ? (
                <div className="space-y-2">
                  {conceptText.split('\n').filter(l => l.trim()).map((line, i) => {
                    const isHeader = /^[📖🔑✏️💡]/.test(line.trim())
                    return (
                      <p key={i}
                        className={isHeader ? 'text-xs font-black mt-2 first:mt-0' : 'text-xs font-medium leading-relaxed pl-1'}
                        style={{ color: isHeader ? '#312E81' : '#4338CA', opacity: isHeader ? 1 : 0.9 }}>
                        {renderInline(line)}
                      </p>
                    )
                  })}
                </div>
              ) : null}

              {/* ── Video section — shown once concept has finished loading ── */}
              {!conceptLoading && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid #C7D2FE' }}>
                  <p className="text-[11px] font-black mb-2" style={{ color: '#4338CA' }}>
                    📺 Explainer Video
                  </p>

                  {videoLoading ? (
                    /* Searching for video */
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }} />
                      <span className="text-xs font-medium" style={{ color: '#6366F1' }}>
                        Finding a relevant video…
                      </span>
                    </div>

                  ) : videoData ? (
                    /* Embedded player */
                    <>
                      <div style={{
                        position: 'relative', paddingBottom: '56.25%', height: 0,
                        borderRadius: 10, overflow: 'hidden', background: '#000',
                      }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoData.videoId}?rel=0&modestbranding=1`}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={videoData.title}
                        />
                      </div>
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-tight line-clamp-2" style={{ color: '#1F2937' }}>
                            {videoData.title}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>
                            {videoData.channelTitle}
                          </p>
                        </div>
                        <a href={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                          target="_blank" rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1 text-[11px] font-black px-2.5 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                          style={{ background: '#FF0000' }}>
                          ▶ YouTube
                        </a>
                      </div>
                    </>

                  ) : (
                    /* Fallback: YouTube search link (no API key, or no results) */
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(videoSearchQuery || `eddie woo ${question?.topic_name ?? ''} HSC maths`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs font-black px-3 py-2.5 rounded-xl text-white w-full transition-opacity hover:opacity-90"
                      style={{ background: '#FF0000' }}>
                      🔍 Search &ldquo;{question?.topic_name ?? 'this topic'}&rdquo; on YouTube →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Disclosure Banner — shown before first AI interaction */}
        {showAIDisclosure && (
          <AIDisclosureBanner
            userId={userId}
            onDismiss={() => setShowAIDisclosure(false)}
          />
        )}

        {/* Action buttons
            Mobile: hint + explain on one row, submit full-width below.
            Desktop (md+): all three in a single row. */}
        {isInteractive ? (
          <div className="flex flex-col gap-2">
            {/* Row 1: Hint + Explain */}
            <div className="flex items-center gap-2">
              <button onClick={handleHint}
                className="flex items-center gap-1.5 px-3 py-3 rounded-2xl border-2 border-purple-200 bg-white text-sm font-black text-violet-700 hover:bg-purple-50 transition-all min-h-[48px] flex-1">
                💡 Hint
                {hintCount > 0 && (
                  <span className="text-xs bg-violet-100 text-violet-700 rounded-full w-5 h-5 flex items-center justify-center font-black">
                    {hintCount}
                  </span>
                )}
              </button>
              <button onClick={handleExplainConcept}
                className="flex items-center gap-1.5 px-3 py-3 rounded-2xl border-2 text-xs font-black transition-all min-h-[48px] flex-1"
                style={{
                  borderColor: !hasProAI ? '#E5E7EB' : showConcept ? '#6366F1' : '#C7D2FE',
                  background:  !hasProAI ? '#F9FAFB' : showConcept ? '#EEF2FF' : 'white',
                  color:       !hasProAI ? '#9CA3AF' : '#4338CA',
                }}>
                {conceptLoading ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: '#6366F1', borderTopColor: 'transparent' }} />
                    Loading…
                  </span>
                ) : !hasProAI ? '🔒 Concept'
                  : showConcept ? '📖 Hide' : '📖 Concept'}
              </button>
            </div>
            {/* Row 2: Submit — full width so there's room for the label */}
            {question.question_type === 'open' ? (
              <button onClick={handleOpenSubmit} disabled={!workingBase64}
                className="btn-gradient w-full py-3 rounded-2xl text-sm font-black min-h-[48px]">
                {workingBase64 ? '✅ Submit for Marking' : '✏️ Add your working above first'}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!selectedOption}
                className="btn-gradient w-full py-3 rounded-2xl text-sm font-black min-h-[48px]">
                {selectedOption ? 'Submit Answer ✨' : 'Select an answer above first…'}
              </button>
            )}
          </div>
        ) : isSubmitting ? (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} />
            <span className="text-sm font-semibold text-gray-500">
              {question.question_type === 'open' ? 'Analysing your working…' : 'Checking…'}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {result && (
              <>
                {/* Result banner */}
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

                {/* Mastery update */}
                <MasteryPanel prevConf={result.prevConfidence} newConf={result.newConfidence}
                  delta={result.delta} newStatus={result.newStatus} predictedHscBand={result.predictedHscBand} />

                {/* Open-response AI feedback */}
                {question.question_type === 'open' && openFeedback && (
                  <div className="rounded-2xl overflow-hidden animate-fade-in-up"
                    style={{ background: '#FAFAFA', border: '1.5px solid #F3F4F6' }}>

                    {/* ── Header with score badge ─────────────────────────── */}
                    <div className="px-4 py-2.5 flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#F5F3FF,#FDF2F8)', borderBottom: '1px solid #EDE9FE' }}>
                      <span className="text-sm">🤖</span>
                      <p className="text-xs font-black" style={{ color: '#5B21B6' }}>AI Marking</p>
                      <span className="ml-auto text-xs font-black px-2.5 py-0.5 rounded-full text-white"
                        style={{ background: openFeedback.isCorrect ? '#10B981' : '#F59E0B' }}>
                        {openFeedback.score}/{openFeedback.totalMarks} marks
                      </span>
                    </div>

                    <div className="px-4 py-3 space-y-3">

                      {/* ── Overall feedback ───────────────────────────────── */}
                      <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                        {openFeedback.feedback}
                      </p>

                      {/* ── Per-step criterion checking ────────────────────── */}
                      {openFeedback.stepResults && openFeedback.stepResults.length > 0 && (
                        <div>
                          <p className="text-[11px] font-black mb-2" style={{ color: '#5B21B6' }}>
                            📋 Step-by-step marking
                          </p>
                          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE9FE' }}>
                            {openFeedback.stepResults.map((step, i) => (
                              <div key={i}
                                className="flex items-start gap-3 px-3 py-2.5"
                                style={{
                                  background:   step.passed ? '#F0FDF4' : '#FEF2F2',
                                  borderBottom: i < openFeedback.stepResults.length - 1 ? '1px solid #F3F4F6' : 'none',
                                }}>
                                {/* Tick / cross badge */}
                                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                                  style={{
                                    background: step.passed ? '#10B981' : '#EF4444',
                                    color:      'white',
                                  }}>
                                  {step.passed ? '✓' : '✗'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  {/* Criterion label */}
                                  <p className="text-xs font-bold leading-snug"
                                    style={{ color: step.passed ? '#065F46' : '#991B1B' }}>
                                    {step.criterion}
                                  </p>
                                  {/* AI comment on this step */}
                                  {step.comment && (
                                    <p className="text-[11px] leading-snug mt-0.5"
                                      style={{ color: step.passed ? '#047857' : '#B91C1C', opacity: 0.85 }}>
                                      {step.comment}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── What was right (fallback when no stepResults) ─── */}
                      {(!openFeedback.stepResults || openFeedback.stepResults.length === 0) && openFeedback.whatWasRight.length > 0 && (
                        <div>
                          <p className="text-[11px] font-black mb-1.5" style={{ color: '#059669' }}>✅ What you got right</p>
                          <div className="space-y-1">
                            {openFeedback.whatWasRight.map((item, i) => (
                              <div key={i} className="flex gap-2 items-start">
                                <span className="text-green-500 text-xs mt-0.5 shrink-0">✓</span>
                                <p className="text-xs leading-relaxed" style={{ color: '#065F46' }}>{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── What was missing (always shown) ───────────────── */}
                      {openFeedback.whatWasMissing.length > 0 && (
                        <div>
                          <p className="text-[11px] font-black mb-1.5" style={{ color: '#DC2626' }}>❌ What was missing</p>
                          <div className="space-y-1">
                            {openFeedback.whatWasMissing.map((item, i) => (
                              <div key={i} className="flex gap-2 items-start">
                                <span className="text-red-400 text-xs mt-0.5 shrink-0">✗</span>
                                <p className="text-xs leading-relaxed" style={{ color: '#991B1B' }}>{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── Tip ────────────────────────────────────────────── */}
                      {openFeedback.tip && (
                        <div className="rounded-xl px-3 py-2.5"
                          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                          <p className="text-[11px] font-black mb-0.5" style={{ color: '#92400E' }}>💡 Tip</p>
                          <p className="text-xs leading-relaxed" style={{ color: '#78350F' }}>{openFeedback.tip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Open-response loading skeleton */}
                {question.question_type === 'open' && openFeedbackLoading && (
                  <div className="rounded-2xl px-4 py-5 flex items-center gap-3 animate-fade-in-up"
                    style={{ background: '#F5F3FF', border: '1.5px solid #EDE9FE' }}>
                    <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                      style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} />
                    <div>
                      <p className="text-sm font-black" style={{ color: '#5B21B6' }}>Analysing your working…</p>
                      <p className="text-xs mt-0.5" style={{ color: '#8B5CF6' }}>This takes about 5 seconds</p>
                    </div>
                  </div>
                )}

                {/* Inline worked solution — always visible for open questions too */}
                <InlineSteps steps={question.step_by_step} />

                {/* Inline ask — Pro only; Basic users see an upgrade nudge */}
                {hasProAI ? (
                  <InlineAsk onAsk={handleInlineAsk} />
                ) : (
                  <a href="/math-nsw/app/account/upgrade?reason=limit"
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#F5F3FF,#FDF2F8)', border: '1.5px solid #EDE9FE' }}>
                    <span className="text-xl">🔒</span>
                    <div>
                      <p className="text-xs font-black" style={{ color: '#7C3AED' }}>Full AI Tutor — Pro feature</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: '#A78BFA' }}>
                        Ask follow-up questions, get step-by-step help. Upgrade to Pro →
                      </p>
                    </div>
                  </a>
                )}
              </>
            )}

            {/* Navigation */}
            {result && !result.isCorrect ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Strip band suffix (e.g. "MA-TRIG-01-B3" → "MA-TRIG-01")
                    // so getNextQuestion builds correct outcomeIds like "MA-TRIG-01-B1..B6"
                    retryTopicRef.current = (question?.outcome_id ?? '').replace(/-B\d+$/, '') || null
                    void loadNext()
                  }}
                  className="w-full py-3 rounded-2xl text-sm font-black text-white min-h-[48px] transition-all active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg,#EF4444,#F97316)' }}>
                  🔁 Try a similar question
                </button>
                <button
                  onClick={() => void loadNext()}
                  className="w-full py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Skip to next topic →
                </button>
              </div>
            ) : (
              <button onClick={() => void loadNext()}
                className="btn-gradient w-full py-3 rounded-2xl text-sm font-black min-h-[48px]">
                Next Question →
              </button>
            )}
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
            {/* Header — extra top padding on mobile for iPhone notch / Dynamic Island */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', paddingTop: 'max(16px, calc(env(safe-area-inset-top, 0px) + 12px))' }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍🏫</span>
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

        {/* Floating chat button (desktop only) */}
        {hasProAI && !showChatPanel && (
          <button onClick={() => setShowChatPanel(true)}
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-black shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
            👩‍🏫 Neumm Helper
            {chatMessages.length > 0 && (
              <span className="bg-white text-violet-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
                {chatMessages.length}
              </span>
            )}
          </button>
        )}
        {!hasProAI && !showChatPanel && (
          <a href="/math-nsw/app/account/upgrade?reason=limit"
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black shadow-md hover:scale-105 transition-transform"
            style={{ background: '#F3F4F6', color: '#9CA3AF', border: '1.5px solid #E5E7EB' }}>
            🔒 Neumm Tutor — Pro
          </a>
        )}
      </div>

      <StreakToast streak={toastStreak} visible={streakToastVisible} />
      <XPToast delta={xpToastDelta} visible={xpToastVisible} />

      {/* Stage / Level completion celebration */}
      {showStageComplete && completionData && (
        <StageCompleteModal
          data={completionData}
          onContinue={() => {
            setShowStageComplete(false)
            void loadNext()
          }}
          onViewMission={() => {
            setShowStageComplete(false)
            router.push('/dashboard/mission')
          }}
        />
      )}
    </div>
  )
}
