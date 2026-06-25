'use client'
import { useState } from 'react'

const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1)
const nPr = (n: number, r: number) => factorial(n) / factorial(n - r)
const nCr = (n: number, r: number) => factorial(n) / (factorial(r) * factorial(n - r))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CombinatoricsVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [factN, setFactN] = useState(4)
  const [permN, setPermN] = useState(5)
  const [permR, setPermR] = useState(3)
  const [combN, setCombN] = useState(5)
  const [combR, setCombR] = useState(3)

  const accent = '#F59E0B'

  const factValue = factorial(factN)
  const permValue = nPr(permN, permR)
  const combValue = nCr(combN, combR)

  // Factorial breakdown string
  const factStr = Array.from({length: factN}, (_, i) => factN - i).join(' × ')

  // Pascal's triangle rows
  const pascalRows = Array.from({length: Math.min(combN+1, 8)}, (_, row) =>
    Array.from({length: row+1}, (_, col) => nCr(row, col))
  )

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
      <div className="flex border-b" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        {['Factorial', 'Permutations nPr', 'Combinations nCr'].map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(245,158,11,0.2)' : 'transparent', color: tab === i ? '#FCD34D' : 'rgba(255,255,255,0.4)' }}>
            {['Factorial', 'nPr', 'nCr'][i]}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — Factorial */}
        {tab === 0 && (
          <div className="space-y-4">
            <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-sm text-center font-bold" style={{ color: '#FCD34D' }}>n! = n × (n−1) × (n−2) × … × 1</p>
              <p className="text-[11px] text-center mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Counts how many ways to arrange n distinct items</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: accent }}>n</span>
              <input type="range" min="1" max="8" value={factN} onChange={e => setFactN(Number(e.target.value))}
                className="flex-1 h-1.5 accent-yellow-500"/>
              <span className="text-xs font-mono w-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{factN}</span>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="font-mono text-base mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>{factN}! = {factStr}</div>
              <div className="font-mono text-3xl font-black" style={{ color: accent }}>{factValue.toLocaleString()}</div>
            </div>
            {/* Visualise as grid of arrangements */}
            <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs font-bold" style={{ color: '#FCD34D' }}>Why it grows so fast</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Choosing 1st item: {factN} options. Then {factN-1} for 2nd. Then {Math.max(1,factN-2)} for 3rd…
                Each choice multiplies the total.
              </p>
            </div>
            {/* Quick table */}
            <div className="grid grid-cols-4 gap-1.5">
              {[1,2,3,4,5,6,7,8].map(n => (
                <div key={n} className="rounded-lg p-1.5 text-center" style={{ background: n === factN ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.2)' }}>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{n}!</div>
                  <div className="text-xs font-mono font-bold" style={{ color: n === factN ? accent : 'rgba(255,255,255,0.5)' }}>{factorial(n)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1 — Permutations */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-lg font-mono font-black" style={{ color: accent }}>ⁿPᵣ = n! / (n−r)!</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Ordered selections — order MATTERS</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'n (pool)', val: permN, set: setPermN, max: 10 }, { label: 'r (pick)', val: permR, set: setPermR, max: permN }].map(sl => (
                <div key={sl.label} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>{sl.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: accent }}>{sl.val}</span>
                  </div>
                  <input type="range" min="0" max={sl.max} value={sl.val} onChange={e => sl.set(Number(e.target.value))}
                    className="w-full h-1.5 accent-yellow-500"/>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="font-mono text-base mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {permN}P{permR} = {permN}! / ({permN}−{permR})! = {factorial(permN)} / {factorial(permN-permR)}
              </div>
              <div className="text-3xl font-mono font-black" style={{ color: accent }}>{permValue.toLocaleString()}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs font-bold" style={{ color: '#FCD34D' }}>Example</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                How many 3-digit codes from digits 1–{permN}? Each digit different, order matters → {permN}P3 = {nPr(permN,Math.min(3,permN)).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2 — Combinations */}
        {tab === 2 && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <p className="text-lg font-mono font-black" style={{ color: accent }}>ⁿCᵣ = n! / r!(n−r)!</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Unordered selections — order does NOT matter</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'n (pool)', val: combN, set: setCombN, max: 7 }, { label: 'r (pick)', val: combR, set: setCombR, max: combN }].map(sl => (
                <div key={sl.label} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>{sl.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: accent }}>{sl.val}</span>
                  </div>
                  <input type="range" min="0" max={sl.max} value={sl.val} onChange={e => sl.set(Number(e.target.value))}
                    className="w-full h-1.5 accent-yellow-500"/>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="text-3xl font-mono font-black" style={{ color: accent }}>{combValue.toLocaleString()}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{combN}C{combR} ways to choose {combR} from {combN}</div>
            </div>
            {/* Pascal's triangle */}
            <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>Pascal&apos;s Triangle — each entry is ⁿCᵣ</p>
            <div className="space-y-1 overflow-x-auto">
              {pascalRows.map((row, r) => (
                <div key={r} className="flex justify-center gap-1">
                  {row.map((val, c) => (
                    <div key={c} className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                      style={{ background: r === combN && c === combR ? accent : 'rgba(255,255,255,0.07)', color: r === combN && c === combR ? '#000' : 'rgba(255,255,255,0.6)' }}>
                      {val}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
