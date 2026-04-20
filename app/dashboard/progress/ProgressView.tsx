'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter }                         from 'next/navigation'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TopicStat {
  prefix:   string
  name:     string
  category: string
  avg:      number | null
  overdue:  boolean          // spaced-repetition review is past due
}

export type NextMoveType =
  | 'quickWin'
  | 'urgentGap'
  | 'dueForReview'
  | 'freshStart'
  | 'highImpact'
  | 'buildingMomentum'

export interface NextMove {
  type:   NextMoveType
  prefix: string
  name:   string
  avg:    number | null
}

// ─── Colour helpers ─────────────────────────────────────────────────────────────

function tileScheme(avg: number | null, overdue: boolean): {
  bg: string; border: string; text: string; dot: string; label: string; fadeBadge?: boolean
} {
  if (avg === null)  return { bg: '#F5F5F5', border: '#E5E7EB', text: '#9CA3AF', dot: '#D1D5DB', label: 'Untested' }
  if (overdue && avg >= 50) return {
    bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', dot: '#F59E0B', label: 'Fading', fadeBadge: true
  }
  if (avg >= 80)     return { bg: '#F0FDF4', border: '#86EFAC', text: '#065F46', dot: '#22C55E', label: 'Mastered'  }
  if (avg >= 50)     return { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', dot: '#F59E0B', label: 'Shaky'     }
  return               { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', dot: '#EF4444', label: 'Gap'       }
}

// ─── Band metadata ──────────────────────────────────────────────────────────────

const BAND_INFO: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Developing',  color: '#9CA3AF', bg: '#F3F4F6' },
  2: { label: 'Basic',       color: '#F97316', bg: '#FFF7ED' },
  3: { label: 'Sound',       color: '#EAB308', bg: '#FEFCE8' },
  4: { label: 'Strong',      color: '#3B82F6', bg: '#EFF6FF' },
  5: { label: 'Excellent',   color: '#8B5CF6', bg: '#F5F3FF' },
  6: { label: 'Outstanding', color: '#10B981', bg: '#F0FDF4' },
}

// ─── Animated mastery ring ─────────────────────────────────────────────────────

function AnimatedRing({ pct }: { pct: number }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setDisplayed(pct), 200)
    return () => clearTimeout(id)
  }, [pct])

  const size  = 110
  const stroke = 9
  const r     = (size - stroke) / 2
  const circ  = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ
  const color  = pct >= 70 ? '#22C55E' : pct >= 45 ? '#F59E0B' : pct >= 20 ? '#3B82F6' : '#EF4444'

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-xl font-black" style={{ color, fontFamily: "'Nunito',sans-serif" }}>{displayed}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
          weighted
        </span>
      </div>
    </div>
  )
}

// ─── Hero section ───────────────────────────────────────────────────────────────

function HeroSection({
  weightedMastery, mastered, shaky, gap, untested,
  displayName, yearLabel, predictedBand, targetBand,
  bandConfidence, coveragePct, testedCount,
  currentStreak, longestStreak,
}: {
  weightedMastery: number; mastered: number; shaky: number; gap: number; untested: number
  displayName: string; yearLabel: string
  predictedBand: number; targetBand: number
  bandConfidence: 'low' | 'medium' | 'high'
  coveragePct: number; testedCount: number
  currentStreak: number; longestStreak: number
}) {
  const pb = BAND_INFO[predictedBand]
  const tb = BAND_INFO[targetBand]

  const confidenceLabel = {
    low:    { text: 'Early prediction — test more topics to sharpen accuracy', color: '#F97316' },
    medium: { text: 'Getting accurate — keep practising to confirm', color: '#F59E0B' },
    high:   { text: 'High confidence — based on strong topic coverage', color: '#22C55E' },
  }[bandConfidence]

  const stats = [
    { label: 'Mastered', value: mastered, color: '#22C55E' },
    { label: 'Shaky',    value: shaky,    color: '#F59E0B' },
    { label: 'Gap',      value: gap,      color: '#EF4444' },
    { label: 'Untested', value: untested, color: '#6B7280' },
  ]

  return (
    <div className="rounded-3xl overflow-hidden mb-6 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #0C2D5A 0%, #185FA5 55%, #2563EB 100%)' }}>

      {/* Main content */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          {/* Left: identity + streak */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: 'rgba(255,255,255,0.45)' }}>🗺️ HSC Journey</p>
            <h2 className="text-xl font-black text-white leading-tight truncate">
              {displayName}&apos;s Map
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {yearLabel} · NSW Advanced Mathematics
            </p>

            {/* Streak pills */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: currentStreak > 0 ? 'rgba(255,107,53,0.85)' : 'rgba(255,255,255,0.1)' }}>
                <span className="text-sm">🔥</span>
                <span className="text-xs font-black text-white">{currentStreak} day streak</span>
              </div>
              {longestStreak > currentStreak && (
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Best: {longestStreak}
                </span>
              )}
              {currentStreak === longestStreak && currentStreak > 0 && (
                <span className="text-xs font-bold" style={{ color: '#FBBF24' }}>
                  🏆 Personal best!
                </span>
              )}
            </div>
          </div>

          {/* Right: animated ring */}
          <AnimatedRing pct={weightedMastery} />
        </div>

        {/* Band ladder */}
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            Predicted HSC Band · {testedCount} topics tested
          </p>
          <div className="flex gap-1.5">
            {[1,2,3,4,5,6].map(b => {
              const isCurrent = b === predictedBand
              const isTarget  = b === targetBand && targetBand !== predictedBand
              const isPast    = b < predictedBand
              return (
                <div key={b} className="flex-1 rounded-xl py-2 px-1 text-center"
                  style={{
                    background: isCurrent
                      ? BAND_INFO[b].color
                      : isTarget
                        ? 'rgba(255,255,255,0.12)'
                        : isPast
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(255,255,255,0.03)',
                    border: isTarget
                      ? '1.5px dashed rgba(255,255,255,0.45)'
                      : '1.5px solid transparent',
                    transition: 'all 0.3s',
                  }}>
                  <p className="text-xs font-black"
                    style={{ color: isCurrent ? 'white' : isTarget ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }}>
                    B{b}
                  </p>
                  {isCurrent && <p className="text-[9px] font-bold mt-0.5 text-white opacity-90">YOU</p>}
                  {isTarget  && <p className="text-[9px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>GOAL</p>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Band labels + confidence */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: pb.bg, color: pb.color }}>
            {pb.label}
          </span>
          <span className="text-white opacity-30 text-sm">→</span>
          <span className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ border: `1.5px dashed ${tb.color}`, color: tb.color, background: 'rgba(255,255,255,0.07)' }}>
            {tb.label} ✦
          </span>
        </div>
        <p className="text-[11px] font-semibold mt-1.5"
          style={{ color: confidenceLabel.color, opacity: 0.9 }}>
          {coveragePct < 100 && `📊 ${coveragePct}% of topics tested · `}{confidenceLabel.text}
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.18)' }}>
        {stats.map(s => (
          <div key={s.label} className="py-3 text-center border-r last:border-r-0"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Daily Goal Widget ──────────────────────────────────────────────────────────

function DailyGoalWidget({
  todayCount, dailyGoal, currentStreak,
}: {
  todayCount: number; dailyGoal: number; currentStreak: number
}) {
  const pct     = Math.min(Math.round((todayCount / dailyGoal) * 100), 100)
  const done    = todayCount >= dailyGoal
  const left    = Math.max(dailyGoal - todayCount, 0)

  return (
    <div className="rounded-2xl p-4 mb-6 border-2"
      style={{
        background: done
          ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
          : 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
        borderColor: done ? '#86EFAC' : '#93C5FD',
      }}>
      <div className="flex items-center gap-4">
        {/* Icon + text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{done ? '🎉' : '🎯'}</span>
            <p className="text-sm font-black" style={{ color: done ? '#065F46' : '#1E40AF' }}>
              {done ? 'Daily goal complete!' : 'Daily goal'}
            </p>
            {currentStreak > 0 && !done && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,107,53,0.12)', color: '#C2410C' }}>
                🔥 Keep your {currentStreak}-day streak!
              </span>
            )}
          </div>
          <p className="text-xs font-semibold mb-2"
            style={{ color: done ? '#065F46' : '#1E40AF', opacity: 0.7 }}>
            {done
              ? `${todayCount} questions answered — outstanding! Come back tomorrow.`
              : `${todayCount}/${dailyGoal} questions · ${left} more to hit today's goal`}
          </p>
          {/* Progress bar */}
          <div className="h-2.5 rounded-full" style={{ background: done ? '#BBF7D0' : '#BFDBFE' }}>
            <div className="h-2.5 rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: done
                  ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                  : 'linear-gradient(90deg, #3B82F6, #2563EB)',
              }} />
          </div>
        </div>
        {/* Big count */}
        <div className="text-center shrink-0">
          <p className="text-3xl font-black" style={{ color: done ? '#16A34A' : '#2563EB' }}>
            {todayCount}
          </p>
          <p className="text-[10px] font-bold" style={{ color: done ? '#166534' : '#1D4ED8', opacity: 0.6 }}>
            / {dailyGoal}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Next Moves config ─────────────────────────────────────────────────────────

const MOVE_CFG: Record<NextMoveType, {
  emoji: string
  headline: string
  bg: string
  border: string
  textColor: string
  dot: string
  dotBg: string
  btnColor: string
  reason: (avg: number | null) => string
}> = {
  quickWin: {
    emoji: '⚡', headline: 'Quick Win',
    bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border: '#86EFAC',
    textColor: '#065F46', dot: '#22C55E', dotBg: '#DCFCE7', btnColor: '#16A34A',
    reason: (avg) => avg !== null
      ? `You're at ${avg}% — just ${80 - avg}% away from mastering this!`
      : 'Close to mastered — one good session over the line.',
  },
  urgentGap: {
    emoji: '🎯', headline: 'Fix This Gap',
    bg: 'linear-gradient(135deg,#FEF2F2,#FFE4E6)', border: '#FCA5A5',
    textColor: '#991B1B', dot: '#EF4444', dotBg: '#FEE2E2', btnColor: '#DC2626',
    reason: (avg) => avg !== null
      ? `Only ${avg}% — a few focused sessions will turn this around fast.`
      : 'This topic needs your attention right now.',
  },
  dueForReview: {
    emoji: '🔄', headline: 'Review Due',
    bg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', border: '#C4B5FD',
    textColor: '#4C1D95', dot: '#8B5CF6', dotBg: '#EDE9FE', btnColor: '#7C3AED',
    reason: (avg) => avg !== null
      ? `You scored ${avg}% here — review it now before it fades from memory.`
      : "You've done this topic — time for a memory refresh.",
  },
  freshStart: {
    emoji: '🌟', headline: 'Explore Next',
    bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '#93C5FD',
    textColor: '#1E40AF', dot: '#3B82F6', dotBg: '#DBEAFE', btnColor: '#2563EB',
    reason: () => "You haven't tried this yet — every master starts somewhere.",
  },
  highImpact: {
    emoji: '💎', headline: 'High Impact',
    bg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '#FCD34D',
    textColor: '#78350F', dot: '#F59E0B', dotBg: '#FEF3C7', btnColor: '#D97706',
    reason: (avg) => avg !== null
      ? `This topic carries heavy HSC exam weight — ${avg}% isn't enough yet.`
      : 'Top exam priority — mastering this lifts your band significantly.',
  },
  buildingMomentum: {
    emoji: '🔥', headline: 'Keep Going',
    bg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', border: '#FDBA74',
    textColor: '#7C2D12', dot: '#F97316', dotBg: '#FFEDD5', btnColor: '#EA580C',
    reason: (avg) => avg !== null
      ? `You're at ${avg}% and building — don't stop now, you're in the zone!`
      : 'You started this one — keep the momentum going.',
  },
}

// ─── Next Moves section ─────────────────────────────────────────────────────────

function NextMovesSection({ moves }: { moves: NextMove[] }) {
  const [expanded, setExpanded] = useState(false)
  const router   = useRouter()
  const visible  = expanded ? moves : moves.slice(0, 3)
  const hidden   = moves.length - 3

  if (moves.length === 0) return null

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black" style={{ color: '#111827', fontFamily: "'Nunito',sans-serif" }}>
            ⚡ Your Next {moves.length} Moves
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
            Smart · Dynamic
          </span>
        </div>
        {moves.length > 3 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs font-black px-3 py-1.5 rounded-full transition-all"
            style={{ background: expanded ? '#F3F4F6' : '#EFF6FF', color: expanded ? '#374151' : '#1D4ED8' }}>
            {expanded ? '↑ Show less' : `↓ Show ${hidden} more`}
          </button>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {visible.map((move, i) => {
          const cfg = MOVE_CFG[move.type]
          return (
            <div key={move.prefix}
              className="rounded-2xl p-4 border-2 flex flex-col"
              style={{ background: cfg.bg, borderColor: cfg.border }}>
              {/* Badge row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{cfg.emoji}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: cfg.dotBg, color: cfg.dot }}>
                    Move {i + 1}
                  </span>
                </div>
                <span className="text-xs font-black" style={{ color: cfg.dot }}>
                  {move.avg !== null ? `${move.avg}%` : 'New'}
                </span>
              </div>

              {/* Topic name */}
              <p className="text-sm font-black leading-tight mb-0.5" style={{ color: cfg.textColor }}>
                {move.name}
              </p>
              <p className="text-[11px] font-bold mb-2" style={{ color: cfg.dot }}>{cfg.headline}</p>

              {/* Confidence bar */}
              {move.avg !== null && (
                <div className="mb-3">
                  <div className="h-1.5 rounded-full mb-1" style={{ background: 'rgba(0,0,0,0.07)' }}>
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${move.avg}%`, background: cfg.dot }} />
                  </div>
                  {(move.avg >= 50 && move.avg < 80) && (
                    <p className="text-[10px] font-bold text-right" style={{ color: cfg.dot }}>
                      {80 - move.avg}% to Mastered
                    </p>
                  )}
                </div>
              )}

              {/* Reason */}
              <p className="text-[11px] leading-relaxed flex-1 mb-3"
                style={{ color: cfg.textColor, opacity: 0.75 }}>
                {cfg.reason(move.avg)}
              </p>

              {/* CTA */}
              <button
                onClick={() => router.push('/practice?topic=' + encodeURIComponent(move.prefix))}
                className="w-full py-2 rounded-xl text-sm font-black text-white transition-all active:scale-[0.97]"
                style={{ background: cfg.btnColor }}>
                Practice now →
              </button>
            </div>
          )
        })}
      </div>

      {/* Expand hint */}
      {!expanded && moves.length > 3 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-3 py-2.5 rounded-2xl text-sm font-bold transition-all"
          style={{ background: '#F9FAFB', color: '#6B7280', border: '1.5px dashed #E5E7EB' }}>
          + {hidden} more personalised move{hidden === 1 ? '' : 's'} waiting
        </button>
      )}
    </div>
  )
}

// ─── Milestone achievements ─────────────────────────────────────────────────────

function MilestonesWidget({
  mastered, shaky, currentStreak, testedCount,
}: {
  mastered: number; shaky: number; currentStreak: number; testedCount: number
}) {
  const milestones = [
    { done: testedCount > 0,   emoji: '🎯', label: 'First topic tested'        },
    { done: mastered >= 1,     emoji: '⭐', label: 'First topic mastered'       },
    { done: mastered >= 5,     emoji: '🏅', label: '5 topics mastered'          },
    { done: mastered >= 10,    emoji: '🥇', label: '10 topics mastered'         },
    { done: currentStreak >= 3,emoji: '🔥', label: '3-day practice streak'      },
    { done: currentStreak >= 7,emoji: '🚀', label: '7-day practice streak'      },
    { done: shaky + mastered >= 20, emoji: '💪', label: '20 topics attempted'   },
    { done: mastered >= 20,    emoji: '💎', label: '20 topics mastered'         },
  ]

  const done  = milestones.filter(m => m.done).length
  const total = milestones.length

  return (
    <div className="rounded-2xl border p-4 mb-8"
      style={{ background: 'white', borderColor: '#F3F4F6' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black" style={{ color: '#111827' }}>🏆 Achievements</h3>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#F0FDF4', color: '#16A34A' }}>
          {done}/{total} unlocked
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {milestones.map((m, i) => (
          <div key={i}
            className="flex items-center gap-2 p-2 rounded-xl"
            style={{
              background: m.done ? '#F0FDF4' : '#F9FAFB',
              border: `1.5px solid ${m.done ? '#86EFAC' : '#F3F4F6'}`,
              opacity: m.done ? 1 : 0.45,
            }}>
            <span className="text-base shrink-0">{m.emoji}</span>
            <span className="text-[11px] font-bold leading-tight"
              style={{ color: m.done ? '#065F46' : '#6B7280' }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Topic tile ─────────────────────────────────────────────────────────────────

function TopicTile({ topic, onClick }: { topic: TopicStat; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const s = tileScheme(topic.avg, topic.overdue)

  const toNextTier =
    topic.avg !== null && topic.avg >= 50 && topic.avg < 80 ? `${80 - topic.avg}% to Mastered` :
    topic.avg !== null && topic.avg > 0 && topic.avg < 50   ? `${50 - topic.avg}% to Shaky`    : ''

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-3 border-2 transition-all text-left w-full"
      style={{
        backgroundColor: s.bg,
        borderColor: hovered ? s.dot : s.border,
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 6px 16px ${s.dot}33` : 'none',
        transition: 'all 0.15s ease',
      }}>
      {/* Mini confidence bar */}
      <div className="h-1 rounded-full mb-2" style={{ background: 'rgba(0,0,0,0.06)' }}>
        {topic.avg !== null && (
          <div className="h-1 rounded-full" style={{ width: `${topic.avg}%`, background: s.dot }} />
        )}
      </div>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.dot }} />
          {topic.overdue && topic.avg !== null && (
            <span className="text-[9px] font-black px-1 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>
              REVIEW
            </span>
          )}
        </div>
        <span className="text-xs font-black" style={{ color: s.dot }}>
          {topic.avg !== null ? `${topic.avg}%` : '—'}
        </span>
      </div>

      <p className="text-xs font-bold leading-snug mb-1.5"
        style={{ color: s.text, fontFamily: "'Nunito',sans-serif" }}>
        {topic.name}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold" style={{ color: s.dot }}>{s.label}</p>
        {hovered && toNextTier && (
          <span className="text-[10px] font-black" style={{ color: s.dot }}>{toNextTier}</span>
        )}
        {hovered && !toNextTier && topic.avg === null && (
          <span className="text-[10px] font-black" style={{ color: '#3B82F6' }}>Start →</span>
        )}
      </div>
    </button>
  )
}

// ─── Category section ────────────────────────────────────────────────────────────

function CategorySection({
  name, topics, onTopicClick,
}: {
  name: string; topics: TopicStat[]; onTopicClick: (prefix: string) => void
}) {
  const tested      = topics.filter(t => t.avg !== null)
  const catMastered = topics.filter(t => (t.avg ?? 0) >= 80).length
  const catAvg      = tested.length > 0
    ? Math.round(tested.reduce((s, t) => s + (t.avg ?? 0), 0) / tested.length)
    : null
  const overdueCount = topics.filter(t => t.overdue).length
  const pctMastered  = Math.round((catMastered / topics.length) * 100)

  const barColor =
    catAvg === null ? '#D1D5DB' :
    catAvg >= 80    ? '#22C55E' :
    catAvg >= 50    ? '#F59E0B' : '#EF4444'

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black truncate" style={{ color: '#374151', fontFamily: "'Nunito',sans-serif" }}>
              {name}
            </h3>
            {overdueCount > 0 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: '#FEF3C7', color: '#92400E' }}>
                {overdueCount} due
              </span>
            )}
          </div>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#9CA3AF' }}>
            {catMastered}/{topics.length} mastered
          </p>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>
            <span>{catAvg !== null ? `${catAvg}% avg` : 'Not started'}</span>
            <span>{pctMastered}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#F3F4F6' }}>
            <div className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${pctMastered}%`, background: barColor }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
        {topics.map(t => (
          <TopicTile key={t.prefix} topic={t} onClick={() => onTopicClick(t.prefix)} />
        ))}
      </div>
    </div>
  )
}

// ─── Legend ─────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-7 px-4 py-3 rounded-2xl"
      style={{ background: 'white', border: '1.5px solid #F3F4F6' }}>
      {[
        { dot: '#22C55E', label: 'Mastered ≥80%' },
        { dot: '#F59E0B', label: 'Shaky 50–79%' },
        { dot: '#EF4444', label: 'Gap <50%'      },
        { dot: '#D1D5DB', label: 'Untested'       },
        { dot: '#F59E0B', label: 'Fading (review due)', outline: true },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: item.dot,
              border: item.outline ? '1.5px dashed #92400E' : 'none',
            }} />
          <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>{item.label}</span>
        </div>
      ))}
      <span className="text-xs font-bold ml-auto" style={{ color: '#3B82F6' }}>
        ⚡ Tap any topic to practice
      </span>
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────────

export default function ProgressView({
  topics, mastered, shaky, gap, untested,
  displayName, yearLabel, predictedBand, targetBand,
  bandConfidence, coveragePct, testedCount, weightedMastery,
  currentStreak, longestStreak, todayCount, dailyGoal,
  nextMoves,
}: {
  topics:          TopicStat[]
  mastered:        number
  shaky:           number
  gap:             number
  untested:        number
  displayName:     string
  yearLabel:       string
  predictedBand:   number
  targetBand:      number
  bandConfidence:  'low' | 'medium' | 'high'
  coveragePct:     number
  testedCount:     number
  weightedMastery: number
  currentStreak:   number
  longestStreak:   number
  todayCount:      number
  dailyGoal:       number
  nextMoves:       NextMove[]
}) {
  const router = useRouter()

  const categories: Record<string, TopicStat[]> = {}
  for (const t of topics) {
    if (!categories[t.category]) categories[t.category] = []
    categories[t.category].push(t)
  }

  const handleTopicClick = useCallback(
    (prefix: string) => { router.push('/practice?topic=' + encodeURIComponent(prefix)) },
    [router],
  )

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif" }}>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#111827' }}>Progress</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          Your personalised map — where you are, where to go, how to get there.
        </p>
      </div>

      {/* 1 — Hero: band journey + streak */}
      <HeroSection
        weightedMastery={weightedMastery}
        mastered={mastered} shaky={shaky} gap={gap} untested={untested}
        displayName={displayName} yearLabel={yearLabel}
        predictedBand={predictedBand} targetBand={targetBand}
        bandConfidence={bandConfidence} coveragePct={coveragePct}
        testedCount={testedCount}
        currentStreak={currentStreak} longestStreak={longestStreak}
      />

      {/* 2 — Daily goal */}
      <DailyGoalWidget todayCount={todayCount} dailyGoal={dailyGoal} currentStreak={currentStreak} />

      {/* 3 — Next moves (expandable 3 → 6) */}
      <NextMovesSection moves={nextMoves} />

      {/* 4 — Achievements */}
      <MilestonesWidget
        mastered={mastered} shaky={shaky}
        currentStreak={currentStreak} testedCount={testedCount}
      />

      {/* 5 — Legend */}
      <Legend />

      {/* 6 — Full mastery map */}
      {Object.entries(categories).map(([cat, catTopics]) => (
        <CategorySection
          key={cat}
          name={cat}
          topics={catTopics}
          onTopicClick={handleTopicClick}
        />
      ))}
    </div>
  )
}
