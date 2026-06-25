'use client'
import { useState } from 'react'

const TABS = ['What is a Derivative?', 'Power Rule', 'Which Rule?']

const POWER_EXAMPLES = [
  { fn: 'x⁵',        deriv: '5x⁴',       rule: 'n·xⁿ⁻¹ → 5·x⁴' },
  { fn: '3x²',       deriv: '6x',         rule: 'coefficient × n·xⁿ⁻¹ = 3·2·x¹' },
  { fn: 'x⁻²',       deriv: '-2x⁻³',      rule: 'n=-2: -2·x⁻³' },
  { fn: '√x = x^½', deriv: '1/(2√x)',     rule: 'n=½: ½·x⁻½' },
  { fn: '7',         deriv: '0',           rule: 'Constants vanish — slope is 0' },
  { fn: '4x³ - 2x', deriv: '12x² - 2',    rule: 'Differentiate each term separately' },
]

const RULES = [
  { name: 'Chain Rule', when: 'Function inside a function', example: 'sin(x²), (3x+1)⁵, e^(2x)', formula: "f(g(x))' = f'(g(x)) · g'(x)" },
  { name: 'Product Rule', when: 'Two functions multiplied', example: 'x²·sin x, e^x·ln x', formula: "(uv)' = u'v + uv'" },
  { name: 'Quotient Rule', when: 'One function divided by another', example: 'sin x / x, x² / (x+1)', formula: "(u/v)' = (u'v - uv') / v²" },
  { name: 'Power Rule', when: 'xⁿ (polynomial terms)', example: 'x³, 5x², √x', formula: "d/dx[xⁿ] = nxⁿ⁻¹" },
]

const GRAD_STEPS = [
  'Pick two points on the curve: x and x + h',
  'Secant gradient = [f(x+h) - f(x)] / h',
  'Shrink h → 0: the secant becomes a tangent',
  "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
  'This limit is the DERIVATIVE at x',
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DifferentiationVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [gradStep, setGradStep] = useState(0)
  const [powIdx, setPowIdx] = useState(0)
  const [ruleIdx, setRuleIdx] = useState(0)
  const [h, setH] = useState(2)

  const accent = '#14B8A6'

  // For gradient visualisation: f(x) = x²
  const fx = (x: number) => x * x
  const x0 = 1
  const hVal = h * 0.5
  const x1 = x0 + hVal
  const slope = (fx(x1) - fx(x0)) / (x1 - x0)

  const svgX = (x: number) => 120 + x * 40
  const svgY = (y: number) => 130 - y * 20

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(20,184,166,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(20,184,166,0.2)' : 'transparent', color: tab === i ? '#2DD4BF' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — What is a Derivative? */}
        {tab === 0 && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox="0 0 240 160" className="w-full">
                {/* Axes */}
                <line x1="30" y1="135" x2="220" y2="135" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <line x1="30" y1="10" x2="30" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* Curve f(x) = x² */}
                <polyline points={Array.from({length:25},(_, i) => {
                  const x = (i-12)*0.3; return `${svgX(x)},${svgY(fx(x))}`
                }).join(' ')} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                {/* Secant line */}
                {gradStep >= 1 && (
                  <line x1={svgX(x0-1.5)} y1={svgY(fx(x0) - slope*1.5)} x2={svgX(x1+1)} y2={svgY(fx(x0) + slope*(x1-x0+1))}
                    stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4"/>
                )}
                {/* Tangent (h→0) */}
                {gradStep >= 3 && (
                  <line x1={svgX(x0-1.5)} y1={svgY(fx(x0) - 2*1.5)} x2={svgX(x0+2)} y2={svgY(fx(x0) + 2*2)}
                    stroke={accent} strokeWidth="2"/>
                )}
                {/* Points */}
                <circle cx={svgX(x0)} cy={svgY(fx(x0))} r="4" fill={accent}/>
                {gradStep >= 1 && <circle cx={svgX(x1)} cy={svgY(fx(x1))} r="4" fill="#F59E0B"/>}
                {/* Labels */}
                <text x={svgX(x0)-5} y={svgY(fx(x0))-6} fontSize="9" fill={accent}>x</text>
                {gradStep >= 1 && <text x={svgX(x1)+3} y={svgY(fx(x1))-6} fontSize="9" fill="#F59E0B">x+h</text>}
                {gradStep >= 3 && <text x={svgX(x0+1.5)} y={svgY(fx(x0)+3)-4} fontSize="9" fill={accent}>tangent</text>}
              </svg>
            </div>
            {/* h slider */}
            {gradStep >= 1 && gradStep < 3 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono" style={{ color: '#F59E0B' }}>h</span>
                <input type="range" min="1" max="5" value={h} onChange={e => setH(Number(e.target.value))}
                  className="flex-1 h-1.5" style={{ accentColor: '#F59E0B' }}/>
                <span className="text-xs font-mono w-8" style={{ color: 'rgba(255,255,255,0.6)' }}>{hVal.toFixed(1)}</span>
              </div>
            )}
            <div className="rounded-xl p-3" style={{ background: gradStep === GRAD_STEPS.length - 1 ? 'rgba(20,184,166,0.15)' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(20,184,166,0.2)' }}>
              <p className="text-sm font-bold" style={{ color: '#2DD4BF' }}>{GRAD_STEPS[gradStep]}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setGradStep(Math.max(0, gradStep - 1))} disabled={gradStep === 0}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.07)', color: gradStep === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>
                ← Back
              </button>
              <button onClick={() => setGradStep(Math.min(GRAD_STEPS.length - 1, gradStep + 1))}
                disabled={gradStep === GRAD_STEPS.length - 1}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: gradStep < GRAD_STEPS.length - 1 ? accent : 'rgba(255,255,255,0.07)', color: gradStep < GRAD_STEPS.length - 1 ? '#fff' : 'rgba(255,255,255,0.2)' }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Tab 1 — Power Rule */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>The Power Rule</p>
              <p className="text-xl font-mono font-black" style={{ color: accent }}>d/dx [xⁿ] = n·xⁿ⁻¹</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Bring the power down, reduce by 1</p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {POWER_EXAMPLES.map((e, i) => (
                <button key={i} onClick={() => setPowIdx(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
                  style={{ background: powIdx === i ? accent : 'rgba(255,255,255,0.07)', color: powIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {e.fn}
                </button>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(20,184,166,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>d/dx[</span>
                <span className="font-mono text-lg font-black" style={{ color: '#fff' }}>{POWER_EXAMPLES[powIdx].fn}</span>
                <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>] =</span>
                <span className="font-mono text-xl font-black" style={{ color: accent }}>{POWER_EXAMPLES[powIdx].deriv}</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{POWER_EXAMPLES[powIdx].rule}</p>
            </div>
          </div>
        )}

        {/* Tab 2 — Which Rule? */}
        {tab === 2 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Look at the structure → pick your rule.</p>
            <div className="flex gap-1.5 flex-wrap">
              {RULES.map((r, i) => (
                <button key={i} onClick={() => setRuleIdx(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  style={{ background: ruleIdx === i ? accent : 'rgba(255,255,255,0.07)', color: ruleIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {r.name}
                </button>
              ))}
            </div>
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(20,184,166,0.2)' }}>
              <p className="text-sm font-black" style={{ color: accent }}>{RULES[ruleIdx].name}</p>
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>When to use</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{RULES[ruleIdx].when}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Examples</p>
                <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{RULES[ruleIdx].example}</p>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'rgba(20,184,166,0.1)' }}>
                <p className="text-xs font-mono font-bold text-center" style={{ color: '#2DD4BF' }}>{RULES[ruleIdx].formula}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
