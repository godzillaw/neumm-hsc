'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { logLearningEvent }           from '@/lib/actions/events'
import { EXAM_CATEGORIES }            from './categories'

const TOPIC_NAMES: Record<string, string> = {
  'MA-CALC-D01':'Differentiation basics',   'MA-CALC-D02':'Product & quotient rule',
  'MA-CALC-D03':'Chain rule',               'MA-CALC-D04':'Trig derivatives',
  'MA-CALC-D05':'Exp derivatives',          'MA-CALC-D06':'Log derivatives',
  'MA-CALC-D07':'Tangents & normals',       'MA-CALC-D08':'Stationary points',
  'MA-CALC-D09':'Optimisation',             'MA-CALC-D10':'Rates of change',
  'MA-CALC-D11':'Concavity',               'MA-CALC-D12':'Implicit diff',
  'MA-CALC-I01':'Antiderivatives',          'MA-CALC-I02':'Polynomial integrals',
  'MA-CALC-I03':'Trig integration',         'MA-CALC-I04':'Exp & log integration',
  'MA-CALC-I05':'Integration by substitution','MA-CALC-I06':'Definite integrals',
  'MA-CALC-I07':'Area under curve',         'MA-CALC-I08':'Area between curves',
  'MA-CALC-I09':'Volumes of revolution',    'MA-CALC-I10':'Kinematics',
  'MA-CALC-I11':'Numerical integration',    'MA-CALC-I12':'Exp growth & decay',
  'MA-TRIG-01':'Exact trig values',         'MA-TRIG-02':'Trig graphs',
  'MA-TRIG-03':'Trig identities',           'MA-TRIG-04':'Trig equations',
  'MA-TRIG-05':'Inverse trig',              'MA-TRIG-06':'Compound angles',
  'MA-TRIG-07':'Sine & cosine rule',        'MA-TRIG-08':'Bearings & 3D trig',
  'MA-TRIG-09':'Radians',                   'MA-EXP-01':'Exp graphs',
  'MA-EXP-02':'Exp equations',              'MA-EXP-03':'Log laws',
  'MA-EXP-04':'Log equations',              'MA-EXP-05':'Natural log',
  'MA-EXP-06':'Exp applications',           'MA-FUNC-01':'Domain & range',
  'MA-FUNC-02':'Types of functions',        'MA-FUNC-03':'Composite functions',
  'MA-FUNC-04':'Inverse functions',         'MA-FUNC-05':'Transformations',
  'MA-FUNC-06':'Absolute value',            'MA-FUNC-07':'Polynomial graphs',
  'MA-FUNC-08':'Rational functions',        'MA-FUNC-09':'Limits',
  'MA-ALG-01':'Quadratics',                 'MA-ALG-02':'Quadratic graphs',
  'MA-ALG-03':'Simultaneous equations',     'MA-ALG-04':'Polynomials',
  'MA-ALG-05':'Inequalities',               'MA-ALG-06':'Arithmetic sequences',
  'MA-ALG-07':'Geometric sequences',        'MA-ALG-08':'Surds',
  'MA-STAT-01':'Data representation',       'MA-STAT-02':'Central tendency',
  'MA-STAT-03':'Spread',                    'MA-STAT-04':'Regression',
  'MA-STAT-05':'Normal distribution',       'MA-STAT-06':'Sampling',
  'MA-PROB-01':'Basic probability',         'MA-PROB-02':'Conditional probability',
  'MA-PROB-03':'Discrete distributions',    'MA-PROB-04':'Binomial distribution',
  'MA-PROB-05':'Counting techniques',       'MA-FIN-01':'Simple interest',
  'MA-FIN-02':'Compound interest',          'MA-FIN-03':'Annuities',
  'MA-FIN-04':'Loans',                      'MA-FIN-05':'Investment analysis',
  'MA-COORD-01':'Distance & midpoint',      'MA-COORD-02':'Lines',
  'MA-COORD-03':'Circles',                  'MA-COORD-04':'Parabolas',
  'MA-COORD-05':'Locus',                    'MA-EXT-01':'Induction',
  'MA-EXT-02':'Binomial theorem',           'MA-EXT-03':'Integration by parts',
  'MA-EXT-04':'Diff equations',             'MA-EXT-05':'Projectile motion',
  'MA-EXT-06':'Vectors',                    'MA-EXT-07':'Complex numbers',
  'MA-EXT-08':'Further trig',
}

// ─── Types ─────────────────────────────────────────────────────────────────────

// Sent to client — correct_answer intentionally omitted
export interface ExamQuestion {
  id:                 string
  outcome_id:         string   // topic prefix  e.g. "MA-CALC-D01"
  mastery_outcome_id: string   // mastery key   e.g. "MA-CALC-D01-B5"
  difficulty_band:    number   // 4 | 5 | 6
  topic_name:         string
  nesa_outcome_code:  string
  content: {
    question_text: string
    option_a:      string
    option_b:      string
    option_c:      string
    option_d:      string
  }
}

export interface ExamSubmission {
  question_id:     string
  selected_option: string | null   // null = unanswered (time expired)
}

export interface ExamQuestionResult extends ExamQuestion {
  selected_option: string | null
  correct_answer:  string          // revealed only in results
  is_correct:      boolean
  explanation:     string
}

export interface TopicResult {
  topic_prefix:        string
  topic_name:          string
  total:               number
  correct:             number
  accuracy:            number   // 0–1
  exam_band:           number   // 1–6 derived from exam accuracy
  practice_confidence: number   // 0–100 from mastery_map, -1 if untested
}

export interface ExamResult {
  session_id:         string
  total:              number
  correct:            number
  accuracy:           number          // 0–1
  predicted_hsc_band: number          // 1–6 from top-3 topic accuracies
  by_topic:           TopicResult[]
  question_results:   ExamQuestionResult[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function accuracyToBand(accuracy: number): number {
  // accuracy 0–1 → band 1–6
  return Math.max(1, Math.min(6, Math.round(1 + accuracy * 5)))
}

// ─── startExam ────────────────────────────────────────────────────────────────
//
// Creates the exam session, fetches band 4–6 questions, and returns them
// WITHOUT correct_answer so the client can't inspect answers mid-exam.

export async function startExam(
  userId:          string,
  prefixes:        string[],   // empty = full exam (all topics)
  questionCount:   number,     // 40 for full, 15 for topic/category
  durationSeconds: number,     // 3600 for full, 1200 for topic
  topicLabel:      string,     // human-readable label for session record
): Promise<{ sessionId: string; questions: ExamQuestion[] } | { error: string }> {
  const supabase = createSupabaseServerClient()

  // ── Create session with exam flag ──────────────────────────────────────────
  const { data: session, error: sessErr } = await supabase
    .from('sessions')
    .insert({
      user_id:          userId,
      session_type:     'exam',
      topic_filter:     topicLabel,
      exam_duration_ms: durationSeconds * 1000,
    })
    .select('id')
    .single()

  if (sessErr || !session) {
    return { error: sessErr?.message ?? 'Could not create exam session' }
  }

  // ── Fetch questions ────────────────────────────────────────────────────────
  // KEY: questions table stores outcome_id as "MA-STAT-01-B3" (prefix + "-B" + band).
  //
  // IMPORTANT: .limit(1000) only returns the first 1000 rows (Calculus topics seeded
  // first). Topics seeded later (Trig, Stats, Algebra, etc.) are beyond row 1000.
  // Fix: use exact .in() matching with all band variants for the selected prefixes.
  type QRow = Record<string, unknown>

  const SELECT_COLS = 'id, outcome_id, difficulty_band, content_json, correct_answer, explanation, nesa_outcome_code'

  let pool: QRow[]

  if (prefixes.length > 0) {
    // Build exact outcome_id list: each prefix × bands 1–6
    // e.g. ['MA-TRIG-01-B1','MA-TRIG-01-B2',...,'MA-TRIG-09-B6']
    const outcomeIds = prefixes.flatMap(p => [1, 2, 3, 4, 5, 6].map(b => `${p}-B${b}`))
    const { data, error: qErr } = await supabase
      .from('questions')
      .select(SELECT_COLS)
      .in('outcome_id', outcomeIds)
      .limit(2000)
    if (qErr) return { error: `Question fetch: ${qErr.message}` }
    pool = (data ?? []) as QRow[]
  } else {
    // Full exam — fetch everything (85 topics × 6 bands × 12 qs = 6120 rows)
    const { data, error: qErr } = await supabase
      .from('questions')
      .select(SELECT_COLS)
      .limit(7000)
    if (qErr) return { error: `Question fetch: ${qErr.message}` }
    pool = (data ?? []) as QRow[]
  }

  // Prefer bands 4–6; fall back to all bands if none exist
  const highBand = pool.filter(r => [4, 5, 6].includes(r.difficulty_band as number))
  const rawQ     = highBand.length > 0 ? highBand : pool

  if (rawQ.length === 0) {
    return { error: 'No questions found for the selected topics. Try selecting different topics or completing practice sessions first.' }
  }

  // Sample, shuffle, take N
  const sampled = shuffle(rawQ).slice(0, questionCount)

  const questions: ExamQuestion[] = sampled.map(row => {
    const c      = (row.content_json ?? {}) as Record<string, string>
    // outcome_id in DB is "MA-TRIG-02-B3" — strip band to get topic prefix
    const fullId = row.outcome_id as string
    const prefix = fullId.replace(/-B\d+$/, '')   // "MA-TRIG-02"
    return {
      id:                 row.id as string,
      outcome_id:         prefix,                  // topic prefix for display/grouping
      mastery_outcome_id: fullId,                  // full key "MA-TRIG-02-B3" for mastery_map
      difficulty_band:    row.difficulty_band as number,
      topic_name:         TOPIC_NAMES[prefix] ?? prefix,
      nesa_outcome_code:  (row.nesa_outcome_code as string) ?? '',
      content: {
        question_text: c.question_text ?? '',
        option_a:      c.option_a      ?? '',
        option_b:      c.option_b      ?? '',
        option_c:      c.option_c      ?? '',
        option_d:      c.option_d      ?? '',
      },
      // correct_answer intentionally omitted — revealed only in finalizeExam
    }
  })

  void logLearningEvent(userId, 'session_started', { session_id: session.id })

  return { sessionId: session.id, questions }
}

// ─── finalizeExam ──────────────────────────────────────────────────────────────
//
// Receives client submissions, re-fetches questions to validate answers,
// writes error_log + mastery_map updates, and returns the full result.
// correct_answer is only revealed here.

export async function finalizeExam(
  userId:      string,
  sessionId:   string,
  submissions: ExamSubmission[],
  durationMs:  number,
): Promise<ExamResult> {
  const supabase = createSupabaseServerClient()

  if (submissions.length === 0) {
    return {
      session_id: sessionId, total: 0, correct: 0, accuracy: 0,
      predicted_hsc_band: 1, by_topic: [], question_results: [],
    }
  }

  // ── Re-fetch questions to get correct_answer + explanation ─────────────────
  const questionIds = submissions.map(s => s.question_id)
  const { data: rawQ } = await supabase
    .from('questions')
    .select('id, outcome_id, difficulty_band, content_json, correct_answer, explanation, nesa_outcome_code')
    .in('id', questionIds)

  const qMap = new Map<string, Record<string, unknown>>()
  for (const q of (rawQ ?? [])) {
    qMap.set(q.id as string, q as Record<string, unknown>)
  }

  // ── Fetch practice mastery for comparison ──────────────────────────────────
  // outcome_id in DB is already the full mastery key e.g. "MA-TRIG-02-B3"
  const masteryIds: string[] = []
  for (const q of (rawQ ?? [])) {
    masteryIds.push(q.outcome_id as string)
  }
  const { data: masteryRows } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct')
    .eq('user_id', userId)
    .in('outcome_id', masteryIds)

  const masteryMap = new Map<string, number>()
  for (const m of (masteryRows ?? [])) {
    masteryMap.set(m.outcome_id as string, m.confidence_pct as number)
  }

  // ── Score each submission ──────────────────────────────────────────────────
  const questionResults: ExamQuestionResult[] = []
  let totalCorrect = 0

  for (const sub of submissions) {
    const q = qMap.get(sub.question_id)
    if (!q) continue

    const c             = (q.content_json ?? {}) as Record<string, string>
    const correctAnswer = ((q.correct_answer as string) ?? 'a').toLowerCase()
    const selected      = sub.selected_option?.toLowerCase() ?? null
    const isCorrect     = selected !== null && selected === correctAnswer

    if (isCorrect) totalCorrect++

    // outcome_id in DB is "MA-TRIG-02-B3" — strip band to get topic prefix
    const fullId  = q.outcome_id as string
    const prefix  = fullId.replace(/-B\d+$/, '')   // "MA-TRIG-02"

    questionResults.push({
      id:                 q.id as string,
      outcome_id:         prefix,                  // topic prefix for grouping
      mastery_outcome_id: fullId,                  // full key for mastery_map
      difficulty_band:    q.difficulty_band as number,
      topic_name:         TOPIC_NAMES[prefix] ?? prefix,
      nesa_outcome_code:  (q.nesa_outcome_code as string) ?? '',
      content: {
        question_text: c.question_text ?? '',
        option_a:      c.option_a      ?? '',
        option_b:      c.option_b      ?? '',
        option_c:      c.option_c      ?? '',
        option_d:      c.option_d      ?? '',
      },
      selected_option: sub.selected_option,
      correct_answer:  correctAnswer,
      is_correct:      isCorrect,
      explanation:     (q.explanation as string) ?? '',
    })
  }

  const total    = questionResults.length
  const accuracy = total > 0 ? totalCorrect / total : 0

  // ── Write error_log + update mastery_map for each answered question ─────────
  for (const qr of questionResults) {
    const diffBand = qr.difficulty_band
    const delta    = qr.is_correct ? Math.round(diffBand * 3) : -10
    const prevConf = masteryMap.get(qr.mastery_outcome_id) ?? 50
    const newConf  = Math.max(0, Math.min(100, prevConf + delta))
    const newStatus: 'mastered' | 'shaky' | 'gap' =
      newConf >= 80 ? 'mastered' : newConf >= 50 ? 'shaky' : 'gap'

    const daysToNext = newConf >= 80 ? 14 : newConf >= 50 ? 7 : 3
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + daysToNext)

    // Upsert mastery_map first (so ILM updater can find the row)
    await supabase.from('mastery_map').upsert({
      user_id:        userId,
      outcome_id:     qr.mastery_outcome_id,
      confidence_pct: newConf,
      status:         newStatus,
      last_tested_at: new Date().toISOString(),
      next_review_at: nextReview.toISOString(),
    }, { onConflict: 'user_id,outcome_id' })

    // Log learning event (non-blocking)
    void logLearningEvent(userId, 'question_submitted', {
      question_id: qr.id,
      outcome_id:  qr.mastery_outcome_id,
      correct:     qr.is_correct,
      error_type:  qr.is_correct ? null : `chose_${qr.selected_option ?? 'none'}`,
      time_ms:     Math.round(durationMs / total),  // approximate per-question time
      hint_used:   false,                            // hints disabled in exam mode
    })
  }

  // ── By-topic breakdown ────────────────────────────────────────────────────
  const topicBuckets = new Map<string, { correct: number; total: number }>()
  for (const qr of questionResults) {
    const existing = topicBuckets.get(qr.outcome_id) ?? { correct: 0, total: 0 }
    topicBuckets.set(qr.outcome_id, {
      correct: existing.correct + (qr.is_correct ? 1 : 0),
      total:   existing.total + 1,
    })
  }

  const byTopic: TopicResult[] = Array.from(topicBuckets.entries()).map(([prefix, bucket]) => {
    const topicAccuracy = bucket.total > 0 ? bucket.correct / bucket.total : 0
    // Look up practice confidence: average of mastery_map rows for this prefix
    const practiceConf = (() => {
      const rows = (masteryRows ?? []).filter(m =>
        (m.outcome_id as string).startsWith(prefix)
      )
      if (rows.length === 0) return -1
      return Math.round(rows.reduce((s, r) => s + (r.confidence_pct as number), 0) / rows.length)
    })()

    return {
      topic_prefix:        prefix,
      topic_name:          TOPIC_NAMES[prefix] ?? prefix,
      total:               bucket.total,
      correct:             bucket.correct,
      accuracy:            topicAccuracy,
      exam_band:           accuracyToBand(topicAccuracy),
      practice_confidence: practiceConf,
    }
  }).sort((a, b) => b.accuracy - a.accuracy)

  // ── Predicted HSC band (top-3 topic accuracies) ───────────────────────────
  const top3Accuracies = byTopic.slice(0, 3).map(t => t.accuracy)
  const avgTopAccuracy = top3Accuracies.length > 0
    ? top3Accuracies.reduce((s, a) => s + a, 0) / top3Accuracies.length
    : accuracy
  const predictedHscBand = accuracyToBand(avgTopAccuracy)

  // ── Finalise session record ───────────────────────────────────────────────
  await supabase.from('sessions').update({
    questions_attempted: total,
    accuracy_pct:        Math.round(accuracy * 100),
    end_time:            new Date().toISOString(),
    exam_duration_ms:    durationMs,
  }).eq('id', sessionId)

  void logLearningEvent(userId, 'session_ended', {
    session_id:          sessionId,
    duration_ms:         durationMs,
    questions_attempted: total,
    accuracy_pct:        Math.round(accuracy * 100),
  })

  return {
    session_id:         sessionId,
    total,
    correct:            totalCorrect,
    accuracy,
    predicted_hsc_band: predictedHscBand,
    by_topic:           byTopic,
    question_results:   questionResults,
  }
}

// ─── getPracticeAccuracy ──────────────────────────────────────────────────────
// Used on the topic selector to show existing mastery per category.

export async function getCategoryMastery(
  userId: string,
): Promise<Record<string, number>> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct')
    .eq('user_id', userId)

  // Average by topic prefix (strip -B\d+ suffix)
  const prefixTotals: Record<string, { sum: number; count: number }> = {}
  for (const row of (data ?? [])) {
    const prefix = (row.outcome_id as string).replace(/-B\d+$/, '')
    if (!prefixTotals[prefix]) prefixTotals[prefix] = { sum: 0, count: 0 }
    prefixTotals[prefix].sum   += row.confidence_pct as number
    prefixTotals[prefix].count += 1
  }

  // Aggregate to category level
  const categoryAvg: Record<string, number> = {}
  for (const cat of EXAM_CATEGORIES) {
    const relevant = cat.prefixes.filter(p => prefixTotals[p])
    if (relevant.length === 0) { categoryAvg[cat.name] = -1; continue }
    const avg = relevant.reduce((s, p) => s + (prefixTotals[p].sum / prefixTotals[p].count), 0) / relevant.length
    categoryAvg[cat.name] = Math.round(avg)
  }

  return categoryAvg
}
