'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updateStreak }               from '@/lib/actions/streak'
import { checkTierAccess }            from '@/lib/tier'
import { logLearningEvent }           from '@/lib/actions/events'
import Anthropic                      from '@anthropic-ai/sdk'

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
  isCorrect:        boolean
  newConfidence:    number
  prevConfidence:   number
  delta:            number          // positive = gain, negative = loss
  newStatus:        'mastered' | 'shaky' | 'gap'
  masteryOutcomeId: string
  explanation:      string
  step_by_step:     string[]
  correctAnswer:    string
  streakUpdated:    boolean         // true when first answer of the AEST calendar day
  newStreak:        number
  longestStreak:    number
  predictedHscBand: number          // 1–6, computed from top-3 outcome confidences
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

// ─── Topic metadata (for on-the-fly generation) ─────────────────────────────────

const TOPIC_META: Record<string, { name: string; nesa: string }> = {
  'MA-CALC-D01': { name: 'Differentiation basics — power rule, sum rule, constant rule',      nesa: 'MA-C1' },
  'MA-CALC-D02': { name: 'Differentiation — product rule and quotient rule',                   nesa: 'MA-C1' },
  'MA-CALC-D03': { name: 'Differentiation — chain rule and composite functions',               nesa: 'MA-C1' },
  'MA-CALC-D04': { name: 'Differentiation of trigonometric functions sin, cos, tan',           nesa: 'MA-C3' },
  'MA-CALC-D05': { name: 'Differentiation of exponential functions',                           nesa: 'MA-C2' },
  'MA-CALC-D06': { name: 'Differentiation of logarithmic functions',                           nesa: 'MA-C2' },
  'MA-CALC-D07': { name: 'Differentiation applications — tangents and normals',                nesa: 'MA-C1' },
  'MA-CALC-D08': { name: 'Differentiation applications — stationary points and curve sketching', nesa: 'MA-C1' },
  'MA-CALC-D09': { name: 'Differentiation applications — optimisation problems',               nesa: 'MA-C1' },
  'MA-CALC-D10': { name: 'Differentiation applications — rates of change',                     nesa: 'MA-C1' },
  'MA-CALC-D11': { name: 'Second derivative — concavity and points of inflection',             nesa: 'MA-C1' },
  'MA-CALC-D12': { name: 'Implicit differentiation and parametric differentiation',            nesa: 'MA-C1' },
  'MA-CALC-I01': { name: 'Integration basics — antiderivatives and indefinite integrals',      nesa: 'MA-C4' },
  'MA-CALC-I02': { name: 'Integration of polynomial functions',                                nesa: 'MA-C4' },
  'MA-CALC-I03': { name: 'Integration of trigonometric functions',                             nesa: 'MA-C4' },
  'MA-CALC-I04': { name: 'Integration of exponential and logarithmic functions',               nesa: 'MA-C4' },
  'MA-CALC-I05': { name: 'Integration by substitution',                                        nesa: 'MA-C4' },
  'MA-CALC-I06': { name: 'Definite integrals and the Fundamental Theorem of Calculus',         nesa: 'MA-C4' },
  'MA-CALC-I07': { name: 'Area under a curve using definite integrals',                        nesa: 'MA-C4' },
  'MA-CALC-I08': { name: 'Area between two curves',                                            nesa: 'MA-C4' },
  'MA-CALC-I09': { name: 'Volumes of solids of revolution',                                    nesa: 'MA-C4' },
  'MA-CALC-I10': { name: 'Integration applications — kinematics',                              nesa: 'MA-C4' },
  'MA-CALC-I11': { name: 'Trapezoidal rule and numerical integration',                         nesa: 'MA-C4' },
  'MA-CALC-I12': { name: 'Exponential growth and decay',                                       nesa: 'MA-C4' },
  'MA-TRIG-01':  { name: 'Trigonometric ratios — exact values 30, 45, 60 degrees',             nesa: 'MA-T1' },
  'MA-TRIG-02':  { name: 'Trigonometric graphs — sine cosine tangent and transformations',     nesa: 'MA-T1' },
  'MA-TRIG-03':  { name: 'Trigonometric identities — Pythagorean and reciprocal',              nesa: 'MA-T2' },
  'MA-TRIG-04':  { name: 'Trigonometric equations — solving in given domains',                 nesa: 'MA-T2' },
  'MA-TRIG-05':  { name: 'Inverse trigonometric functions arcsin arccos arctan',               nesa: 'MA-T2' },
  'MA-TRIG-06':  { name: 'Compound angle and double angle formulas',                           nesa: 'MA-T3' },
  'MA-TRIG-07':  { name: 'Sine rule cosine rule and area formula',                             nesa: 'MA-T1' },
  'MA-TRIG-08':  { name: 'Bearings and 3D trigonometry problems',                             nesa: 'MA-T1' },
  'MA-TRIG-09':  { name: 'Radians — conversion arc length sector area',                       nesa: 'MA-T2' },
  'MA-EXP-01':   { name: 'Exponential functions — graphs properties transformations',          nesa: 'MA-E1' },
  'MA-EXP-02':   { name: 'Solving exponential equations',                                      nesa: 'MA-E1' },
  'MA-EXP-03':   { name: 'Logarithm laws — product quotient power rules',                     nesa: 'MA-E1' },
  'MA-EXP-04':   { name: 'Solving logarithmic equations',                                      nesa: 'MA-E1' },
  'MA-EXP-05':   { name: 'Natural logarithm — properties and equations with e',               nesa: 'MA-E1' },
  'MA-EXP-06':   { name: 'Applications of exponential functions — population and finance',    nesa: 'MA-E2' },
  'MA-FUNC-01':  { name: 'Functions — domain range function notation',                         nesa: 'MA-F1' },
  'MA-FUNC-02':  { name: 'Types of functions — one-to-one many-to-one odd even',              nesa: 'MA-F1' },
  'MA-FUNC-03':  { name: 'Composite functions and function of a function',                     nesa: 'MA-F1' },
  'MA-FUNC-04':  { name: 'Inverse functions — finding and graphing inverses',                  nesa: 'MA-F1' },
  'MA-FUNC-05':  { name: 'Graph transformations — translations reflections dilations',         nesa: 'MA-F1' },
  'MA-FUNC-06':  { name: 'Absolute value functions and equations',                             nesa: 'MA-F1' },
  'MA-FUNC-07':  { name: 'Polynomial functions — sketching and end behaviour',                 nesa: 'MA-F2' },
  'MA-FUNC-08':  { name: 'Rational functions and asymptotes',                                  nesa: 'MA-F2' },
  'MA-FUNC-09':  { name: 'Limits and continuity of functions',                                 nesa: 'MA-F2' },
  'MA-ALG-01':   { name: 'Quadratic equations — factoring completing the square formula',     nesa: 'MA-A1' },
  'MA-ALG-02':   { name: 'Quadratic functions — graphs vertex discriminant',                   nesa: 'MA-A1' },
  'MA-ALG-03':   { name: 'Simultaneous equations — linear and non-linear',                    nesa: 'MA-A1' },
  'MA-ALG-04':   { name: 'Polynomial equations — factor theorem remainder theorem',            nesa: 'MA-A1' },
  'MA-ALG-05':   { name: 'Inequalities — linear and quadratic',                               nesa: 'MA-A1' },
  'MA-ALG-06':   { name: 'Arithmetic sequences and series',                                    nesa: 'MA-A2' },
  'MA-ALG-07':   { name: 'Geometric sequences and series',                                     nesa: 'MA-A2' },
  'MA-ALG-08':   { name: 'Surds — simplifying and rationalising denominators',                nesa: 'MA-A1' },
  'MA-STAT-01':  { name: 'Data representation — histograms box plots dot plots',              nesa: 'MA-S1' },
  'MA-STAT-02':  { name: 'Measures of central tendency — mean median mode',                   nesa: 'MA-S1' },
  'MA-STAT-03':  { name: 'Measures of spread — range IQR standard deviation variance',        nesa: 'MA-S1' },
  'MA-STAT-04':  { name: 'Correlation and regression — scatterplots line of best fit',        nesa: 'MA-S2' },
  'MA-STAT-05':  { name: 'Normal distribution — z-scores and empirical rule',                 nesa: 'MA-S3' },
  'MA-STAT-06':  { name: 'Sampling and statistical inference',                                 nesa: 'MA-S4' },
  'MA-PROB-01':  { name: 'Basic probability — sample spaces events',                           nesa: 'MA-S1' },
  'MA-PROB-02':  { name: 'Conditional probability and independence',                           nesa: 'MA-S1' },
  'MA-PROB-03':  { name: 'Discrete probability distributions',                                 nesa: 'MA-S1' },
  'MA-PROB-04':  { name: 'Binomial distribution — probability mean variance',                 nesa: 'MA-S1' },
  'MA-PROB-05':  { name: 'Counting techniques — permutations and combinations',               nesa: 'MA-S1' },
  'MA-FIN-01':   { name: 'Simple interest calculations',                                       nesa: 'MA-M1' },
  'MA-FIN-02':   { name: 'Compound interest — future value and present value',                nesa: 'MA-M1' },
  'MA-FIN-03':   { name: 'Annuities — future value and present value',                        nesa: 'MA-M1' },
  'MA-FIN-04':   { name: 'Loans and reducible interest — repayment schedules',                nesa: 'MA-M1' },
  'MA-FIN-05':   { name: 'Investment analysis and financial planning',                         nesa: 'MA-M1' },
  'MA-COORD-01': { name: 'Coordinate geometry — distance midpoint gradient',                   nesa: 'MA-G2' },
  'MA-COORD-02': { name: 'Equations of lines — various forms parallel perpendicular',          nesa: 'MA-G2' },
  'MA-COORD-03': { name: 'Circles — equations tangents chords',                               nesa: 'MA-G2' },
  'MA-COORD-04': { name: 'Parabolas — focus directrix tangents',                              nesa: 'MA-G2' },
  'MA-COORD-05': { name: 'Locus problems and parametric equations',                            nesa: 'MA-G2' },
  'MA-EXT-01':   { name: 'Mathematical induction — divisibility and inequalities',             nesa: 'MA-P1' },
  'MA-EXT-02':   { name: 'Binomial theorem — expansion and coefficients',                     nesa: 'MA-A3' },
  'MA-EXT-03':   { name: 'Further integration by parts',                                       nesa: 'MA-C5' },
  'MA-EXT-04':   { name: 'Differential equations — formation and solution',                    nesa: 'MA-C5' },
  'MA-EXT-05':   { name: 'Mechanics — projectile motion',                                     nesa: 'MA-M2' },
  'MA-EXT-06':   { name: 'Vectors — operations dot product projections',                      nesa: 'MA-V1' },
  'MA-EXT-07':   { name: 'Complex numbers — operations modulus argument polar form',           nesa: 'MA-N1' },
  'MA-EXT-08':   { name: 'Further trigonometry — t-formula and auxiliary angle method',       nesa: 'MA-T4' },
}

// ─── On-the-fly question generation ─────────────────────────────────────────────
// Called when no questions exist in DB for a topic. Generates 12 questions via
// Claude and saves them, then returns one immediately.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateQuestionsForTopic(topicFilter: string, supabase: any): Promise<any[]> {
  const meta = TOPIC_META[topicFilter]
  if (!meta) return []

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return []

  const client = new Anthropic({ apiKey })

  // Generate bands 2, 3, 4 (medium difficulty) for immediate use
  const bands = [2, 3, 4]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allRows: any[] = []

  for (const band of bands) {
    try {
      const prompt = `Generate exactly 6 HSC Advanced Mathematics multiple choice questions on: "${meta.name}"
Difficulty band: ${band} (${band <= 2 ? 'easy — single-step, direct application' : band <= 4 ? 'medium — multi-step, requires understanding' : 'hard — complex HSC-style'})

Return ONLY a valid JSON array — no markdown fences, no text outside the array.
Each object must have exactly these fields:
{
  "outcome_id": "${topicFilter}-B${band}",
  "nesa_outcome_code": "${meta.nesa}",
  "difficulty_band": ${band},
  "question_text": "complete self-contained question",
  "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...",
  "correct_option": "a",
  "explanation": "2-3 sentences explaining why correct and why others wrong",
  "step_by_step": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
}
Rules: 6 unique questions, plausible distractors, keep responses concise. Start with [ immediately.`

      const res = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map(b => b.text)
        .join('')

      // Parse the JSON array
      const start = text.indexOf('[')
      if (start === -1) continue
      let parsed: Record<string, unknown>[] = []
      try {
        const end = text.lastIndexOf(']')
        if (end !== -1) parsed = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>[]
      } catch {
        // Partial — try object-by-object
        const chunk = text.slice(start)
        let depth = 0, inStr = false, escape = false, objStart = -1
        for (let i = 0; i < chunk.length; i++) {
          const ch = chunk[i]
          if (escape) { escape = false; continue }
          if (ch === '\\' && inStr) { escape = true; continue }
          if (ch === '"') { inStr = !inStr; continue }
          if (inStr) continue
          if (ch === '{') { if (depth === 0) objStart = i; depth++ }
          else if (ch === '}') {
            depth--
            if (depth === 0 && objStart !== -1) {
              try { parsed.push(JSON.parse(chunk.slice(objStart, i + 1)) as Record<string, unknown>) } catch {}
              objStart = -1
            }
          }
        }
      }

      if (parsed.length === 0) continue

      // Insert into DB
      const rows = parsed.map((q) => ({
        outcome_id:        q.outcome_id ?? `${topicFilter}-B${band}`,
        course:            'Advanced Mathematics',
        difficulty_band:   Number(q.difficulty_band ?? band),
        format:            'multiple_choice',
        content_json:      {
          question_text: q.question_text ?? '',
          option_a: q.option_a ?? '', option_b: q.option_b ?? '',
          option_c: q.option_c ?? '', option_d: q.option_d ?? '',
        },
        correct_answer:    String(q.correct_option ?? 'a').toLowerCase(),
        explanation:       String(q.explanation ?? ''),
        step_by_step:      Array.isArray(q.step_by_step) ? q.step_by_step : [],
        nesa_outcome_code: String(q.nesa_outcome_code ?? meta.nesa),
        served_to:         [],
      }))

      const { data: inserted } = await supabase
        .from('questions')
        .insert(rows)
        .select('id, outcome_id, difficulty_band, content_json, correct_answer, explanation, step_by_step, nesa_outcome_code')

      if (inserted) allRows.push(...inserted)
    } catch (e) {
      console.error(`[generateQuestionsForTopic] band ${band} failed:`, e)
    }
  }

  return allRows
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

  const sessionId = data?.id ?? null

  // Fire-and-forget: don't block session creation on logging
  if (sessionId) {
    void logLearningEvent(userId, 'session_started', { session_id: sessionId })
  }

  return sessionId
}

// ─── getNextQuestion ────────────────────────────────────────────────────────────
//
// Priority: lowest confidence first (red < yellow < green).
// Excludes questions the user has already answered (error_log).
// Falls back to any unanswered question → then any question if all answered.

export async function getNextQuestion(userId: string, topicFilter?: string): Promise<PracticeQuestion | null> {
  // ── Server-side tier guard (defence-in-depth) ─────────────────────────────────
  const access = await checkTierAccess(userId)
  if (!access.canAnswer) return null

  const supabase = createSupabaseServerClient()
  const now      = new Date().toISOString()

  // ── KEY: outcome_id is stored as "MA-TRIG-02-B3" (prefix + "-B" + band) ──────
  // We use fetch-all + JS filtering (same reliable approach as exam) to avoid
  // PostgREST LIKE quirks that can silently return empty sets.

  // 1. Fetch question pool — if topicFilter set, fetch with coarse server filter
  //    to limit payload, then refine in JS.
  const SELECT = 'id, outcome_id, difficulty_band, content_json, correct_answer, explanation, step_by_step, nesa_outcome_code'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let poolQuery: any = supabase.from('questions').select(SELECT).limit(500)
  // Coarse server-side filter: this may or may not work depending on PostgREST,
  // but if it fails silently we rely on JS filter below.
  if (topicFilter) poolQuery = poolQuery.ilike('outcome_id', `${topicFilter}%`)

  const { data: poolRaw } = await poolQuery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pool = (poolRaw ?? []) as any[]

  // JS-level refinement: only keep questions actually matching the topic prefix
  if (topicFilter) {
    const prefix = topicFilter  // e.g. "MA-TRIG-02"
    pool = pool.filter(r => {
      const oid: string = r.outcome_id ?? ''
      // Match "MA-TRIG-02-B3" style: startsWith prefix then "-B"
      return oid === prefix || oid.startsWith(`${prefix}-`)
    })
  }

  // If no questions exist for this topic, generate them on-the-fly via Claude
  if (pool.length === 0) {
    if (topicFilter) {
      console.log(`[getNextQuestion] No questions for ${topicFilter} — generating on-the-fly`)
      const generated = await generateQuestionsForTopic(topicFilter, supabase)
      if (generated.length > 0) {
        pool = generated
      } else {
        return null  // generation failed — nothing we can do
      }
    } else {
      return null
    }
  }

  // 2. Get recently answered question IDs (for exclusion)
  const { data: answeredRows } = await supabase
    .from('error_log')
    .select('question_id')
    .eq('user_id', userId)
    .not('question_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(500)

  const answeredSet = new Set(
    (answeredRows ?? []).map((r: { question_id: string }) => r.question_id).filter(Boolean)
  )

  // 3. Load mastery map for prioritisation
  const { data: masteryRows } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct')
    .eq('user_id', userId)
    .or(`next_review_at.is.null,next_review_at.lte.${now}`)

  // Build a quick lookup: outcomeId → confidence
  const masteryMap: Record<string, number> = {}
  for (const row of (masteryRows ?? [])) {
    masteryMap[row.outcome_id] = row.confidence_pct ?? 50
  }

  // 4. Score each question in the pool
  //    Lower score = higher priority (we want lowest confidence, unanswered first)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function scoreQuestion(r: any): number {
    const oid: string = r.outcome_id ?? ''
    const answered   = answeredSet.has(r.id) ? 1000 : 0   // push answered to end
    const confidence = masteryMap[oid] ?? 50               // 0–100, lower = higher priority
    return answered + confidence
  }

  // Sort and pick best candidate, with a little randomness in the top-10
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sorted = pool.slice().sort((a: any, b: any) => scoreQuestion(a) - scoreQuestion(b))

  // Prefer unanswered questions; take top-10 unanswered for randomness
  const unanswered = sorted.filter((r: { id: string }) => !answeredSet.has(r.id))
  const candidates = unanswered.length > 0
    ? unanswered.slice(0, 10)     // pick from top-10 unanswered by confidence priority
    : sorted.slice(0, 10)         // all answered — restart, pick from top-10

  const row = candidates[Math.floor(Math.random() * candidates.length)]
  const oid: string = row.outcome_id ?? ''
  const confidence = masteryMap[oid] ?? 50
  // masteryOutcomeId is the full stored key (e.g. "MA-TRIG-02-B3") or construct it
  return shapeQuestion(row, oid || `${topicFilter ?? 'MA-CALC-D01'}-B3`, confidence)
}

// ─── submitAnswer ───────────────────────────────────────────────────────────────

export async function submitAnswer(params: {
  userId:           string
  sessionId:        string
  questionId:       string
  masteryOutcomeId: string   // for mastery_map lookup (e.g. "MA-CALC-D01-B3")
  difficultyBand:   number   // 1–6, drives confidence gain
  selectedOption:   string   // 'a'|'b'|'c'|'d'
  correctAnswer:    string
  hintUsed:         boolean
  timeMs:           number
  explanation:      string
  step_by_step:     string[]
}): Promise<SubmitResult> {
  const {
    userId, sessionId, questionId, masteryOutcomeId,
    difficultyBand, selectedOption, correctAnswer, hintUsed, timeMs,
    explanation, step_by_step,
  } = params

  const isCorrect = selectedOption.toLowerCase() === correctAnswer.toLowerCase()
  const supabase  = createSupabaseServerClient()

  // ── 1. Update mastery_map confidence ──────────────────────────────────────
  //
  // Must happen BEFORE logLearningEvent so the mastery_map row exists when the
  // ILM updater tries to write individual_learning_model into it.
  //
  // Formula:
  //   Correct → +( difficulty_band × 3 )   e.g. Band 6 = +18, Band 1 = +3
  //   Wrong   → −10 (flat penalty, regardless of difficulty)
  //
  // SM-2 spaced repetition intervals:
  //   Mastered (≥ 80) → 14 days
  //   Shaky   (50–79) →  7 days
  //   Gap     (< 50)  →  3 days

  const { data: currentEntry } = await supabase
    .from('mastery_map')
    .select('confidence_pct')
    .eq('user_id', userId)
    .eq('outcome_id', masteryOutcomeId)
    .single()

  const prevConf  = currentEntry?.confidence_pct ?? 50
  const delta     = isCorrect
    ? Math.round(difficultyBand * 3)   // variable gain: harder questions give more credit
    : -10
  const newConf   = Math.max(0, Math.min(100, prevConf + delta))
  const newStatus: 'mastered' | 'shaky' | 'gap' =
    newConf >= 80 ? 'mastered' :
    newConf >= 50 ? 'shaky'    : 'gap'

  const daysToNext = newConf >= 80 ? 14 : newConf >= 50 ? 7 : 3
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

  // ── 2. Log event (error_log write + ILM update) ──────────────────────────
  //
  // Replaces the previous direct error_log insert. Now includes full structured
  // payload and updates mastery_map.individual_learning_model in one call.

  await logLearningEvent(userId, 'question_submitted', {
    question_id: questionId,
    outcome_id:  masteryOutcomeId,
    correct:     isCorrect,
    error_type:  isCorrect ? null : `chose_${selectedOption}`,
    time_ms:     timeMs,
    hint_used:   hintUsed,
  })

  // ── 3. Update session stats ─────────────────────────────────────────────────
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

  // ── 4. Compute predicted HSC band ───────────────────────────────────────────
  //
  // Takes the top-3 highest confidence_pct values in the user's mastery_map
  // and maps their average to the HSC band scale (1–6).
  //
  // Mapping: avg 0 → band 1, avg 100 → band 6
  //   formula: round( 1 + (avg / 100) × 5 )  clamped to [1, 6]
  //
  // Also persists the band to student_profiles so it can be read elsewhere
  // (dashboard, progress screen) without re-computing.

  const { data: topEntries } = await supabase
    .from('mastery_map')
    .select('confidence_pct')
    .eq('user_id', userId)
    .order('confidence_pct', { ascending: false })
    .limit(3)

  let predictedHscBand = 1
  if (topEntries && topEntries.length > 0) {
    const avgConf = topEntries.reduce((s: number, r: { confidence_pct: number }) => s + (r.confidence_pct ?? 0), 0) / topEntries.length
    predictedHscBand = Math.max(1, Math.min(6, Math.round(1 + (avgConf / 100) * 5)))
  }

  // Persist to student_profiles (fire-and-forget — not critical path)
  void supabase
    .from('student_profiles')
    .update({ predicted_hsc_band: predictedHscBand })
    .eq('user_id', userId)

  // ── 5. Update streak ─────────────────────────────────────────────────────────
  const streakResult = await updateStreak(userId)

  return {
    isCorrect,
    prevConfidence:   prevConf,
    newConfidence:    newConf,
    delta,
    newStatus,
    masteryOutcomeId,
    explanation,
    step_by_step,
    correctAnswer,
    streakUpdated:    streakResult.isNewDay,
    newStreak:        streakResult.currentStreak,
    longestStreak:    streakResult.longestStreak,
    predictedHscBand,
  }
}

