'use client'

import { useEffect, useState } from 'react'
import { useRouter }            from 'next/navigation'
import NeummLogo                from '@/components/NeummLogo'

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface MasteryEntry {
  outcome_id:     string
  status:         string
  confidence_pct: number
  difficulty_band?: number
}

export interface OutcomeTopic {
  prefix:            string
  nesa_outcome_code: string
  name:              string
  category:          string
}

export interface ProfileData {
  course:     string | null
  year_group: string | null
  intent:     string | null
}

interface Props {
  mastery: MasteryEntry[]
  topics:  OutcomeTopic[]
  profile: ProfileData
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function tileColor(conf: number | null): string {
  if (conf === null || conf === 0) return '#D1D5DB'   // grey — untested
  if (conf >= 60)                  return '#10B981'   // green
  if (conf >= 20)                  return '#F59E0B'   // amber
  return '#EF4444'                                     // red
}

function tileLabel(conf: number | null): string {
  if (conf === null || conf === 0) return 'Untested'
  if (conf >= 60) return 'Strong'
  if (conf >= 20) return 'Learning'
  return 'Gap'
}

const COURSE_BADGE_COLOR: Record<string, string> = {
  'Standard':    '#185FA5',
  'Advanced':    '#7C3AED',
  'Extension 1': '#EC4899',
  'Extension 2': '#EF4444',
}

// ─── Circular progress ─────────────────────────────────────────────────────────
function CircularProgress({ pct, size = 130 }: { pct: number; size?: number }) {
  const r           = (size - 16) / 2
  const circ        = 2 * Math.PI * r
  const [offset, setOffset] = useState(circ)

  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(circ * (1 - pct / 100)))
    return () => cancelAnimationFrame(id)
  }, [pct, circ])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E6F1FB" strokeWidth="12" />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke="#185FA5"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color: '#185FA5' }}>{pct}%</span>
        <span className="text-xs font-semibold text-gray-400">mastery</span>
      </div>
    </div>
  )
}

// ─── Legend dot ────────────────────────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function MasteryMapView({ mastery, topics, profile }: Props) {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)

  // 2-second loading animation before revealing results
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // ── Build prefix → avg confidence ──────────────────────────────────────────
  const prefixMap: Record<string, number[]> = {}
  for (const m of mastery) {
    const prefix = m.outcome_id.replace(/-B\d+$/, '')
    if (!prefixMap[prefix]) prefixMap[prefix] = []
    prefixMap[prefix].push(m.confidence_pct)
  }

  const avgFor = (prefix: string): number | null => {
    const vals = prefixMap[prefix]
    if (!vals || vals.length === 0) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }

  // ── Stats ───────────────────────────────────────────────────────────────────
  const testedTopics   = topics.filter(t => prefixMap[t.prefix])
  const strongCount    = testedTopics.filter(t => (avgFor(t.prefix) ?? 0) >= 60).length
  const overallPct     = testedTopics.length === 0 ? 0
    : Math.round(testedTopics.reduce((s, t) => s + (avgFor(t.prefix) ?? 0), 0) / testedTopics.length)

  const biggestGap = testedTopics.length > 0
    ? testedTopics.reduce((worst, t) => {
        const a = avgFor(t.prefix) ?? 100
        const b = avgFor(worst.prefix) ?? 100
        return a < b ? t : worst
      }, testedTopics[0])
    : null

  const course      = profile.course ?? 'Advanced'
  const badgeColor  = COURSE_BADGE_COLOR[course] ?? '#185FA5'
  const categories  = Array.from(new Set(topics.map(t => t.category)))

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (!revealed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
      >
        <NeummLogo size={56} />
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">Building your personal mastery map…</p>
          <p className="text-sm text-gray-400 mt-1">Analysing your results</p>
        </div>
        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-bounce"
              style={{ backgroundColor: '#185FA5', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F8FAFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-6 flex items-center justify-between bg-white border-b border-gray-100">
        <NeummLogo size={36} />
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Mastery Map</p>
          <p className="text-sm font-bold text-gray-900">{course} Mathematics</p>
        </div>
      </div>

      <div className="flex-1 px-5 py-6 space-y-5 pb-32">

        {/* ── Overview card ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          {/* Course badge + completion banner */}
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{ backgroundColor: '#E6F1FB' }}
          >
            <span className="text-xl">🎉</span>
            <div className="flex-1">
              <p className="font-black text-sm" style={{ color: '#185FA5' }}>Placement complete!</p>
              <p className="text-xs text-gray-500">Probe finished · mastery map seeded</p>
            </div>
            <span
              className="text-xs font-black text-white px-3 py-1.5 rounded-full shrink-0"
              style={{ backgroundColor: badgeColor }}
            >
              HSC {course}
            </span>
          </div>

          {/* Circular + insight */}
          <div className="flex items-center gap-5">
            <CircularProgress pct={overallPct} size={120} />
            <div className="flex-1 space-y-2.5">
              <div className="rounded-xl px-4 py-3 border border-blue-100" style={{ backgroundColor: '#E6F1FB' }}>
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                  You are strong in{' '}
                  <span className="font-bold text-gray-900">{strongCount}</span> outcome{strongCount !== 1 ? 's' : ''}.
                </p>
                {biggestGap && (
                  <p className="text-xs font-semibold mt-1" style={{ color: '#185FA5' }}>
                    Biggest gap: {biggestGap.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-gray-100">
            <LegendDot color="#10B981" label="Strong (≥60%)" />
            <LegendDot color="#F59E0B" label="Learning (20–59%)" />
            <LegendDot color="#EF4444" label="Gap (<20%)" />
            <LegendDot color="#D1D5DB" label="Untested" />
          </div>
        </div>

        {/* ── Topic tiles by category ── */}
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-xs font-black uppercase tracking-wide mb-2 px-1 text-gray-400">{cat}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {topics.filter(t => t.category === cat).map(t => {
                const avg     = avgFor(t.prefix)
                const color   = tileColor(avg)
                const label   = tileLabel(avg)
                const isGrey  = avg === null || avg === 0
                return (
                  <button
                    key={t.prefix}
                    onClick={() => router.push(`/practice?topic=${encodeURIComponent(t.prefix)}`)}
                    className="rounded-xl p-2.5 flex flex-col items-center gap-1.5 transition-all active:scale-95 hover:ring-2"
                    style={{
                      backgroundColor: isGrey ? '#F5F5F5' : `${color}18`,
                      minHeight:       76,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ['--tw-ring-color' as any]: '#185FA5',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {avg !== null && avg > 0
                        ? <span className="text-white text-xs font-bold">{avg}</span>
                        : <span className="text-gray-400 text-xs font-bold">?</span>
                      }
                    </div>
                    <p className="text-center leading-tight font-semibold text-gray-600"
                      style={{ fontSize: 9, lineHeight: 1.2 }}>
                      {t.name}
                    </p>
                    <p className="text-center font-bold"
                      style={{ fontSize: 8, color: isGrey ? '#D1D5DB' : color }}>
                      {label}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #F8FAFF 70%, transparent)' }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98] shadow-lg"
          style={{
            backgroundColor: '#185FA5',
            boxShadow:        '0 8px 24px rgba(24,95,165,0.35)',
            minHeight:        56,
          }}
        >
          Continue to my dashboard →
        </button>
      </div>
    </div>
  )
}
