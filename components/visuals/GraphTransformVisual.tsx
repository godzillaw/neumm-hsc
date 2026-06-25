'use client'
import { useState } from 'react'

const TABS = ['Translations', 'Reflections & Dilations', 'Absolute Value']

const BASE_FNS = [
  { label: 'x²', fn: (x: number) => x * x },
  { label: '|x|', fn: (x: number) => Math.abs(x) },
  { label: 'x³', fn: (x: number) => x * x * x },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function GraphTransformVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [baseIdx, setBaseIdx] = useState(0)
  const [h, setH] = useState(0)
  const [k, setK] = useState(0)
  const [reflX, setReflX] = useState(false)
  const [reflY, setReflY] = useState(false)
  const [scale, setScale] = useState(1)
  const [absMode, setAbsMode] = useState<'outside' | 'inside'>('outside')

  const accent = '#0EA5E9'
  const W = 240; const H = 140
  const cx = W / 2; const cy = H / 2
  const sc = 28

  const svgX = (x: number) => cx + x * sc
  const svgY = (y: number) => cy - y * sc

  const baseFn = BASE_FNS[baseIdx].fn

  const transformedFn = (x: number) => {
    const xIn = reflY ? -(x - h) : (x - h)
    let y = baseFn(xIn) * scale + k
    if (reflX) y = -y
    return y
  }

  const points = (fn: (x: number) => number, col: string, dash = false) => {
    const pts = Array.from({length: 41}, (_, i) => {
      const x = (i - 20) / 5
      const y = fn(x)
      if (Math.abs(y) > 4) return null
      return `${svgX(x)},${svgY(y)}`
    }).filter(Boolean)
    // Split at nulls (gaps)
    return <polyline key={col} points={pts.join(' ')} fill="none" stroke={col} strokeWidth={dash ? 1.5 : 2} strokeDasharray={dash ? '4' : undefined}/>
  }

  // Absolute value tab
  const absFn = (x: number) => {
    if (absMode === 'outside') return Math.abs(baseFn(x))
    return baseFn(Math.abs(x))
  }

  const transformLabel = () => {
    const fnName = BASE_FNS[baseIdx].label
    let inner = reflY ? `−(x${h !== 0 ? `${h > 0 ? '−' : '+'}${Math.abs(h)}` : ''})` : `(x${h !== 0 ? `${h > 0 ? '−' : '+'}${Math.abs(h)}` : ''})`
    if (h === 0 && !reflY) inner = 'x'
    let result = `${scale !== 1 ? scale : ''}f(${inner})`
    if (scale === 1) result = `f(${inner})`
    if (reflX) result = `-${result}`
    if (k !== 0) result += ` ${k > 0 ? '+' : '−'} ${Math.abs(k)}`
    return `y = ${result} where f(x) = ${fnName}`
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(14,165,233,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(14,165,233,0.2)' : 'transparent', color: tab === i ? '#38BDF8' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Base function selector */}
        <div className="flex gap-2 mb-3">
          {BASE_FNS.map((f, i) => (
            <button key={f.label} onClick={() => setBaseIdx(i)}
              className="px-3 py-1 rounded-lg text-xs font-mono font-bold"
              style={{ background: baseIdx === i ? accent : 'rgba(255,255,255,0.07)', color: baseIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              f(x) = {f.label}
            </button>
          ))}
        </div>

        {/* Tab 0 — Translations */}
        {tab === 0 && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                <line x1="0" y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <line x1={cx} y1="0" x2={cx} y2={H} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                {points(baseFn, 'rgba(255,255,255,0.3)', true)}
                {points(transformedFn, accent)}
              </svg>
            </div>
            {[
              { label: 'h (horizontal shift)', val: h, set: setH, min: -3, max: 3, hint: h > 0 ? `Right ${h}` : h < 0 ? `Left ${Math.abs(h)}` : 'No shift' },
              { label: 'k (vertical shift)', val: k, set: setK, min: -3, max: 3, hint: k > 0 ? `Up ${k}` : k < 0 ? `Down ${Math.abs(k)}` : 'No shift' },
            ].map(sl => (
              <div key={sl.label} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{sl.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: accent }}>{sl.hint}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} value={sl.val} onChange={e => sl.set(Number(e.target.value))}
                  className="w-full h-1.5 accent-sky-500"/>
              </div>
            ))}
            <div className="rounded-lg p-2" style={{ background: 'rgba(14,165,233,0.1)' }}>
              <p className="text-[11px] font-mono" style={{ color: '#38BDF8' }}>{transformLabel()}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>y → y + k</p>
                <p className="text-xs font-bold" style={{ color: accent }}>Vertical: outside f</p>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>x → x − h</p>
                <p className="text-xs font-bold" style={{ color: accent }}>Horizontal: inside f</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1 — Reflections & Dilations */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                <line x1="0" y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <line x1={cx} y1="0" x2={cx} y2={H} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                {points(baseFn, 'rgba(255,255,255,0.3)', true)}
                {points(transformedFn, accent)}
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setReflX(!reflX)}
                className="py-2 rounded-xl text-xs font-bold transition-colors"
                style={{ background: reflX ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.07)', border: `1px solid ${reflX ? accent : 'transparent'}`, color: reflX ? '#38BDF8' : 'rgba(255,255,255,0.5)' }}>
                {reflX ? '✓' : '○'} Reflect in x-axis
              </button>
              <button onClick={() => setReflY(!reflY)}
                className="py-2 rounded-xl text-xs font-bold transition-colors"
                style={{ background: reflY ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.07)', border: `1px solid ${reflY ? accent : 'transparent'}`, color: reflY ? '#38BDF8' : 'rgba(255,255,255,0.5)' }}>
                {reflY ? '✓' : '○'} Reflect in y-axis
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Vertical dilation (a)</span>
                <span className="text-xs font-mono font-bold" style={{ color: accent }}>×{scale}</span>
              </div>
              <input type="range" min="1" max="4" value={scale} onChange={e => setScale(Number(e.target.value))}
                className="w-full h-1.5 accent-sky-500"/>
            </div>
            <div className="space-y-1.5">
              {[
                { col: 'rgba(255,255,255,0.4)', text: 'Original f(x)' },
                { col: accent, text: reflX ? '-f(x) — flip vertically (in x-axis)' : reflY ? 'f(-x) — flip horizontally (in y-axis)' : `${scale}f(x) — stretch vertically by ${scale}` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-0.5" style={{ background: item.col, borderTop: i === 0 ? '2px dashed' : undefined }}/>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2 — Absolute Value */}
        {tab === 2 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {([['outside', '|f(x)|'], ['inside', 'f(|x|)']] as const).map(([mode, label]) => (
                <button key={mode} onClick={() => setAbsMode(mode)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold"
                  style={{ background: absMode === mode ? accent : 'rgba(255,255,255,0.07)', color: absMode === mode ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  y = {label}
                </button>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                <line x1="0" y1={cy} x2={W} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <line x1={cx} y1="0" x2={cx} y2={H} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                {points(baseFn, 'rgba(255,255,255,0.3)', true)}
                {points(absFn, accent)}
              </svg>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
              {absMode === 'outside' ? (
                <>
                  <p className="text-xs font-bold" style={{ color: '#38BDF8' }}>|f(x)| — reflects negative y-values up</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Any part of the curve below the x-axis gets flipped above it. Nothing goes negative.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold" style={{ color: '#38BDF8' }}>f(|x|) — reflects the right half onto the left</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Input |x| means negative x values behave like positive ones → graph is symmetric about y-axis.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
