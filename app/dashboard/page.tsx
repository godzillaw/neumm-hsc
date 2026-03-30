import { requireAuth } from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import DashboardContent, {
  type DashboardData,
  type TopicStat,
} from './DashboardContent'

// ─── Topic name lookup (mirrors onboarding/map/page.tsx) ───────────────────────
const TOPIC_META: Record<string, { name: string; category: string }> = {
  'MA-CALC-D01': { name: 'Differentiation basics',       category: 'Calculus — Differentiation' },
  'MA-CALC-D02': { name: 'Product & quotient rule',      category: 'Calculus — Differentiation' },
  'MA-CALC-D03': { name: 'Chain rule',                   category: 'Calculus — Differentiation' },
  'MA-CALC-D04': { name: 'Trig derivatives',             category: 'Calculus — Differentiation' },
  'MA-CALC-D05': { name: 'Exp derivatives',              category: 'Calculus — Differentiation' },
  'MA-CALC-D06': { name: 'Log derivatives',              category: 'Calculus — Differentiation' },
  'MA-CALC-D07': { name: 'Tangents & normals',           category: 'Calculus — Differentiation' },
  'MA-CALC-D08': { name: 'Stationary points',            category: 'Calculus — Differentiation' },
  'MA-CALC-D09': { name: 'Optimisation',                 category: 'Calculus — Differentiation' },
  'MA-CALC-D10': { name: 'Rates of change',              category: 'Calculus — Differentiation' },
  'MA-CALC-D11': { name: 'Concavity',                    category: 'Calculus — Differentiation' },
  'MA-CALC-D12': { name: 'Implicit diff',                category: 'Calculus — Differentiation' },
  'MA-CALC-I01': { name: 'Antiderivatives',              category: 'Calculus — Integration' },
  'MA-CALC-I02': { name: 'Polynomial integrals',         category: 'Calculus — Integration' },
  'MA-CALC-I03': { name: 'Trig integration',             category: 'Calculus — Integration' },
  'MA-CALC-I04': { name: 'Exp & log integration',        category: 'Calculus — Integration' },
  'MA-CALC-I05': { name: 'Integration by substitution',  category: 'Calculus — Integration' },
  'MA-CALC-I06': { name: 'Definite integrals',           category: 'Calculus — Integration' },
  'MA-CALC-I07': { name: 'Area under curve',             category: 'Calculus — Integration' },
  'MA-CALC-I08': { name: 'Area between curves',          category: 'Calculus — Integration' },
  'MA-CALC-I09': { name: 'Volumes of revolution',        category: 'Calculus — Integration' },
  'MA-CALC-I10': { name: 'Kinematics',                   category: 'Calculus — Integration' },
  'MA-CALC-I11': { name: 'Numerical integration',        category: 'Calculus — Integration' },
  'MA-CALC-I12': { name: 'Exp growth & decay',           category: 'Calculus — Integration' },
  'MA-TRIG-01':  { name: 'Exact trig values',            category: 'Trigonometry' },
  'MA-TRIG-02':  { name: 'Trig graphs',                  category: 'Trigonometry' },
  'MA-TRIG-03':  { name: 'Trig identities',              category: 'Trigonometry' },
  'MA-TRIG-04':  { name: 'Trig equations',               category: 'Trigonometry' },
  'MA-TRIG-05':  { name: 'Inverse trig',                 category: 'Trigonometry' },
  'MA-TRIG-06':  { name: 'Compound angles',              category: 'Trigonometry' },
  'MA-TRIG-07':  { name: 'Sine & cosine rule',           category: 'Trigonometry' },
  'MA-TRIG-08':  { name: 'Bearings & 3D trig',           category: 'Trigonometry' },
  'MA-TRIG-09':  { name: 'Radians',                      category: 'Trigonometry' },
  'MA-EXP-01':   { name: 'Exp graphs',                   category: 'Exponential & Logarithms' },
  'MA-EXP-02':   { name: 'Exp equations',                category: 'Exponential & Logarithms' },
  'MA-EXP-03':   { name: 'Log laws',                     category: 'Exponential & Logarithms' },
  'MA-EXP-04':   { name: 'Log equations',                category: 'Exponential & Logarithms' },
  'MA-EXP-05':   { name: 'Natural log',                  category: 'Exponential & Logarithms' },
  'MA-EXP-06':   { name: 'Exp applications',             category: 'Exponential & Logarithms' },
  'MA-FUNC-01':  { name: 'Domain & range',               category: 'Functions' },
  'MA-FUNC-02':  { name: 'Types of functions',           category: 'Functions' },
  'MA-FUNC-03':  { name: 'Composite functions',          category: 'Functions' },
  'MA-FUNC-04':  { name: 'Inverse functions',            category: 'Functions' },
  'MA-FUNC-05':  { name: 'Transformations',              category: 'Functions' },
  'MA-FUNC-06':  { name: 'Absolute value',               category: 'Functions' },
  'MA-FUNC-07':  { name: 'Polynomial graphs',            category: 'Functions' },
  'MA-FUNC-08':  { name: 'Rational functions',           category: 'Functions' },
  'MA-FUNC-09':  { name: 'Limits',                       category: 'Functions' },
  'MA-ALG-01':   { name: 'Quadratics',                   category: 'Algebra' },
  'MA-ALG-02':   { name: 'Quadratic graphs',             category: 'Algebra' },
  'MA-ALG-03':   { name: 'Simultaneous equations',       category: 'Algebra' },
  'MA-ALG-04':   { name: 'Polynomials',                  category: 'Algebra' },
  'MA-ALG-05':   { name: 'Inequalities',                 category: 'Algebra' },
  'MA-ALG-06':   { name: 'Arithmetic sequences',         category: 'Algebra' },
  'MA-ALG-07':   { name: 'Geometric sequences',          category: 'Algebra' },
  'MA-ALG-08':   { name: 'Surds',                        category: 'Algebra' },
  'MA-STAT-01':  { name: 'Data representation',          category: 'Statistics & Probability' },
  'MA-STAT-02':  { name: 'Central tendency',             category: 'Statistics & Probability' },
  'MA-STAT-03':  { name: 'Spread',                       category: 'Statistics & Probability' },
  'MA-STAT-04':  { name: 'Regression',                   category: 'Statistics & Probability' },
  'MA-STAT-05':  { name: 'Normal distribution',          category: 'Statistics & Probability' },
  'MA-STAT-06':  { name: 'Sampling',                     category: 'Statistics & Probability' },
  'MA-PROB-01':  { name: 'Basic probability',            category: 'Statistics & Probability' },
  'MA-PROB-02':  { name: 'Conditional probability',      category: 'Statistics & Probability' },
  'MA-PROB-03':  { name: 'Discrete distributions',       category: 'Statistics & Probability' },
  'MA-PROB-04':  { name: 'Binomial distribution',        category: 'Statistics & Probability' },
  'MA-PROB-05':  { name: 'Counting techniques',          category: 'Statistics & Probability' },
  'MA-FIN-01':   { name: 'Simple interest',              category: 'Financial Mathematics' },
  'MA-FIN-02':   { name: 'Compound interest',            category: 'Financial Mathematics' },
  'MA-FIN-03':   { name: 'Annuities',                    category: 'Financial Mathematics' },
  'MA-FIN-04':   { name: 'Loans',                        category: 'Financial Mathematics' },
  'MA-FIN-05':   { name: 'Investment analysis',          category: 'Financial Mathematics' },
  'MA-COORD-01': { name: 'Distance & midpoint',          category: 'Coordinate Geometry' },
  'MA-COORD-02': { name: 'Lines',                        category: 'Coordinate Geometry' },
  'MA-COORD-03': { name: 'Circles',                      category: 'Coordinate Geometry' },
  'MA-COORD-04': { name: 'Parabolas',                    category: 'Coordinate Geometry' },
  'MA-COORD-05': { name: 'Locus',                        category: 'Coordinate Geometry' },
  'MA-EXT-01':   { name: 'Induction',                    category: 'Extension Topics' },
  'MA-EXT-02':   { name: 'Binomial theorem',             category: 'Extension Topics' },
  'MA-EXT-03':   { name: 'Integration by parts',         category: 'Extension Topics' },
  'MA-EXT-04':   { name: 'Diff equations',               category: 'Extension Topics' },
  'MA-EXT-05':   { name: 'Projectile motion',            category: 'Extension Topics' },
  'MA-EXT-06':   { name: 'Vectors',                      category: 'Extension Topics' },
  'MA-EXT-07':   { name: 'Complex numbers',              category: 'Extension Topics' },
  'MA-EXT-08':   { name: 'Further trig',                 category: 'Extension Topics' },
}

export default async function DashboardPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  // ── 1. Student profile ──────────────────────────────────────────────────────
  const { data: profileRaw } = await supabase
    .from('student_profiles')
    .select('course, year_group, display_name')
    .eq('user_id', user.id)
    .single()

  // ── 2. Streak ───────────────────────────────────────────────────────────────
  const { data: streakRaw } = await supabase
    .from('streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .single()

  // ── 3. Today's session count ────────────────────────────────────────────────
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)

  const { count: todayCount } = await supabase
    .from('sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())

  // ── 4. Mastery map ──────────────────────────────────────────────────────────
  const { data: masteryRaw } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct')
    .eq('user_id', user.id)

  // Build prefix → avg confidence
  const prefixMap: Record<string, number[]> = {}
  for (const m of (masteryRaw ?? [])) {
    const prefix = m.outcome_id.replace(/-B\d+$/, '')
    if (!prefixMap[prefix]) prefixMap[prefix] = []
    prefixMap[prefix].push(m.confidence_pct)
  }

  const topicStats: TopicStat[] = Object.keys(prefixMap)
    .filter(p => TOPIC_META[p])
    .map(p => {
      const vals = prefixMap[p]
      const avg  = Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length)
      return {
        prefix:   p,
        name:     TOPIC_META[p].name,
        category: TOPIC_META[p].category,
        avg,
      }
    })

  const totalTopics    = Object.keys(TOPIC_META).length
  const masteredCount  = topicStats.filter(t => t.avg >= 80).length
  const overallMastery = topicStats.length === 0 ? 0
    : Math.round(topicStats.reduce((sum, t) => sum + t.avg, 0) / topicStats.length)

  // Top 3 by avg (for topic list — show highest mastery topics)
  const topTopics = topicStats
    .slice()
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3)

  // Weakest tested topic (for CTA recommendation)
  const weakTopic: TopicStat | null = topicStats.length > 0
    ? topicStats.slice().sort((a, b) => a.avg - b.avg)[0]
    : null

  // ── Assemble ────────────────────────────────────────────────────────────────
  const rawProfile = profileRaw as { display_name?: string; course?: string; year_group?: string } | null
  const displayName = rawProfile?.display_name
    ?? user.email?.split('@')[0]
    ?? 'Student'

  const dashboardData: DashboardData = {
    displayName,
    course:         rawProfile?.course ?? 'Advanced',
    streak:         streakRaw?.current_streak ?? 0,
    todayQuestions: todayCount ?? 0,
    overallMastery,
    topTopics,
    weakTopic,
    totalTopics,
    masteredCount,
  }

  return <DashboardContent data={dashboardData} />
}
