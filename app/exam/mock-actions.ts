'use server'

import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import { requireAuth }                 from '@/lib/auth-server'
import Anthropic                       from '@anthropic-ai/sdk'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MockTestConfig {
  id:             string
  title:          string
  mode:           'school_test' | 'hsc_trial' | 'hsc' | 'naplan_y9' | 'prelim_y11'
  course:         string | null
  topicPrefixes:  string[]
  testDate:       string | null
  questionCount:  number
  timeLimitMins:  number
}

export interface MockQuestion {
  id:             string
  topicPrefix:    string
  topicName:      string
  difficultyBand: number
  questionText:   string
  optionA:        string
  optionB:        string
  optionC:        string
  optionD:        string
}

export interface MockAnswerResult {
  questionId:     string
  position:       number
  topicPrefix:    string
  topicName:      string
  difficultyBand: number
  questionText:   string
  optionA:        string
  optionB:        string
  optionC:        string
  optionD:        string
  studentAnswer:  string | null
  correctAnswer:  string
  isCorrect:      boolean
  isSkipped:      boolean
  explanation:    string
  stepByStep:     string[]
}

export interface MockTestResult {
  attemptId:      string
  mockTestId:     string
  title:          string
  mode:           string
  attemptNumber:  number
  scorePct:       number
  predictedBand:  number
  timeTakenSecs:  number
  readiness:      Record<string, 'ready' | 'nearly' | 'needs_work'>
  answers:        MockAnswerResult[]
}

export interface HistoryAttempt {
  attemptId:      string
  mockTestId:     string
  title:          string
  mode:           string
  attemptNumber:  number
  scorePct:       number
  predictedBand:  number
  timeTakenSecs:  number
  completedAt:    string
  topicCount:     number
}

// ─── Topic name map (matches existing exam actions) ───────────────────────────

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

function topicName(prefix: string): string {
  return TOPIC_NAMES[prefix] ?? prefix
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function predictBand(scorePct: number): number {
  if (scorePct >= 90) return 6
  if (scorePct >= 75) return 5
  if (scorePct >= 60) return 4
  if (scorePct >= 45) return 3
  if (scorePct >= 30) return 2
  return 1
}

// ─── createMockTest ───────────────────────────────────────────────────────────

export async function createMockTest(params: {
  title:         string
  mode:          'school_test' | 'hsc_trial' | 'hsc' | 'naplan_y9' | 'prelim_y11'
  course?:       string
  topicPrefixes: string[]
  testDate?:     string
  questionCount: number
  timeLimitMins: number
}): Promise<{ mockTestId: string; attemptId: string } | { error: string }> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: test, error: testErr } = await supabase
    .from('mock_tests')
    .insert({
      user_id:        user.id,
      title:          params.title,
      mode:           params.mode,
      course:         params.course ?? null,
      topic_prefixes: params.topicPrefixes,
      test_date:      params.testDate ?? null,
      question_count: params.questionCount,
      time_limit_mins: params.timeLimitMins,
    })
    .select('id')
    .single()

  if (testErr || !test) return { error: testErr?.message ?? 'Failed to create test' }

  const { data: attempt, error: attErr } = await supabase
    .from('mock_test_attempts')
    .insert({
      mock_test_id:   test.id,
      user_id:        user.id,
      attempt_number: 1,
      status:         'in_progress',
    })
    .select('id')
    .single()

  if (attErr || !attempt) return { error: attErr?.message ?? 'Failed to create attempt' }

  return { mockTestId: test.id, attemptId: attempt.id }
}

// ─── retryMockTest ────────────────────────────────────────────────────────────

export async function retryMockTest(mockTestId: string): Promise<{ attemptId: string } | { error: string }> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: prev } = await supabase
    .from('mock_test_attempts')
    .select('attempt_number')
    .eq('mock_test_id', mockTestId)
    .order('attempt_number', { ascending: false })
    .limit(1)
    .single()

  const nextNum = ((prev?.attempt_number as number) ?? 0) + 1

  const { data: attempt, error } = await supabase
    .from('mock_test_attempts')
    .insert({
      mock_test_id:   mockTestId,
      user_id:        user.id,
      attempt_number: nextNum,
      status:         'in_progress',
    })
    .select('id')
    .single()

  if (error || !attempt) return { error: error?.message ?? 'Failed to create attempt' }
  return { attemptId: attempt.id }
}

// ─── loadAttemptConfig ────────────────────────────────────────────────────────

export async function loadAttemptConfig(attemptId: string): Promise<{
  config:    MockTestConfig
  questions: MockQuestion[]
} | { error: string }> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: attempt } = await supabase
    .from('mock_test_attempts')
    .select('*, mock_tests(*)')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .single()

  if (!attempt) return { error: 'Attempt not found' }

  const mt = attempt.mock_tests as Record<string, unknown> | null
  if (!mt) return { error: 'Test configuration not found. The test may have been deleted.' }
  const config: MockTestConfig = {
    id:            mt.id as string,
    title:         mt.title as string,
    mode:          mt.mode as MockTestConfig['mode'],
    course:        mt.course as string | null,
    topicPrefixes: mt.topic_prefixes as string[],
    testDate:      mt.test_date as string | null,
    questionCount: mt.question_count as number,
    timeLimitMins: mt.time_limit_mins as number,
  }

  // Fetch question pool — use service client to bypass RLS on the questions table
  const svc = createSupabaseServiceClient()
  const prefixes = config.topicPrefixes ?? []
  const SELECT = 'id, outcome_id, difficulty_band, content_json, correct_answer, explanation'

  // Core topics used when running a full-curriculum HSC/Prelim/NAPLAN mode
  const CORE_TOPICS = [
    'MA-CALC-D01','MA-CALC-D03','MA-CALC-D08','MA-CALC-D09',
    'MA-CALC-I01','MA-CALC-I06','MA-CALC-I07',
    'MA-TRIG-01','MA-TRIG-04','MA-TRIG-09',
    'MA-EXP-02','MA-EXP-03','MA-EXP-05',
    'MA-ALG-01','MA-ALG-06',
    'MA-STAT-02','MA-STAT-05','MA-PROB-01',
  ]

  type QRow = Record<string, unknown>

  const fetchPool = async (): Promise<QRow[]> => {
    if (prefixes.length > 0) {
      const outcomeIds = prefixes.flatMap(p => [1,2,3,4,5,6].map(b => `${p}-B${b}`))
      const { data: exact, error: e1 } = await svc
        .from('questions').select(SELECT).in('outcome_id', outcomeIds).limit(3000)
      if (e1) return []
      if ((exact ?? []).length > 0) return exact as QRow[]
      // fallback: LIKE match
      const rows: QRow[] = []
      for (const p of prefixes) {
        const { data: fb } = await svc.from('questions').select(SELECT).like('outcome_id', `${p}%`).limit(500)
        if (fb) rows.push(...(fb as QRow[]))
      }
      return rows
    } else {
      const { data } = await svc.from('questions').select(SELECT).limit(7000)
      return (data ?? []) as QRow[]
    }
  }

  let pool = await fetchPool()

  // If pool is empty, generate questions directly via Anthropic SDK then re-fetch
  if (pool.length === 0) {
    const topicsToGenerate = (prefixes.length > 0 ? prefixes : CORE_TOPICS).slice(0, 14)
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      const ai = new Anthropic({ apiKey })
      await Promise.all(topicsToGenerate.map(async (topic) => {
        try {
          // Skip if questions already exist for this topic
          const { data: ex } = await svc.from('questions').select('id').ilike('outcome_id', `${topic}-%`).limit(1)
          if (ex && ex.length > 0) return

          const res = await ai.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 3000,
            messages: [{ role: 'user', content:
              `Generate 6 multiple-choice NSW HSC Mathematics questions on: "${topic}". One per difficulty band 1–6.
Return ONLY a JSON array, no markdown:
[{"outcome_id":"${topic}-B1","difficulty_band":1,"question_text":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","correct_option":"a","explanation":"..."},...]` }],
          })
          const raw = res.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map(b => b.text).join('')
          const s = raw.indexOf('['), e = raw.lastIndexOf(']')
          if (s === -1 || e <= s) return
          const parsed = JSON.parse(raw.slice(s, e + 1)) as Record<string, unknown>[]
          if (!parsed.length) return
          await svc.from('questions').insert(parsed.map(q => ({
            outcome_id:      `${topic}-B${Math.max(1, Math.min(6, Number(q.difficulty_band ?? 3)))}`,
            course:          'Advanced Mathematics',
            difficulty_band: Math.max(1, Math.min(6, Number(q.difficulty_band ?? 3))),
            format:          'multiple_choice',
            content_json:    { question_text: String(q.question_text ?? ''), option_a: String(q.option_a ?? ''), option_b: String(q.option_b ?? ''), option_c: String(q.option_c ?? ''), option_d: String(q.option_d ?? '') },
            correct_answer:  String(q.correct_option ?? 'a').toLowerCase().charAt(0),
            explanation:     String(q.explanation ?? ''),
            step_by_step:    [],
            nesa_outcome_code: '',
            served_to:       [],
          })))
        } catch { /* skip failed topic */ }
      }))
    }
    pool = await fetchPool()
  }

  if (pool.length === 0) return { error: 'Question generation failed. Please try again in a moment.' }

  // Build adaptive question set:
  // Ensure coverage across all selected topics, then fill remaining with best spread
  const byPrefix: Record<string, QRow[]> = {}
  for (const q of pool) {
    const prefix = (q.outcome_id as string).replace(/-B\d+$/, '')
    if (!byPrefix[prefix]) byPrefix[prefix] = []
    byPrefix[prefix].push(q)
  }

  const selectedPrefixes = prefixes.length > 0 ? prefixes : Object.keys(byPrefix)
  const count = config.questionCount

  // Round-robin across topics to ensure coverage, shuffle within each topic
  const selected: QRow[] = []
  const shuffled: Record<string, QRow[]> = {}
  for (const p of selectedPrefixes) {
    shuffled[p] = shuffle(byPrefix[p] ?? [])
  }

  let round = 0
  while (selected.length < count) {
    let added = 0
    for (const p of selectedPrefixes) {
      if (selected.length >= count) break
      const q = (shuffled[p] ?? [])[round]
      if (q) { selected.push(q); added++ }
    }
    if (added === 0) break
    round++
  }

  // Shuffle the final list so same-topic questions aren't consecutive
  const finalList = shuffle(selected).slice(0, count)

  const questions: MockQuestion[] = finalList.map(q => {
    const c      = (q.content_json ?? {}) as Record<string, string>
    const prefix = (q.outcome_id as string).replace(/-B\d+$/, '')
    return {
      id:             q.id as string,
      topicPrefix:    prefix,
      topicName:      topicName(prefix),
      difficultyBand: q.difficulty_band as number,
      questionText:   c.question_text ?? '',
      optionA:        c.option_a ?? '',
      optionB:        c.option_b ?? '',
      optionC:        c.option_c ?? '',
      optionD:        c.option_d ?? '',
    }
  })

  return { config, questions }
}

// ─── finalizeMockAttempt ──────────────────────────────────────────────────────

export async function finalizeMockAttempt(params: {
  attemptId:    string
  timeTakenSecs: number
  timedOut:     boolean
  answers: Array<{
    questionId:     string
    position:       number
    topicPrefix:    string
    difficultyBand: number
    studentAnswer:  string | null
    questionText:   string
    optionA:        string
    optionB:        string
    optionC:        string
    optionD:        string
  }>
}): Promise<{ result: MockTestResult } | { error: string }> {
  try {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  // Verify attempt ownership
  const { data: attempt } = await supabase
    .from('mock_test_attempts')
    .select('id, mock_test_id, attempt_number, mock_tests(title, mode, topic_prefixes)')
    .eq('id', params.attemptId)
    .eq('user_id', user.id)
    .single()

  if (!attempt) return { error: 'Attempt not found' }

  // Re-fetch correct answers from DB (never trust client for correct_answer)
  const qIds = params.answers.map(a => a.questionId).filter(Boolean)
  const { data: rawQ } = qIds.length > 0
    ? await supabase.from('questions').select('id, correct_answer, explanation').in('id', qIds)
    : { data: [] }

  const qMap = new Map<string, { correct: string; explanation: string }>()
  for (const q of (rawQ ?? [])) {
    qMap.set(q.id as string, {
      correct:     ((q.correct_answer as string) ?? 'a').toLowerCase(),
      explanation: (q.explanation as string) ?? '',
    })
  }

  // Score answers
  let correctCount = 0
  const answerRows = params.answers.map((a, idx) => {
    const truth     = qMap.get(a.questionId)
    const isSkipped = a.studentAnswer === null
    const isCorrect = !isSkipped && a.studentAnswer?.toLowerCase() === truth?.correct
    if (isCorrect) correctCount++
    return {
      attempt_id:     params.attemptId,
      question_id:    a.questionId,
      position:       a.position ?? idx + 1,
      topic_prefix:   a.topicPrefix,
      difficulty_band: a.difficultyBand,
      student_answer: a.studentAnswer,
      correct_answer: truth?.correct ?? '',
      is_correct:     isCorrect,
      is_skipped:     isSkipped,
      explanation:    truth?.explanation ?? '',
      question_text:  a.questionText,
      option_a:       a.optionA,
      option_b:       a.optionB,
      option_c:       a.optionC,
      option_d:       a.optionD,
    }
  })

  const total    = answerRows.length
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const band     = predictBand(scorePct)

  // Per-topic readiness
  const topicBuckets: Record<string, { correct: number; total: number }> = {}
  for (const a of answerRows) {
    if (!topicBuckets[a.topic_prefix]) topicBuckets[a.topic_prefix] = { correct: 0, total: 0 }
    topicBuckets[a.topic_prefix].total++
    if (a.is_correct) topicBuckets[a.topic_prefix].correct++
  }
  const readiness: Record<string, 'ready' | 'nearly' | 'needs_work'> = {}
  for (const [prefix, bucket] of Object.entries(topicBuckets)) {
    const acc = bucket.total > 0 ? bucket.correct / bucket.total : 0
    readiness[prefix] = acc >= 0.8 ? 'ready' : acc >= 0.5 ? 'nearly' : 'needs_work'
  }

  // Save answers + update attempt
  await supabase.from('mock_test_answers').insert(answerRows)
  await supabase.from('mock_test_attempts').update({
    status:          params.timedOut ? 'timed_out' : 'completed',
    completed_at:    new Date().toISOString(),
    time_taken_secs: params.timeTakenSecs,
    score_pct:       scorePct,
    predicted_band:  band,
    readiness,
  }).eq('id', params.attemptId)

  const mt = attempt.mock_tests as unknown as Record<string, unknown>
  const result: MockTestResult = {
    attemptId:     params.attemptId,
    mockTestId:    attempt.mock_test_id as string,
    title:         mt.title as string,
    mode:          mt.mode as string,
    attemptNumber: attempt.attempt_number as number,
    scorePct,
    predictedBand: band,
    timeTakenSecs: params.timeTakenSecs,
    readiness,
    answers: answerRows.map(a => ({
      questionId:     a.question_id,
      position:       a.position,
      topicPrefix:    a.topic_prefix,
      topicName:      topicName(a.topic_prefix),
      difficultyBand: a.difficulty_band,
      questionText:   a.question_text,
      optionA:        a.option_a,
      optionB:        a.option_b,
      optionC:        a.option_c,
      optionD:        a.option_d,
      studentAnswer:  a.student_answer,
      correctAnswer:  a.correct_answer,
      isCorrect:      a.is_correct,
      isSkipped:      a.is_skipped,
      explanation:    a.explanation,
      stepByStep:     [],
    })),
  }

  return { result }
  } catch (err) {
    console.error('finalizeMockAttempt error:', err)
    return { error: err instanceof Error ? err.message : 'Unknown error during submission' }
  }
}

// ─── getAttemptResult ─────────────────────────────────────────────────────────

export async function getAttemptResult(attemptId: string): Promise<MockTestResult | null> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: attempt } = await supabase
    .from('mock_test_attempts')
    .select('*, mock_tests(title, mode)')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .single()

  if (!attempt) return null

  const { data: answers } = await supabase
    .from('mock_test_answers')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('position')

  // Fetch step_by_step from questions table for rich explanations
  const qIds = (answers ?? []).map(a => a.question_id as string).filter(Boolean)
  const { data: qRows } = qIds.length > 0
    ? await supabase.from('questions').select('id, step_by_step').in('id', qIds)
    : { data: [] }
  const stepMap = new Map<string, string[]>()
  for (const q of (qRows ?? [])) {
    stepMap.set(q.id as string, Array.isArray(q.step_by_step) ? (q.step_by_step as string[]) : [])
  }

  const mt = attempt.mock_tests as Record<string, unknown>
  return {
    attemptId,
    mockTestId:    attempt.mock_test_id as string,
    title:         mt.title as string,
    mode:          mt.mode as string,
    attemptNumber: attempt.attempt_number as number,
    scorePct:      Number(attempt.score_pct ?? 0),
    predictedBand: (attempt.predicted_band as number) ?? 1,
    timeTakenSecs: (attempt.time_taken_secs as number) ?? 0,
    readiness:     (attempt.readiness as Record<string, 'ready' | 'nearly' | 'needs_work'>) ?? {},
    answers: (answers ?? []).map(a => ({
      questionId:     a.question_id as string,
      position:       a.position as number,
      topicPrefix:    a.topic_prefix as string,
      topicName:      topicName(a.topic_prefix as string),
      difficultyBand: a.difficulty_band as number,
      questionText:   a.question_text as string,
      optionA:        a.option_a as string,
      optionB:        a.option_b as string,
      optionC:        a.option_c as string,
      optionD:        a.option_d as string,
      studentAnswer:  a.student_answer as string | null,
      correctAnswer:  (a.correct_answer as string) ?? '',
      isCorrect:      a.is_correct as boolean,
      isSkipped:      a.is_skipped as boolean,
      explanation:    a.explanation as string,
      stepByStep:     stepMap.get(a.question_id as string) ?? [],
    })),
  }
}

// ─── getMockTestHistory ───────────────────────────────────────────────────────

export async function getMockTestHistory(): Promise<HistoryAttempt[]> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data } = await supabase
    .from('mock_test_attempts')
    .select('*, mock_tests(title, mode, topic_prefixes, question_count)')
    .eq('user_id', user.id)
    .in('status', ['completed', 'timed_out'])
    .order('completed_at', { ascending: false })
    .limit(100)

  return (data ?? []).map(row => {
    const mt = row.mock_tests as Record<string, unknown>
    const prefixes = (mt.topic_prefixes as string[]) ?? []
    return {
      attemptId:     row.id as string,
      mockTestId:    row.mock_test_id as string,
      title:         mt.title as string,
      mode:          mt.mode as string,
      attemptNumber: row.attempt_number as number,
      scorePct:      Number(row.score_pct ?? 0),
      predictedBand: (row.predicted_band as number) ?? 1,
      timeTakenSecs: (row.time_taken_secs as number) ?? 0,
      completedAt:   (row.completed_at as string) ?? '',
      topicCount:    prefixes.length,
    }
  })
}

// ─── getMockTestsForUser ──────────────────────────────────────────────────────

export async function getMockTestsForUser(): Promise<Array<{
  id: string; title: string; mode: string; testDate: string | null;
  questionCount: number; timeLimitMins: number; attemptCount: number;
  lastScore: number | null; lastBand: number | null;
}>> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: tests } = await supabase
    .from('mock_tests')
    .select('*, mock_test_attempts(score_pct, predicted_band, status, attempt_number)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (tests ?? []).map(t => {
    const attempts = ((t.mock_test_attempts as Array<Record<string,unknown>>) ?? [])
      .filter(a => a.status === 'completed' || a.status === 'timed_out')
    const last = attempts.sort((a,b) => (b.attempt_number as number) - (a.attempt_number as number))[0]
    return {
      id:            t.id as string,
      title:         t.title as string,
      mode:          t.mode as string,
      testDate:      t.test_date as string | null,
      questionCount: t.question_count as number,
      timeLimitMins: t.time_limit_mins as number,
      attemptCount:  attempts.length,
      lastScore:     last ? Number(last.score_pct) : null,
      lastBand:      last ? (last.predicted_band as number) : null,
    }
  })
}

// ─── saveTestPhoto ────────────────────────────────────────────────────────────

export async function saveTestPhoto(params: {
  attemptId:     string
  storagePath:   string
  photoUrl:      string
  questionRefs:  number[]
  caption:       string
}): Promise<{ error?: string }> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('mock_test_photos').insert({
    attempt_id:    params.attemptId,
    user_id:       user.id,
    photo_url:     params.photoUrl,
    storage_path:  params.storagePath,
    question_refs: params.questionRefs,
    caption:       params.caption,
  })
  return error ? { error: error.message } : {}
}

// ─── getTestPhotos ────────────────────────────────────────────────────────────

export async function getTestPhotos(attemptId: string): Promise<Array<{
  id: string; photoUrl: string; questionRefs: number[]; caption: string
}>> {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('mock_test_photos')
    .select('id, photo_url, question_refs, caption')
    .eq('attempt_id', attemptId)
    .eq('user_id', user.id)
    .order('uploaded_at')
  return (data ?? []).map(r => ({
    id:           r.id as string,
    photoUrl:     r.photo_url as string,
    questionRefs: r.question_refs as number[],
    caption:      r.caption as string,
  }))
}
