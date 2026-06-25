'use client'
import { useState } from 'react'

const TABS = ['What is a Log?', 'Log Laws', 'Graphs']

const LOG_LAWS = [
  { name: 'Product Law',   law: 'logₐ(mn) = logₐm + logₐn',   example: 'log₂(8×4) = log₂8 + log₂4 = 3+2 = 5', hint: 'Multiply → add logs' },
  { name: 'Quotient Law',  law: 'logₐ(m/n) = logₐm − logₐn',  example: 'log₂(16/4) = log₂16 − log₂4 = 4−2 = 2', hint: 'Divide → subtract logs' },
  { name: 'Power Law',     law: 'logₐ(mⁿ) = n·logₐm',          example: 'log₂(8²) = 2·log₂8 = 2×3 = 6', hint: 'Power comes down as multiplier' },
  { name: 'Change of Base',law: 'logₐb = log b / log a',        example: 'log₃7 = log7 / log3 ≈ 0.845/0.477 ≈ 1.77', hint: 'Use this for calculators' },
  { name: 'Log of 1',      law: 'logₐ1 = 0',                   example: 'log₁₀(1) = 0', hint: 'aˣ=1 only when x=0' },
  { name: 'Log of base',   law: 'logₐa = 1',                   example: 'log₅5 = 1', hint: 'a¹=a always' },
]

const CONVERTER_EXAMPLES = [
  { index: '2³ = 8',    log: 'log₂8 = 3' },
  { index: '10² = 100', log: 'log₁₀100 = 2' },
  { index: '5⁰ = 1',   log: 'log₅1 = 0' },
  { index: 'eˣ = y',   log: 'ln y = x' },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LogarithmVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [convIdx, setConvIdx] = useState(0)
  const [showLog, setShowLog] = useState(false)
  const [lawIdx, setLawIdx] = useState(0)
  const [base, setBase] = useState(2)

  const accent = '#6366F1'

  const W = 240; const H = 130
  const svgX = (x: number) => 30 + (x / 4) * (W - 40)
  const svgY = (y: number) => H - 10 - ((y + 2) / 6) * (H - 20)

  const expPoints = Array.from({length:41},(_, i) => {
    const x = (i / 40) * 4
    return `${svgX(x)},${svgY(Math.pow(base, x - 2))}`
  }).join(' ')

  const logPoints = Array.from({length:35},(_, i) => {
    const x = (i / 35) * 4
    const xv = x * 3.5
    if (xv <= 0) return ''
    return `${svgX(x)},${svgY(Math.log(xv) / Math.log(base))}`
  }).filter(Boolean).join(' ')

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(99,102,241,0.2)' : 'transparent', color: tab === i ? '#818CF8' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — What is a Log? */}
        {tab === 0 && (
          <div className="space-y-4">
            <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-sm font-bold text-center" style={{ color: '#818CF8' }}>
                logₐb = x  means  aˣ = b
              </p>
              <p className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                &ldquo;Log asks: what power do I raise a to, to get b?&rdquo;
              </p>
            </div>
            <div className="flex gap-2">
              {CONVERTER_EXAMPLES.map((e, i) => (
                <button key={i} onClick={() => { setConvIdx(i); setShowLog(false) }}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-colors"
                  style={{ background: convIdx === i ? accent : 'rgba(255,255,255,0.07)', color: convIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  Ex {i+1}
                </button>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="text-center space-y-3">
                <div className="text-lg font-mono font-black" style={{ color: '#fff' }}>
                  {CONVERTER_EXAMPLES[convIdx].index}
                </div>
                <div className="text-2xl" style={{ color: 'rgba(255,255,255,0.2)' }}>⇅</div>
                <div className="text-lg font-mono font-black" style={{ color: showLog ? '#818CF8' : 'rgba(99,102,241,0.3)', filter: showLog ? 'none' : 'blur(4px)' }}>
                  {CONVERTER_EXAMPLES[convIdx].log}
                </div>
              </div>
            </div>
            <button onClick={() => setShowLog(!showLog)}
              className="w-full py-2.5 rounded-xl text-sm font-bold"
              style={{ background: showLog ? 'rgba(255,255,255,0.07)' : accent, color: showLog ? 'rgba(255,255,255,0.5)' : '#fff' }}>
              {showLog ? 'Hide log form' : 'Convert to log form'}
            </button>
          </div>
        )}

        {/* Tab 1 — Log Laws */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              {LOG_LAWS.map((l, i) => (
                <button key={i} onClick={() => setLawIdx(i)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                  style={{ background: lawIdx === i ? accent : 'rgba(255,255,255,0.07)', color: lawIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {l.name.split(' ')[0]}
                </button>
              ))}
            </div>
            <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <p className="text-sm font-black" style={{ color: '#818CF8' }}>{LOG_LAWS[lawIdx].name}</p>
              <div className="rounded-lg p-2" style={{ background: 'rgba(99,102,241,0.1)' }}>
                <p className="font-mono text-sm font-bold text-center" style={{ color: '#fff' }}>{LOG_LAWS[lawIdx].law}</p>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{LOG_LAWS[lawIdx].hint}</p>
              <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Example</p>
                <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{LOG_LAWS[lawIdx].example}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 — Graphs */}
        {tab === 2 && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                <line x1="30" y1={H-10} x2={W-5} y2={H-10} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                <line x1="30" y1="5" x2="30" y2={H-5} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                {/* y=x line (mirror) */}
                <line x1="30" y1={H-10} x2={W-30} y2="15" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3"/>
                <text x={W-25} y="20" fontSize="8" fill="rgba(255,255,255,0.2)">y=x</text>
                {/* Exponential */}
                <polyline points={expPoints} fill="none" stroke={accent} strokeWidth="2"/>
                <text x={svgX(3.5)} y={svgY(Math.pow(base,1.5))-6} fontSize="9" fill={accent}>y=aˣ</text>
                {/* Log */}
                <polyline points={logPoints} fill="none" stroke="#F59E0B" strokeWidth="2"/>
                <text x={svgX(3.6)} y={svgY(1.2)+4} fontSize="9" fill="#F59E0B">y=logₐx</text>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: accent }}>base a</span>
              <input type="range" min="2" max="5" value={base} onChange={e => setBase(Number(e.target.value))}
                className="flex-1 h-1.5 accent-indigo-500"/>
              <span className="text-xs font-mono w-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{base}</span>
            </div>
            <div className="space-y-1.5">
              {[
                { col: accent, desc: `y = ${base}ˣ: passes through (0,1), always positive, steeper for larger a` },
                { col: '#F59E0B', desc: `y = log${base}(x): passes through (1,0), never crosses y-axis` },
                { col: 'rgba(255,255,255,0.3)', desc: 'They are reflections of each other in y = x (inverse functions)' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ background: item.col }}/>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
