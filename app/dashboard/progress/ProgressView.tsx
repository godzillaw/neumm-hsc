'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TopicStat {
  prefix:   string
  name:     string
  category: string
  avg:      number | null   // null = untested
}

// ─── Colour helpers ─────────────────────────────────────────────────────────────

function tileScheme(avg: number | null): {
  bg: string; border: string; text: string; dot: string; label: string
} {
  if (avg === null) return { bg: '#F5F5F0', border: '#E8E8DF', text: '#9CA3AF', dot: '#D1D5DB', label: 'Untested' }
  if (avg >= 80)   return { bg: '#F0FDF4', border: '#6EE7B7', text: '#065F46', dot: '#10B981', label: 'Mastered'  }
  if (avg >= 50)   return { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', dot: '#F59E0B', label: 'Shaky'     }
  return              { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', dot: '#EF4444', label: 'Gap'       }
}

function overallColor(pct: number) {
  if (pct >= 80) return '#FFDA00'
  if (pct >= 50) return '#FF6B35'
  return '#EF4444'
}

// ─── Circular progress indicator ───────────────────────────────────────────────

function CircularProgress({ pct }: { pct: number }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setDisplayed(pct), 120)
    return () => clearTimeout(id)
  }, [pct])

  const size         = 168
  const stroke       = 13
  const r            = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset       = circumference - (displayed / 100) * circumference
  const color        = overallColor(pct)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Track + arc */}
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}
      >
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,218,0,0.2)" strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>

      {/* Inner text */}
      <div className="flex flex-col items-center justify-center z-10">
        <span className="text-3xl font-extrabold" style={{ color, fontFamily: "'Nunito', sans-serif" }}>{displayed}%</span>
        <span className="text-xs font-medium mt-0.5" style={{ color: '#666672' }}>overall</span>
      </div>
    </div>
  )
}

// ─── Topic tile ─────────────────────────────────────────────────────────────────

function TopicTile({ topic, onClick }: { topic: TopicStat; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const scheme = tileScheme(topic.avg)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-3 border transition-all text-left w-full"
      style={{
        backgroundColor: scheme.bg,
        borderColor: hovered ? '#FFDA00' : scheme.border,
        cursor: 'pointer',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 4px 12px rgba(255,218,0,0.2)' : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: scheme.dot }} />
        <span className="text-xs font-bold" style={{ color: scheme.dot }}>
          {topic.avg !== null ? `${topic.avg}%` : '—'}
        </span>
      </div>
      <p className="text-xs font-semibold leading-snug" style={{ color: scheme.text, fontFamily: "'Nunito', sans-serif" }}>
        {topic.name}
      </p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs font-medium" style={{ color: scheme.dot }}>
          {scheme.label}
        </p>
        {hovered && (
          <span className="text-xs font-bold" style={{ color: '#FF6B35' }}>
            Practice →
          </span>
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
  const tested = topics.filter(t => t.avg !== null)
  const catAvg = tested.length > 0
    ? Math.round(tested.reduce((s, t) => s + (t.avg ?? 0), 0) / tested.length)
    : null
  const catScheme = tileScheme(catAvg)

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3
          className="text-sm font-black"
          style={{ color: '#666672', fontFamily: "'Nunito', sans-serif" }}
        >
          {name}
        </h3>
        {catAvg !== null && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: catScheme.bg, color: catScheme.dot }}
          >
            {catAvg}%
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
        {topics.map(t => (
          <TopicTile
            key={t.prefix}
            topic={t}
            onClick={() => onTopicClick(t.prefix)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Legend ─────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {[
        { dot: '#10B981', label: 'Mastered ≥80%' },
        { dot: '#F59E0B', label: 'Shaky 50–79%' },
        { dot: '#EF4444', label: 'Gap <50%' },
        { dot: '#D1D5DB', label: 'Untested' },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.dot }} />
          <span className="text-xs" style={{ color: '#666672' }}>{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs" style={{ color: '#FF6B35', fontFamily: "'Nunito', sans-serif" }}>
          ⚡ Tap any topic to practice
        </span>
      </div>
    </div>
  )
}

// ─── Summary stats row ────────────────────────────────────────────────────────

function SummaryStats({
  mastered, shaky, gap, untested,
}: {
  mastered: number; shaky: number; gap: number; untested: number
}) {
  const stats = [
    { label: 'Mastered', value: mastered, color: '#10B981' },
    { label: 'Shaky',    value: shaky,    color: '#F59E0B' },
    { label: 'Gap',      value: gap,      color: '#EF4444' },
    { label: 'Untested', value: untested, color: '#9CA3AF' },
  ]
  return (
    <div className="flex gap-3 mt-4">
      {stats.map(s => (
        <div key={s.label} className="flex-1 text-center">
          <p
            className="text-xl font-bold"
            style={{ color: s.color, fontFamily: "'Nunito', sans-serif" }}
          >
            {s.value}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#666672' }}>{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function ProgressView({
  topics,
  overallMastery,
  mastered, shaky, gap, untested,
}: {
  topics:        TopicStat[]
  overallMastery: number
  mastered:       number
  shaky:          number
  gap:            number
  untested:       number
}) {
  const router = useRouter()

  // Group by category
  const categories: Record<string, TopicStat[]> = {}
  for (const t of topics) {
    if (!categories[t.category]) categories[t.category] = []
    categories[t.category].push(t)
  }

  function handleTopicClick(prefix: string) {
    router.push('/practice?topic=' + encodeURIComponent(prefix))
  }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* ── Hero: circular indicator + stats ── */}
      <div
        className="rounded-2xl shadow-sm p-5 mb-6"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #F0E980',
        }}
      >
        {/* Stack vertically on mobile (168px circle would crush the stat row at 390px) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="shrink-0">
            <CircularProgress pct={overallMastery} />
          </div>
          <div className="flex-1 w-full">
            <h2
              className="text-base font-bold text-center sm:text-left"
              style={{ color: '#0F0F14', fontFamily: "'Nunito', sans-serif" }}
            >
              Overall Mastery
            </h2>
            <p
              className="text-sm mt-0.5 text-center sm:text-left"
              style={{ color: '#666672' }}
            >
              Across all {topics.length} tracked topics
            </p>
            <SummaryStats mastered={mastered} shaky={shaky} gap={gap} untested={untested} />
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <Legend />

      {/* ── Category sections ── */}
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
