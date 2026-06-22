'use client'

import { useState } from 'react'

// Interactive number line for Stage 2A: Real Numbers and Intervals
// Shows how interval notation maps to a visual number line

interface Props {
  color?: string
}

type IntervalExample = {
  label: string
  notation: string
  desc: string
  from: number
  to: number
  openLeft: boolean
  openRight: boolean
  infinite: 'left' | 'right' | null
}

const EXAMPLES: IntervalExample[] = [
  {
    label: 'Closed [a,b]',
    notation: '[-2, 5]',
    desc: 'Both endpoints included. Solid dots at −2 and 5.',
    from: -2, to: 5, openLeft: false, openRight: false, infinite: null,
  },
  {
    label: 'Open (a,b)',
    notation: '(-1, 4)',
    desc: 'Both endpoints excluded. Open circles at −1 and 4.',
    from: -1, to: 4, openLeft: true, openRight: true, infinite: null,
  },
  {
    label: 'Half-open [a,b)',
    notation: '[0, 3)',
    desc: 'Includes 0 (solid), excludes 3 (open). Like x ≥ 0 and x < 3.',
    from: 0, to: 3, openLeft: false, openRight: true, infinite: null,
  },
  {
    label: 'Unbounded (a,∞)',
    notation: '(2, ∞)',
    desc: '∞ always uses a round bracket — it\'s never reached, so it can\'t be included.',
    from: 2, to: 7, openLeft: true, openRight: false, infinite: 'right',
  },
  {
    label: 'All reals (-∞,∞)',
    notation: '(-∞, ∞) = ℝ',
    desc: 'Every real number. The entire number line.',
    from: -6, to: 7, openLeft: false, openRight: false, infinite: null,
  },
]

// Map a value in [-6, 7] to SVG x coordinate [20, 220]
function toX(val: number): number {
  return 20 + ((val + 6) / 13) * 200
}

const TICKS = [-6, -4, -2, 0, 2, 4, 6]

export default function NumberLineVisual({ color = '#8B5CF6' }: Props) {
  const [idx, setIdx] = useState(0)
  const ex = EXAMPLES[idx]

  const x1 = toX(ex.from)
  const x2 = ex.infinite === 'right' ? 224 : toX(ex.to)
  const isAllReals = ex.notation.includes('ℝ')

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Visual — Number Line
      </p>

      {/* Interval selector tabs */}
      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((e, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-black transition-all"
            style={i === idx
              ? { background: color, color: 'white' }
              : { background: `${color}22`, color: `${color}` }
            }
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* SVG number line */}
      <div className="flex justify-center">
        <svg viewBox="0 0 240 80" width="100%" height="80">
          {/* Axis line */}
          <line x1="14" y1="40" x2="226" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Arrow heads */}
          <polygon points="224,36 232,40 224,44" fill="rgba(255,255,255,0.2)" />
          <polygon points="16,36 8,40 16,44" fill="rgba(255,255,255,0.2)" />

          {/* Tick marks and labels */}
          {TICKS.map(t => (
            <g key={t}>
              <line x1={toX(t)} y1="35" x2={toX(t)} y2="45" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <text x={toX(t)} y="60" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Nunito,sans-serif">{t}</text>
            </g>
          ))}

          {/* Highlighted interval */}
          {isAllReals ? (
            <line x1="14" y1="40" x2="226" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
          ) : (
            <>
              <line x1={x1} y1="40" x2={x2} y2="40" stroke={color} strokeWidth="4" strokeLinecap={ex.infinite ? 'square' : 'round'} />
              {/* Arrow if infinite right */}
              {ex.infinite === 'right' && (
                <polygon points={`${x2 - 6},36 ${x2 + 2},40 ${x2 - 6},44`} fill={color} />
              )}
              {/* Left endpoint dot */}
              {ex.infinite !== 'left' && (
                ex.openLeft
                  ? <circle cx={x1} cy={40} r={5} fill="#0D1B2E" stroke={color} strokeWidth="2.5" />
                  : <circle cx={x1} cy={40} r={5} fill={color} />
              )}
              {/* Right endpoint dot */}
              {ex.infinite !== 'right' && (
                ex.openRight
                  ? <circle cx={toX(ex.to)} cy={40} r={5} fill="#0D1B2E" stroke={color} strokeWidth="2.5" />
                  : <circle cx={toX(ex.to)} cy={40} r={5} fill={color} />
              )}
            </>
          )}

          {/* Notation label above line */}
          <text x="120" y="18" textAnchor="middle" fill={color} fontSize="13" fontWeight="800" fontFamily="Nunito,sans-serif">
            {ex.notation}
          </text>
        </svg>
      </div>

      {/* Description */}
      <div className="rounded-xl px-4 py-3 min-h-[52px] flex items-center"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <p className="text-sm font-bold text-white leading-snug">{ex.desc}</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <svg width="16" height="16"><circle cx="8" cy="8" r="5" fill={color} /></svg>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Included (solid)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16"><circle cx="8" cy="8" r="5" fill="#0D1B2E" stroke={color} strokeWidth="2" /></svg>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Excluded (open)</span>
        </div>
      </div>
    </div>
  )
}
