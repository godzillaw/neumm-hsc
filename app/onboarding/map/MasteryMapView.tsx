'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface MasteryEntry {
  outcome_id: string
  status: string
  confidence_pct: number
  difficulty_band: number
}

export interface OutcomeTopic {
  prefix: string
  nesa_outcome_code: string
  name: string
  category: string
}

export interface ProfileData {
  course: string | null
  year_group: string | null
  intent: string | null
}

interface Props {
  mastery:   MasteryEntry[]
  topics:    OutcomeTopic[]
  profile:   ProfileData
}

// ─── Colour helpers ────────────────────────────────────────────────────────────
function tileColor(avgConfidence: number | null): string {
  if (avgConfidence === null) return '#E5E7EB'          // grey  — untested
  if (avgConfidence >= 80)   return '#10B981'          // green — mastered
  if (avgConfidence >= 50)   return '#F59E0B'          // amber — shaky
  return '#EF4444'                                      // red   — gap
}

function tileLabel(avgConfidence: number | null): string {
  if (avgConfidence === null) return 'Untested'
  if (avgConfidence >= 80)   return 'Mastered'
  if (avgConfidence >= 50)   return 'Shaky'
  return 'Gap'
}

// ─── Circular progress ─────────────────────────────────────────────────────────
function CircularProgress({ pct, size = 120 }: { pct: number; size?: number }) {
  const r      = (size - 16) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  const [animOffset, setAnimOffset] = useState(circ)

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimOffset(offset))
    return () => cancelAnimationFrame(t)
  }, [offset])

  const strokeColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : pct >= 20 ? '#185FA5' : '#EF4444'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: 'block' }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{pct}%</span>
        <span className="text-xs text-gray-400 font-medium">mastery</span>
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

// ─── Main component ────────────────────────────────────────────────────────────
export default function MasteryMapView({ mastery, topics, profile }: Props) {
  const router = useRouter()

  // Build prefix → avg confidence map
  const prefixMap: Record<string, number[]> = {}
  for (const m of mastery) {
    // outcome_id is like MA-CALC-D01-B3 → prefix = MA-CALC-D01
    const prefix = m.outcome_id.replace(/-B\d+$/, '')
    if (!prefixMap[prefix]) prefixMap[prefix] = []
    prefixMap[prefix].push(m.confidence_pct)
  }

  const avgFor = (prefix: string): number | null => {
    const vals = prefixMap[prefix]
    if (!vals || vals.length === 0) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }

  // Stats
  const testedTopics  = topics.filter(t => prefixMap[t.prefix])
  const masteredCount = testedTopics.filter(t => (avgFor(t.prefix) ?? 0) >= 80).length
  const totalTopics   = topics.length
  const overallPct    = testedTopics.length === 0 ? 0
    : Math.round(testedTopics.reduce((sum, t) => sum + (avgFor(t.prefix) ?? 0), 0) / testedTopics.length)

  // Biggest opportunity = tested topic with lowest confidence
  const biggestOpp = testedTopics.length > 0
    ? testedTopics.reduce((worst, t) => {
        const a = avgFor(t.prefix) ?? 100
        const b = avgFor(worst.prefix) ?? 100
        return a < b ? t : worst
      }, testedTopics[0])
    : null

  // Group topics by category
  const categories = Array.from(new Set(topics.map(t => t.category)))

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-10 pb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your mastery map</p>
        <h1 className="text-xl font-bold text-gray-900">
          {profile.course ?? 'Advanced'} Mathematics
        </h1>
        {profile.year_group && (
          <p className="text-sm text-gray-400 mt-0.5">{profile.year_group.replace(/_/g, ' ')}</p>
        )}
      </div>

      <div className="flex-1 px-5 py-5 space-y-5 pb-28">

        {/* ── Overview card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-5">
            <CircularProgress pct={overallPct} size={110} />

            <div className="flex-1 space-y-3">
              {/* Insight */}
              <div
                className="rounded-xl px-4 py-3"
                style={{ backgroundColor: '#EEF4FB' }}
              >
                <p className="text-xs text-[#185FA5] leading-relaxed font-medium">
                  You are strong in{' '}
                  <span className="font-bold">{masteredCount} of {totalTopics}</span>{' '}
                  outcomes
                </p>
              </div>

              {/* Biggest opportunity */}
              {biggestOpp && (
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ backgroundColor: '#FFF7ED' }}
                >
                  <p className="text-xs text-amber-700 font-medium mb-0.5">Biggest opportunity</p>
                  <p className="text-xs text-amber-900 font-semibold leading-tight">{biggestOpp.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-gray-100">
            <LegendDot color="#10B981" label="Mastered (≥80%)" />
            <LegendDot color="#F59E0B" label="Shaky (50–79%)" />
            <LegendDot color="#EF4444" label="Gap (<50%)" />
            <LegendDot color="#E5E7EB" label="Untested" />
          </div>
        </div>

        {/* ── Mastery grid by category ── */}
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">{cat}</p>
            <div className="grid grid-cols-4 gap-2">
              {topics
                .filter(t => t.category === cat)
                .map(t => {
                  const avg = avgFor(t.prefix)
                  const color = tileColor(avg)
                  const label = tileLabel(avg)
                  const isLight = avg === null
                  return (
                    <button
                      key={t.prefix}
                      className="rounded-xl p-2 flex flex-col items-center gap-1 transition-all active:scale-95"
                      style={{ backgroundColor: isLight ? '#F3F4F6' : `${color}18`, minHeight: 72 }}
                    >
                      {/* Colour dot */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: color }}
                      >
                        {avg !== null && (
                          <span className="text-white text-xs font-bold">{avg}</span>
                        )}
                        {avg === null && (
                          <span className="text-gray-400 text-xs">?</span>
                        )}
                      </div>
                      {/* Topic name */}
                      <p
                        className="text-center leading-tight font-medium"
                        style={{ fontSize: 9, color: isLight ? '#9CA3AF' : '#374151', lineHeight: 1.2 }}
                      >
                        {t.name}
                      </p>
                      {/* Status label */}
                      <p
                        className="text-center font-semibold"
                        style={{ fontSize: 8, color: isLight ? '#D1D5DB' : color }}
                      >
                        {label}
                      </p>
                    </button>
                  )
                })}
            </div>
          </div>
        ))}

        {/* ── Probe summary ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Probe summary
          </p>
          <div className="space-y-2">
            {mastery.map(m => {
              const prefix = m.outcome_id.replace(/-B\d+$/, '')
              const topic  = topics.find(t => t.prefix === prefix)
              const color  = tileColor(m.confidence_pct)
              return (
                <div key={m.outcome_id} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {topic?.name ?? m.outcome_id}
                    </p>
                    <p className="text-xs text-gray-400">Band {m.difficulty_band}</p>
                  </div>
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{ color }}
                  >
                    {m.confidence_pct}%
                  </span>
                </div>
              )
            })}
            {mastery.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Complete the placement probe to see your results
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #F4F6FA 70%, transparent)' }}
      >
        <button
          onClick={() => router.push('/practice')}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg"
          style={{ backgroundColor: '#185FA5', boxShadow: '0 8px 24px rgba(24,95,165,0.3)' }}
        >
          Start my first session →
        </button>
      </div>
    </div>
  )
}
