'use client'

import { useState } from 'react'

interface Props { color?: string }

// ── Tab 1: FOIL step-through ──────────────────────────────────────────────────

const FOIL_STEPS = [
  { label: 'Setup',    highlight: null as string|null, desc: 'A rectangle with width (x + 2) and height (x + 3). Its total area = (x + 2)(x + 3). We\'ll find it by splitting the rectangle into four regions.' },
  { label: 'First',   highlight: 'tl', desc: 'FIRST: x × x = x²  (top-left region — both x sides multiply together)' },
  { label: 'Outer',   highlight: 'tr', desc: 'OUTER: x × 3 = 3x  (top-right — the far ends of each bracket)' },
  { label: 'Inner',   highlight: 'bl', desc: 'INNER: 2 × x = 2x  (bottom-left — the inner terms)' },
  { label: 'Last',    highlight: 'br', desc: 'LAST: 2 × 3 = 6  (bottom-right — both constant terms)' },
  { label: 'Collect', highlight: 'all', desc: 'Add all four regions: x² + 3x + 2x + 6 = x² + 5x + 6  ✓' },
]

function cellOp(step: typeof FOIL_STEPS[0], key: string) {
  if (step.highlight === 'all' || step.highlight === key) return 1
  return step.highlight === null ? 0.18 : 0.12
}

function FOILTab({ color }: { color: string }) {
  const [step, setStep] = useState(0)
  const s = FOIL_STEPS[step]
  const colors = { tl: '#6366F1', tr: '#8B5CF6', bl: '#A78BFA', br: '#C4B5FD' }

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <svg viewBox="0 0 260 210" width="100%" height="180">
          {/* Column labels */}
          <text x="90" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Nunito,sans-serif">x</text>
          <text x="190" y="16" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Nunito,sans-serif">2</text>
          {/* Row labels */}
          <text x="16" y="90" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Nunito,sans-serif">x</text>
          <text x="16" y="175" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Nunito,sans-serif">3</text>
          {/* Border */}
          <rect x="30" y="24" width="220" height="176" rx="6" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
          <line x1="140" y1="24" x2="140" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          <line x1="30" y1="120" x2="250" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          {/* Cells */}
          {([['tl','x²',85,77],['tr','2x',195,77],['bl','3x',85,165],['br','6',195,165]] as [string,string,number,number][]).map(([k,t,cx,cy])=>(
            <g key={k} style={{ transition: 'opacity 0.3s' }} opacity={cellOp(s, k)}>
              <rect x={k[1]==='l'?31:141} y={k[0]==='t'?25:121} width={k[1]==='l'?108:108} height={94} rx="4" fill={(colors as Record<string,string>)[k]}/>
              <text x={cx} y={cy} textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="Nunito,sans-serif">{t}</text>
            </g>
          ))}
          {/* FOIL labels when highlighting */}
          {s.highlight && s.highlight !== 'all' && (
            <text x="140" y="208" textAnchor="middle" fill={color} fontSize="11" fontWeight="800" fontFamily="Nunito,sans-serif">
              {s.label === 'First' ? 'F' : s.label === 'Outer' ? 'O' : s.label === 'Inner' ? 'I' : 'L'} — {
                s.highlight==='tl' ? 'x × x' : s.highlight==='tr' ? 'x × 2' : s.highlight==='bl' ? '3 × x' : '3 × 2'
              }
            </text>
          )}
          {s.highlight === 'all' && (
            <text x="140" y="208" textAnchor="middle" fill="#34D399" fontSize="11" fontWeight="800" fontFamily="Nunito,sans-serif">
              x² + 2x + 3x + 6 = x² + 5x + 6
            </text>
          )}
        </svg>
      </div>
      <div className="rounded-xl px-4 py-3 min-h-[60px] flex items-center" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <p className="text-sm font-bold text-white leading-snug">{s.desc}</p>
      </div>
      <div className="flex items-center gap-2">
        <button disabled={step===0} onClick={()=>setStep(s=>s-1)} className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-30" style={{ background:`${color}33`, color }}>←</button>
        <div className="flex-1 flex gap-1 justify-center">
          {FOIL_STEPS.map((_,i)=>(
            <button key={i} onClick={()=>setStep(i)} className="rounded-full transition-all" style={{ width:i===step?20:8, height:8, background:i===step?color:`${color}44` }}/>
          ))}
        </div>
        <button disabled={step===FOIL_STEPS.length-1} onClick={()=>setStep(s=>s+1)} className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-30" style={{ background:`${color}33`, color }}>→</button>
      </div>
      <p className="text-center text-[11px] font-bold" style={{ color:'rgba(255,255,255,0.3)' }}>Step {step+1} of {FOIL_STEPS.length} · {s.label}</p>
    </div>
  )
}

// ── Tab 2: Special Identities ─────────────────────────────────────────────────

const IDENTITIES = [
  {
    name: '(a+b)²',
    label: 'Perfect Square — Sum',
    formula: '(a + b)² = a² + 2ab + b²',
    example: '(x + 3)² = x² + 6x + 9',
    mistake: 'Common mistake: (x+3)² ≠ x² + 9 (you MUST include the 2ab middle term!)',
    color: '#6366F1',
    steps: ['(x+3)² = (x+3)(x+3)', '= x²+ 3x + 3x + 9   [FOIL]', '= x² + 6x + 9   [collect like terms]'],
    svgDesc: 'Square with side (a+b): the 2ab region is what people miss',
    cells: [
      { x:31, y:25, w:108, h:108, fill:'#6366F1', label:'a²', cx:85, cy:84 },
      { x:141, y:25, w:108, h:108, fill:'#8B5CF6', label:'ab', cx:195, cy:84 },
      { x:31, y:135, w:108, h:88, fill:'#8B5CF6', label:'ab', cx:85, cy:184 },
      { x:141, y:135, w:108, h:88, fill:'#A78BFA', label:'b²', cx:195, cy:184 },
    ],
    colLabels: [['a',85],['b',195]] as [string,number][],
    rowLabels: [['a',94],['b',184]] as [string,number][],
  },
  {
    name: '(a−b)²',
    label: 'Perfect Square — Difference',
    formula: '(a − b)² = a² − 2ab + b²',
    example: '(x − 4)² = x² − 8x + 16',
    mistake: 'Note: the middle term is NEGATIVE: −2ab, not +2ab.',
    color: '#EC4899',
    steps: ['(x−4)² = (x−4)(x−4)', '= x²− 4x − 4x + 16   [FOIL]', '= x² − 8x + 16'],
    svgDesc: 'Same shape — subtract the two ab rectangles instead of adding',
    cells: [
      { x:31, y:25, w:108, h:108, fill:'#6366F1', label:'a²', cx:85, cy:84 },
      { x:141, y:25, w:108, h:108, fill:'#EC4899', label:'−ab', cx:195, cy:84 },
      { x:31, y:135, w:108, h:88, fill:'#EC4899', label:'−ab', cx:85, cy:184 },
      { x:141, y:135, w:108, h:88, fill:'#A78BFA', label:'b²', cx:195, cy:184 },
    ],
    colLabels: [['a',85],['b',195]] as [string,number][],
    rowLabels: [['a',94],['b',184]] as [string,number][],
  },
  {
    name: '(a+b)(a−b)',
    label: 'Difference of Two Squares',
    formula: '(a + b)(a − b) = a² − b²',
    example: '(x + 5)(x − 5) = x² − 25',
    mistake: 'The two middle terms cancel: +bx and −bx = 0. That\'s why only a²−b² remains.',
    color: '#F59E0B',
    steps: ['(x+5)(x−5)', '= x²− 5x + 5x − 25   [FOIL]', '= x² − 25   [middle terms cancel!]'],
    svgDesc: 'The +ab and −ab rectangles cancel each other exactly',
    cells: [
      { x:31, y:25, w:108, h:108, fill:'#6366F1', label:'a²', cx:85, cy:84 },
      { x:141, y:25, w:108, h:108, fill:'#F59E0B', label:'+ab', cx:195, cy:84 },
      { x:31, y:135, w:108, h:88, fill:'#F59E0B', label:'−ab', cx:85, cy:184 },
      { x:141, y:135, w:108, h:88, fill:'#374151', label:'−b²', cx:195, cy:184 },
    ],
    colLabels: [['a',85],['b',195]] as [string,number][],
    rowLabels: [['a',94],['b',184]] as [string,number][],
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function IdentitiesTab({ color }: { color: string }) {
  const [idx, setIdx] = useState(0)
  const id = IDENTITIES[idx]

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 flex-wrap">
        {IDENTITIES.map((id,i) => (
          <button key={i} onClick={()=>setIdx(i)} className="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
            style={i===idx ? {background:id.color,color:'white'} : {background:`${id.color}22`,color:id.color}}>
            {id.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl px-4 py-2 text-center" style={{ background:`${id.color}22`, border:`1px solid ${id.color}44` }}>
        <p className="text-xs font-black uppercase tracking-wide mb-1" style={{ color:id.color }}>{id.label}</p>
        <p className="text-base font-black text-white">{id.formula}</p>
      </div>

      {/* Area diagram */}
      <div className="flex justify-center">
        <svg viewBox="0 0 260 240" width="100%" height="180">
          <text x="16" y="90" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">{id.rowLabels[0][0]}</text>
          <text x="16" y="182" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">{id.rowLabels[1][0]}</text>
          <text x={id.colLabels[0][1]} y="15" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">{id.colLabels[0][0]}</text>
          <text x={id.colLabels[1][1]} y="15" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Nunito,sans-serif">{id.colLabels[1][0]}</text>
          {id.cells.map((c,i) => (
            <g key={i}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="4" fill={c.fill} fillOpacity={0.85}/>
              <text x={c.cx} y={c.cy} textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Nunito,sans-serif">{c.label}</text>
            </g>
          ))}
          {/* Special annotation for DOTS */}
          {idx === 2 && (
            <text x="140" y="228" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="800" fontFamily="Nunito,sans-serif">+ab and −ab cancel → only a² − b² survives</text>
          )}
          {idx === 0 && (
            <text x="140" y="228" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="800" fontFamily="Nunito,sans-serif">Two ab rectangles → combined = 2ab</text>
          )}
          {idx === 1 && (
            <text x="140" y="228" textAnchor="middle" fill="#EC4899" fontSize="11" fontWeight="800" fontFamily="Nunito,sans-serif">Two −ab regions → combined = −2ab</text>
          )}
        </svg>
      </div>

      {/* Worked example */}
      <div className="rounded-xl px-4 py-3 space-y-1" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[11px] font-black uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.4)' }}>Worked Example</p>
        {id.steps.map((line,i) => (
          <p key={i} className="text-sm font-bold text-white">{line}</p>
        ))}
      </div>

      {/* Mistake callout */}
      <div className="rounded-xl px-4 py-2.5 flex gap-2 items-start" style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)' }}>
        <span className="text-base shrink-0">⚠️</span>
        <p className="text-xs font-bold text-white leading-snug">{id.mistake}</p>
      </div>
    </div>
  )
}

// ── Tab 3: Like Terms Builder ─────────────────────────────────────────────────

const LIKE_TERMS_GROUPS = [
  { terms: ['5x²', '−7x²', '3x²'], type: 'x²', result: 'x²', resultCoeff: 1, color:'#6366F1' },
  { terms: ['4x', '−2x', '8x'],    type: 'x',  result: 'x',  resultCoeff: 10, color:'#8B5CF6' },
  { terms: ['9', '−3', '2'],        type: 'constant', result: '', resultCoeff: 8, color:'#A78BFA' },
]

const COLLECTION_EX = {
  input: '5x² + 4x + 9 − 7x² − 2x − 3 + 3x²',
  groups: [
    { label: 'x² terms', terms: ['5x²','−7x²','3x²'], result: 'x²', color:'#6366F1' },
    { label: 'x terms',  terms: ['4x','−2x'],          result: '2x',  color:'#8B5CF6' },
    { label: 'constants',terms: ['9','−3'],             result: '6',   color:'#A78BFA' },
  ],
  final: 'x² + 2x + 6',
}

function LikeTermsTab({ color }: { color: string }) {
  const [step, setStep] = useState<'identify'|'collect'>('identify')
  const [revealed, setRevealed] = useState<number[]>([])

  function toggle(i: number) {
    setRevealed(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i])
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['identify','collect'] as const).map(t => (
          <button key={t} onClick={()=>{setStep(t);setRevealed([])}} className="flex-1 py-2 rounded-xl text-xs font-black transition-all"
            style={step===t ? {background:color,color:'white'} : {background:`${color}22`,color}}>
            {t === 'identify' ? '🏷️ What are like terms?' : '🧮 Collecting step-by-step'}
          </button>
        ))}
      </div>

      {step === 'identify' && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-white">Like terms share the <span style={{color}}>same variable AND same exponent</span>. Tap each group to see why they can be combined:</p>
          {LIKE_TERMS_GROUPS.map((g, gi) => (
            <button key={gi} onClick={()=>toggle(gi)} className="w-full rounded-xl px-4 py-3 text-left transition-all"
              style={{ background:revealed.includes(gi)?`${g.color}22`:'rgba(255,255,255,0.04)', border:`1px solid ${revealed.includes(gi)?g.color+'66':'rgba(255,255,255,0.08)'}` }}>
              <div className="flex flex-wrap gap-2 items-center mb-1">
                {g.terms.map((t,i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg text-sm font-black" style={{ background:`${g.color}33`, color:g.color }}>{t}</span>
                ))}
                <span className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.4)' }}>— all have {g.type === 'constant' ? 'no variable' : g.type}</span>
              </div>
              {revealed.includes(gi) && (
                <p className="text-sm font-black mt-1" style={{ color:'#34D399' }}>
                  Combined: {g.resultCoeff}{g.result} ({g.type === 'constant' ? 'add the numbers' : 'add the coefficients'})
                </p>
              )}
              {!revealed.includes(gi) && <p className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.3)' }}>Tap to combine →</p>}
            </button>
          ))}
          <div className="rounded-xl px-4 py-2.5" style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)' }}>
            <p className="text-xs font-bold text-white">⚠️ 3x² and 3x are NOT like terms — different exponents. 3x and 3y are NOT like terms — different variables.</p>
          </div>
        </div>
      )}

      {step === 'collect' && (
        <div className="space-y-3">
          <div className="rounded-xl px-4 py-3" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Expression to simplify</p>
            <p className="text-sm font-black text-white">{COLLECTION_EX.input}</p>
          </div>

          <p className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.5)' }}>Step 1: Group the like terms by colour</p>

          <div className="space-y-2">
            {COLLECTION_EX.groups.map((g, gi) => (
              <div key={gi} className="rounded-xl px-4 py-3" style={{ background:`${g.color}18`, border:`1px solid ${g.color}44` }}>
                <p className="text-[11px] font-black uppercase mb-1" style={{ color:g.color }}>{g.label}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {g.terms.map((t,i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-sm font-black text-white" style={{ background:`${g.color}44` }}>{t}</span>
                  ))}
                  <span className="text-white font-black">= <span style={{ color:'#34D399' }}>{g.result}</span></span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-4 py-3 text-center" style={{ background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.4)' }}>
            <p className="text-[11px] font-black uppercase tracking-wide mb-1" style={{ color:'#34D399' }}>Final Answer</p>
            <p className="text-lg font-black text-white">{COLLECTION_EX.final}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

type Tab = 'foil' | 'identities' | 'liketerms'

export default function AreaModelVisual({ color = '#6366F1' }: Props) {
  const [tab, setTab] = useState<Tab>('foil')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'foil',       label: '🔲 FOIL' },
    { id: 'identities', label: '⚡ Special Identities' },
    { id: 'liketerms',  label: '🏷️ Like Terms' },
  ]

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Interactive — Algebraic Expressions
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

      {tab === 'foil'       && <FOILTab color={color} />}
      {tab === 'identities' && <IdentitiesTab color={color} />}
      {tab === 'liketerms'  && <LikeTermsTab color={color} />}
    </div>
  )
}
