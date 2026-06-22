'use client'

import { useState } from 'react'

interface Props { color?: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function toX(val: number, min=-6, max=7, pxMin=20, pxMax=220): number {
  return pxMin + ((val - min) / (max - min)) * (pxMax - pxMin)
}
const TICKS = [-6, -4, -2, 0, 2, 4, 6]

// ── Tab 1: Number System Hierarchy ───────────────────────────────────────────

const NUMBER_SETS = [
  { symbol:'ℕ', name:'Natural Numbers', color:'#6366F1', examples:'1, 2, 3, 4 …', fact:'Counting numbers. Positive integers only.', r:110, cx:120, cy:120 },
  { symbol:'ℤ', name:'Integers',        color:'#8B5CF6', examples:'… −3, −2, −1, 0, 1, 2 …', fact:'Includes negatives and zero. ℕ ⊂ ℤ', r:95, cx:120, cy:120 },
  { symbol:'ℚ', name:'Rationals',       color:'#A78BFA', examples:'½, ¾, −2.5, 0.333…', fact:'Any number expressible as p/q. Includes all integers. ℤ ⊂ ℚ', r:76, cx:120, cy:120 },
  { symbol:'𝕀', name:'Irrationals',     color:'#C4B5FD', examples:'√2, π, e', fact:'Cannot be written as p/q. Decimal never terminates or repeats.', r:0, cx:0, cy:0 },
  { symbol:'ℝ', name:'Real Numbers',    color:'#E9D5FF', examples:'All of the above', fact:'ℝ = ℚ ∪ 𝕀 — every point on the number line.', r:120, cx:120, cy:120 },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NumberSystemTab({ color }: { color: string }) {
  const [active, setActive] = useState<number|null>(null)
  const info = active !== null ? NUMBER_SETS[active] : null

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.5)' }}>Tap each ring to explore the number hierarchy</p>

      <div className="flex justify-center">
        <svg viewBox="0 0 240 240" width="220" height="220">
          {/* ℝ outer ring */}
          <circle cx="120" cy="120" r="110" fill="#E9D5FF" fillOpacity="0.08" stroke="#E9D5FF" strokeWidth="1.5" strokeOpacity="0.4" style={{cursor:'pointer'}} onClick={()=>setActive(active===4?null:4)}/>
          {/* ℚ */}
          <circle cx="120" cy="120" r="95" fill="#A78BFA" fillOpacity="0.1" stroke="#A78BFA" strokeWidth="1.5" strokeOpacity="0.5" style={{cursor:'pointer'}} onClick={()=>setActive(active===2?null:2)}/>
          {/* ℤ */}
          <circle cx="120" cy="120" r="76" fill="#8B5CF6" fillOpacity="0.12" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.6" style={{cursor:'pointer'}} onClick={()=>setActive(active===1?null:1)}/>
          {/* ℕ */}
          <circle cx="120" cy="120" r="54" fill="#6366F1" fillOpacity="0.18" stroke="#6366F1" strokeWidth="1.5" strokeOpacity="0.8" style={{cursor:'pointer'}} onClick={()=>setActive(active===0?null:0)}/>

          {/* Irrational bubble — top right outside ℚ but inside ℝ */}
          <circle cx="185" cy="55" r="28" fill="#C4B5FD" fillOpacity="0.12" stroke="#C4B5FD" strokeWidth="1.5" strokeOpacity="0.6" style={{cursor:'pointer'}} onClick={()=>setActive(active===3?null:3)}/>
          <text x="185" y="50" textAnchor="middle" fill="#C4B5FD" fontSize="12" fontWeight="900" fontFamily="Nunito,sans-serif">𝕀</text>
          <text x="185" y="63" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="Nunito,sans-serif">Irrationals</text>

          {/* Labels */}
          <text x="120" y="78" textAnchor="middle" fill="#6366F1" fontSize="16" fontWeight="900" fontFamily="Nunito,sans-serif">ℕ</text>
          <text x="120" y="91" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Nunito,sans-serif">Natural</text>
          <text x="155" y="105" textAnchor="middle" fill="#8B5CF6" fontSize="14" fontWeight="900" fontFamily="Nunito,sans-serif">ℤ</text>
          <text x="155" y="116" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="Nunito,sans-serif">Integers</text>
          <text x="196" y="132" textAnchor="middle" fill="#A78BFA" fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">ℚ</text>
          <text x="196" y="142" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="Nunito,sans-serif">Rationals</text>
          <text x="55" y="195" textAnchor="middle" fill="#E9D5FF" fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">ℝ</text>
          <text x="55" y="206" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="Nunito,sans-serif">Real Numbers</text>

          {/* Highlight ring when active */}
          {active !== null && active !== 3 && (
            <circle cx="120" cy="120" r={NUMBER_SETS[active].r} fill="none" stroke={NUMBER_SETS[active].color} strokeWidth="3" strokeOpacity="0.9"/>
          )}
          {active === 3 && (
            <circle cx="185" cy="55" r="28" fill="none" stroke="#C4B5FD" strokeWidth="3" strokeOpacity="0.9"/>
          )}
        </svg>
      </div>

      {info ? (
        <div className="rounded-xl px-4 py-3 space-y-1 transition-all" style={{ background:`${info.color}18`, border:`1px solid ${info.color}55` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-black" style={{ color:info.color }}>{info.symbol}</span>
            <span className="text-sm font-black text-white">{info.name}</span>
          </div>
          <p className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.6)' }}>Examples: {info.examples}</p>
          <p className="text-xs font-bold text-white">{info.fact}</p>
        </div>
      ) : (
        <div className="rounded-xl px-4 py-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm font-bold" style={{ color:'rgba(255,255,255,0.4)' }}>Tap a ring to see what numbers it contains</p>
        </div>
      )}

      <div className="rounded-xl px-4 py-2.5" style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)' }}>
        <p className="text-xs font-bold text-white">⚡ Key fact: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ — every natural number is also an integer, rational, and real number.</p>
      </div>
    </div>
  )
}

// ── Tab 2: Interval Notation ──────────────────────────────────────────────────

const INTERVALS = [
  { label:'[a, b]', name:'Closed',     notation:'[-2, 5]',  from:-2, to:5,  openL:false, openR:false, inf:null as 'left'|'right'|null, inequality:'-2 ≤ x ≤ 5',  desc:'Both endpoints included — use ≤ (less than OR equal).' },
  { label:'(a, b)', name:'Open',       notation:'(-1, 4)',  from:-1, to:4,  openL:true,  openR:true,  inf:null, inequality:'-1 < x < 4', desc:'Both excluded — use strict < (strictly less than).' },
  { label:'[a, b)', name:'Half-open',  notation:'[0, 3)',   from:0,  to:3,  openL:false, openR:true,  inf:null, inequality:'0 ≤ x < 3',  desc:'Left included (solid), right excluded (open).' },
  { label:'(a, ∞)', name:'Unbounded right', notation:'(2, ∞)', from:2, to:7, openL:true, openR:false, inf:'right' as 'left'|'right'|null, inequality:'x > 2', desc:'∞ always uses a round bracket — it is never a fixed value.' },
  { label:'(-∞, b]',name:'Unbounded left',  notation:'(-∞, 1]', from:-6, to:1, openL:false, openR:false, inf:'left' as 'left'|'right'|null, inequality:'x ≤ 1', desc:'Extends infinitely to the left. Open arrow on the left end.' },
  { label:'(-∞,∞)', name:'All reals = ℝ', notation:'(-∞, ∞)', from:-6, to:7, openL:false, openR:false, inf:null, inequality:'x ∈ ℝ', desc:'Every real number — the entire number line.' },
]

function IntervalTab({ color }: { color: string }) {
  const [idx, setIdx] = useState(0)
  const ex = INTERVALS[idx]
  const isAllReals = ex.name === 'All reals = ℝ'
  const x1 = ex.inf === 'left' ? 16 : toX(ex.from)
  const x2 = ex.inf === 'right' ? 224 : toX(ex.to)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {INTERVALS.map((e,i) => (
          <button key={i} onClick={()=>setIdx(i)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all"
            style={i===idx ? {background:color,color:'white'} : {background:`${color}22`,color}}>
            {e.label}
          </button>
        ))}
      </div>

      {/* Number line SVG */}
      <div className="rounded-xl py-3 px-2" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <svg viewBox="0 0 240 70" width="100%" height="70">
          {/* Notation above */}
          <text x="120" y="14" textAnchor="middle" fill={color} fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">{ex.notation}</text>
          {/* Axis */}
          <line x1="14" y1="38" x2="226" y2="38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
          <polygon points="224,34 232,38 224,42" fill="rgba(255,255,255,0.2)"/>
          <polygon points="16,34 8,38 16,42" fill="rgba(255,255,255,0.2)"/>
          {/* Ticks */}
          {TICKS.map(t => (
            <g key={t}>
              <line x1={toX(t)} y1="33" x2={toX(t)} y2="43" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              <text x={toX(t)} y="58" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="Nunito,sans-serif">{t}</text>
            </g>
          ))}
          {/* Interval */}
          {isAllReals ? (
            <line x1="14" y1="38" x2="226" y2="38" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          ) : (
            <>
              <line x1={x1} y1="38" x2={x2} y2="38" stroke={color} strokeWidth="4" strokeLinecap="square"/>
              {ex.inf === 'right' && <polygon points={`${x2-5},34 ${x2+3},38 ${x2-5},42`} fill={color}/>}
              {ex.inf === 'left'  && <polygon points={`${x1+5},34 ${x1-3},38 ${x1+5},42`} fill={color}/>}
              {ex.inf !== 'left'  && (ex.openL ? <circle cx={x1} cy={38} r={5} fill="#0D1B2E" stroke={color} strokeWidth="2.5"/> : <circle cx={x1} cy={38} r={5} fill={color}/>)}
              {ex.inf !== 'right' && (ex.openR ? <circle cx={toX(ex.to)} cy={38} r={5} fill="#0D1B2E" stroke={color} strokeWidth="2.5"/> : <circle cx={toX(ex.to)} cy={38} r={5} fill={color}/>)}
            </>
          )}
        </svg>
      </div>

      {/* Inequality ↔ interval mapping */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl px-3 py-2.5 text-center" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
          <p className="text-[10px] font-black uppercase mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Inequality</p>
          <p className="text-sm font-black text-white">{ex.inequality}</p>
        </div>
        <div className="rounded-xl px-3 py-2.5 text-center" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
          <p className="text-[10px] font-black uppercase mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Interval</p>
          <p className="text-sm font-black text-white">{ex.notation}</p>
        </div>
      </div>

      <div className="rounded-xl px-4 py-2.5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-bold text-white">{ex.desc}</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14"><circle cx="7" cy="7" r="5" fill={color}/></svg>
          <span className="text-[10px] font-bold" style={{ color:'rgba(255,255,255,0.5)' }}>● Included</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14"><circle cx="7" cy="7" r="5" fill="#0D1B2E" stroke={color} strokeWidth="2"/></svg>
          <span className="text-[10px] font-bold" style={{ color:'rgba(255,255,255,0.5)' }}>○ Excluded</span>
        </div>
      </div>
    </div>
  )
}

// ── Tab 3: Inequality → Interval Quiz ────────────────────────────────────────

const QUIZ_QS = [
  { q:'x > 3',           answer:'(3, ∞)',   options:['(3, ∞)','[3, ∞)','(−∞, 3)','(−∞, 3]'], explain:'x > 3 means strictly greater, so open bracket at 3. ∞ always open.' },
  { q:'−1 ≤ x < 5',     answer:'[−1, 5)', options:['(−1, 5)','[−1, 5]','[−1, 5)','(−1, 5]'], explain:'-1 is included (≤) → [. 5 is excluded (<) → ).' },
  { q:'x ≤ 2',          answer:'(−∞, 2]', options:['(−∞, 2]','(−∞, 2)','[2, ∞)','(2, ∞)'], explain:'x ≤ 2 means any real number up to and including 2. Left side is unbounded.' },
  { q:'0 < x ≤ 6',     answer:'(0, 6]',   options:['[0, 6]','(0, 6)','(0, 6]','[0, 6)'], explain:'0 is excluded (strict <) → (, but 6 is included (≤) → ].' },
  { q:'x ∈ ℝ',          answer:'(−∞, ∞)', options:['(−∞, ∞)','[−∞, ∞]','(0, ∞)','(−∞, 0)'], explain:'All real numbers means the entire number line — both ends unbounded.' },
]

function QuizTab({ color }: { color: string }) {
  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<string|null>(null)
  const q = QUIZ_QS[qi]
  const correct = selected === q.answer
  const answered = selected !== null

  function next() { setQi(i => (i+1) % QUIZ_QS.length); setSelected(null) }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.4)' }}>Question {qi+1} of {QUIZ_QS.length}</p>
        <div className="flex gap-1">
          {QUIZ_QS.map((_,i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i===qi ? color : `${color}33` }}/>)}
        </div>
      </div>

      <div className="rounded-xl px-4 py-4 text-center" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
        <p className="text-[11px] font-black uppercase mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Write in interval notation:</p>
        <p className="text-2xl font-black text-white">{q.q}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {q.options.map(opt => {
          const isSelected = selected === opt
          const isCorrect = opt === q.answer
          let bg = `${color}22`
          let border = `${color}33`
          let textCol = color
          if (answered) {
            if (isCorrect)             { bg = 'rgba(52,211,153,0.2)'; border = '#34D399'; textCol = '#34D399' }
            else if (isSelected)       { bg = 'rgba(248,113,113,0.2)'; border = '#F87171'; textCol = '#F87171' }
            else                       { bg = 'rgba(255,255,255,0.04)'; border = 'rgba(255,255,255,0.08)'; textCol = 'rgba(255,255,255,0.3)' }
          }
          return (
            <button key={opt} disabled={answered} onClick={()=>setSelected(opt)}
              className="py-3 rounded-xl text-sm font-black transition-all"
              style={{ background:bg, border:`1px solid ${border}`, color:textCol }}>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="rounded-xl px-4 py-3 space-y-1" style={{ background: correct ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${correct ? '#34D399' : '#F87171'}44` }}>
          <p className="text-sm font-black" style={{ color: correct ? '#34D399' : '#F87171' }}>{correct ? '✓ Correct!' : `✗ It was ${q.answer}`}</p>
          <p className="text-xs font-bold text-white">{q.explain}</p>
        </div>
      )}

      {answered && (
        <button onClick={next} className="w-full py-3 rounded-xl text-sm font-black text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
          {qi === QUIZ_QS.length-1 ? 'Restart Quiz' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

type Tab = 'system' | 'intervals' | 'quiz'

export default function NumberLineVisual({ color = '#8B5CF6' }: Props) {
  const [tab, setTab] = useState<Tab>('system')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'system',    label: '🔢 Number Systems' },
    { id: 'intervals', label: '📏 Interval Notation' },
    { id: 'quiz',      label: '🧠 Quick Quiz' },
  ]

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Interactive — Real Numbers & Intervals
      </p>

      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
            style={tab === t.id ? { background: color, color: 'white' } : { background: `${color}22`, color }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'system'    && <NumberSystemTab color={color} />}
      {tab === 'intervals' && <IntervalTab color={color} />}
      {tab === 'quiz'      && <QuizTab color={color} />}
    </div>
  )
}
