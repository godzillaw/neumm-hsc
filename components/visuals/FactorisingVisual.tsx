'use client'

import { useState } from 'react'

interface Props { color?: string }

// ── Tab 1: Method Identifier (Decision Tree) ──────────────────────────────────

type Method = 'hcf' | 'dots' | 'perfect' | 'trinomial' | 'grouping' | 'cubes'

interface Expression {
  expr: string
  method: Method
  hint: string
  worked: string[]
}

const EXPRESSIONS: Expression[] = [
  {
    expr: '6x² − 9x',
    method: 'hcf',
    hint: 'Every term shares a common factor. What divides into both 6x² and 9x?',
    worked: ['HCF of 6x² and 9x is 3x', '6x² − 9x = 3x(2x − 3)', '✓ Done — fully factorised'],
  },
  {
    expr: 'x² − 25',
    method: 'dots',
    hint: 'Two perfect squares separated by a minus sign. No middle term.',
    worked: ['x² − 25 = x² − 5²', 'Use a² − b² = (a+b)(a−b)', '= (x + 5)(x − 5)'],
  },
  {
    expr: 'x² + 6x + 9',
    method: 'perfect',
    hint: 'Check: is the last term a perfect square? Is the middle term exactly 2×√first×√last?',
    worked: ['√9 = 3, and 2 × 1 × 3 = 6 ✓ perfect square', 'x² + 6x + 9 = (x + 3)²'],
  },
  {
    expr: '2x² + 7x + 3',
    method: 'trinomial',
    hint: 'Three terms, leading coefficient ≠ 1. Use the product-sum method.',
    worked: ['Product = 2 × 3 = 6', 'Need two numbers: multiply to 6, add to 7 → 6 and 1', '2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)'],
  },
  {
    expr: 'ax + ay + bx + by',
    method: 'grouping',
    hint: 'Four terms — try pairing the first two and the last two.',
    worked: ['Group: (ax + ay) + (bx + by)', '= a(x + y) + b(x + y)', '= (a + b)(x + y)'],
  },
  {
    expr: 'x³ − 8',
    method: 'cubes',
    hint: 'A perfect cube minus another perfect cube. 8 = 2³.',
    worked: ['x³ − 8 = x³ − 2³', 'Use a³ − b³ = (a − b)(a² + ab + b²)', '= (x − 2)(x² + 2x + 4)'],
  },
]

const METHOD_INFO: Record<Method, { label: string; color: string; signal: string }> = {
  hcf:       { label: 'HCF',              color: '#6366F1', signal: 'Common factor in every term' },
  dots:      { label: 'Diff. of Squares', color: '#EC4899', signal: 'a² − b² shape (two squares, minus)' },
  perfect:   { label: 'Perfect Square',   color: '#F59E0B', signal: 'a² + 2ab + b² or a² − 2ab + b²' },
  trinomial: { label: 'Split Middle',     color: '#10B981', signal: 'ax² + bx + c with three terms' },
  grouping:  { label: 'Grouping',         color: '#3B82F6', signal: 'Four terms — pair them up' },
  cubes:     { label: 'Sum/Diff Cubes',   color: '#8B5CF6', signal: 'a³ ± b³ shape' },
}

function SpotterTab({ color }: { color: string }) {
  const [qi, setQi] = useState(0)
  const [chosen, setChosen] = useState<Method | null>(null)
  const [showWorked, setShowWorked] = useState(false)
  const q = EXPRESSIONS[qi]
  const answered = chosen !== null
  const correct = chosen === q.method

  function next() {
    setQi(i => (i + 1) % EXPRESSIONS.length)
    setChosen(null)
    setShowWorked(false)
  }

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Expression {qi + 1} of {EXPRESSIONS.length}
        </p>
        <div className="flex gap-1">
          {EXPRESSIONS.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: i === qi ? color : `${color}33` }} />
          ))}
        </div>
      </div>

      {/* Expression */}
      <div className="rounded-xl px-5 py-5 text-center" style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
        <p className="text-[11px] font-black uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Which method would you use to factorise?
        </p>
        <p className="text-3xl font-black text-white">{q.expr}</p>
      </div>

      {/* Method buttons */}
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(METHOD_INFO) as Method[]).map(m => {
          const info = METHOD_INFO[m]
          const isChosen = chosen === m
          const isCorrect = m === q.method
          let bg = `${info.color}18`
          let border = `${info.color}44`
          let textCol = info.color
          if (answered) {
            if (isCorrect)       { bg = 'rgba(52,211,153,0.18)'; border = '#34D399'; textCol = '#34D399' }
            else if (isChosen)   { bg = 'rgba(248,113,113,0.18)'; border = '#F87171'; textCol = '#F87171' }
            else                 { bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.07)'; textCol = 'rgba(255,255,255,0.25)' }
          }
          return (
            <button key={m} disabled={answered} onClick={() => setChosen(m)}
              className="py-2.5 px-3 rounded-xl text-left transition-all"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <p className="text-xs font-black" style={{ color: textCol }}>{info.label}</p>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: answered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.45)' }}>{info.signal}</p>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="space-y-2">
          <div className="rounded-xl px-4 py-2.5" style={{ background: correct ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${correct ? '#34D399' : '#F87171'}44` }}>
            <p className="text-sm font-black" style={{ color: correct ? '#34D399' : '#F87171' }}>
              {correct ? '✓ Correct!' : `✗ It's ${METHOD_INFO[q.method].label}`}
            </p>
            <p className="text-xs font-bold text-white mt-0.5">{q.hint}</p>
          </div>

          {!showWorked ? (
            <button onClick={() => setShowWorked(true)}
              className="w-full py-2.5 rounded-xl text-xs font-black"
              style={{ background: `${color}22`, color }}>
              Show worked solution →
            </button>
          ) : (
            <div className="rounded-xl px-4 py-3 space-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {q.worked.map((line, i) => (
                <p key={i} className="text-sm font-bold text-white">{line}</p>
              ))}
            </div>
          )}

          <button onClick={next}
            className="w-full py-3 rounded-xl text-sm font-black text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
            {qi === EXPRESSIONS.length - 1 ? 'Restart Spotter' : 'Next Expression →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Tab 2: Splitting the Middle Term — built from scratch ──────────────────────

const SPLIT_STEPS = [
  {
    title: 'Start with the expression',
    body: 'We want to factorise 2x² + 7x + 3. Three terms, leading coefficient ≠ 1.',
    highlight: 'expr',
    visual: { a: 2, b: 7, c: 3 },
  },
  {
    title: 'Find the product',
    body: 'Multiply the first coefficient by the last constant: 2 × 3 = 6. We need two numbers that multiply to 6.',
    highlight: 'product',
    visual: { a: 2, b: 7, c: 3 },
  },
  {
    title: 'Find the pair',
    body: 'Which two numbers multiply to 6 AND add to 7 (the middle term)? → 6 × 1 = 6 and 6 + 1 = 7 ✓',
    highlight: 'pair',
    visual: { a: 2, b: 7, c: 3 },
  },
  {
    title: 'Split the middle term',
    body: 'Replace 7x with 6x + 1x: 2x² + 6x + x + 3. Same expression, just written differently.',
    highlight: 'split',
    visual: { a: 2, b: 7, c: 3 },
  },
  {
    title: 'Group in pairs',
    body: '(2x² + 6x) + (x + 3) — group the first two and last two terms together.',
    highlight: 'group',
    visual: { a: 2, b: 7, c: 3 },
  },
  {
    title: 'Take out HCF from each group',
    body: '2x(x + 3) + 1(x + 3) — notice both groups contain the same bracket (x + 3)!',
    highlight: 'hcf',
    visual: { a: 2, b: 7, c: 3 },
  },
  {
    title: 'Factorise the common bracket',
    body: '(x + 3)(2x + 1) ✓ — the answer. Check by expanding: (x+3)(2x+1) = 2x² + x + 6x + 3 = 2x² + 7x + 3 ✓',
    highlight: 'final',
    visual: { a: 2, b: 7, c: 3 },
  },
]

const SPLIT_VISUALS: Record<string, { line1: string; line2?: string; highlight1?: string; highlight2?: string }> = {
  expr:    { line1: '2x² + 7x + 3' },
  product: { line1: '2x² + 7x + 3', line2: 'product: 2 × 3 = 6', highlight2: '#FBBF24' },
  pair:    { line1: '2x² + 7x + 3', line2: '6 × 1 = 6  ✓   6 + 1 = 7  ✓', highlight2: '#34D399' },
  split:   { line1: '2x² + 6x + 1x + 3', highlight1: '#8B5CF6' },
  group:   { line1: '(2x² + 6x) + (x + 3)', highlight1: '#6366F1' },
  hcf:     { line1: '2x(x + 3) + 1(x + 3)', highlight1: '#EC4899' },
  final:   { line1: '(x + 3)(2x + 1)', highlight1: '#34D399' },
}

function SplittingTab({ color }: { color: string }) {
  const [step, setStep] = useState(0)
  const s = SPLIT_STEPS[step]
  const v = SPLIT_VISUALS[s.highlight]

  return (
    <div className="space-y-3">
      {/* Visual expression box */}
      <div className="rounded-xl px-4 py-4 text-center space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-xl font-black" style={{ color: v.highlight1 || 'white' }}>{v.line1}</p>
        {v.line2 && <p className="text-sm font-black" style={{ color: v.highlight2 || 'rgba(255,255,255,0.6)' }}>{v.line2}</p>}
      </div>

      {/* Step info */}
      <div className="rounded-xl px-4 py-3 min-h-[72px]" style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
        <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color }}>Step {step + 1} — {s.title}</p>
        <p className="text-sm font-bold text-white leading-snug">{s.body}</p>
      </div>

      {/* Nav */}
      <div className="flex items-center gap-2">
        <button disabled={step === 0} onClick={() => setStep(s => s - 1)}
          className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-30"
          style={{ background: `${color}33`, color }}>←</button>
        <div className="flex-1 flex gap-1 justify-center">
          {SPLIT_STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} className="rounded-full transition-all"
              style={{ width: i === step ? 20 : 8, height: 8, background: i === step ? color : `${color}44` }} />
          ))}
        </div>
        <button disabled={step === SPLIT_STEPS.length - 1} onClick={() => setStep(s => s + 1)}
          className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-30"
          style={{ background: `${color}33`, color }}>→</button>
      </div>
      <p className="text-center text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Step {step + 1} of {SPLIT_STEPS.length}
      </p>

      {/* WHY this works */}
      {step === SPLIT_STEPS.length - 1 && (
        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <p className="text-xs font-bold text-white">⚡ Why this works: we used FOIL in reverse. When you expand (x+3)(2x+1) using FOIL, the two middle terms are x and 6x — which is exactly what we split 7x into. Splitting the middle term is just FOIL backwards.</p>
        </div>
      )}
    </div>
  )
}

// ── Tab 3: Misconception Traps ────────────────────────────────────────────────

const TRAPS = [
  {
    wrong: 'x² − 9 = (x − 3)²',
    question: 'What is wrong with this factorisation?',
    options: [
      { text: '(x−3)² expands to x²−6x+9, not x²−9', correct: true },
      { text: 'The sign should be + not −', correct: false },
      { text: 'x² − 9 cannot be factorised', correct: false },
    ],
    correct: 'x² − 9 = (x+3)(x−3)  [Difference of Two Squares, not a perfect square]',
    lesson: 'x²−9 has NO middle term — it\'s difference of squares, not a perfect square. (x−3)² always has a middle term.',
  },
  {
    wrong: '6x² + 4x = 2(3x² + 2x)',
    question: 'Is this fully factorised?',
    options: [
      { text: 'No — there is still a common factor inside the bracket', correct: true },
      { text: 'Yes — 2 has been taken out correctly', correct: false },
      { text: 'No — the signs are wrong', correct: false },
    ],
    correct: '6x² + 4x = 2x(3x + 2)  [HCF is 2x, not just 2]',
    lesson: 'Always take out the FULL HCF. Here x is also common — the HCF is 2x not just 2.',
  },
  {
    wrong: '2x² + 5x + 3 = (2x + 3)(x + 1)   [by guessing pairs]',
    question: 'Is (2x+3)(x+1) correct? Expand and check.',
    options: [
      { text: 'No — expansion gives 2x²+5x+3 ✓ it IS correct', correct: true },
      { text: 'No — expansion gives 2x²+2x+3x+3 = 2x²+5x+3 so it\'s wrong', correct: false },
      { text: 'Cannot tell without the discriminant', correct: false },
    ],
    correct: '(2x+3)(x+1) = 2x²+2x+3x+3 = 2x²+5x+3 ✓  Always verify by expanding back.',
    lesson: 'Always check your factorisation by expanding. It takes 10 seconds and catches every error.',
  },
  {
    wrong: 'x² + 4 = (x + 2)(x − 2)',
    question: 'What is wrong here?',
    options: [
      { text: '(x+2)(x−2) = x²−4, not x²+4. Sum of squares cannot be factorised over reals.', correct: true },
      { text: 'Should be (x+2)²', correct: false },
      { text: 'The factorisation is correct', correct: false },
    ],
    correct: 'x²+4 CANNOT be factorised over real numbers. Difference of squares only works with MINUS.',
    lesson: 'a² + b² cannot be factorised over the reals — only a² − b² works. This is one of the most common HSC errors.',
  },
]

function TrapsTab({ color }: { color: string }) {
  const [ti, setTi] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const trap = TRAPS[ti]
  const answered = chosen !== null

  function next() { setTi(i => (i + 1) % TRAPS.length); setChosen(null) }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>Trap {ti + 1} of {TRAPS.length}</p>
        <div className="flex gap-1">{TRAPS.map((_, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i === ti ? color : `${color}33` }} />)}</div>
      </div>

      {/* Wrong answer shown */}
      <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)' }}>
        <p className="text-[10px] font-black uppercase mb-1" style={{ color: '#F87171' }}>A student wrote:</p>
        <p className="text-lg font-black text-white">{trap.wrong}</p>
      </div>

      <p className="text-sm font-bold text-white">{trap.question}</p>

      <div className="space-y-2">
        {trap.options.map((opt, i) => {
          const isChosen = chosen === i
          const isCorrect = opt.correct
          let bg = 'rgba(255,255,255,0.04)'
          let border = 'rgba(255,255,255,0.08)'
          let textCol = 'rgba(255,255,255,0.85)'
          if (answered) {
            if (isCorrect)       { bg = 'rgba(52,211,153,0.15)'; border = '#34D399'; textCol = '#34D399' }
            else if (isChosen)   { bg = 'rgba(248,113,113,0.15)'; border = '#F87171'; textCol = '#F87171' }
            else                 { bg = 'rgba(255,255,255,0.02)'; border = 'rgba(255,255,255,0.05)'; textCol = 'rgba(255,255,255,0.3)' }
          }
          return (
            <button key={i} disabled={answered} onClick={() => setChosen(i)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color: textCol }}>
              {opt.text}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="space-y-2">
          <div className="rounded-xl px-4 py-3" style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
            <p className="text-[10px] font-black uppercase mb-1" style={{ color }}>Correct answer</p>
            <p className="text-sm font-bold text-white">{trap.correct}</p>
          </div>
          <div className="rounded-xl px-4 py-2.5 flex gap-2" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <span className="shrink-0">💡</span>
            <p className="text-xs font-bold text-white">{trap.lesson}</p>
          </div>
          <button onClick={next} className="w-full py-3 rounded-xl text-sm font-black text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
            {ti === TRAPS.length - 1 ? 'Restart Traps' : 'Next Trap →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Tab 4: Methods Reference ──────────────────────────────────────────────────

const METHODS_REF = [
  {
    id: 'hcf', name: 'HCF', color: '#6366F1',
    when: 'Every term has a common factor',
    formula: 'ab + ac = a(b + c)',
    example: '6x² + 9x = 3x(2x + 3)',
    tip: 'Always do this FIRST before any other method.',
  },
  {
    id: 'dots', name: 'Difference of Squares', color: '#EC4899',
    when: 'Two perfect squares with a MINUS between them. NO middle term.',
    formula: 'a² − b² = (a + b)(a − b)',
    example: 'x² − 16 = (x+4)(x−4)',
    tip: 'a² + b² CANNOT be factorised over the reals.',
  },
  {
    id: 'perfect', name: 'Perfect Square', color: '#F59E0B',
    when: 'Three terms. First and last are perfect squares. Middle = 2×√first×√last.',
    formula: '(a ± b)² = a² ± 2ab + b²',
    example: 'x² + 8x + 16 = (x+4)²',
    tip: 'Check: (middle term)² = 4 × first × last',
  },
  {
    id: 'trinomial', name: 'Split Middle Term', color: '#10B981',
    when: 'Three terms ax² + bx + c where a ≠ 1',
    formula: 'Find p, q where pq = ac and p+q = b',
    example: '2x²+7x+3 → pq=6, p+q=7 → p=6,q=1 → (2x+1)(x+3)',
    tip: 'Always check by expanding your answer.',
  },
  {
    id: 'grouping', name: 'Grouping', color: '#3B82F6',
    when: 'Four terms — pair first two and last two',
    formula: 'ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)',
    example: 'x³+x²+x+1 = x²(x+1)+1(x+1) = (x²+1)(x+1)',
    tip: 'If first grouping fails, try pairing differently.',
  },
  {
    id: 'cubes', name: 'Sum/Diff of Cubes', color: '#8B5CF6',
    when: 'a³ ± b³ — two perfect cubes',
    formula: 'a³±b³ = (a±b)(a²∓ab+b²)',
    example: 'x³−8 = (x−2)(x²+2x+4)',
    tip: 'Remember: the sign pattern is SOAP — Same, Opposite, Always Positive.',
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ReferenceTab({ color }: { color: string }) {
  const [open, setOpen] = useState<string | null>('hcf')

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>Tap each method to expand. Use this as your cheat sheet until you know them cold.</p>
      {METHODS_REF.map(m => (
        <div key={m.id}>
          <button onClick={() => setOpen(open === m.id ? null : m.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
            style={{ background: open === m.id ? `${m.color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${open === m.id ? m.color + '55' : 'rgba(255,255,255,0.08)'}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white"
              style={{ background: m.color }}>{m.id === 'hcf' ? 'HCF' : m.id === 'dots' ? 'a²−b²' : m.id === 'perfect' ? '(a±b)²' : m.id === 'trinomial' ? 'ax²' : m.id === 'grouping' ? '4T' : 'a³'}</div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">{m.name}</p>
              <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.when}</p>
            </div>
            <span style={{ color: m.color, fontSize: 14 }}>{open === m.id ? '▲' : '▼'}</span>
          </button>
          {open === m.id && (
            <div className="mx-2 rounded-b-xl px-4 py-3 space-y-2" style={{ background: `${m.color}12`, borderLeft: `1px solid ${m.color}44`, borderRight: `1px solid ${m.color}44`, borderBottom: `1px solid ${m.color}44` }}>
              <div>
                <p className="text-[10px] font-black uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Formula</p>
                <p className="text-sm font-black text-white">{m.formula}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Example</p>
                <p className="text-sm font-bold text-white">{m.example}</p>
              </div>
              <div className="flex gap-2 items-start pt-1">
                <span className="text-sm shrink-0">💡</span>
                <p className="text-xs font-bold text-white">{m.tip}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

type Tab = 'spotter' | 'split' | 'traps' | 'ref'

export default function FactorisingVisual({ color = '#6366F1' }: Props) {
  const [tab, setTab] = useState<Tab>('spotter')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'spotter', label: '🎯 Method Spotter' },
    { id: 'split',   label: '🔪 Split Middle Term' },
    { id: 'traps',   label: '⚠️ Common Mistakes' },
    { id: 'ref',     label: '📋 Methods Guide' },
  ]

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Interactive — Factorising
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
            style={tab === t.id ? { background: color, color: 'white' } : { background: `${color}22`, color }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'spotter' && <SpotterTab color={color} />}
      {tab === 'split'   && <SplittingTab color={color} />}
      {tab === 'traps'   && <TrapsTab color={color} />}
      {tab === 'ref'     && <ReferenceTab color={color} />}
    </div>
  )
}
