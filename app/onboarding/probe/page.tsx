'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams }             from 'next/navigation'
import NeummLogo                                  from '@/components/NeummLogo'
import { createSupabaseBrowserClient }            from '@/lib/supabase-browser'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProbeQuestion {
  id:          string
  outcomeId:   string
  band:        number
  text:        string
  formula:     string | null
  options:     [string, string, string, string]
  correct:     'a' | 'b' | 'c' | 'd'
  explanation: string
}

interface ProbeAnswer {
  questionId: string
  outcomeId:  string
  band:       number
  selected:   string
  correct:    string
  isCorrect:  boolean
  timeMs:     number
}

// ─── Question banks ───────────────────────────────────────────────────────────

const YEAR_9_QUESTIONS: ProbeQuestion[] = [
  {
    id: 'y9-q1', outcomeId: 'NSW9-IDX-01', band: 1,
    text:    'Simplify:',
    formula: '3⁴ × 3²',
    options: ['3⁶', '3⁸', '9⁶', '6²'],
    correct: 'a',
    explanation: 'When multiplying terms with the same base, add the indices: 3⁴ × 3² = 3^(4+2) = 3⁶.',
  },
  {
    id: 'y9-q2', outcomeId: 'NSW9-ALG-01', band: 1,
    text:    'Expand and simplify:',
    formula: '3(x + 4) − 2(x − 1)',
    options: ['x + 10', 'x + 14', '5x + 10', 'x + 12'],
    correct: 'b',
    explanation: 'Expand each bracket: 3(x + 4) = 3x + 12, and −2(x − 1) = −2x + 2. Collect like terms: 3x − 2x + 12 + 2 = x + 14.',
  },
  {
    id: 'y9-q3', outcomeId: 'NSW9-LIN-01', band: 2,
    text:    'Solve for x:',
    formula: '4x − 3 = 2x + 7',
    options: ['x = 2', 'x = 5', 'x = 4', 'x = 10'],
    correct: 'b',
    explanation: 'Subtract 2x from both sides: 2x − 3 = 7. Add 3: 2x = 10. Divide by 2: x = 5.',
  },
  {
    id: 'y9-q4', outcomeId: 'NSW9-GEOM-03', band: 2,
    text:    'Two similar triangles have a scale factor of 1 : 3. If a side of the smaller triangle is 5 cm, what is the corresponding side of the larger triangle?',
    formula: null,
    options: ['3 cm', '8 cm', '15 cm', '25 cm'],
    correct: 'c',
    explanation: 'Scale factor 1 : 3 means every side of the larger triangle is 3× the smaller. So the corresponding side = 5 × 3 = 15 cm.',
  },
  {
    id: 'y9-q5', outcomeId: 'NSW9-GEOM-02', band: 2,
    text:    'Find the length of the hypotenuse in a right triangle with shorter sides 6 cm and 8 cm:',
    formula: 'c² = a² + b²',
    options: ['7 cm', '10 cm', '14 cm', '√48 cm'],
    correct: 'b',
    explanation: 'c² = 6² + 8² = 36 + 64 = 100. So c = √100 = 10 cm.',
  },
  {
    id: 'y9-q6', outcomeId: 'NSW9-TRIG-01', band: 2,
    text:    'In a right triangle, the opposite side is 5 cm and the hypotenuse is 10 cm. What is angle θ?',
    formula: 'sin θ = opposite ÷ hypotenuse',
    options: ['30°', '45°', '60°', '90°'],
    correct: 'a',
    explanation: 'sin θ = 5 ÷ 10 = 0.5. Since sin 30° = 0.5, therefore θ = 30°.',
  },
  {
    id: 'y9-q7', outcomeId: 'NSW9-MEAS-01', band: 2,
    text:    'Find the area of a trapezium with parallel sides 4 cm and 8 cm, and perpendicular height 5 cm:',
    formula: 'A = ½(a + b)h',
    options: ['20 cm²', '30 cm²', '40 cm²', '60 cm²'],
    correct: 'b',
    explanation: 'A = ½(4 + 8) × 5 = ½ × 12 × 5 = 30 cm².',
  },
  {
    id: 'y9-q8', outcomeId: 'NSW9-PROB-01', band: 3,
    text:    'A bag contains 4 red, 3 blue, and 5 green marbles. One marble is drawn at random. What is the probability of drawing a red marble?',
    formula: null,
    options: ['1/4', '1/3', '4/5', '5/12'],
    correct: 'b',
    explanation: 'Total marbles = 4 + 3 + 5 = 12. P(red) = 4/12 = 1/3.',
  },
]

const YEAR_10_QUESTIONS: ProbeQuestion[] = [
  {
    id: 'y10-q1', outcomeId: 'NSW10-ALG-01', band: 2,
    text:    'Factorise fully:',
    formula: 'x² − 5x + 6',
    options: ['(x − 2)(x − 3)', '(x + 2)(x − 3)', '(x + 2)(x + 3)', '(x − 1)(x − 6)'],
    correct: 'a',
    explanation: 'Find two numbers that multiply to +6 and add to −5: those are −2 and −3. So x² − 5x + 6 = (x − 2)(x − 3).',
  },
  {
    id: 'y10-q2', outcomeId: 'NSW10-ALG-02', band: 2,
    text:    'Solve:',
    formula: 'x² − 7x + 12 = 0',
    options: ['x = 3 or x = 4', 'x = −3 or x = −4', 'x = 3 or x = −4', 'x = 6 or x = 2'],
    correct: 'a',
    explanation: 'Factorise: (x − 3)(x − 4) = 0. Therefore x = 3 or x = 4.',
  },
  {
    id: 'y10-q3', outcomeId: 'NSW10-FUNC-01', band: 2,
    text:    'What are the x-intercepts of the parabola?',
    formula: 'y = x² − x − 6',
    options: ['x = −2 and x = 3', 'x = 2 and x = −3', 'x = 1 and x = −6', 'x = 6 and x = −1'],
    correct: 'a',
    explanation: 'Factorise: (x + 2)(x − 3) = 0. So x = −2 or x = 3 are the x-intercepts.',
  },
  {
    id: 'y10-q4', outcomeId: 'NSW10-COORD-01', band: 3,
    text:    'Find the midpoint of the segment joining:',
    formula: '(−2, 6)  and  (4, −2)',
    options: ['(1, 2)', '(2, 4)', '(3, 2)', '(−1, 4)'],
    correct: 'a',
    explanation: 'Midpoint = ((−2+4)/2, (6+(−2))/2) = (2/2, 4/2) = (1, 2).',
  },
  {
    id: 'y10-q5', outcomeId: 'NSW10-TRIG-01', band: 3,
    text:    'In triangle ABC, angle A = 30°, angle B = 45°, and side a = 6 cm. Find side b:',
    formula: 'a/sin A = b/sin B',
    options: ['b = 6√2', 'b = 3√2', 'b = 6', 'b = 3'],
    correct: 'a',
    explanation: 'b = a × sin B ÷ sin A = 6 × sin 45° ÷ sin 30° = 6 × (√2/2) ÷ (1/2) = 6√2.',
  },
  {
    id: 'y10-q6', outcomeId: 'NSW10-MEAS-01', band: 3,
    text:    'Find the volume of a cone with radius 3 cm and height 4 cm:',
    formula: 'V = ⅓πr²h',
    options: ['12π cm³', '36π cm³', '9π cm³', '48π cm³'],
    correct: 'a',
    explanation: 'V = ⅓ × π × 3² × 4 = ⅓ × π × 9 × 4 = 12π cm³.',
  },
  {
    id: 'y10-q7', outcomeId: 'NSW10-STAT-01', band: 3,
    text:    'For the data set: 3, 7, 7, 9, 12, 15, 18 — what is the interquartile range (IQR)?',
    formula: 'IQR = Q3 − Q1',
    options: ['7', '8', '9', '15'],
    correct: 'b',
    explanation: 'Q1 (median of lower half 3, 7, 7) = 7. Q3 (median of upper half 12, 15, 18) = 15. IQR = 15 − 7 = 8.',
  },
  {
    id: 'y10-q8', outcomeId: 'NSW10-PROB-01', band: 4,
    text:    'A class has 20 students: 12 play sport, 8 play music, and 4 do both. Given a student plays sport, what is the probability they also play music?',
    formula: 'P(A | B) = P(A ∩ B) ÷ P(B)',
    options: ['1/5', '1/3', '2/5', '3/5'],
    correct: 'b',
    explanation: 'P(music | sport) = P(both) ÷ P(sport) = (4/20) ÷ (12/20) = 4 ÷ 12 = 1/3.',
  },
]

const YEAR_11_QUESTIONS: ProbeQuestion[] = [
  {
    id: 'y11-q1', outcomeId: 'MA-ALG-02', band: 2,
    text:    'How many real solutions does the following equation have?',
    formula: 'x² − 6x + 9 = 0',
    options: ['No real solutions', 'Exactly one real solution', 'Two distinct real solutions', 'Infinitely many solutions'],
    correct: 'b',
    explanation: 'Discriminant Δ = b² − 4ac = (−6)² − 4(1)(9) = 36 − 36 = 0. When Δ = 0, there is exactly one real solution (a repeated root).',
  },
  {
    id: 'y11-q2', outcomeId: 'MA-FUNC-01', band: 3,
    text:    'What is the domain of the function?',
    formula: 'f(x) = √(x − 3)',
    options: ['x > 3', 'x ≥ 3', 'x ≥ 0', 'All real x'],
    correct: 'b',
    explanation: 'The square root requires the expression inside to be ≥ 0. So x − 3 ≥ 0, giving x ≥ 3.',
  },
  {
    id: 'y11-q3', outcomeId: 'MA-TRIG-01', band: 3,
    text:    'Find the exact value of:',
    formula: 'cos 60° × tan 45°',
    options: ['√3/2', '1/√2', '1/2', '√3'],
    correct: 'c',
    explanation: 'cos 60° = 1/2 and tan 45° = 1. Therefore cos 60° × tan 45° = 1/2 × 1 = 1/2.',
  },
  {
    id: 'y11-q4', outcomeId: 'MA-EXP-03', band: 3,
    text:    'Simplify using log laws:',
    formula: 'log₂ 8 + log₂ 4',
    options: ['3', 'log₂ 12', '5', '2'],
    correct: 'c',
    explanation: 'log₂ 8 + log₂ 4 = log₂(8 × 4) = log₂ 32 = 5, since 2⁵ = 32.',
  },
  {
    id: 'y11-q5', outcomeId: 'MA-CALC-D01', band: 4,
    text:    'Differentiate:',
    formula: 'f(x) = 4x³ − 5x² + 2x − 7',
    options: ["f′(x) = 12x² − 10x + 2", "f′(x) = 4x² − 5x + 2", "f′(x) = 12x³ − 10x + 2", "f′(x) = 12x² − 5x"],
    correct: 'a',
    explanation: 'Power rule term by term: d/dx(4x³) = 12x², d/dx(−5x²) = −10x, d/dx(2x) = 2, d/dx(−7) = 0. So f′(x) = 12x² − 10x + 2.',
  },
  {
    id: 'y11-q6', outcomeId: 'MA-EXP-02', band: 4,
    text:    'Solve for x:',
    formula: '2^(x+1) = 32',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correct: 'b',
    explanation: 'Write 32 = 2⁵. So 2^(x+1) = 2⁵, giving x + 1 = 5, therefore x = 4.',
  },
  {
    id: 'y11-q7', outcomeId: 'MA-CALC-D03', band: 4,
    text:    'Differentiate using the chain rule:',
    formula: 'y = (3x + 1)⁴',
    options: ['4(3x + 1)³', '12(3x + 1)³', '4(3x + 1)⁴', '12(3x)³'],
    correct: 'b',
    explanation: 'Chain rule: d/dx[(3x+1)⁴] = 4(3x+1)³ × d/dx(3x+1) = 4(3x+1)³ × 3 = 12(3x+1)³.',
  },
  {
    id: 'y11-q8', outcomeId: 'MA-CALC-D08', band: 5,
    text:    'Find the x-value of the stationary point and determine its nature:',
    formula: 'y = x² − 4x + 7',
    options: ['Minimum at x = 2', 'Maximum at x = 2', 'Minimum at x = −2', 'Inflection point at x = 2'],
    correct: 'a',
    explanation: "dy/dx = 2x − 4. Set dy/dx = 0: x = 2. d²y/dx² = 2 > 0, confirming a minimum at x = 2.",
  },
]

const YEAR_12_QUESTIONS: ProbeQuestion[] = [
  {
    id: 'y12-q1', outcomeId: 'MA-ALG-01', band: 2,
    text:    'Solve for x:',
    formula: '2x + 5 = 13',
    options: ['x = 3', 'x = 4', 'x = 9', 'x = 6'],
    correct: 'b',
    explanation: 'Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4.',
  },
  {
    id: 'y12-q2', outcomeId: 'MA-FUNC-01', band: 3,
    text:    'If f(x) = x² − 2x + 1, what is f(3)?',
    formula: 'f(x) = x² − 2x + 1',
    options: ['2', '4', '6', '8'],
    correct: 'b',
    explanation: 'Substitute x = 3: f(3) = 3² − 2(3) + 1 = 9 − 6 + 1 = 4.',
  },
  {
    id: 'y12-q3', outcomeId: 'MA-TRIG-01', band: 3,
    text:    'Find the angle θ if sin θ = 0.5, where 0° ≤ θ ≤ 90°',
    formula: 'sin θ = 0.5,   0° ≤ θ ≤ 90°',
    options: ['30°', '45°', '60°', '90°'],
    correct: 'a',
    explanation: 'sin 30° = 0.5 is an exact trigonometric value. Therefore θ = 30°.',
  },
  {
    id: 'y12-q4', outcomeId: 'MA-COORD-01', band: 3,
    text:    'Find the gradient of the line passing through the two points:',
    formula: '(1, 3)  and  (4, 9)',
    options: ['1', '2', '3', '4'],
    correct: 'b',
    explanation: 'Gradient = (y₂ − y₁) ÷ (x₂ − x₁) = (9 − 3) ÷ (4 − 1) = 6 ÷ 3 = 2.',
  },
  {
    id: 'y12-q5', outcomeId: 'MA-CALC-D01', band: 4,
    text:    'Differentiate:',
    formula: 'f(x) = 3x⁴ − 2x + 5',
    options: ["f′(x) = 12x³ − 2x", "f′(x) = 12x³ − 2", "f′(x) = 3x³ − 2", "f′(x) = 4x³ − 2"],
    correct: 'b',
    explanation: 'Power rule: d/dx(3x⁴) = 12x³, d/dx(−2x) = −2, d/dx(5) = 0. So f′(x) = 12x³ − 2.',
  },
  {
    id: 'y12-q6', outcomeId: 'MA-CALC-I01', band: 4,
    text:    'Evaluate the indefinite integral:',
    formula: '∫(2x + 3) dx',
    options: ['x² + 3x', 'x² + 3x + C', '2x² + 3x + C', 'x + 3 + C'],
    correct: 'b',
    explanation: 'Integrate term by term: ∫2x dx = x², ∫3 dx = 3x. Always add + C for indefinite integrals.',
  },
  {
    id: 'y12-q7', outcomeId: 'MA-TRIG-04', band: 5,
    text:    'Solve for x in the domain 0 ≤ x ≤ 2π:',
    formula: '2sin²x − sin x − 1 = 0',
    options: [
      'x = π/6, 5π/6',
      'x = π/2, 7π/6, 11π/6',
      'x = π/2, 7π/6',
      'x = π/6, π/2',
    ],
    correct: 'b',
    explanation: 'Factor: (2sin x + 1)(sin x − 1) = 0. So sin x = 1 → x = π/2, or sin x = −½ → x = 7π/6, 11π/6.',
  },
  {
    id: 'y12-q8', outcomeId: 'MA-EXT-01', band: 6,
    text:    'Which option correctly proves by mathematical induction that 3ⁿ − 1 is divisible by 2 for all positive integers n?',
    formula: 'Prove: 3ⁿ − 1 is divisible by 2 for all n ∈ ℤ⁺',
    options: [
      'Base n=1: 3¹−1=2 ✓. Assume 3ᵏ−1 divisible by 2. Then 3^(k+1)−1 = 3·3ᵏ−1 = 3(3ᵏ−1)+2. Both terms divisible by 2. ✓',
      'Base n=1: 3¹−1=2. Assume 3ᵏ divisible by 2. Then 3^(k+1)=3·3ᵏ also divisible by 2. ✓',
      '3ⁿ is always odd, so 3ⁿ−1 is always even, therefore divisible by 2. ✓',
      'For n=1: 2 is divisible by 2. For n=2: 8 is divisible by 2. Therefore true for all n. ✓',
    ],
    correct: 'a',
    explanation: 'A valid induction proof needs a base case, inductive hypothesis, and algebraic step. Option A correctly rewrites 3^(k+1)−1 = 3(3ᵏ−1)+2, where both parts are divisible by 2.',
  },
]

const QUESTIONS_BY_YEAR: Record<string, ProbeQuestion[]> = {
  year_9:  YEAR_9_QUESTIONS,
  year_10: YEAR_10_QUESTIONS,
  year_11: YEAR_11_QUESTIONS,
  year_12: YEAR_12_QUESTIONS,
}

const YEAR_LABEL: Record<string, string> = {
  year_9:  'Year 9',
  year_10: 'Year 10',
  year_11: 'Year 11',
  year_12: 'Year 12',
}

// ─── Course assignment ─────────────────────────────────────────────────────────

function assignCourse(answers: ProbeAnswer[], yearGroup: string): string {
  const correctCount = answers.filter(a => a.isCorrect).length
  const ok = (i: number) => answers[i]?.isCorrect ?? false

  // Year 9 / 10 — Stage 5 placement
  if (yearGroup === 'year_9' || yearGroup === 'year_10') {
    if (correctCount >= 7) return 'Advanced'
    if (correctCount >= 4) return 'Standard'
    return 'Foundation'
  }

  // Year 11 — Preliminary placement
  if (yearGroup === 'year_11') {
    if (correctCount === 8) return 'Extension 1'
    if ([0,1,2,3,4,5,6].every(i => ok(i)) && !ok(7)) return 'Extension 1'
    if (ok(4) && correctCount >= 5) return 'Advanced'
    if (correctCount >= 3) return 'Advanced'
    return 'Standard'
  }

  // Year 12 — HSC placement (original logic)
  if (correctCount === 8) return 'Extension 2'
  if ([0,1,2,3,4,5,6].every(i => ok(i)) && !ok(7)) return 'Extension 1'
  if ([0,1,2,3,4,5].every(i => ok(i)) && !ok(6)) return 'Advanced'
  if ([0,1,2,3,4].every(i => ok(i)) && !ok(5)) return 'Advanced'
  if (ok(4) && correctCount >= 4) return 'Advanced'
  if ([0,1,2].every(i => ok(i)) && !ok(3)) return 'Standard'
  if (correctCount < 3) return 'Standard'
  return 'Standard'
}

// ─── Mastery seeding ───────────────────────────────────────────────────────────

async function seedMastery(userId: string, answers: ProbeAnswer[]) {
  const supabase = createSupabaseBrowserClient()
  const now      = new Date().toISOString()

  const rows = answers.map(a => ({
    user_id:        userId,
    outcome_id:     a.outcomeId,
    confidence_pct: a.isCorrect ? 60 : 20,
    status:         a.isCorrect ? 'shaky' : 'gap',
    last_tested_at: now,
    next_review_at: new Date(
      Date.now() + (a.isCorrect ? 3 : 1) * 86_400_000,
    ).toISOString(),
  }))

  await supabase.from('mastery_map').upsert(rows, { onConflict: 'user_id,outcome_id' })
}

// ─── Phase type ────────────────────────────────────────────────────────────────
type Phase = 'selecting' | 'revealed' | 'saving' | 'done'

// ─── Inner component (uses useSearchParams, must be inside Suspense) ───────────
function ProbeInner() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const rawYear    = searchParams.get('year') ?? 'year_12'
  const yearGroup  = Object.prototype.hasOwnProperty.call(QUESTIONS_BY_YEAR, rawYear)
    ? rawYear
    : 'year_12'
  const questions  = QUESTIONS_BY_YEAR[yearGroup]
  const yearLabel  = YEAR_LABEL[yearGroup] ?? 'Year 12'

  const [phase,       setPhase]       = useState<Phase>('selecting')
  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [answers,     setAnswers]     = useState<ProbeAnswer[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    startRef.current = Date.now()
    setSelectedKey(null)
  }, [currentIdx])

  function handleSubmit() {
    if (!selectedKey || phase !== 'selecting') return
    const timeMs    = Date.now() - startRef.current
    const q         = questions[currentIdx]
    const isCorrect = selectedKey === q.correct
    setAnswers(prev => [
      ...prev,
      { questionId: q.id, outcomeId: q.outcomeId, band: q.band,
        selected: selectedKey, correct: q.correct, isCorrect, timeMs },
    ])
    setPhase('revealed')
  }

  function handleNext() {
    const next = currentIdx + 1
    if (next < questions.length) {
      setCurrentIdx(next)
      setPhase('selecting')
    } else {
      void finishProbe(answers)
    }
  }

  async function finishProbe(finalAnswers: ProbeAnswer[]) {
    setPhase('saving')
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const course = assignCourse(finalAnswers, yearGroup)

    await supabase.from('student_profiles').upsert(
      { user_id: user.id, course, placement_probe_completed: true },
      { onConflict: 'user_id' },
    )
    await seedMastery(user.id, finalAnswers)

    const logRows = finalAnswers.map(a => ({
      user_id:            user.id,
      question_id:        a.questionId,
      outcome_id:         a.outcomeId,
      error_type:         a.isCorrect ? null : 'probe_incorrect',
      hint_used:          false,
      time_to_respond_ms: a.timeMs,
    }))
    await supabase.from('error_log').insert(logRows)

    setPhase('done')
    router.push('/dashboard')
  }

  const q        = questions[currentIdx]
  const progress = Math.round((currentIdx / questions.length) * 100)
  const isLast   = currentIdx === questions.length - 1

  const thisAnswer = answers[answers.length - 1]
  const isCorrect  = phase === 'revealed' ? thisAnswer?.isCorrect : false

  if (phase === 'saving' || phase === 'done') {
    return (
      <Screen>
        <div className="text-center">
          <Spinner size={40} />
          <p className="mt-4 text-sm font-semibold text-gray-600">
            Building your mastery map — taking you to your dashboard…
          </p>
        </div>
      </Screen>
    )
  }

  const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
  const OPTION_KEYS   = ['a', 'b', 'c', 'd'] as const

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <NeummLogo size={32} />
          <span className="text-xs font-bold text-gray-400">
            {currentIdx + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-1.5">
            {[1,2,3,4].map(n => (
              <div key={n} className="h-1.5 rounded-full transition-all"
                style={{ width: n <= 3 ? 24 : 8, backgroundColor: n <= 3 ? '#185FA5' : '#E5E7EB' }} />
            ))}
          </div>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#185FA5' }} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col px-6 pb-10 gap-4">

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {`Let's see where you are — 8 ${yearLabel} questions`}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Select an answer, then tap <strong>Submit</strong>.
          </p>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
            Question {currentIdx + 1}
          </p>
          <p className="text-base font-medium text-gray-900 leading-relaxed mb-3">{q.text}</p>
          {q.formula && (
            <div className="rounded-xl px-4 py-3"
              style={{ backgroundColor: '#E6F1FB', borderLeft: '3px solid #185FA5' }}>
              <p className="text-sm font-semibold leading-relaxed"
                style={{ color: '#0C447C', fontFamily: "'Courier New', monospace" }}>
                {q.formula}
              </p>
            </div>
          )}
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-2.5">
          {OPTION_KEYS.map((key, i) => {
            const isSelected    = selectedKey === key
            const isThisCorrect = key === q.correct

            let borderColor = '#E5E7EB'
            let bgColor     = '#FAFAFA'
            let labelBg     = '#E6F1FB'
            let labelColor  = '#185FA5'

            if (phase === 'revealed') {
              if (isThisCorrect) {
                borderColor = '#10B981'; bgColor = '#F0FFF8'
                labelBg = '#10B981';     labelColor = 'white'
              } else if (isSelected && !isThisCorrect) {
                borderColor = '#EF4444'; bgColor = '#FFF5F5'
                labelBg = '#EF4444';     labelColor = 'white'
              } else {
                borderColor = '#E5E7EB'; bgColor = '#FAFAFA'
              }
            } else if (isSelected) {
              borderColor = '#185FA5'; bgColor = '#E6F1FB'
              labelBg = '#185FA5';     labelColor = 'white'
            }

            return (
              <button
                key={key}
                onClick={() => phase === 'selecting' && setSelectedKey(key)}
                disabled={phase === 'revealed'}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]"
                style={{ minHeight: 56, borderColor, backgroundColor: bgColor }}
              >
                <div className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ backgroundColor: labelBg, color: labelColor }}>
                    {phase === 'revealed' && isThisCorrect ? '✓'
                      : phase === 'revealed' && isSelected && !isThisCorrect ? '✗'
                      : OPTION_LABELS[i]}
                  </div>
                  <span className="text-sm font-medium text-gray-800 leading-snug">
                    {q.options[i]}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation card */}
        {phase === 'revealed' && (
          <div
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: isCorrect ? '#F0FFF8' : '#FFF5F5',
              borderColor:     isCorrect ? '#6EE7B7' : '#FCA5A5',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{isCorrect ? '🎉' : '💡'}</span>
              <p className="text-sm font-black"
                style={{ color: isCorrect ? '#065F46' : '#991B1B' }}>
                {isCorrect ? 'Correct!' : "Not quite — here's the solution:"}
              </p>
            </div>
            <p className="text-sm font-medium leading-relaxed"
              style={{ color: isCorrect ? '#047857' : '#B91C1C' }}>
              {q.explanation}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto pt-2">
          {phase === 'selecting' ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedKey}
              className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ backgroundColor: '#185FA5', minHeight: 56 }}
            >
              Submit answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98]"
              style={{
                backgroundColor: isLast ? '#10B981' : '#185FA5',
                minHeight: 56,
              }}
            >
              {isLast ? 'See my results →' : 'Next question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page export (Suspense required for useSearchParams in Next.js 14) ─────────
export default function ProbePage() {
  return (
    <Suspense fallback={<Screen><Spinner size={40} /></Screen>}>
      <ProbeInner />
    </Suspense>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {children}
    </div>
  )
}

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      style={{ width: size, height: size }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#185FA5" strokeWidth="4" />
      <path className="opacity-75" fill="#185FA5" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
