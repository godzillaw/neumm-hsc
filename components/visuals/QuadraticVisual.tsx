'use client'
import { useState } from 'react'

const TABS = ['Parabola Explorer', 'Discriminant', 'Completing the Square']

const DISC_CASES = [
  { label: 'Δ > 0', desc: 'Two distinct real roots', sub: 'Parabola crosses x-axis twice', col: '#38B2AC', roots: [-2, 1.5] },
  { label: 'Δ = 0', desc: 'One repeated root', sub: 'Parabola touches x-axis once', col: '#F59E0B', roots: [1] },
  { label: 'Δ < 0', desc: 'No real roots', sub: 'Parabola doesn\'t touch x-axis', col: '#E05555', roots: [] },
]

const CTS_STEPS = [
  { text: 'Start: x² + 6x + 2', highlight: '' },
  { text: 'Take the x-term coefficient: 6', highlight: 'Take half of 6 → 3' },
  { text: 'Square it: 3² = 9', highlight: 'This is what we add & subtract' },
  { text: 'x² + 6x + 9 − 9 + 2', highlight: 'Add and subtract 9 (net zero change)' },
  { text: '(x + 3)² − 9 + 2', highlight: 'The first 3 terms factor perfectly!' },
  { text: '(x + 3)² − 7', highlight: '✓ Vertex form: vertex at (−3, −7)' },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QuadraticVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)
  const [discCase, setDiscCase] = useState(0)
  const [ctsStep, setCtsStep] = useState(0)

  const accent = '#EC4899'

  // Parabola math
  const disc = b * b - 4 * a * c
  const vx = -b / (2 * a)
  const vy = c - (b * b) / (4 * a)

  // SVG parabola points
  const W = 280; const H = 160; const cx = W / 2; const cy = H / 2
  const scale = 20
  const points = Array.from({ length: 57 }, (_, i) => {
    const x = (i - 28) / 2
    const y = a * x * x + b * x + c
    return `${cx + x * scale},${cy - y * scale}`
  }).join(' ')

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(236,72,153,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(236,72,153,0.2)' : 'transparent', color: tab === i ? '#F472B6' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — Parabola Explorer */}
        {tab === 0 && (
          <div className="space-y-3">
            <p className="text-xs font-mono text-center" style={{ color: '#F472B6' }}>
              y = {a}x² {b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`}
            </p>
            {/* SVG */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                {/* Grid */}
                {[-3,-2,-1,1,2,3].map(n => (
                  <line key={`v${n}`} x1={cx+n*scale} y1={0} x2={cx+n*scale} y2={H} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                ))}
                {[-3,-2,-1,1,2,3].map(n => (
                  <line key={`h${n}`} x1={0} y1={cy+n*scale} x2={W} y2={cy+n*scale} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                ))}
                {/* Axes */}
                <line x1={0} y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <line x1={cx} y1={0} x2={cx} y2={H} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* Parabola */}
                <polyline points={points} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>
                {/* Vertex */}
                {Math.abs(vx) <= 6 && Math.abs(vy) <= 4 && (
                  <circle cx={cx + vx * scale} cy={cy - vy * scale} r="4" fill={accent}/>
                )}
              </svg>
            </div>
            {/* Sliders */}
            {[
              { label: 'a', val: a, set: setA, min: -3, max: 3 },
              { label: 'b', val: b, set: setB, min: -6, max: 6 },
              { label: 'c', val: c, set: setC, min: -5, max: 5 },
            ].map(sl => (
              <div key={sl.label} className="flex items-center gap-3">
                <span className="w-4 text-xs font-mono font-bold" style={{ color: '#F472B6' }}>{sl.label}</span>
                <input type="range" min={sl.min} max={sl.max} value={sl.val}
                  onChange={e => sl.set(Number(e.target.value))} className="flex-1 h-1.5 accent-pink-500"/>
                <span className="w-6 text-xs font-mono text-right" style={{ color: 'rgba(255,255,255,0.7)' }}>{sl.val}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Vertex', val: `(${vx.toFixed(1)}, ${vy.toFixed(1)})` },
                { label: 'Axis', val: `x = ${vx.toFixed(1)}` },
                { label: 'Discriminant Δ', val: disc.toFixed(1) },
                { label: 'Opens', val: a > 0 ? 'Upward ∪' : 'Downward ∩' },
              ].map(r => (
                <div key={r.label} className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.label}</div>
                  <div className="text-sm font-mono font-bold mt-0.5" style={{ color: '#F472B6' }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1 — Discriminant */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>The Formula</p>
              <p className="text-xl font-mono font-bold mt-1" style={{ color: '#F472B6' }}>Δ = b² − 4ac</p>
            </div>
            <div className="flex gap-2">
              {DISC_CASES.map((dc, i) => (
                <button key={i} onClick={() => setDiscCase(i)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ background: discCase === i ? `${dc.col}22` : 'rgba(255,255,255,0.05)', border: `1px solid ${discCase === i ? dc.col : 'transparent'}`, color: discCase === i ? dc.col : 'rgba(255,255,255,0.4)' }}>
                  {dc.label}
                </button>
              ))}
            </div>
            {/* Visual parabola for selected case */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox="0 0 200 120" className="w-full">
                <line x1="0" y1="70" x2="200" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <line x1="100" y1="0" x2="100" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                {discCase === 0 && (
                  <>
                    <polyline points="20,110 60,30 100,10 140,30 180,110" fill="none" stroke={DISC_CASES[0].col} strokeWidth="2.5"/>
                    <circle cx="52" cy="70" r="4" fill={DISC_CASES[0].col}/>
                    <circle cx="148" cy="70" r="4" fill={DISC_CASES[0].col}/>
                    <text x="52" y="88" textAnchor="middle" fontSize="9" fill={DISC_CASES[0].col}>x₁</text>
                    <text x="148" y="88" textAnchor="middle" fontSize="9" fill={DISC_CASES[0].col}>x₂</text>
                  </>
                )}
                {discCase === 1 && (
                  <>
                    <polyline points="20,110 60,40 100,10 140,40 180,110" fill="none" stroke={DISC_CASES[1].col} strokeWidth="2.5"/>
                    <circle cx="100" cy="10" r="4" fill={DISC_CASES[1].col}/>
                    <circle cx="100" cy="70" r="4" fill="transparent" stroke={DISC_CASES[1].col} strokeWidth="2"/>
                    <text x="100" y="88" textAnchor="middle" fontSize="9" fill={DISC_CASES[1].col}>x (one root)</text>
                  </>
                )}
                {discCase === 2 && (
                  <>
                    <polyline points="20,80 60,30 100,15 140,30 180,80" fill="none" stroke={DISC_CASES[2].col} strokeWidth="2.5"/>
                    <text x="100" y="105" textAnchor="middle" fontSize="9" fill={DISC_CASES[2].col}>Never crosses x-axis</text>
                  </>
                )}
              </svg>
            </div>
            <div className="rounded-xl p-3" style={{ background: `${DISC_CASES[discCase].col}15`, border: `1px solid ${DISC_CASES[discCase].col}40` }}>
              <p className="text-sm font-bold" style={{ color: DISC_CASES[discCase].col }}>{DISC_CASES[discCase].desc}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{DISC_CASES[discCase].sub}</p>
            </div>
          </div>
        )}

        {/* Tab 2 — Completing the Square */}
        {tab === 2 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Turn <strong style={{ color: '#F472B6' }}>ax² + bx + c</strong> → <strong style={{ color: '#F472B6' }}>a(x + h)² + k</strong> (vertex form)
            </p>
            <div className="space-y-2">
              {CTS_STEPS.slice(0, ctsStep + 1).map((s, i) => (
                <div key={i} className="rounded-xl p-3 flex gap-3 items-start"
                  style={{ background: i === ctsStep ? 'rgba(236,72,153,0.15)' : 'rgba(0,0,0,0.2)', border: `1px solid ${i === ctsStep ? 'rgba(236,72,153,0.3)' : 'transparent'}` }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                    style={{ background: i === ctsStep ? accent : 'rgba(255,255,255,0.15)', color: '#fff' }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold" style={{ color: i === ctsStep ? '#fff' : 'rgba(255,255,255,0.5)' }}>{s.text}</div>
                    {s.highlight && i === ctsStep && (
                      <div className="text-[11px] mt-1" style={{ color: 'rgba(244,114,182,0.8)' }}>{s.highlight}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCtsStep(Math.max(0, ctsStep - 1))} disabled={ctsStep === 0}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.07)', color: ctsStep === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>
                ← Back
              </button>
              <button onClick={() => setCtsStep(Math.min(CTS_STEPS.length - 1, ctsStep + 1))}
                disabled={ctsStep === CTS_STEPS.length - 1}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: ctsStep < CTS_STEPS.length - 1 ? accent : 'rgba(255,255,255,0.07)', color: ctsStep < CTS_STEPS.length - 1 ? '#fff' : 'rgba(255,255,255,0.2)' }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
