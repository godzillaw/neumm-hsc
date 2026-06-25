'use client'
import { useState } from 'react'

const TABS = ['Area Concept', 'Antiderivatives', 'Definite Integrals']

const ANTI_EXAMPLES = [
  { fn: 'x³',           anti: 'x⁴/4 + C',      rule: 'Add 1 to power, divide by new power' },
  { fn: '5x²',          anti: '5x³/3 + C',      rule: 'Coefficient stays: 5 × x³/3' },
  { fn: '6x',           anti: '3x² + C',         rule: 'x¹ → x²/2, times coefficient 6' },
  { fn: '1/x',          anti: 'ln|x| + C',       rule: 'Special case — memorise this one' },
  { fn: 'sin x',        anti: '−cos x + C',      rule: 'Anti of sin is negative cos' },
  { fn: 'cos x',        anti: 'sin x + C',       rule: 'Anti of cos is sin' },
  { fn: 'eˣ',           anti: 'eˣ + C',          rule: 'eˣ is its own antiderivative!' },
]

const DEF_STEPS = [
  { label: 'Write the integral', expr: '∫₁³ x² dx' },
  { label: 'Find antiderivative', expr: '= [x³/3]₁³' },
  { label: 'Substitute upper limit', expr: '= (3³/3) − …' },
  { label: 'Substitute lower limit', expr: '= (27/3) − (1/3)' },
  { label: 'Simplify', expr: '= 9 − 1/3 = 26/3' },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function IntegrationVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [rects, setRects] = useState(4)
  const [antiIdx, setAntiIdx] = useState(0)
  const [defStep, setDefStep] = useState(0)

  const accent = '#8B5CF6'

  const fn = (x: number) => x * x
  const a = 0; const b2 = 2
  const W = 240; const H = 140
  const svgX = (x: number) => 30 + (x / 3) * (W - 40)
  const svgY = (y: number) => H - 10 - (y / 5) * (H - 20)

  // Riemann rects
  const rectWidth = (b2 - a) / rects
  const rectEls = Array.from({ length: rects }, (_, i) => {
    const xi = a + i * rectWidth
    const yi = fn(xi)
    return { x: svgX(xi), w: (W - 40) * rectWidth / 3, h: (H - 20) * yi / 5, y: svgY(yi) }
  })

  // Actual area x³/3 from 0 to 2 = 8/3 ≈ 2.667
  const exactArea = (Math.pow(b2, 3) / 3 - Math.pow(a, 3) / 3).toFixed(3)
  const approxArea = (rectWidth * rectEls.reduce((s, r) => s + fn(a + rectEls.indexOf(r) * rectWidth), 0)).toFixed(3)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(139,92,246,0.2)' : 'transparent', color: tab === i ? '#A78BFA' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — Area Concept */}
        {tab === 0 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Integration finds the <strong style={{ color: '#A78BFA' }}>exact area</strong> under a curve by shrinking rectangles to infinitely thin slices.
            </p>
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                {/* Axes */}
                <line x1="30" y1={H-10} x2={W} y2={H-10} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <line x1="30" y1="5" x2="30" y2={H-5} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* Riemann rectangles */}
                {rectEls.map((r, i) => (
                  <rect key={i} x={r.x} y={r.y} width={r.w} height={H - 10 - r.y}
                    fill={`${accent}40`} stroke={accent} strokeWidth="0.5"/>
                ))}
                {/* Curve */}
                <polyline points={Array.from({length:31},(_, i) => {
                  const x = i * 3 / 30; return `${svgX(x)},${svgY(fn(x))}`
                }).join(' ')} fill="none" stroke="#A78BFA" strokeWidth="2"/>
                {/* Area label */}
                <text x="120" y={H-25} textAnchor="middle" fontSize="9" fill={accent}>f(x) = x²</text>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: accent }}>n</span>
              <input type="range" min="1" max="20" value={rects} onChange={e => setRects(Number(e.target.value))}
                className="flex-1 h-1.5 accent-violet-500"/>
              <span className="text-xs font-mono w-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{rects}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Approx area</div>
                <div className="text-sm font-mono font-bold" style={{ color: '#F59E0B' }}>{approxArea}</div>
              </div>
              <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Exact area</div>
                <div className="text-sm font-mono font-bold" style={{ color: accent }}>{exactArea}</div>
              </div>
            </div>
            <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
              More rectangles → closer to {exactArea}. At n=∞ they match exactly.
            </p>
          </div>
        )}

        {/* Tab 1 — Antiderivatives */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Reverse of differentiation</p>
              <p className="text-lg font-mono font-black mt-1" style={{ color: accent }}>∫xⁿ dx = xⁿ⁺¹/(n+1) + C</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>+C because the constant vanished when differentiating</p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {ANTI_EXAMPLES.map((e, i) => (
                <button key={i} onClick={() => setAntiIdx(i)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
                  style={{ background: antiIdx === i ? accent : 'rgba(255,255,255,0.07)', color: antiIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {e.fn}
                </button>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>∫</span>
                <span className="font-mono text-lg font-black">{ANTI_EXAMPLES[antiIdx].fn}</span>
                <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>dx =</span>
                <span className="font-mono text-xl font-black" style={{ color: accent }}>{ANTI_EXAMPLES[antiIdx].anti}</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{ANTI_EXAMPLES[antiIdx].rule}</p>
            </div>
          </div>
        )}

        {/* Tab 2 — Definite Integrals */}
        {tab === 2 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Definite integral = substituting <strong style={{ color: '#A78BFA' }}>upper</strong> minus <strong style={{ color: '#A78BFA' }}>lower</strong> limit into the antiderivative.
            </p>
            <div className="space-y-2">
              {DEF_STEPS.slice(0, defStep + 1).map((s, i) => (
                <div key={i} className="rounded-xl p-3 flex gap-3 items-center"
                  style={{ background: i === defStep ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.2)', border: `1px solid ${i === defStep ? 'rgba(139,92,246,0.3)' : 'transparent'}` }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ background: i === defStep ? accent : 'rgba(255,255,255,0.15)', color: '#fff' }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                    <div className="font-mono text-base font-bold" style={{ color: i === defStep ? '#fff' : 'rgba(255,255,255,0.5)' }}>{s.expr}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDefStep(Math.max(0, defStep - 1))} disabled={defStep === 0}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.07)', color: defStep === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>
                ← Back
              </button>
              <button onClick={() => setDefStep(Math.min(DEF_STEPS.length - 1, defStep + 1))}
                disabled={defStep === DEF_STEPS.length - 1}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: defStep < DEF_STEPS.length - 1 ? accent : 'rgba(255,255,255,0.07)', color: defStep < DEF_STEPS.length - 1 ? '#fff' : 'rgba(255,255,255,0.2)' }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
