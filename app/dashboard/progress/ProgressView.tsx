'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TopicStat {
  prefix:   string
  name:     string
  category: string
  avg:      number | null
}

export interface NextMove {
  type:   'quickWin' | 'urgentGap' | 'freshStart'
  prefix: string
  name:   string
  avg:    number | null
}

// ─── Colour helpers ─────────────────────────────────────────────────────────────

function tileScheme(avg: number | null): {
  bg: string; border: string; text: string; dot: string; label: string
} {
  if (avg === null) return { bg: '#F5F5F5', border: '#E8E8E8', text: '#9CA3AF', dot: '#D1D5DB', label: 'Untested' }
  if (avg >= 80)   return { bg: '#F0FDF4', border: '#86EFAC', text: '#065F46', dot: '#22C55E', label: 'Mastered'  }
  if (avg >= 50)   return { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', dot: '#F59E0B', label: 'Shaky'     }
  return              { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', dot: '#EF4444', label: 'Gap'       }
}

// ─── Band metadata ──────────────────────────────────────────────────────────────

const BAND_INFO: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Developing',   color: '#9CA3AF', bg: '#F3F4F6' },
  2: { label: 'Basic',        color: '#F97316', bg: '#FFF7ED' },
  3: { label: 'Sound',        color: '#EAB308', bg: '#FEFCE8' },
  4: { label: 'Strong',       color: '#3B82F6', bg: '#EFF6FF' },
  5: { label: 'Excellent',    color: '#8B5CF6', bg: '#F5F3FF' },
  6: { label: 'Outstanding',  color: '#10B981', bg: '#F0FDF4' },
}

// ─── Animated ring ─────────────────────────────────────────────────────────────

function AnimatedRing({ pct }: { pct: number }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setDisplayed(pct), 150)
    return () => clearTimeout(id)
  }, [pct])

  const size   = 120
  const stroke = 10
  const r      = (size - stroke) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ

  const color =
    pct >= 80 ? '#22C55E' :
    pct >= 50 ? '#F59E0B' :
    pct >= 25 ? '#3B82F6' : '#EF4444'

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-2xl font-black" style={{ color, fontFamily: "'Nunito',sans-serif" }}>
          {displayed}%
        </span>
        <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>mastery</span>
      </div>
    </div>
  )
}

// ─── Hero section ───────────────────────────────────────────────────────────────

function HeroSection({
  overallMastery, mastered, shaky, gap, untested,
  displayName, yearLabel, predictedBand, targetBand,
}: {
  overallMastery: number
  mastered: number; shaky: number; gap: number; untested: number
  displayName: string; yearLabel: string
  predictedBand: number; targetBand: number
}) {
  const pb = BAND_INFO[predictedBand]
  const tb = BAND_INFO[targetBand]

  const stats = [
    { label: 'Mastered', value: mastered, color: '#22C55E', bg: '#F0FDF4' },
    { label: 'Shaky',    value: shaky,    color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Gap',      value: gap,      color: '#EF4444', bg: '#FEF2F2' },
    { label: 'Untested', value: untested, color: '#9CA3AF', bg: '#F5F5F5' },
  ]

  return (
    <div className="rounded-3xl overflow-hidden mb-6 shadow-sm"
      style={{ background: 'linear-gradient(135deg, #0C2D5A 0%, #185FA5 50%, #2563EB 100%)' }}>
      <div className="px-6 pt-6 pb-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              🗺️ Your HSC Journey
            </p>
            <h2 className="text-xl font-black text-white">
              {displayName}&apos;s Math Map
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {yearLabel} · NSW Advanced Mathematics
            </p>
          </div>
          <AnimatedRing pct={overallMastery} />
        </div>

        {/* Band ladder */}
        <div className="mb-4">
          <p className="text-xs font-bold mb-2.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
            PREDICTED HSC BAND
          </p>
          <div className="flex gap-1.5">
            {[1,2,3,4,5,6].map(b => {
              const isCurrent = b === predictedBand
              const isTarget  = b === targetBand && targetBand !== predictedBand
              const isPast    = b < predictedBand
              return (
                <div key={b} className="flex-1 rounded-xl py-2 px-1 text-center transition-all"
                  style={{
                    background: isCurrent
                      ? BAND_INFO[b].color
                      : isTarget
                        ? 'rgba(255,255,255,0.15)'
                        : isPast
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(255,255,255,0.04)',
                    border: isTarget ? '2px dashed rgba(255,255,255,0.5)' : '2px solid transparent',
                  }}>
                  <p className="text-xs font-black"
                    style={{ color: isCurrent ? 'white' : isTarget ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}>
                    B{b}
                  </p>
                  {isCurrent && (
                    <p className="text-[9px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      YOU
                    </p>
                  )}
                  {isTarget && (
                    <p className="text-[9px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      GOAL
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Band description + arrow */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: pb.bg, color: pb.color }}>
            {pb.label}
          </span>
          <span className="text-white opacity-40 text-sm">→</span>
          <span className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ border: `1.5px dashed ${tb.color}`, color: tb.color, background: 'rgba(255,255,255,0.08)' }}>
            {tb.label} ✦
          </span>
          <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {mastered === 0
              ? 'Start practising to unlock your journey'
              : `${mastered} topic${mastered === 1 ? '' : 's'} mastered so far`}
          </span>
        </div>
      </div>

      {/* Stats row — white strip */}
      <div className="grid grid-cols-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        {stats.map(s => (
          <div key={s.label} className="py-3 text-center border-r last:border-r-0"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Next 3 Moves ───────────────────────────────────────────────────────────────

const MOVE_CONFIG = {
  quickWin: {
    emoji: '⚡',
    headline: 'Quick Win',
    bg: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
    border: '#86EFAC',
    color: '#065F46',
    badge: '#22C55E',
    badgeBg: '#DCFCE7',
    btn: '#22C55E',
    reason: (avg: number | null) =>
      avg !== null ? `You're at ${avg}% — ${80 - avg}% away from mastering this!` : 'You\'re close — push to 80%!',
  },
  urgentGap: {
    emoji: '🎯',
    headline: 'Fix This Gap',
    bg: 'linear-gradient(135deg, #FEF2F2, #FFE4E6)',
    border: '#FCA5A5',
    color: '#991B1B',
    badge: '#EF4444',
    badgeBg: '#FEE2E2',
    btn: '#EF4444',
    reason: (avg: number | null) =>
      avg !== null ? `Only ${avg}% — a few focused sessions will turn this around.` : 'This topic needs attention.',
  },
  freshStart: {
    emoji: '🌟',
    headline: 'Explore Next',
    bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
    border: '#93C5FD',
    color: '#1E40AF',
    badge: '#3B82F6',
    badgeBg: '#DBEAFE',
    btn: '#3B82F6',
    reason: () =>
      'You haven\'t tried this yet — every master starts somewhere.',
  },
}

function NextMovesSection({ moves }: { moves: NextMove[] }) {
  const router = useRouter()
  if (moves.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-black" style={{ color: '#111827', fontFamily: "'Nunito',sans-serif" }}>
          ⚡ Your Next 3 Moves
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
          Personalised for you
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {moves.map((move, i) => {
          const cfg = MOVE_CONFIG[move.type]
          return (
            <div key={move.prefix}
              className="rounded-2xl p-4 border-2 flex flex-col"
              style={{ background: cfg.bg, borderColor: cfg.border }}>

              {/* Badge row */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cfg.emoji}</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: cfg.badgeBg, color: cfg.badge }}>
                  Move {i + 1}
                </span>
              </div>

              {/* Topic name */}
              <p className="text-sm font-black leading-snug mb-1" style={{ color: cfg.color }}>
                {move.name}
              </p>
              <p className="text-xs font-bold mb-1" style={{ color: cfg.color, opacity: 0.7 }}>
                {cfg.headline}
              </p>

              {/* Confidence bar */}
              {move.avg !== null && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"
                    style={{ color: cfg.color, opacity: 0.7 }}>
                    <span>{move.avg}%</span>
                    <span>80% Mastered</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${move.avg}%`, background: cfg.badge }} />
                  </div>
                </div>
              )}

              {/* Reason text */}
              <p className="text-xs leading-relaxed mb-4 flex-1"
                style={{ color: cfg.color, opacity: 0.75 }}>
                {cfg.reason(move.avg)}
              </p>

              {/* CTA */}
              <button
                onClick={() => router.push('/practice?topic=' + encodeURIComponent(move.prefix))}
                className="w-full py-2 rounded-xl text-sm font-black text-white transition-all active:scale-[0.97]"
                style={{ background: cfg.btn }}>
                Practice now →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Topic tile ─────────────────────────────────────────────────────────────────

function TopicTile({ topic, onClick }: { topic: TopicStat; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const s = tileScheme(topic.avg)

  // "X% to next tier" hint
  let hint = ''
  if (topic.avg !== null) {
    if (topic.avg >= 50 && topic.avg < 80) hint = `${80 - topic.avg}% to Mastered`
    else if (topic.avg > 0 && topic.avg < 50) hint = `${50 - topic.avg}% to Shaky`
  }

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
      {/* Confidence bar at top */}
      {topic.avg !== null && (
        <div className="h-1 rounded-full mb-2" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <div className="h-1 rounded-full" style={{ width: `${topic.avg}%`, background: s.dot }} />
        </div>
      )}
      {topic.avg === null && (
        <div className="h-1 rounded-full mb-2" style={{ background: s.border }} />
      )}

      <div className="flex items-center justify-between mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.dot }} />
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
        {hovered && hint && (
          <span className="text-[10px] font-bold" style={{ color: s.dot }}>{hint}</span>
        )}
        {hovered && !hint && topic.avg === null && (
          <span className="text-[10px] font-bold" style={{ color: '#3B82F6' }}>Start →</span>
        )}
      </div>
    </button>
  )
}

// ─── Category section ────────────────────────────────────────────────────────────

function CategorySection({
  name, topics, onTopicClick,
}: {
  name: string
  topics: TopicStat[]
  onTopicClick: (prefix: string) => void
}) {
  const tested    = topics.filter(t => t.avg !== null)
  const catMaster = topics.filter(t => (t.avg ?? 0) >= 80).length
  const catAvg    = tested.length > 0
    ? Math.round(tested.reduce((s, t) => s + (t.avg ?? 0), 0) / tested.length)
    : null
  const pctMastered = Math.round((catMaster / topics.length) * 100)

  const dotColor =
    catAvg === null ? '#D1D5DB' :
    catAvg >= 80    ? '#22C55E' :
    catAvg >= 50    ? '#F59E0B' : '#EF4444'

  return (
    <div className="mb-8">
      {/* Category header with mini progress bar */}
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h3 className="text-sm font-black" style={{ color: '#374151', fontFamily: "'Nunito',sans-serif" }}>
            {name}
          </h3>
          <p className="text-xs font-semibold mt-0.5" style={{ color: '#9CA3AF' }}>
            {catMaster}/{topics.length} mastered
          </p>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-semibold mb-1"
            style={{ color: '#9CA3AF' }}>
            <span>{catAvg !== null ? `${catAvg}% avg` : 'Not started'}</span>
            <span>{pctMastered}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: '#F3F4F6' }}>
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${pctMastered}%`, background: dotColor }} />
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
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-7 px-4 py-3 rounded-2xl"
      style={{ background: 'white', border: '1.5px solid #F3F4F6' }}>
      {[
        { dot: '#22C55E', label: 'Mastered ≥80%' },
        { dot: '#F59E0B', label: 'Shaky 50–79%' },
        { dot: '#EF4444', label: 'Gap <50%' },
        { dot: '#D1D5DB', label: 'Untested' },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.dot }} />
          <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>{item.label}</span>
        </div>
      ))}
      <span className="text-xs font-bold ml-auto" style={{ color: '#3B82F6' }}>
        ⚡ Tap any topic to practice
      </span>
    </div>
  )
}

// ─── Main ProgressView ───────────────────────────────────────────────────────────

export default function ProgressView({
  topics, overallMastery, mastered, shaky, gap, untested,
  displayName, yearLabel, predictedBand, targetBand, nextMoves,
}: {
  topics:         TopicStat[]
  overallMastery: number
  mastered:       number
  shaky:          number
  gap:            number
  untested:       number
  displayName:    string
  yearLabel:      string
  predictedBand:  number
  targetBand:     number
  nextMoves:      NextMove[]
}) {
  const router = useRouter()

  const categories: Record<string, TopicStat[]> = {}
  for (const t of topics) {
    if (!categories[t.category]) categories[t.category] = []
    categories[t.category].push(t)
  }

  function handleTopicClick(prefix: string) {
    router.push('/practice?topic=' + encodeURIComponent(prefix))
  }

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif" }}>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#111827' }}>Progress</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          Your hyper-personalised mastery map — where you are, where to go, how to get there.
        </p>
      </div>

      {/* 1 ── Hero band journey */}
      <HeroSection
        overallMastery={overallMastery}
        mastered={mastered} shaky={shaky} gap={gap} untested={untested}
        displayName={displayName}
        yearLabel={yearLabel}
        predictedBand={predictedBand}
        targetBand={targetBand}
      />

      {/* 2 ── Next 3 Moves */}
      <NextMovesSection moves={nextMoves} />

      {/* 3 ── Legend */}
      <Legend />

      {/* 4 ── Full mastery map by category */}
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
