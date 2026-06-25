'use client'
import { useState } from 'react'

const TABS = ['SOH-CAH-TOA', 'Unit Circle', 'Exact Values']

const EXACT: Record<number, { sin: string; cos: string; tan: string }> = {
  0:  { sin: '0',      cos: '1',       tan: '0' },
  30: { sin: '½',      cos: '√3/2',    tan: '1/√3' },
  45: { sin: '√2/2',  cos: '√2/2',    tan: '1' },
  60: { sin: '√3/2',  cos: '½',       tan: '√3' },
  90: { sin: '1',      cos: '0',       tan: 'undefined' },
}

const ANGLES = [0, 30, 45, 60, 90]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TrigonometryVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [selected, setSelected] = useState<'sin' | 'cos' | 'tan'>('sin')
  const [ucAngle, setUcAngle] = useState(30)
  const [exactAngle, setExactAngle] = useState(30)
  const [revealed, setRevealed] = useState(false)

  const accent = '#F97316'
  const rad = (ucAngle * Math.PI) / 180
  const sinV = Math.sin(rad)
  const cosV = Math.cos(rad)
  const cx = 120; const cy = 100; const r = 70

  const px = cx + r * cosV
  const py = cy - r * sinV

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(249,115,22,0.2)' : 'transparent', color: tab === i ? '#FB923C' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — SOH-CAH-TOA */}
        {tab === 0 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['sin', 'cos', 'tan'] as const).map(r => (
                <button key={r} onClick={() => setSelected(r)}
                  className="flex-1 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors"
                  style={{ background: selected === r ? accent : 'rgba(255,255,255,0.07)', color: selected === r ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {r}
                </button>
              ))}
            </div>
            {/* Triangle SVG */}
            <div className="rounded-xl overflow-hidden flex justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox="0 0 220 150" className="w-full max-w-xs">
                {/* Triangle */}
                <polygon points="30,120 190,120 190,30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                {/* Right angle marker */}
                <polyline points="180,120 180,110 190,110" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
                {/* Angle θ arc */}
                <path d="M 50,120 A 20,20 0 0,0 42,104" fill="none" stroke={accent} strokeWidth="1.5"/>
                <text x="55" y="112" fontSize="12" fill={accent} fontWeight="bold">θ</text>
                {/* Labels */}
                <text x="108" y="136" textAnchor="middle" fontSize="11" fill={selected === 'cos' ? accent : 'rgba(255,255,255,0.4)'} fontWeight="bold">Adjacent</text>
                <text x="200" y="82" textAnchor="middle" fontSize="11" fill={selected === 'sin' ? accent : 'rgba(255,255,255,0.4)'} fontWeight="bold">Opp</text>
                <text x="108" y="72" textAnchor="middle" fontSize="11" fill={selected === 'tan' || selected === 'sin' || selected === 'cos' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)'} fontWeight="bold">Hyp</text>
                {/* Highlight relevant sides */}
                {selected === 'sin' && <>
                  <line x1="190" y1="30" x2="190" y2="120" stroke={accent} strokeWidth="3"/>
                  <line x1="30" y1="120" x2="190" y2="30" stroke="rgba(249,115,22,0.4)" strokeWidth="2" strokeDasharray="4"/>
                </>}
                {selected === 'cos' && <>
                  <line x1="30" y1="120" x2="190" y2="120" stroke={accent} strokeWidth="3"/>
                  <line x1="30" y1="120" x2="190" y2="30" stroke="rgba(249,115,22,0.4)" strokeWidth="2" strokeDasharray="4"/>
                </>}
                {selected === 'tan' && <>
                  <line x1="190" y1="30" x2="190" y2="120" stroke={accent} strokeWidth="3"/>
                  <line x1="30" y1="120" x2="190" y2="120" stroke="#38B2AC" strokeWidth="3"/>
                </>}
              </svg>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
              {selected === 'sin' && <><p className="text-2xl font-mono font-black" style={{ color: accent }}>sin θ = Opp / Hyp</p><p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>S — O/H</p></>}
              {selected === 'cos' && <><p className="text-2xl font-mono font-black" style={{ color: accent }}>cos θ = Adj / Hyp</p><p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>C — A/H</p></>}
              {selected === 'tan' && <><p className="text-2xl font-mono font-black" style={{ color: accent }}>tan θ = Opp / Adj</p><p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>T — O/A</p></>}
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <p className="text-sm font-black tracking-widest" style={{ color: '#FB923C' }}>SOH  –  CAH  –  TOA</p>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Some Old Hags — Can&apos;t Always Hide — Their Old Age</p>
            </div>
          </div>
        )}

        {/* Tab 1 — Unit Circle */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox="0 0 240 200" className="w-full">
                {/* Axes */}
                <line x1="20" y1={cy} x2="220" y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <line x1={cx} y1="10" x2={cx} y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* Circle */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                {/* Radius to point */}
                <line x1={cx} y1={cy} x2={px} y2={py} stroke={accent} strokeWidth="2"/>
                {/* sin line (vertical) */}
                <line x1={px} y1={cy} x2={px} y2={py} stroke="#38B2AC" strokeWidth="2" strokeDasharray="3"/>
                {/* cos line (horizontal) */}
                <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#A78BFA" strokeWidth="2" strokeDasharray="3"/>
                {/* Point on circle */}
                <circle cx={px} cy={py} r="5" fill={accent}/>
                {/* Labels */}
                <text x={px + 6} y={py - 4} fontSize="10" fill={accent}>({cosV.toFixed(2)}, {sinV.toFixed(2)})</text>
                <text x={px + 6} y={(cy + py) / 2} fontSize="10" fill="#38B2AC">sin θ = {sinV.toFixed(2)}</text>
                <text x={(cx + px) / 2} y={cy + 14} fontSize="10" fill="#A78BFA" textAnchor="middle">cos θ = {cosV.toFixed(2)}</text>
                {/* Angle label */}
                <text x={cx + 15} y={cy - 8} fontSize="10" fill={accent}>{ucAngle}°</text>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: accent }}>θ</span>
              <input type="range" min="0" max="360" value={ucAngle}
                onChange={e => setUcAngle(Number(e.target.value))}
                className="flex-1 h-1.5 accent-orange-500"/>
              <span className="text-xs font-mono w-8" style={{ color: 'rgba(255,255,255,0.7)' }}>{ucAngle}°</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'cos θ', val: cosV.toFixed(3), col: '#A78BFA' },
                { label: 'sin θ', val: sinV.toFixed(3), col: '#38B2AC' },
                { label: 'tan θ', val: Math.abs(cosV) < 0.01 ? '∞' : (sinV/cosV).toFixed(3), col: accent },
              ].map(v => (
                <div key={v.label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{v.label}</div>
                  <div className="text-sm font-mono font-bold" style={{ color: v.col }}>{v.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2 — Exact Values */}
        {tab === 2 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Tap an angle to test yourself — then reveal.</p>
            <div className="flex gap-2">
              {ANGLES.map(ang => (
                <button key={ang} onClick={() => { setExactAngle(ang); setRevealed(false) }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors"
                  style={{ background: exactAngle === ang ? accent : 'rgba(255,255,255,0.07)', color: exactAngle === ang ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {ang}°
                </button>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="py-2 px-3 text-left text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>Ratio</th>
                    <th className="py-2 px-3 text-center text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {(['sin', 'cos', 'tan'] as const).map(r => (
                    <tr key={r} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-3 px-3 font-mono font-bold" style={{ color: accent }}>{r} {exactAngle}°</td>
                      <td className="py-3 px-3 text-center font-mono font-bold" style={{ color: revealed ? '#fff' : 'transparent', background: revealed ? 'transparent' : 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                        {EXACT[exactAngle][r]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setRevealed(!revealed)}
              className="w-full py-2.5 rounded-xl text-sm font-bold"
              style={{ background: revealed ? 'rgba(255,255,255,0.07)' : accent, color: revealed ? 'rgba(255,255,255,0.5)' : '#fff' }}>
              {revealed ? 'Hide Answers' : 'Reveal Answers'}
            </button>
            <div className="rounded-xl p-3" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <p className="text-xs font-bold" style={{ color: '#FB923C' }}>Memory trick — the 1-2-3 pattern</p>
              <p className="text-xs mt-1 font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                sin 0°,30°,45°,60°,90° = √0/2, √1/2, √2/2, √3/2, √4/2
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
