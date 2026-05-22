import { requireAuth }                from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ProgressView                   from './ProgressView'
import type { TopicStat, NextMove }   from './ProgressView'

// ─── Topic catalogue ────────────────────────────────────────────────────────────

const TOPIC_META: Record<string, { name: string; category: string }> = {
  // ── MA-C1: Introduction to Differentiation (Year 11) ──────────────────────
  'MA-CALC-D00': { name: 'First principles',             category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D01': { name: 'Differentiation basics',      category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D02': { name: 'Product & quotient rule',     category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D03': { name: 'Chain rule',                  category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D07': { name: 'Tangents & normals',          category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D08': { name: 'Stationary points',           category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D09': { name: 'Optimisation',                category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D10': { name: 'Rates of change',             category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D11': { name: 'Concavity',                   category: 'MA-C1 · Introduction to Differentiation' },
  'MA-CALC-D12': { name: 'Implicit differentiation',    category: 'MA-C1 · Introduction to Differentiation' },
  // ── MA-C2/C3: Differential Calculus (Year 12) ────────────────────────────
  'MA-CALC-D04': { name: 'Trig derivatives',            category: 'MA-C2/C3 · Differential Calculus' },
  'MA-CALC-D05': { name: 'Exp derivatives',             category: 'MA-C2/C3 · Differential Calculus' },
  'MA-CALC-D06': { name: 'Log derivatives',             category: 'MA-C2/C3 · Differential Calculus' },
  // ── MA-C4: Integral Calculus (Year 12) ───────────────────────────────────
  'MA-CALC-I01': { name: 'Antiderivatives',             category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I02': { name: 'Polynomial integrals',        category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I03': { name: 'Trig integration',            category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I04': { name: 'Exp & log integration',       category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I05': { name: 'Integration by substitution', category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I06': { name: 'Definite integrals',          category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I07': { name: 'Area under a curve',          category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I08': { name: 'Area between curves',         category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I09': { name: 'Volumes of revolution',       category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I10': { name: 'Kinematics',                  category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I11': { name: 'Numerical integration',       category: 'MA-C4 · Integral Calculus' },
  'MA-CALC-I12': { name: 'Exp growth & decay',          category: 'MA-C4 · Integral Calculus' },
  // ── MA-T1: Trigonometry & Measure of Angles (Year 11) ────────────────────
  'MA-TRIG-01':  { name: 'Exact trig values',           category: 'MA-T1 · Trigonometric Functions' },
  'MA-TRIG-02':  { name: 'Trig graphs',                 category: 'MA-T1 · Trigonometric Functions' },
  'MA-TRIG-09':  { name: 'Radians',                     category: 'MA-T1 · Trigonometric Functions' },
  'MA-TRIG-07':  { name: 'Sine & cosine rule',          category: 'MA-T1 · Trigonometric Functions' },
  'MA-TRIG-08':  { name: 'Bearings & 3D trig',          category: 'MA-T1 · Trigonometric Functions' },
  // ── MA-T2/T3: Trig Functions & Equations (Year 12) ───────────────────────
  'MA-TRIG-03':  { name: 'Trig identities',             category: 'MA-T2/T3 · Trigonometric Functions' },
  'MA-TRIG-04':  { name: 'Trig equations',              category: 'MA-T2/T3 · Trigonometric Functions' },
  'MA-TRIG-05':  { name: 'Inverse trig',                category: 'MA-T2/T3 · Trigonometric Functions' },
  'MA-TRIG-06':  { name: 'Compound angles',             category: 'MA-T2/T3 · Trigonometric Functions' },
  // ── MA-E1: Logarithms & Exponentials (Year 11) ───────────────────────────
  'MA-EXP-01':   { name: 'Exp graphs',                  category: 'MA-E1 · Exponential & Log Functions' },
  'MA-EXP-02':   { name: 'Exp equations',               category: 'MA-E1 · Exponential & Log Functions' },
  'MA-EXP-03':   { name: 'Log laws',                    category: 'MA-E1 · Exponential & Log Functions' },
  'MA-EXP-04':   { name: 'Log equations',               category: 'MA-E1 · Exponential & Log Functions' },
  'MA-EXP-05':   { name: 'Natural log',                 category: 'MA-E1 · Exponential & Log Functions' },
  // ── MA-E2: Applications (Year 12) ────────────────────────────────────────
  'MA-EXP-06':   { name: 'Exp applications',            category: 'MA-E2 · Applications of Exp & Log' },
  // ── MA-F1: Working with Functions (Year 11) ──────────────────────────────
  'MA-ALG-01':   { name: 'Quadratics',                  category: 'MA-F1 · Functions' },
  'MA-ALG-02':   { name: 'Quadratic graphs',            category: 'MA-F1 · Functions' },
  'MA-ALG-03':   { name: 'Simultaneous equations',      category: 'MA-F1 · Functions' },
  'MA-ALG-04':   { name: 'Polynomials',                 category: 'MA-F1 · Functions' },
  'MA-ALG-05':   { name: 'Inequalities',                category: 'MA-F1 · Functions' },
  'MA-ALG-06':   { name: 'Arithmetic sequences',        category: 'MA-F1 · Functions' },
  'MA-ALG-07':   { name: 'Geometric sequences',         category: 'MA-F1 · Functions' },
  'MA-ALG-08':   { name: 'Surds',                       category: 'MA-F1 · Functions' },
  'MA-FUNC-01':  { name: 'Domain & range',              category: 'MA-F1 · Functions' },
  'MA-FUNC-02':  { name: 'Types of functions',          category: 'MA-F1 · Functions' },
  'MA-FUNC-03':  { name: 'Composite functions',         category: 'MA-F1 · Functions' },
  'MA-FUNC-04':  { name: 'Inverse functions',           category: 'MA-F1 · Functions' },
  'MA-FUNC-05':  { name: 'Transformations',             category: 'MA-F1 · Functions' },
  'MA-FUNC-06':  { name: 'Absolute value',              category: 'MA-F1 · Functions' },
  // ── MA-F2: Graphing Techniques (Year 12) ─────────────────────────────────
  'MA-FUNC-07':  { name: 'Polynomial graphs',           category: 'MA-F2 · Graphing Techniques' },
  'MA-FUNC-08':  { name: 'Rational functions',          category: 'MA-F2 · Graphing Techniques' },
  'MA-FUNC-09':  { name: 'Limits',                      category: 'MA-F2 · Graphing Techniques' },
  'MA-COORD-01': { name: 'Distance & midpoint',         category: 'MA-F2 · Graphing Techniques' },
  'MA-COORD-02': { name: 'Lines',                       category: 'MA-F2 · Graphing Techniques' },
  'MA-COORD-03': { name: 'Circles',                     category: 'MA-F2 · Graphing Techniques' },
  'MA-COORD-04': { name: 'Parabolas',                   category: 'MA-F2 · Graphing Techniques' },
  'MA-COORD-05': { name: 'Locus',                       category: 'MA-F2 · Graphing Techniques' },
  // ── MA-S1: Probability & Discrete Distributions (Year 11) ────────────────
  'MA-STAT-01':  { name: 'Data representation',         category: 'MA-S1 · Statistical Analysis' },
  'MA-STAT-02':  { name: 'Central tendency',            category: 'MA-S1 · Statistical Analysis' },
  'MA-STAT-03':  { name: 'Spread',                      category: 'MA-S1 · Statistical Analysis' },
  'MA-PROB-01':  { name: 'Basic probability',           category: 'MA-S1 · Statistical Analysis' },
  'MA-PROB-02':  { name: 'Conditional probability',     category: 'MA-S1 · Statistical Analysis' },
  'MA-PROB-03':  { name: 'Discrete distributions',      category: 'MA-S1 · Statistical Analysis' },
  'MA-PROB-04':  { name: 'Binomial distribution',       category: 'MA-S1 · Statistical Analysis' },
  'MA-PROB-05':  { name: 'Counting techniques',         category: 'MA-S1 · Statistical Analysis' },
  // ── MA-S2–S4: Continuous Distributions & Inference (Year 12) ─────────────
  'MA-STAT-04':  { name: 'Regression',                  category: 'MA-S2–S4 · Statistical Analysis' },
  'MA-STAT-05':  { name: 'Normal distribution',         category: 'MA-S2–S4 · Statistical Analysis' },
  'MA-STAT-06':  { name: 'Sampling & inference',        category: 'MA-S2–S4 · Statistical Analysis' },
  // ── Financial Mathematics ─────────────────────────────────────────────────
  'MA-FIN-01':   { name: 'Simple interest',             category: 'Financial Mathematics' },
  'MA-FIN-02':   { name: 'Compound interest',           category: 'Financial Mathematics' },
  'MA-FIN-03':   { name: 'Annuities',                   category: 'Financial Mathematics' },
  'MA-FIN-04':   { name: 'Loans',                       category: 'Financial Mathematics' },
  'MA-FIN-05':   { name: 'Investment analysis',         category: 'Financial Mathematics' },
  // ── Extension Topics ──────────────────────────────────────────────────────
  'MA-EXT-01':   { name: 'Mathematical induction',      category: 'Extension Topics' },
  'MA-EXT-02':   { name: 'Binomial theorem',            category: 'Extension Topics' },
  'MA-EXT-03':   { name: 'Integration by parts',        category: 'Extension Topics' },
  'MA-EXT-04':   { name: 'Differential equations',      category: 'Extension Topics' },
  'MA-EXT-05':   { name: 'Projectile motion',           category: 'Extension Topics' },
  'MA-EXT-06':   { name: 'Vectors',                     category: 'Extension Topics' },
  'MA-EXT-07':   { name: 'Complex numbers',             category: 'Extension Topics' },
  'MA-EXT-08':   { name: 'Further trigonometry',        category: 'Extension Topics' },
  // ── Year 9 — NSW Stage 5 ──────────────────────────────────────────────────────
  'NSW9-IDX-01':   { name: 'Index laws',                    category: 'Year 9 · Indices & Surds' },
  'NSW9-IDX-02':   { name: 'Negative & zero indices',       category: 'Year 9 · Indices & Surds' },
  'NSW9-SUR-01':   { name: 'Surds & irrational numbers',    category: 'Year 9 · Indices & Surds' },
  'NSW9-CON-01':   { name: 'Consumer arithmetic',           category: 'Year 9 · Number' },
  'NSW9-FIN-01':   { name: 'Financial maths basics',        category: 'Year 9 · Number' },
  'NSW9-ALG-01':   { name: 'Algebraic techniques',          category: 'Year 9 · Algebra' },
  'NSW9-ALG-02':   { name: 'Algebraic fractions',           category: 'Year 9 · Algebra' },
  'NSW9-LIN-01':   { name: 'Linear equations',              category: 'Year 9 · Linear Relationships' },
  'NSW9-LIN-02':   { name: 'Linear graphs & gradient',      category: 'Year 9 · Linear Relationships' },
  'NSW9-SIM-01':   { name: 'Simultaneous equations',        category: 'Year 9 · Linear Relationships' },
  'NSW9-INEQ-01':  { name: 'Linear inequalities',           category: 'Year 9 · Linear Relationships' },
  'NSW9-GEOM-01':  { name: 'Properties of shapes',          category: 'Year 9 · Geometry' },
  'NSW9-GEOM-02':  { name: "Pythagoras' theorem",           category: 'Year 9 · Geometry' },
  'NSW9-GEOM-03':  { name: 'Similarity & scale',            category: 'Year 9 · Geometry' },
  'NSW9-TRIG-01':  { name: 'Sin, cos & tan ratios',         category: 'Year 9 · Trigonometry' },
  'NSW9-TRIG-02':  { name: 'Elevation & depression',        category: 'Year 9 · Trigonometry' },
  'NSW9-MEAS-01':  { name: 'Area & volume',                 category: 'Year 9 · Measurement' },
  'NSW9-GRAPH-01': { name: 'Non-linear graphs',             category: 'Year 9 · Graphs & Functions' },
  'NSW9-STAT-01':  { name: 'Data analysis',                 category: 'Year 9 · Statistics' },
  'NSW9-STAT-02':  { name: 'Bivariate data',                category: 'Year 9 · Statistics' },
  'NSW9-PROB-01':  { name: 'Probability',                   category: 'Year 9 · Probability' },
  // ── Year 10 — NSW Stage 5 ─────────────────────────────────────────────────────
  'NSW10-ALG-01':   { name: 'Factorisation',                category: 'Year 10 · Algebra' },
  'NSW10-ALG-02':   { name: 'Quadratic equations',          category: 'Year 10 · Algebra' },
  'NSW10-ALG-03':   { name: 'Polynomial expressions',       category: 'Year 10 · Algebra' },
  'NSW10-ALG-04':   { name: 'Further algebra',              category: 'Year 10 · Algebra' },
  'NSW10-SIM-01':   { name: 'Simultaneous equations',       category: 'Year 10 · Algebra' },
  'NSW10-PROOF-01': { name: 'Algebraic & geometric proof',  category: 'Year 10 · Algebra' },
  'NSW10-FUNC-01':  { name: 'Quadratic graphs',             category: 'Year 10 · Functions & Graphs' },
  'NSW10-FUNC-02':  { name: 'Non-linear functions',         category: 'Year 10 · Functions & Graphs' },
  'NSW10-EXP-01':   { name: 'Exponential functions',        category: 'Year 10 · Functions & Graphs' },
  'NSW10-GRAPH-01': { name: 'Hyperbola & inverse proportion',category: 'Year 10 · Functions & Graphs' },
  'NSW10-LOG-01':   { name: 'Introduction to logarithms',   category: 'Year 10 · Functions & Graphs' },
  'NSW10-COORD-01': { name: 'Coordinate geometry',          category: 'Year 10 · Functions & Graphs' },
  'NSW10-TRIG-01':  { name: 'Sine & cosine rule',           category: 'Year 10 · Trigonometry' },
  'NSW10-TRIG-02':  { name: 'Bearings & 3D problems',       category: 'Year 10 · Trigonometry' },
  'NSW10-MEAS-01':  { name: 'Surface area & volume',        category: 'Year 10 · Measurement' },
  'NSW10-GEOM-01':  { name: 'Circle geometry theorems',     category: 'Year 10 · Geometry' },
  'NSW10-STAT-01':  { name: 'Data & regression',            category: 'Year 10 · Statistics' },
  'NSW10-PROB-01':  { name: 'Conditional probability',      category: 'Year 10 · Probability' },
  'NSW10-PROB-02':  { name: 'Two-way tables & Venn diagrams',category: 'Year 10 · Probability' },
}

// ─── HSC topic weights (approximate exam mark weighting) ────────────────────────
// Calculus ~35%, Trig ~15%, Functions ~15%, Exp/Log ~10%,
// Algebra ~10%, Stats/Prob ~10%, Coord Geom ~5%

const TOPIC_WEIGHTS: Record<string, number> = {
  'MA-CALC-D01': 3, 'MA-CALC-D02': 3, 'MA-CALC-D03': 3, 'MA-CALC-D04': 2,
  'MA-CALC-D05': 2, 'MA-CALC-D06': 2, 'MA-CALC-D07': 2, 'MA-CALC-D08': 3,
  'MA-CALC-D09': 3, 'MA-CALC-D10': 2, 'MA-CALC-D11': 2, 'MA-CALC-D12': 1,
  'MA-CALC-I01': 2, 'MA-CALC-I02': 2, 'MA-CALC-I03': 2, 'MA-CALC-I04': 2,
  'MA-CALC-I05': 3, 'MA-CALC-I06': 3, 'MA-CALC-I07': 3, 'MA-CALC-I08': 3,
  'MA-CALC-I09': 2, 'MA-CALC-I10': 2, 'MA-CALC-I11': 1, 'MA-CALC-I12': 2,
  'MA-TRIG-01': 2, 'MA-TRIG-02': 2, 'MA-TRIG-03': 2, 'MA-TRIG-04': 2,
  'MA-TRIG-05': 2, 'MA-TRIG-06': 3, 'MA-TRIG-07': 2, 'MA-TRIG-08': 1, 'MA-TRIG-09': 2,
  'MA-EXP-01': 2, 'MA-EXP-02': 2, 'MA-EXP-03': 2,
  'MA-EXP-04': 2, 'MA-EXP-05': 2, 'MA-EXP-06': 2,
  'MA-FUNC-01': 2, 'MA-FUNC-02': 2, 'MA-FUNC-03': 2, 'MA-FUNC-04': 2,
  'MA-FUNC-05': 2, 'MA-FUNC-06': 1, 'MA-FUNC-07': 2, 'MA-FUNC-08': 1, 'MA-FUNC-09': 1,
  'MA-ALG-01': 2, 'MA-ALG-02': 2, 'MA-ALG-03': 2, 'MA-ALG-04': 2,
  'MA-ALG-05': 1, 'MA-ALG-06': 2, 'MA-ALG-07': 2, 'MA-ALG-08': 1,
  'MA-STAT-01': 1, 'MA-STAT-02': 1, 'MA-STAT-03': 1, 'MA-STAT-04': 2,
  'MA-STAT-05': 2, 'MA-STAT-06': 2,
  'MA-PROB-01': 1, 'MA-PROB-02': 2, 'MA-PROB-03': 2, 'MA-PROB-04': 2, 'MA-PROB-05': 1,
  'MA-FIN-01': 1, 'MA-FIN-02': 1, 'MA-FIN-03': 2, 'MA-FIN-04': 2, 'MA-FIN-05': 1,
  'MA-COORD-01': 1, 'MA-COORD-02': 1, 'MA-COORD-03': 1, 'MA-COORD-04': 1, 'MA-COORD-05': 1,
  'MA-EXT-01': 1, 'MA-EXT-02': 1, 'MA-EXT-03': 1, 'MA-EXT-04': 1,
  'MA-EXT-05': 1, 'MA-EXT-06': 1, 'MA-EXT-07': 1, 'MA-EXT-08': 1,
  'MA-CALC-D00': 2,
  // Year 9
  'NSW9-IDX-01': 1, 'NSW9-IDX-02': 1, 'NSW9-SUR-01': 1, 'NSW9-CON-01': 1,
  'NSW9-FIN-01': 1, 'NSW9-ALG-01': 1, 'NSW9-ALG-02': 1,
  'NSW9-LIN-01': 1, 'NSW9-LIN-02': 1, 'NSW9-SIM-01': 1, 'NSW9-INEQ-01': 1,
  'NSW9-GEOM-01': 1, 'NSW9-GEOM-02': 1, 'NSW9-GEOM-03': 1,
  'NSW9-TRIG-01': 1, 'NSW9-TRIG-02': 1, 'NSW9-MEAS-01': 1, 'NSW9-GRAPH-01': 1,
  'NSW9-STAT-01': 1, 'NSW9-STAT-02': 1, 'NSW9-PROB-01': 1,
  // Year 10
  'NSW10-ALG-01': 1, 'NSW10-ALG-02': 1, 'NSW10-ALG-03': 1, 'NSW10-ALG-04': 1,
  'NSW10-SIM-01': 1, 'NSW10-PROOF-01': 1,
  'NSW10-FUNC-01': 1, 'NSW10-FUNC-02': 1, 'NSW10-EXP-01': 1,
  'NSW10-GRAPH-01': 1, 'NSW10-LOG-01': 1, 'NSW10-COORD-01': 1,
  'NSW10-TRIG-01': 1, 'NSW10-TRIG-02': 1, 'NSW10-MEAS-01': 1,
  'NSW10-GEOM-01': 1, 'NSW10-STAT-01': 1, 'NSW10-PROB-01': 1, 'NSW10-PROB-02': 1,
}

// ─── Band computation (weighted, coverage-honest) ────────────────────────────────

function computeBand(weightedMastery: number, coveragePct: number, testedCount: number): {
  band: number; confidence: 'low' | 'medium' | 'high'
} {
  let band =
    weightedMastery >= 85 ? 6 :
    weightedMastery >= 70 ? 5 :
    weightedMastery >= 55 ? 4 :
    weightedMastery >= 40 ? 3 :
    weightedMastery >= 25 ? 2 : 1

  // Coverage penalty: cap prediction if we haven't seen enough topics
  if (testedCount === 0)        band = 1
  else if (coveragePct < 15)    band = Math.min(band, 3)
  else if (coveragePct < 30)    band = Math.min(band, 4)

  const confidence: 'low' | 'medium' | 'high' =
    coveragePct >= 50 ? 'high' :
    coveragePct >= 20 ? 'medium' : 'low'

  return { band, confidence }
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function ProgressPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  // UTC midnight for "today" query
  const todayMidnight = new Date()
  todayMidnight.setUTCHours(0, 0, 0, 0)
  const todayStr = todayMidnight.toISOString()
  const nowStr   = new Date().toISOString()

  // ── Parallel fetch everything ──────────────────────────────────────────────────
  const [masteryRes, profileRes, userRes, streakRes, todayCountRes] = await Promise.all([
    supabase
      .from('mastery_map')
      .select('outcome_id, confidence_pct, next_review_at')
      .eq('user_id', user.id),
    supabase
      .from('student_profiles')
      .select('year_group')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('users')
      .select('display_name')
      .eq('id', user.id)
      .single(),
    supabase
      .from('streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('error_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStr),
  ])

  const masteryRows  = masteryRes.data  ?? []
  const yearGroup    = (profileRes.data  as { year_group?: string }   | null)?.year_group    ?? 'year_12'
  const displayName  = (userRes.data     as { display_name?: string } | null)?.display_name
    ?? user.email?.split('@')[0] ?? 'Student'
  const currentStreak  = (streakRes.data  as { current_streak?: number; longest_streak?: number } | null)?.current_streak  ?? 0
  const longestStreak  = (streakRes.data  as { current_streak?: number; longest_streak?: number } | null)?.longest_streak  ?? 0
  const todayCount     = todayCountRes.count ?? 0
  const dailyGoal      = 10   // questions per day target

  const YEAR_LABEL: Record<string, string> = {
    year_9: 'Year 9', year_10: 'Year 10',
    year_11: 'Year 11', year_12: 'Year 12',
  }

  // ── Aggregate mastery_map by topic prefix ──────────────────────────────────────
  const prefixConfMap:    Record<string, number[]> = {}
  const prefixOverdueMap: Record<string, boolean>  = {}

  for (const row of masteryRows) {
    const prefix = row.outcome_id.replace(/-B\d+$/, '')
    if (!prefixConfMap[prefix]) prefixConfMap[prefix] = []
    prefixConfMap[prefix].push(row.confidence_pct)
    // Mark overdue only for topics genuinely tested (confidence > 0)
    if (row.next_review_at && row.next_review_at <= nowStr && row.confidence_pct > 0) {
      prefixOverdueMap[prefix] = true
    }
  }

  // ── Build full topic list ──────────────────────────────────────────────────────
  const topicStats: TopicStat[] = Object.keys(TOPIC_META).map(prefix => {
    const vals = prefixConfMap[prefix]
    const avg  = vals && vals.length > 0
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : null
    return {
      prefix,
      name:     TOPIC_META[prefix].name,
      category: TOPIC_META[prefix].category,
      avg,
      overdue:  prefixOverdueMap[prefix] ?? false,
    }
  })

  // ── Summary counts ──────────────────────────────────────────────────────────────
  // "tested" = student has genuinely engaged with this topic (confidence > 0).
  // confidence_pct = 0 means a row was seeded as untested (old behaviour) — treat
  // those the same as null so band predictions stay honest.
  const tested   = topicStats.filter(t => t.avg !== null && t.avg > 0)
  const mastered = tested.filter(t => (t.avg ?? 0) >= 80).length
  const shaky    = tested.filter(t => (t.avg ?? 0) >= 50 && (t.avg ?? 0) < 80).length
  const gap      = tested.filter(t => (t.avg ?? 0) < 50).length
  const untested = topicStats.length - tested.length

  // ── Weighted band prediction ───────────────────────────────────────────────────
  let weightedSum   = 0
  let weightedTotal = 0
  for (const t of tested) {
    const w = TOPIC_WEIGHTS[t.prefix] ?? 1
    weightedSum   += (t.avg ?? 0) * w
    weightedTotal += w
  }
  const weightedMastery = weightedTotal > 0
    ? Math.round(weightedSum / weightedTotal)
    : 0
  const coveragePct = Math.round((tested.length / topicStats.length) * 100)

  const { band: predictedBand, confidence: bandConfidence } =
    computeBand(weightedMastery, coveragePct, tested.length)
  const targetBand = predictedBand >= 5 ? 6 : predictedBand + 2

  // ── 6 Smart Next Moves ─────────────────────────────────────────────────────────
  const addedPrefixes = new Set<string>()
  const nextMoves: NextMove[] = []

  function tryAdd(t: TopicStat | undefined, type: NextMove['type']): void {
    if (!t || addedPrefixes.has(t.prefix) || nextMoves.length >= 6) return
    addedPrefixes.add(t.prefix)
    nextMoves.push({ type, prefix: t.prefix, name: t.name, avg: t.avg })
  }

  // 1. Quick Win — closest to mastered (65–79%)
  const quickWin =
    tested.filter(t => (t.avg ?? 0) >= 65 && (t.avg ?? 0) < 80)
      .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0]
    ?? tested.filter(t => (t.avg ?? 0) >= 50 && (t.avg ?? 0) < 80)
        .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0]

  // 2. Urgent Gap — weakest started topic
  const urgentGap = tested
    .filter(t => (t.avg ?? 0) > 0 && (t.avg ?? 0) < 50)
    .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))[0]

  // 3. Due for Review — overdue for spaced repetition
  const dueForReview = tested
    .filter(t => t.overdue)
    .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))[0]   // lowest overdue first

  // 4. Fresh Start — first untested topic (catalog order = prerequisite order)
  const freshStart = topicStats.find(t => t.avg === null)

  // 5. High Impact — highest-weight topic not yet mastered
  const highImpact = topicStats
    .filter(t => (t.avg ?? 0) < 80)
    .sort((a, b) => (TOPIC_WEIGHTS[b.prefix] ?? 1) - (TOPIC_WEIGHTS[a.prefix] ?? 1))[0]

  // 6. Building Momentum — mid-progress topic (30–64%), encourage continuation
  const buildingMomentum = tested
    .filter(t => (t.avg ?? 0) >= 30 && (t.avg ?? 0) < 65)
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0]

  tryAdd(quickWin,        'quickWin')
  tryAdd(urgentGap,       'urgentGap')
  tryAdd(dueForReview,    'dueForReview')
  tryAdd(freshStart,      'freshStart')
  tryAdd(highImpact,      'highImpact')
  tryAdd(buildingMomentum,'buildingMomentum')

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <ProgressView
        topics={topicStats}
        mastered={mastered}
        shaky={shaky}
        gap={gap}
        untested={untested}
        displayName={displayName}
        yearLabel={YEAR_LABEL[yearGroup] ?? 'HSC'}
        yearGroup={yearGroup}
        predictedBand={predictedBand}
        targetBand={targetBand}
        bandConfidence={bandConfidence}
        coveragePct={coveragePct}
        testedCount={tested.length}
        weightedMastery={weightedMastery}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        todayCount={todayCount}
        dailyGoal={dailyGoal}
        nextMoves={nextMoves}
      />
    </div>
  )
}
