'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter }                    from 'next/navigation'
import NeummLogo                        from '@/components/NeummLogo'
import { createSupabaseBrowserClient }  from '@/lib/supabase-browser'

// ─── Hardcoded 8-question placement probe ─────────────────────────────────────
// Questions progress from Band 2 → Band 6 to infer course level.

interface ProbeQuestion {
  id:          string
  outcomeId:   string
  band:        number
  text:        string
  formula:     string | null
  options:     [string, string, string, string]   // A, B, C, D
  correct:     'a' | 'b' | 'c' | 'd'
  explanation: string
}

const PROBE_QUESTIONS: ProbeQuestion[] = [
  {
    id:          'probe-q1',
    outcomeId:   'MA-ALG-01',
    band:        2,
    text:        'Solve for x:',
    formula:     '2x + 5 = 13',
    options:     ['x = 3', 'x = 4', 'x = 9', 'x = 6'],
    correct:     'b',
    explanation: 'Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4.',
  },
  {
    id:          'probe-q2',
    outcomeId:   'MA-FUNC-01',
    band:        3,
    text:        'If f(x) = x² − 2x + 1, what is f(3)?',
    formula:     'f(x) = x² − 2x + 1',
    options:     ['2', '4', '6', '8'],
    correct:     'b',
    explanation: 'Substitute x = 3: f(3) = 3² − 2(3) + 1 = 9 − 6 + 1 = 4.',
  },
  {
    id:          'probe-q3',
    outcomeId:   'MA-TRIG-01',
    band:        3,
    text:        'Find the angle θ if sin θ = 0.5, where 0° ≤ θ ≤ 90°',
    formula:     'sin θ = 0.5,  0° ≤ θ ≤ 90°',
    options:     ['30°', '45°', '60°', '90°'],
    correct:     'a',
    explanation: 'sin 30° = 0.5 is an exact trigonometric value. Therefore θ = 30°.',
  },
  {
    id:          'probe-q4',
    outcomeId:   'MA-COORD-01',
    band:        3,
    text:        'Find the gradient of the line passing through the two points below:',
    formula:     '(1, 3)  and  (4, 9)',
    options:     ['1', '2', '3', '4'],
    correct:     'b',
    explanation: 'Gradient = (y₂ − y₁) ÷ (x₂ − x₁) = (9 − 3) ÷ (4 − 1) = 6 ÷ 3 = 2.',
  },
  {
    id:          'probe-q5',
    outcomeId:   'MA-CALC-D01',
    band:        4,
    text:        'Differentiate the following function:',
    formula:     'f(x) = 3x⁴ − 2x + 5',
    options:     ["f′(x) = 12x³ − 2x", "f′(x) = 12x³ − 2", "f′(x) = 3x³ − 2", "f′(x) = 4x³ − 2"],
    correct:     'b',
    explanation: 'Power rule: d/dx(3x⁴) = 12x³, d/dx(−2x) = −2, d/dx(5) = 0. So f′(x) = 12x³ − 2.',
  },
  {
    id:          'probe-q6',
    outcomeId:   'MA-CALC-I01',
    band:        4,
    text:        'Evaluate the following indefinite integral:',
    formula:     '∫(2x + 3) dx',
    options:     ['x² + 3x', 'x² + 3x + C', '2x² + 3x + C', 'x + 3 + C'],
    correct:     'b',
    explanation: 'Integrate term by term: ∫2x dx = x², ∫3 dx = 3x. Always add + C for indefinite integrals.',
  },
  {
    id:        'probe-q7',
    outcomeId: 'MA-EXT-04',
    band:      5,
    text:        'Solve for x in the domain 0 ≤ x ≤ 2π:',
    formula:     '2sin²x − sin x − 1 = 0',
    options:     [
      'x = π/6, 5π/6',
      'x = π/2, 7π/6, 11π/6',
      'x = π/2, 7π/6',
      'x = π/6, π/2',
    ],
    correct:     'b',
    explanation: 'Factor: (2sinx + 1)(sinx − 1) = 0. So sinx = 1 → x = π/2, or sinx = −½ → x = 7π/6, 11π/6.',
  },
  {
    id:          'probe-q8',
    outcomeId:   'MA-EXT-01',
    band:        6,
    text:        'Which of the following correctly proves by mathematical induction that 3ⁿ − 1 is divisible by 2 for all positive integers n?',
    formula:     'Prove: 3ⁿ − 1 is divisible by 2 for all n ∈ ℤ⁺',
    options:     [
      'Base n=1: 3¹−1=2 ✓. Assume 3ᵏ−1 divisible by 2. Then 3^(k+1)−1 = 3·3ᵏ−1 = 3(3ᵏ−1)+2. Both terms divisible by 2. ✓',
      'Base n=1: 3¹−1=2. Assume 3ᵏ divisible by 2. Then 3^(k+1)=3·3ᵏ also divisible by 2. ✓',
      '3ⁿ is always odd, so 3ⁿ−1 is always even, therefore divisible by 2. ✓',
      'For n=1: 2 is divisible by 2. For n=2: 8 is divisible by 2. Therefore true for all n. ✓',
    ],
    correct:     'a',
    explanation: 'A valid induction proof needs: a base case, an inductive hypothesis, and an algebraic step. Option A correctly rewrites 3^(k+1)−1 = 3(3ᵏ−1)+2, where both parts are divisible by 2.',
  },
]

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
const OPTION_KEYS   = ['a', 'b', 'c', 'd'] as const

// ─── Course assignment ─────────────────────────────────────────────────────────
// Uses the index-based "correct count" approach specified in the product brief.

interface ProbeAnswer {
  questionId: string
  outcomeId:  string
  band:       number
  selected:   string
  correct:    string
  isCorrect:  boolean
  timeMs:     number
}

function assignCourse(answers: ProbeAnswer[]): string {
  const correctCount = answers.filter(a => a.isCorrect).length

  // Check specific question correctness by index
  const ok = (i: number) => answers[i]?.isCorrect ?? false

  // All 8 correct → Extension 2
  if (correctCount === 8) return 'Extension 2'

  // Q1–Q7 correct, Q8 wrong → Extension 1
  if ([0,1,2,3,4,5,6].every(i => ok(i)) && !ok(7)) return 'Extension 1'

  // Q1–Q6 correct, Q7 wrong → Advanced (note ext1 readiness)
  if ([0,1,2,3,4,5].every(i => ok(i)) && !ok(6)) return 'Advanced'

  // Q1–Q5 correct, Q6 wrong → Advanced
  if ([0,1,2,3,4].every(i => ok(i)) && !ok(5)) return 'Advanced'

  // Q5 correct even if Q4 wrong → weight Q5 heavily → Advanced
  if (ok(4) && correctCount >= 4) return 'Advanced'

  // Q1–Q3 correct, Q4 wrong → Standard
  if ([0,1,2].every(i => ok(i)) && !ok(3)) return 'Standard'

  // Fewer than 3 correct → Standard
  if (correctCount < 3) return 'Standard'

  return 'Standard'
}

// ─── Mastery seeding ───────────────────────────────────────────────────────────
// Only seeds the 8 topics the student actually answered.
// Untested topics have NO mastery_map row → avg = null in the progress page.
// This keeps "topics tested" honest: 8 probe answers = 8 tested topics.
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

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProbePage() {
  const router = useRouter()

  const [phase,         setPhase]         = useState<Phase>('selecting')
  const [currentIdx,    setCurrentIdx]    = useState(0)
  const [answers,       setAnswers]       = useState<ProbeAnswer[]>([])
  const [selectedKey,   setSelectedKey]   = useState<string | null>(null)
  const startRef = useRef<number>(Date.now())

  // Reset timer & selection when question changes
  useEffect(() => {
    startRef.current = Date.now()
    setSelectedKey(null)
  }, [currentIdx])

  // ── Submit current selection ────────────────────────────────────────────────
  function handleSubmit() {
    if (!selectedKey || phase !== 'selecting') return

    const timeMs    = Date.now() - startRef.current
    const q         = PROBE_QUESTIONS[currentIdx]
    const isCorrect = selectedKey === q.correct

    setAnswers(prev => [
      ...prev,
      { questionId: q.id, outcomeId: q.outcomeId, band: q.band,
        selected: selectedKey, correct: q.correct, isCorrect, timeMs },
    ])
    setPhase('revealed')
  }

  // ── Advance to next question (or finish) ────────────────────────────────────
  function handleNext() {
    const next = currentIdx + 1
    if (next < PROBE_QUESTIONS.length) {
      setCurrentIdx(next)
      setPhase('selecting')
    } else {
      // Build final answers including current answer already in state
      void finishProbe(answers)
    }
  }

  // ── Finish & save ───────────────────────────────────────────────────────────
  async function finishProbe(finalAnswers: ProbeAnswer[]) {
    setPhase('saving')
    const supabase = createSupabaseBrowserClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const course = assignCourse(finalAnswers)

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

  const q        = PROBE_QUESTIONS[currentIdx]
  const progress = Math.round((currentIdx / PROBE_QUESTIONS.length) * 100)
  const isLast   = currentIdx === PROBE_QUESTIONS.length - 1

  // The answer recorded for THIS question (available once revealed)
  const thisAnswer = answers[answers.length - 1]
  const isCorrect  = phase === 'revealed' ? thisAnswer?.isCorrect : false

  // ── Saving screen ────────────────────────────────────────────────────────────
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
            {currentIdx + 1} / {PROBE_QUESTIONS.length}
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

        {/* Subheading */}
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {"Let's see where you are — 8 quick questions"}
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
            const isSelected = selectedKey === key
            const isThisCorrect = key === q.correct

            // Style logic after reveal
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

        {/* ── Explanation card (shown after reveal) ── */}
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
                {isCorrect ? 'Correct!' : 'Not quite — here\'s the solution:'}
              </p>
            </div>
            <p className="text-sm font-medium leading-relaxed"
              style={{ color: isCorrect ? '#047857' : '#B91C1C' }}>
              {q.explanation}
            </p>
          </div>
        )}

        {/* ── Action buttons ── */}
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

// ─── Sub-components ─────────────────────────────────────────────────────────────
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
