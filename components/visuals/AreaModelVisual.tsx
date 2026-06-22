'use client'

import { useState } from 'react'

// Interactive area model for expanding (a+b)(c+d)
// Used for Stage 1A: Arithmetic with Algebraic Expressions

interface Props {
  color?: string
}

const STEPS = [
  {
    label: 'Setup',
    desc: 'A rectangle with width (x + 2) and height (x + 3). What\'s its area?',
    highlight: null as string | null,
  },
  {
    label: 'x · x',
    desc: 'Multiply the first terms: x × x = x²',
    highlight: 'tl',
  },
  {
    label: 'x · 3',
    desc: 'Multiply outer terms: x × 3 = 3x',
    highlight: 'tr',
  },
  {
    label: '2 · x',
    desc: 'Multiply inner terms: 2 × x = 2x',
    highlight: 'bl',
  },
  {
    label: '2 · 3',
    desc: 'Multiply last terms: 2 × 3 = 6',
    highlight: 'br',
  },
  {
    label: 'Collect',
    desc: 'Total area = x² + 3x + 2x + 6 = x² + 5x + 6',
    highlight: 'all',
  },
]

const CELL_LABELS: Record<string, { term: string; color: string }> = {
  tl: { term: 'x²',  color: '#6366F1' },
  tr: { term: '3x',  color: '#8B5CF6' },
  bl: { term: '2x',  color: '#A78BFA' },
  br: { term: '6',   color: '#C4B5FD' },
}

export default function AreaModelVisual({ color = '#6366F1' }: Props) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  function cellOpacity(key: string) {
    if (current.highlight === 'all') return 1
    if (current.highlight === key)  return 1
    if (current.highlight === null) return 0.18
    return 0.18
  }

  function cellScale(key: string) {
    if (current.highlight === key) return 'scale(1.06)'
    return 'scale(1)'
  }

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Visual — Area Model
      </p>

      {/* SVG area grid */}
      <div className="flex justify-center">
        <svg viewBox="0 0 240 200" width="240" height="200" style={{ overflow: 'visible' }}>
          {/* Column labels */}
          <text x="72" y="18" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">x</text>
          <text x="168" y="18" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">3</text>

          {/* Row labels */}
          <text x="18" y="92" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">x</text>
          <text x="18" y="168" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">2</text>

          {/* Outer border */}
          <rect x="30" y="28" width="200" height="160" rx="6"
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          {/* Divider lines */}
          <line x1="128" y1="28" x2="128" y2="188" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="30" y1="108" x2="230" y2="108" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

          {/* TL cell — x² */}
          <rect x="31" y="29" width="96" height="78" rx="4"
            fill={CELL_LABELS.tl.color}
            fillOpacity={cellOpacity('tl')}
            style={{ transition: 'fill-opacity 0.3s, transform 0.3s', transformOrigin: '79px 68px', transform: cellScale('tl') }}
          />
          <text x="79" y="73" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Nunito, sans-serif"
            opacity={current.highlight === 'tl' || current.highlight === 'all' ? 1 : 0.35}
            style={{ transition: 'opacity 0.3s' }}>
            x²
          </text>

          {/* TR cell — 3x */}
          <rect x="129" y="29" width="100" height="78" rx="4"
            fill={CELL_LABELS.tr.color}
            fillOpacity={cellOpacity('tr')}
            style={{ transition: 'fill-opacity 0.3s', transformOrigin: '179px 68px', transform: cellScale('tr') }}
          />
          <text x="179" y="73" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Nunito, sans-serif"
            opacity={current.highlight === 'tr' || current.highlight === 'all' ? 1 : 0.35}
            style={{ transition: 'opacity 0.3s' }}>
            3x
          </text>

          {/* BL cell — 2x */}
          <rect x="31" y="109" width="96" height="78" rx="4"
            fill={CELL_LABELS.bl.color}
            fillOpacity={cellOpacity('bl')}
            style={{ transition: 'fill-opacity 0.3s', transformOrigin: '79px 148px', transform: cellScale('bl') }}
          />
          <text x="79" y="153" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Nunito, sans-serif"
            opacity={current.highlight === 'bl' || current.highlight === 'all' ? 1 : 0.35}
            style={{ transition: 'opacity 0.3s' }}>
            2x
          </text>

          {/* BR cell — 6 */}
          <rect x="129" y="109" width="100" height="78" rx="4"
            fill={CELL_LABELS.br.color}
            fillOpacity={cellOpacity('br')}
            style={{ transition: 'fill-opacity 0.3s', transformOrigin: '179px 148px', transform: cellScale('br') }}
          />
          <text x="179" y="153" textAnchor="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Nunito, sans-serif"
            opacity={current.highlight === 'br' || current.highlight === 'all' ? 1 : 0.35}
            style={{ transition: 'opacity 0.3s' }}>
            6
          </text>
        </svg>
      </div>

      {/* Step description */}
      <div className="rounded-xl px-4 py-3 min-h-[56px] flex items-center"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <p className="text-sm font-bold text-white leading-snug">{current.desc}</p>
      </div>

      {/* Step nav */}
      <div className="flex items-center gap-3">
        <button
          disabled={step === 0}
          onClick={() => setStep(s => s - 1)}
          className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-30 transition-opacity"
          style={{ background: `${color}33`, color }}
        >
          ←
        </button>

        <div className="flex-1 flex gap-1 justify-center">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="rounded-full transition-all"
              style={{
                width: i === step ? 20 : 8,
                height: 8,
                background: i === step ? color : `${color}44`,
              }}
            />
          ))}
        </div>

        <button
          disabled={step === STEPS.length - 1}
          onClick={() => setStep(s => s + 1)}
          className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-30 transition-opacity"
          style={{ background: `${color}33`, color }}
        >
          →
        </button>
      </div>

      <p className="text-center text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Step {step + 1} of {STEPS.length} · {current.label}
      </p>
    </div>
  )
}
