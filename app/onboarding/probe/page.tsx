'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter }                    from 'next/navigation'
import NeummLogo                        from '@/components/NeummLogo'
import { createSupabaseBrowserClient }  from '@/lib/supabase-browser'

// ─── Hardcoded 8-question placement probe ─────────────────────────────────────
// Questions progress from Band 2 → Band 6 to infer course level.

interface ProbeQuestion {
  id:         string
  outcomeId:  string
  band:       number
  text:       string
  formula:    string | null
  options:    [string, string, string, string]   // A, B, C, D
  correct:    'a' | 'b' | 'c' | 'd'
}

const PROBE_QUESTIONS: ProbeQuestion[] = [
  {
    id:        'probe-q1',
    outcomeId: 'MA-ALG-01',
    band:      2,
    text:      'Solve for x:',
    formula:   '2x + 5 = 13',
    options:   ['x = 3', 'x = 4', 'x = 9', 'x = 6'],
    correct:   'b',
  },
  {
    id:        'probe-q2',
    outcomeId: 'MA-FUNC-01',
    band:      3,
    text:      'If f(x) = x² − 2x + 1, what is f(3)?',
    formula:   'f(x) = x² − 2x + 1',
    options:   ['2', '4', '6', '8'],
    correct:   'b',
  },
  {
    id:        'probe-q3',
    outcomeId: 'MA-TRIG-01',
    band:      3,
    text:      'Find the angle θ if sin θ = 0.5, where 0° ≤ θ ≤ 90°',
    formula:   'sin θ = 0.5,  0° ≤ θ ≤ 90°',
    options:   ['30°', '45°', '60°', '90°'],
    correct:   'a',
  },
  {
    id:        'probe-q4',
    outcomeId: 'MA-COORD-01',
    band:      3,
    text:      'Find the gradient of the line passing through the two points below:',
    formula:   '(1, 3)  and  (4, 9)',
    options:   ['1', '2', '3', '4'],
    correct:   'b',
  },
  {
    id:        'probe-q5',
    outcomeId: 'MA-CALC-D01',
    band:      4,
    text:      'Differentiate the following function:',
    formula:   'f(x) = 3x⁴ − 2x + 5',
    options:   ["f′(x) = 12x³ − 2x", "f′(x) = 12x³ − 2", "f′(x) = 3x³ − 2", "f′(x) = 4x³ − 2"],
    correct:   'b',
  },
  {
    id:        'probe-q6',
    outcomeId: 'MA-CALC-I01',
    band:      4,
    text:      'Evaluate the following indefinite integral:',
    formula:   '∫(2x + 3) dx',
    options:   ['x² + 3x', 'x² + 3x + C', '2x² + 3x + C', 'x + 3 + C'],
    correct:   'b',
  },
  {
    id:        'probe-q7',
    outcomeId: 'MA-EXT-04',
    band:      5,
    text:      'Solve for x in the domain 0 ≤ x ≤ 2π:',
    formula:   '2sin²x − sin x − 1 = 0',
    options:   [
      'x = π/6, 5π/6',
      'x = π/2, 7π/6, 11π/6',
      'x = π/2, 7π/6',
      'x = π/6, π/2',
    ],
    correct:   'b',
  },
  {
    id:        'probe-q8',
    outcomeId: 'MA-EXT-01',
    band:      6,
    text:      'Which of the following correctly proves by mathematical induction that 3ⁿ − 1 is divisible by 2 for all positive integers n?',
    formula:   'Prove: 3ⁿ − 1 is divisible by 2 for all n ∈ ℤ⁺',
    options:   [
      'Base n=1: 3¹−1=2 ✓. Assume 3ᵏ−1 divisible by 2. Then 3^(k+1)−1 = 3·3ᵏ−1 = 3(3ᵏ−1)+2. Both terms divisible by 2. ✓',
      'Base n=1: 3¹−1=2. Assume 3ᵏ divisible by 2. Then 3^(k+1)=3·3ᵏ also divisible by 2. ✓',
      '3ⁿ is always odd, so 3ⁿ−1 is always even, therefore divisible by 2. ✓',
      'For n=1: 2 is divisible by 2. For n=2: 8 is divisible by 2. Therefore true for all n. ✓',
    ],
    correct:   'a',
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
async function seedMastery(
  userId:  string,
  answers: ProbeAnswer[],
  course:  string,
) {
  const supabase = createSupabaseBrowserClient()

  // Map of tested outcome → result
  const tested = new Map<string, boolean>()
  for (const a of answers) tested.set(a.outcomeId, a.isCorrect)

  // All outcomes that appear in the probe
  const probeOutcomes = PROBE_QUESTIONS.map(q => q.outcomeId)

  // Additional untested outcomes to seed for the assigned course
  const courseOutcomes: Record<string, string[]> = {
    'Standard':    ['MA-ALG-01','MA-ALG-02','MA-ALG-03','MA-ALG-04','MA-ALG-05','MA-ALG-06','MA-ALG-07','MA-ALG-08',
                    'MA-FUNC-01','MA-FUNC-02','MA-FUNC-03','MA-FUNC-04','MA-FUNC-05',
                    'MA-TRIG-01','MA-TRIG-02','MA-TRIG-03','MA-TRIG-07','MA-TRIG-09',
                    'MA-COORD-01','MA-COORD-02','MA-STAT-01','MA-STAT-02','MA-STAT-03',
                    'MA-FIN-01','MA-FIN-02','MA-FIN-03'],
    'Advanced':    ['MA-ALG-01','MA-ALG-02','MA-ALG-03','MA-ALG-04','MA-ALG-05','MA-ALG-06','MA-ALG-07','MA-ALG-08',
                    'MA-FUNC-01','MA-FUNC-02','MA-FUNC-03','MA-FUNC-04','MA-FUNC-05','MA-FUNC-06','MA-FUNC-07','MA-FUNC-08','MA-FUNC-09',
                    'MA-TRIG-01','MA-TRIG-02','MA-TRIG-03','MA-TRIG-04','MA-TRIG-05','MA-TRIG-06','MA-TRIG-07','MA-TRIG-08','MA-TRIG-09',
                    'MA-COORD-01','MA-COORD-02','MA-COORD-03','MA-COORD-04','MA-COORD-05',
                    'MA-CALC-D01','MA-CALC-D02','MA-CALC-D03','MA-CALC-D04','MA-CALC-D05','MA-CALC-D06','MA-CALC-D07','MA-CALC-D08','MA-CALC-D09',
                    'MA-CALC-I01','MA-CALC-I02','MA-CALC-I03','MA-CALC-I04','MA-CALC-I06','MA-CALC-I07',
                    'MA-EXP-01','MA-EXP-02','MA-EXP-03','MA-EXP-04','MA-EXP-05','MA-EXP-06',
                    'MA-STAT-01','MA-STAT-02','MA-STAT-03','MA-STAT-04','MA-STAT-05','MA-STAT-06',
                    'MA-FIN-01','MA-FIN-02','MA-FIN-03','MA-FIN-04','MA-FIN-05'],
    'Extension 1': ['MA-CALC-D01','MA-CALC-D02','MA-CALC-D03','MA-CALC-D04','MA-CALC-D05','MA-CALC-D06','MA-CALC-D07','MA-CALC-D08','MA-CALC-D09','MA-CALC-D10','MA-CALC-D11','MA-CALC-D12',
                    'MA-CALC-I01','MA-CALC-I02','MA-CALC-I03','MA-CALC-I04','MA-CALC-I05','MA-CALC-I06','MA-CALC-I07','MA-CALC-I08',
                    'MA-EXT-01','MA-EXT-02','MA-EXT-03','MA-EXT-04','MA-EXT-05','MA-EXT-06','MA-EXT-07','MA-EXT-08'],
    'Extension 2': ['MA-CALC-D01','MA-CALC-D02','MA-CALC-D03','MA-CALC-D04','MA-CALC-D05','MA-CALC-D06','MA-CALC-D07','MA-CALC-D08','MA-CALC-D09','MA-CALC-D10','MA-CALC-D11','MA-CALC-D12',
                    'MA-CALC-I01','MA-CALC-I02','MA-CALC-I03','MA-CALC-I04','MA-CALC-I05','MA-CALC-I06','MA-CALC-I07','MA-CALC-I08','MA-CALC-I09','MA-CALC-I10','MA-CALC-I11','MA-CALC-I12',
                    'MA-EXT-01','MA-EXT-02','MA-EXT-03','MA-EXT-04','MA-EXT-05','MA-EXT-06','MA-EXT-07','MA-EXT-08'],
  }

  // All outcomes to seed = probe outcomes ∪ course outcomes
  const allOutcomes = Array.from(new Set([
    ...probeOutcomes,
    ...(courseOutcomes[course] ?? courseOutcomes['Standard']),
  ]))

  const rows = allOutcomes.map(oid => {
    const wasTested  = tested.has(oid)
    const wasCorrect = tested.get(oid) ?? false
    const now        = new Date().toISOString()
    return {
      user_id:        userId,
      outcome_id:     oid,
      confidence_pct: wasTested ? (wasCorrect ? 60 : 20) : 0,
      status:         wasTested ? (wasCorrect ? 'learning' : 'needs_work') : 'untested',
      last_tested_at: wasTested ? now : null,
      next_review_at: wasTested ? new Date(Date.now() + (wasCorrect ? 3 : 1) * 86400000).toISOString() : null,
    }
  })

  await supabase.from('mastery_map').upsert(rows, { onConflict: 'user_id,outcome_id' })
}

// ─── Phase type ────────────────────────────────────────────────────────────────
type Phase = 'active' | 'thinking' | 'saving' | 'done'

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProbePage() {
  const router = useRouter()

  const [phase,      setPhase]      = useState<Phase>('active')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers,    setAnswers]    = useState<ProbeAnswer[]>([])
  const startRef = useRef<number>(Date.now())

  // Reset timer when question changes
  useEffect(() => { startRef.current = Date.now() }, [currentIdx])

  // ── Handle answer selection ─────────────────────────────────────────────────
  function handleSelect(optionKey: string) {
    if (phase !== 'active') return

    const timeMs     = Date.now() - startRef.current
    const q          = PROBE_QUESTIONS[currentIdx]
    const isCorrect  = optionKey === q.correct

    const newAnswers: ProbeAnswer[] = [
      ...answers,
      {
        questionId: q.id,
        outcomeId:  q.outcomeId,
        band:       q.band,
        selected:   optionKey,
        correct:    q.correct,
        isCorrect,
        timeMs,
      },
    ]
    setAnswers(newAnswers)

    // No feedback — show brief "Thinking..." then advance
    setPhase('thinking')
    setTimeout(() => {
      const next = currentIdx + 1
      if (next < PROBE_QUESTIONS.length) {
        setCurrentIdx(next)
        setPhase('active')
      } else {
        // All questions answered — save results
        void finishProbe(newAnswers)
      }
    }, 500)
  }

  // ── Finish & save ───────────────────────────────────────────────────────────
  async function finishProbe(finalAnswers: ProbeAnswer[]) {
    setPhase('saving')
    const supabase = createSupabaseBrowserClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const course = assignCourse(finalAnswers)

    // 1 — Update student_profiles
    await supabase.from('student_profiles').upsert(
      { user_id: user.id, course, placement_probe_completed: true },
      { onConflict: 'user_id' },
    )

    // 2 — Seed mastery map
    await seedMastery(user.id, finalAnswers, course)

    // 3 — Log all answers to error_log (records time + correctness)
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

  // ── Saving screen ────────────────────────────────────────────────────────────
  if (phase === 'saving' || phase === 'done') {
    return (
      <Screen>
        <div className="text-center">
          <Spinner size={40} />
          <p className="mt-4 text-sm font-semibold text-gray-600">Building your mastery map — taking you to your dashboard…</p>
        </div>
      </Screen>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Header */}
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

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#185FA5' }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-6 pb-10 gap-5">

        {/* Heading */}
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {"Let's see where you are — 8 quick questions"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            There are no wrong answers here. Just do your best.
          </p>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Question {currentIdx + 1}
          </p>
          <p className="text-base font-medium text-gray-900 leading-relaxed mb-3">
            {q.text}
          </p>

          {/* Formula block */}
          {q.formula && (
            <div
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: '#E6F1FB', borderLeft: '3px solid #185FA5' }}
            >
              <p
                className="text-sm font-semibold leading-relaxed"
                style={{ color: '#0C447C', fontFamily: "'Courier New', monospace" }}
              >
                {q.formula}
              </p>
            </div>
          )}
        </div>

        {/* "Thinking..." overlay — shown briefly after selection */}
        {phase === 'thinking' ? (
          <div className="flex flex-col gap-3">
            {OPTION_KEYS.map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-14 animate-pulse"
                style={{ backgroundColor: '#F3F4F6' }}
              />
            ))}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-2">
              <Spinner size={16} />
              Thinking…
            </div>
          </div>
        ) : (
          /* Answer options */
          <div className="flex flex-col gap-3">
            {OPTION_KEYS.map((key, i) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={phase !== 'active'}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] hover:border-blue-200"
                style={{
                  minHeight:       56,
                  borderColor:     '#E5E7EB',
                  backgroundColor: '#FAFAFA',
                }}
              >
                <div className="flex items-center gap-4 px-5 py-3.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ backgroundColor: '#E6F1FB', color: '#185FA5' }}
                  >
                    {OPTION_LABELS[i]}
                  </div>
                  <span className="text-sm font-medium text-gray-800 leading-snug">
                    {q.options[i]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tap prompt */}
        {phase === 'active' && (
          <p className="text-center text-xs text-gray-400 mt-auto">
            Tap an option to continue
          </p>
        )}
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
