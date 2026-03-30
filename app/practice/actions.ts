'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PracticeQuestion {
  id:                 string
  outcome_id:         string   // topic prefix   e.g. "MA-CALC-D01"
  mastery_outcome_id: string   // full map key   e.g. "MA-CALC-D01-B3"
  difficulty_band:    number
  content: {
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
  }
  correct_answer:     string   // 'a'|'b'|'c'|'d'
  explanation:        string
  step_by_step:       string[]
  nesa_outcome_code:  string
  current_confidence: number   // from mastery_map
  topic_name:         string
}

export interface SubmitResult {
  isCorrect:      boolean
  newConfidence:  number
  delta:          number   // +15 or -10
  explanation:    string
  step_by_step:   string[]
  correctAnswer:  string
}

// ─── Topic display names ────────────────────────────────────────────────────────

const TOPIC_NAMES: Record<string, string> = {
  'MA-CALC-D01': 'Differentiation basics',
  'MA-CALC-D02': 'Product & quotient rule',
  'MA-CALC-D03': 'Chain rule',
  'MA-CALC-D04': 'Trig derivatives',
  'MA-CALC-D05': 'Exponential derivatives',
  'MA-CALC-D06': 'Log derivatives',
  'MA-CALC-D07': 'Tangents & normals',
  'MA-CALC-D08': 'Stationary points',
  'MA-CALC-D09': 'Optimisation',
  'MA-CALC-D10': 'Rates of change',
  'MA-CALC-D11': 'Concavity',
  'MA-CALC-D12': 'Implicit differentiation',
  'MA-CALC-I01': 'Antiderivatives',
  'MA-CALC-I02': 'Polynomial integrals',
  'MA-CALC-I03': 'Trig integration',
  'MA-CALC-I04': 'Exp & log integration',
  'MA-CALC-I05': 'Integration by substitution',
  'MA-CALC-I06': 'Definite integrals',
  'MA-CALC-I07': 'Area under a curve',
  'MA-CALC-I08': 'Area between curves',
  'MA-CALC-I09': 'Volumes of revolution',
  'MA-CALC-I10': 'Kinematics',
  'MA-CALC-I11': 'Numerical integration',
  'MA-CALC-I12': 'Exponential growth & decay',
  'MA-TRIG-01':  'Exact trig values',
  'MA-TRIG-02':  'Trig graphs',
  'MA-TRIG-03':  'Trig identities',
  'MA-TRIG-04':  'Trig equations',
  'MA-TRIG-05':  'Inverse trig',
  'MA-TRIG-06':  'Compound angles',
  'MA-TRIG-07':  'Sine & cosine rule',
  'MA-TRIG-08':  'Bearings & 3D trig',
  'MA-TRIG-09':  'Radians',
  'MA-EXP-01':   'Exp graphs',
  'MA-EXP-02':   'Exp equations',
  'MA-EXP-03':   'Log laws',
  'MA-EXP-04':   'Log equations',
  'MA-EXP-05':   'Natural log',
  'MA-EXP-06':   'Exp applications',
  'MA-FUNC-01':  'Domain & range',
  'MA-FUNC-02':  'Types of functions',
  'MA-FUNC-03':  'Composite functions',
  'MA-FUNC-04':  'Inverse functions',
  'MA-FUNC-05':  'Transformations',
  'MA-FUNC-06':  'Absolute value',
  'MA-FUNC-07':  'Polynomial graphs',
  'MA-FUNC-08':  'Rational functions',
  'MA-FUNC-09':  'Limits',
  'MA-ALG-01':   'Quadratics',
  'MA-ALG-02':   'Quadratic graphs',
  'MA-ALG-03':   'Simultaneous equations',
  'MA-ALG-04':   'Polynomials',
  'MA-ALG-05':   'Inequalities',
  'MA-ALG-06':   'Arithmetic sequences',
  'MA-ALG-07':   'Geometric sequences',
  'MA-ALG-08':   'Surds',
  'MA-STAT-01':  'Data representation',
  'MA-STAT-02':  'Central tendency',
  'MA-STAT-03':  'Spread',
  'MA-STAT-04':  'Regression',
  'MA-STAT-05':  'Normal distribution',
  'MA-STAT-06':  'Sampling',
  'MA-PROB-01':  'Basic probability',
  'MA-PROB-02':  'Conditional probability',
  'MA-PROB-03':  'Discrete distributions',
  'MA-PROB-04':  'Binomial distribution',
  'MA-PROB-05':  'Counting techniques',
  'MA-FIN-01':   'Simple interest',
  'MA-FIN-02':   'Compound interest',
  'MA-FIN-03':   'Annuities',
  'MA-FIN-04':   'Loans',
  'MA-FIN-05':   'Investment analysis',
  'MA-COORD-01': 'Distance & midpoint',
  'MA-COORD-02': 'Lines',
  'MA-COORD-03': 'Circles',
  'MA-COORD-04': 'Parabolas',
  'MA-COORD-05': 'Locus',
  'MA-EXT-01':   'Mathematical induction',
  'MA-EXT-02':   'Binomial theorem',
  'MA-EXT-03':   'Integration by parts',
  'MA-EXT-04':   'Differential equations',
  'MA-EXT-05':   'Projectile motion',
  'MA-EXT-06':   'Vectors',
  'MA-EXT-07':   'Complex numbers',
  'MA-EXT-08':   'Further trigonometry',
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeQuestion(row: any, masteryOutcomeId: string, confidence: number): PracticeQuestion {
  const c = (row.content_json ?? {}) as Record<string, string>
  const prefix = row.outcome_id ?? masteryOutcomeId.replace(/-B\d+$/, '')
  return {
    id:                 row.id,
    outcome_id:         prefix,
    mastery_outcome_id: masteryOutcomeId,
    difficulty_band:    row.difficulty_band ?? 3,
    content: {
      question_text: c.question_text ?? '',
      option_a:      c.option_a      ?? '',
      option_b:      c.option_b      ?? '',
      option_c:      c.option_c      ?? '',
      option_d:      c.option_d      ?? '',
    },
    correct_answer:    (row.correct_answer ?? 'a').toLowerCase(),
    explanation:       row.explanation ?? '',
    step_by_step:      Array.isArray(row.step_by_step) ? row.step_by_step : [],
    nesa_outcome_code: row.nesa_outcome_code ?? '',
    current_confidence: confidence,
    topic_name:         TOPIC_NAMES[prefix] ?? prefix,
  }
}

// ─── createPracticeSession ──────────────────────────────────────────────────────

export async function createPracticeSession(userId: string): Promise<string | null> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId })
    .select('id')
    .single()
  if (error) console.error('[createPracticeSession]', error.message)
  return data?.id ?? null
}

// ─── getNextQuestion ────────────────────────────────────────────────────────────
//
// Priority: lowest confidence first (red < yellow < green).
// Excludes questions the user has already answered (error_log).
// Falls back to any unanswered question → then any question if all answered.

export async function getNextQuestion(userId: string): Promise<PracticeQuestion | null> {
  const supabase = createSupabaseServerClient()
  const now      = new Date().toISOString()

  // 1. Load mastery map — eligible entries (review due or untested)
  const { data: masteryRows } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct, difficulty_band, next_review_at')
    .eq('user_id', userId)
    .or(`next_review_at.is.null,next_review_at.lte.${now}`)
    .order('confidence_pct', { ascending: true })  // red first, then yellow, then green
    .limit(30)

  // 2. Get recently answered question IDs (for exclusion)
  const { data: answeredRows } = await supabase
    .from('error_log')
    .select('question_id')
    .eq('user_id', userId)
    .not('question_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(300)

  const answeredSet = new Set(
    (answeredRows ?? []).map(r => r.question_id as string).filter(Boolean)
  )
  const answeredIds = Array.from(answeredSet)

  // 3. Try each priority entry
  for (const entry of (masteryRows ?? [])) {
    const prefix     = entry.outcome_id.replace(/-B(\d+)$/, '')
    const bandMatch  = entry.outcome_id.match(/-B(\d+)$/)
    const band       = bandMatch ? parseInt(bandMatch[1], 10) : (entry.difficulty_band ?? 3)
    const confidence = entry.confidence_pct ?? 0

    let q = supabase
      .from('questions')
      .select('id, outcome_id, difficulty_band, content_json, correct_answer, explanation, step_by_step, nesa_outcome_code')
      .eq('outcome_id', prefix)
      .eq('difficulty_band', band)

    if (answeredIds.length > 0) {
      q = q.not('id', 'in', `(${answeredIds.join(',')})`)
    }

    const { data: candidates } = await q.limit(8)

    if (candidates && candidates.length > 0) {
      const row = candidates[Math.floor(Math.random() * candidates.length)]
      return shapeQuestion(row, entry.outcome_id, confidence)
    }
  }

  // 4. Fallback A: any unanswered question in the entire bank
  {
    let q = supabase
      .from('questions')
      .select('id, outcome_id, difficulty_band, content_json, correct_answer, explanation, step_by_step, nesa_outcome_code')
    if (answeredIds.length > 0) {
      q = q.not('id', 'in', `(${answeredIds.join(',')})`)
    }
    const { data: fallback } = await q.limit(20)
    if (fallback && fallback.length > 0) {
      const row = fallback[Math.floor(Math.random() * fallback.length)]
      return shapeQuestion(row, row.outcome_id ?? 'MA-CALC-D01', 50)
    }
  }

  // 5. Fallback B: truly any question (all answered — restart the bank)
  {
    const { data: any_ } = await supabase
      .from('questions')
      .select('id, outcome_id, difficulty_band, content_json, correct_answer, explanation, step_by_step, nesa_outcome_code')
      .limit(20)
    if (any_ && any_.length > 0) {
      const row = any_[Math.floor(Math.random() * any_.length)]
      return shapeQuestion(row, row.outcome_id ?? 'MA-CALC-D01', 50)
    }
  }

  return null
}

// ─── submitAnswer ───────────────────────────────────────────────────────────────

export async function submitAnswer(params: {
  userId:           string
  sessionId:        string
  questionId:       string
  outcomePrefix:    string   // for error_log.outcome_id
  masteryOutcomeId: string   // for mastery_map lookup (e.g. "MA-CALC-D01-B3")
  selectedOption:   string   // 'a'|'b'|'c'|'d'
  correctAnswer:    string
  hintUsed:         boolean
  timeMs:           number
  explanation:      string
  step_by_step:     string[]
}): Promise<SubmitResult> {
  const {
    userId, sessionId, questionId, outcomePrefix, masteryOutcomeId,
    selectedOption, correctAnswer, hintUsed, timeMs, explanation, step_by_step,
  } = params

  const isCorrect = selectedOption.toLowerCase() === correctAnswer.toLowerCase()
  const supabase  = createSupabaseServerClient()

  // ── 1. Record in error_log ──
  await supabase.from('error_log').insert({
    user_id:           userId,
    question_id:       questionId,
    outcome_id:        outcomePrefix,
    error_type:        isCorrect ? null : `chose_${selectedOption}`,
    hint_used:         hintUsed,
    time_to_respond_ms: timeMs,
  })

  // ── 2. Update mastery_map ──
  const { data: currentEntry } = await supabase
    .from('mastery_map')
    .select('confidence_pct')
    .eq('user_id', userId)
    .eq('outcome_id', masteryOutcomeId)
    .single()

  const prevConf   = currentEntry?.confidence_pct ?? 50
  const delta      = isCorrect ? 15 : -10
  const newConf    = Math.max(0, Math.min(100, prevConf + delta))
  const newStatus  =
    newConf >= 80 ? 'mastered' :
    newConf >= 50 ? 'shaky'    : 'gap'

  // Spaced repetition: review interval based on new confidence
  const daysToNext = newConf >= 80 ? 7 : newConf >= 50 ? 2 : 1
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + daysToNext)

  await supabase.from('mastery_map').upsert({
    user_id:        userId,
    outcome_id:     masteryOutcomeId,
    confidence_pct: newConf,
    status:         newStatus,
    last_tested_at: new Date().toISOString(),
    next_review_at: nextReview.toISOString(),
  }, { onConflict: 'user_id,outcome_id' })

  // ── 3. Update session stats ──
  const { data: sess } = await supabase
    .from('sessions')
    .select('questions_attempted, accuracy_pct')
    .eq('id', sessionId)
    .single()

  if (sess) {
    const newAttempted = (sess.questions_attempted ?? 0) + 1
    const prevCorrect  = Math.round(((sess.accuracy_pct ?? 0) / 100) * (sess.questions_attempted ?? 0))
    const newCorrect   = prevCorrect + (isCorrect ? 1 : 0)
    const newAccuracy  = Math.round((newCorrect / newAttempted) * 100)

    await supabase.from('sessions').update({
      questions_attempted: newAttempted,
      accuracy_pct:        newAccuracy,
      end_time:            new Date().toISOString(),
    }).eq('id', sessionId)
  }

  // ── 4. Update streak (fire-and-forget) ──
  updateStreak(userId, supabase).catch(() => {})

  return { isCorrect, newConfidence: newConf, delta, explanation, step_by_step, correctAnswer }
}

// ─── updateStreak (internal) ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateStreak(userId: string, supabase: any) {
  const today = new Date()
  const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`

  const { data: streak } = await supabase
    .from('streaks')
    .select('current_streak, longest_streak, last_active_date')
    .eq('user_id', userId)
    .single()

  if (!streak) return

  if (streak.last_active_date === todayStr) return  // already updated today

  const yesterday = new Date(today)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yStr = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterday.getUTCDate()).padStart(2, '0')}`

  const newStreak  = streak.last_active_date === yStr ? (streak.current_streak ?? 0) + 1 : 1
  const newLongest = Math.max(newStreak, streak.longest_streak ?? 0)

  await supabase.from('streaks').update({
    current_streak:  newStreak,
    longest_streak:  newLongest,
    last_active_date: todayStr,
  }).eq('user_id', userId)
}
