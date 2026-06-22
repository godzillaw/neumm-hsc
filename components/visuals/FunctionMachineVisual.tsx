'use client'

import { useState } from 'react'

// Interactive function machine for Stage 3A: Functions and Function Notation
// Shows: input → function rule → output, plus vertical line test

interface Props {
  color?: string
}

const FUNCTIONS = [
  { label: 'f(x) = x²',      fn: (x: number) => x * x,          rule: 'Square the input' },
  { label: 'f(x) = 2x + 1',  fn: (x: number) => 2 * x + 1,      rule: 'Double, then add 1' },
  { label: 'f(x) = x² − 3',  fn: (x: number) => x * x - 3,      rule: 'Square, then subtract 3' },
]

const INPUTS = [-3, -2, -1, 0, 1, 2, 3]

// Mini graph points for vertical line test demonstration
type GraphType = 'function' | 'not-function'

const GRAPH_DEMOS: { type: GraphType; label: string; desc: string; points: [number, number][] }[] = [
  {
    type: 'function',
    label: 'y = x²  ✓',
    desc: 'Every vertical line crosses the graph at most once. This IS a function.',
    points: [[-3,9],[-2,4],[-1,1],[0,0],[1,1],[2,4],[3,9]],
  },
  {
    type: 'not-function',
    label: 'x² + y² = 9  ✗',
    desc: 'A vertical line through x=0 crosses at y=3 AND y=−3. This is NOT a function.',
    points: Array.from({ length: 37 }, (_, i) => {
      const angle = (i / 36) * 2 * Math.PI
      return [3 * Math.cos(angle), 3 * Math.sin(angle)] as [number, number]
    }),
  },
]

// Map domain [-3,3] x [-1,9] to SVG coords
function toSvgX(v: number, minV = -3, maxV = 3, minPx = 10, maxPx = 130): number {
  return minPx + ((v - minV) / (maxV - minV)) * (maxPx - minPx)
}
function toSvgY(v: number, minV = -1, maxV = 9, minPx = 110, maxPx = 10): number {
  return minPx + ((v - minV) / (maxV - minV)) * (maxPx - minPx)
}
function toCircleX(v: number): number {
  return 70 + (v / 3) * 55
}
function toCircleY(v: number): number {
  return 60 - (v / 3) * 55
}

export default function FunctionMachineVisual({ color = '#0EA5E9' }: Props) {
  const [tab, setTab] = useState<'machine' | 'vlt'>('machine')
  const [fnIdx, setFnIdx] = useState(0)
  const [inputVal, setInputVal] = useState(2)
  const [graphIdx, setGraphIdx] = useState(0)
  const [vtLineX, setVtLineX] = useState<number | null>(null)

  const { fn, rule, label } = FUNCTIONS[fnIdx]
  const output = fn(inputVal)
  const graph = GRAPH_DEMOS[graphIdx]

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Visual — Function Explorer
      </p>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(['machine', 'vlt'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-xs font-black transition-all"
            style={tab === t
              ? { background: color, color: 'white' }
              : { background: `${color}22`, color }
            }
          >
            {t === 'machine' ? '⚙️ Function Machine' : '📏 Vertical Line Test'}
          </button>
        ))}
      </div>

      {tab === 'machine' && (
        <>
          {/* Function selector */}
          <div className="flex gap-1.5 flex-wrap">
            {FUNCTIONS.map((f, i) => (
              <button
                key={i}
                onClick={() => setFnIdx(i)}
                className="px-3 py-1 rounded-lg text-[11px] font-black transition-all"
                style={i === fnIdx
                  ? { background: color, color: 'white' }
                  : { background: `${color}22`, color }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Machine diagram */}
          <div className="flex items-center gap-2 justify-center">
            {/* Input */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-black uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>INPUT x</p>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                style={{ background: `${color}33`, border: `2px solid ${color}` }}>
                {inputVal}
              </div>
            </div>

            {/* Arrow in */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-0.5" style={{ background: color }} />
              <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${color}` }} />
            </div>

            {/* Machine box */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-black uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>RULE</p>
              <div className="w-24 h-14 rounded-2xl flex flex-col items-center justify-center px-2"
                style={{ background: `${color}44`, border: `2px solid ${color}88` }}>
                <p className="text-[10px] font-bold text-white text-center leading-tight">{rule}</p>
                <p className="text-[11px] font-black mt-0.5" style={{ color }}>{label}</p>
              </div>
            </div>

            {/* Arrow out */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-0.5" style={{ background: '#34D399' }} />
              <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #34D399' }} />
            </div>

            {/* Output */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-black uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>OUTPUT</p>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                style={{ background: 'rgba(52,211,153,0.2)', border: '2px solid #34D399' }}>
                {output}
              </div>
            </div>
          </div>

          {/* f(x) notation */}
          <div className="rounded-xl px-4 py-2.5 text-center"
            style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
            <p className="text-sm font-black text-white">
              f({inputVal}) = {label.split('= ')[1].replace(/x/g, `(${inputVal})`)} = <span style={{ color: '#34D399' }}>{output}</span>
            </p>
          </div>

          {/* Input slider */}
          <div>
            <p className="text-[11px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Try different inputs:</p>
            <div className="flex gap-1.5 flex-wrap">
              {INPUTS.map(v => (
                <button
                  key={v}
                  onClick={() => setInputVal(v)}
                  className="w-9 h-9 rounded-xl text-sm font-black transition-all"
                  style={v === inputVal
                    ? { background: color, color: 'white' }
                    : { background: `${color}22`, color }
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Key insight: one input always gives exactly ONE output. That&apos;s what makes it a function.
          </p>
        </>
      )}

      {tab === 'vlt' && (
        <>
          {/* Graph selector */}
          <div className="flex gap-2">
            {GRAPH_DEMOS.map((g, i) => (
              <button
                key={i}
                onClick={() => { setGraphIdx(i); setVtLineX(null) }}
                className="flex-1 py-2 rounded-xl text-xs font-black transition-all"
                style={i === graphIdx
                  ? { background: i === 0 ? '#34D399' : '#F87171', color: 'white' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }
                }
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Graph SVG */}
          <div className="flex justify-center">
            <svg
              viewBox="0 0 140 120"
              width="200"
              height="170"
              style={{ cursor: 'crosshair' }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                const relX = ((e.clientX - rect.left) / rect.width) * 140
                setVtLineX(Math.max(10, Math.min(130, relX)))
              }}
              onMouseLeave={() => setVtLineX(null)}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                const relX = ((e.clientX - rect.left) / rect.width) * 140
                setVtLineX(Math.max(10, Math.min(130, relX)))
              }}
            >
              {/* Axes */}
              <line x1="10" y1="60" x2="130" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="70" y1="10" x2="70" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

              {/* Graph curve */}
              {graphIdx === 0 ? (
                <polyline
                  points={graph.points.map(([x, y]) => `${toSvgX(x)},${toSvgY(y)}`).join(' ')}
                  fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"
                />
              ) : (
                <polyline
                  points={graph.points.map(([x, y]) => `${toCircleX(x)},${toCircleY(y)}`).join(' ')}
                  fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinejoin="round"
                />
              )}

              {/* Vertical test line */}
              {vtLineX !== null && (
                <>
                  <line
                    x1={vtLineX} y1="10" x2={vtLineX} y2="110"
                    stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="4,2"
                  />
                  {/* Intersection dots */}
                  {graphIdx === 0
                    ? (() => {
                        const xVal = ((vtLineX - 10) / 120) * 6 - 3
                        const yVal = xVal * xVal
                        if (yVal > 9) return null
                        return <circle cx={vtLineX} cy={toSvgY(yVal)} r="4" fill="#FBBF24" />
                      })()
                    : (() => {
                        const xVal = ((vtLineX - 10) / 120) * 8 - 4
                        const normX = xVal / 3
                        if (Math.abs(normX) > 1) return null
                        const yAbs = Math.sqrt(1 - normX * normX) * 55
                        return (
                          <>
                            <circle cx={vtLineX} cy={60 - yAbs} r="4" fill="#FBBF24" />
                            <circle cx={vtLineX} cy={60 + yAbs} r="4" fill="#FBBF24" />
                            <text x={vtLineX + 4} y={60 - yAbs - 4} fill="#FBBF24" fontSize="8" fontWeight="800">2 points!</text>
                          </>
                        )
                      })()
                  }
                </>
              )}
            </svg>
          </div>

          <div className="rounded-xl px-4 py-3"
            style={{ background: graphIdx === 0 ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)', border: `1px solid ${graphIdx === 0 ? '#34D399' : '#F87171'}44` }}>
            <p className="text-sm font-bold text-white leading-snug">{graph.desc}</p>
          </div>

          <p className="text-[11px] font-bold text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Hover or tap the graph to draw a vertical line
          </p>
        </>
      )}
    </div>
  )
}
