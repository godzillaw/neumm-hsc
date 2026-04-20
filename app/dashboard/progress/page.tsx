import { requireAuth }                 from '@/lib/auth-server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import ProgressView                    from './ProgressView'
import type { TopicStat, NextMove }    from './ProgressView'

// ─── Topic catalogue ────────────────────────────────────────────────────────────

const TOPIC_META: Record<string, { name: string; category: string }> = {
  'MA-CALC-D01': { name: 'Differentiation basics',      category: 'Calculus — Differentiation' },
  'MA-CALC-D02': { name: 'Product & quotient rule',     category: 'Calculus — Differentiation' },
  'MA-CALC-D03': { name: 'Chain rule',                  category: 'Calculus — Differentiation' },
  'MA-CALC-D04': { name: 'Trig derivatives',            category: 'Calculus — Differentiation' },
  'MA-CALC-D05': { name: 'Exp derivatives',             category: 'Calculus — Differentiation' },
  'MA-CALC-D06': { name: 'Log derivatives',             category: 'Calculus — Differentiation' },
  'MA-CALC-D07': { name: 'Tangents & normals',          category: 'Calculus — Differentiation' },
  'MA-CALC-D08': { name: 'Stationary points',           category: 'Calculus — Differentiation' },
  'MA-CALC-D09': { name: 'Optimisation',                category: 'Calculus — Differentiation' },
  'MA-CALC-D10': { name: 'Rates of change',             category: 'Calculus — Differentiation' },
  'MA-CALC-D11': { name: 'Concavity',                   category: 'Calculus — Differentiation' },
  'MA-CALC-D12': { name: 'Implicit differentiation',    category: 'Calculus — Differentiation' },
  'MA-CALC-I01': { name: 'Antiderivatives',             category: 'Calculus — Integration' },
  'MA-CALC-I02': { name: 'Polynomial integrals',        category: 'Calculus — Integration' },
  'MA-CALC-I03': { name: 'Trig integration',            category: 'Calculus — Integration' },
  'MA-CALC-I04': { name: 'Exp & log integration',       category: 'Calculus — Integration' },
  'MA-CALC-I05': { name: 'Integration by substitution', category: 'Calculus — Integration' },
  'MA-CALC-I06': { name: 'Definite integrals',          category: 'Calculus — Integration' },
  'MA-CALC-I07': { name: 'Area under a curve',          category: 'Calculus — Integration' },
  'MA-CALC-I08': { name: 'Area between curves',         category: 'Calculus — Integration' },
  'MA-CALC-I09': { name: 'Volumes of revolution',       category: 'Calculus — Integration' },
  'MA-CALC-I10': { name: 'Kinematics',                  category: 'Calculus — Integration' },
  'MA-CALC-I11': { name: 'Numerical integration',       category: 'Calculus — Integration' },
  'MA-CALC-I12': { name: 'Exp growth & decay',          category: 'Calculus — Integration' },
  'MA-TRIG-01':  { name: 'Exact trig values',           category: 'Trigonometry' },
  'MA-TRIG-02':  { name: 'Trig graphs',                 category: 'Trigonometry' },
  'MA-TRIG-03':  { name: 'Trig identities',             category: 'Trigonometry' },
  'MA-TRIG-04':  { name: 'Trig equations',              category: 'Trigonometry' },
  'MA-TRIG-05':  { name: 'Inverse trig',                category: 'Trigonometry' },
  'MA-TRIG-06':  { name: 'Compound angles',             category: 'Trigonometry' },
  'MA-TRIG-07':  { name: 'Sine & cosine rule',          category: 'Trigonometry' },
  'MA-TRIG-08':  { name: 'Bearings & 3D trig',          category: 'Trigonometry' },
  'MA-TRIG-09':  { name: 'Radians',                     category: 'Trigonometry' },
  'MA-EXP-01':   { name: 'Exp graphs',                  category: 'Exponential & Logarithms' },
  'MA-EXP-02':   { name: 'Exp equations',               category: 'Exponential & Logarithms' },
  'MA-EXP-03':   { name: 'Log laws',                    category: 'Exponential & Logarithms' },
  'MA-EXP-04':   { name: 'Log equations',               category: 'Exponential & Logarithms' },
  'MA-EXP-05':   { name: 'Natural log',                 category: 'Exponential & Logarithms' },
  'MA-EXP-06':   { name: 'Exp applications',            category: 'Exponential & Logarithms' },
  'MA-FUNC-01':  { name: 'Domain & range',              category: 'Functions' },
  'MA-FUNC-02':  { name: 'Types of functions',          category: 'Functions' },
  'MA-FUNC-03':  { name: 'Composite functions',         category: 'Functions' },
  'MA-FUNC-04':  { name: 'Inverse functions',           category: 'Functions' },
  'MA-FUNC-05':  { name: 'Transformations',             category: 'Functions' },
  'MA-FUNC-06':  { name: 'Absolute value',              category: 'Functions' },
  'MA-FUNC-07':  { name: 'Polynomial graphs',           category: 'Functions' },
  'MA-FUNC-08':  { name: 'Rational functions',          category: 'Functions' },
  'MA-FUNC-09':  { name: 'Limits',                      category: 'Functions' },
  'MA-ALG-01':   { name: 'Quadratics',                  category: 'Algebra' },
  'MA-ALG-02':   { name: 'Quadratic graphs',            category: 'Algebra' },
  'MA-ALG-03':   { name: 'Simultaneous equations',      category: 'Algebra' },
  'MA-ALG-04':   { name: 'Polynomials',                 category: 'Algebra' },
  'MA-ALG-05':   { name: 'Inequalities',                category: 'Algebra' },
  'MA-ALG-06':   { name: 'Arithmetic sequences',        category: 'Algebra' },
  'MA-ALG-07':   { name: 'Geometric sequences',         category: 'Algebra' },
  'MA-ALG-08':   { name: 'Surds',                       category: 'Algebra' },
  'MA-STAT-01':  { name: 'Data representation',         category: 'Statistics & Probability' },
  'MA-STAT-02':  { name: 'Central tendency',            category: 'Statistics & Probability' },
  'MA-STAT-03':  { name: 'Spread',                      category: 'Statistics & Probability' },
  'MA-STAT-04':  { name: 'Regression',                  category: 'Statistics & Probability' },
  'MA-STAT-05':  { name: 'Normal distribution',         category: 'Statistics & Probability' },
  'MA-STAT-06':  { name: 'Sampling',                    category: 'Statistics & Probability' },
  'MA-PROB-01':  { name: 'Basic probability',           category: 'Statistics & Probability' },
  'MA-PROB-02':  { name: 'Conditional probability',     category: 'Statistics & Probability' },
  'MA-PROB-03':  { name: 'Discrete distributions',      category: 'Statistics & Probability' },
  'MA-PROB-04':  { name: 'Binomial distribution',       category: 'Statistics & Probability' },
  'MA-PROB-05':  { name: 'Counting techniques',         category: 'Statistics & Probability' },
  'MA-FIN-01':   { name: 'Simple interest',             category: 'Financial Mathematics' },
  'MA-FIN-02':   { name: 'Compound interest',           category: 'Financial Mathematics' },
  'MA-FIN-03':   { name: 'Annuities',                   category: 'Financial Mathematics' },
  'MA-FIN-04':   { name: 'Loans',                       category: 'Financial Mathematics' },
  'MA-FIN-05':   { name: 'Investment analysis',         category: 'Financial Mathematics' },
  'MA-COORD-01': { name: 'Distance & midpoint',         category: 'Coordinate Geometry' },
  'MA-COORD-02': { name: 'Lines',                       category: 'Coordinate Geometry' },
  'MA-COORD-03': { name: 'Circles',                     category: 'Coordinate Geometry' },
  'MA-COORD-04': { name: 'Parabolas',                   category: 'Coordinate Geometry' },
  'MA-COORD-05': { name: 'Locus',                       category: 'Coordinate Geometry' },
  'MA-EXT-01':   { name: 'Mathematical induction',      category: 'Extension Topics' },
  'MA-EXT-02':   { name: 'Binomial theorem',            category: 'Extension Topics' },
  'MA-EXT-03':   { name: 'Integration by parts',        category: 'Extension Topics' },
  'MA-EXT-04':   { name: 'Differential equations',      category: 'Extension Topics' },
  'MA-EXT-05':   { name: 'Projectile motion',           category: 'Extension Topics' },
  'MA-EXT-06':   { name: 'Vectors',                     category: 'Extension Topics' },
  'MA-EXT-07':   { name: 'Complex numbers',             category: 'Extension Topics' },
  'MA-EXT-08':   { name: 'Further trigonometry',        category: 'Extension Topics' },
}

// ─── Band computation ────────────────────────────────────────────────────────────

function computeBand(mastery: number): number {
  if (mastery >= 85) return 6
  if (mastery >= 70) return 5
  if (mastery >= 55) return 4
  if (mastery >= 40) return 3
  if (mastery >= 25) return 2
  return 1
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function ProgressPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  // Parallel fetch: mastery map + student profile + display name
  const [masteryRes, profileRes, userRes] = await Promise.all([
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
  ])

  const masteryRows = masteryRes.data ?? []
  const yearGroup   = (profileRes.data as { year_group?: string } | null)?.year_group ?? 'year_12'
  const displayName = (userRes.data as { display_name?: string } | null)?.display_name
    ?? user.email?.split('@')[0]
    ?? 'Student'

  const YEAR_LABEL: Record<string, string> = {
    year_9: 'Year 9', year_10: 'Year 10',
    year_11: 'Year 11', year_12: 'Year 12',
  }

  // ── Aggregate: group mastery_map rows by topic prefix ──
  const prefixMap: Record<string, number[]> = {}
  for (const row of masteryRows) {
    const prefix = row.outcome_id.replace(/-B\d+$/, '')
    if (!prefixMap[prefix]) prefixMap[prefix] = []
    prefixMap[prefix].push(row.confidence_pct)
  }

  // ── Build full topic list ──
  const topicStats: TopicStat[] = Object.keys(TOPIC_META).map(prefix => {
    const vals = prefixMap[prefix]
    const avg  = vals && vals.length > 0
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : null
    return {
      prefix,
      name:     TOPIC_META[prefix].name,
      category: TOPIC_META[prefix].category,
      avg,
    }
  })

  // ── Summary counts ──
  const tested   = topicStats.filter(t => t.avg !== null)
  const mastered = tested.filter(t => (t.avg ?? 0) >= 80).length
  const shaky    = tested.filter(t => (t.avg ?? 0) >= 50 && (t.avg ?? 0) < 80).length
  const gap      = tested.filter(t => (t.avg ?? 0) < 50).length
  const untested = topicStats.length - tested.length

  // ── Overall mastery ──
  const overallMastery = tested.length > 0
    ? Math.round(tested.reduce((s, t) => s + (t.avg ?? 0), 0) / tested.length)
    : 0

  // ── Band prediction ──
  const predictedBand = computeBand(overallMastery)
  const targetBand    = predictedBand >= 5 ? 6 : predictedBand + 2

  // ── Smart "Next 3 Moves" ──────────────────────────────────────────────────────
  // Move 1 — Quick Win: highest confidence in 60–79% (one session to Mastered)
  const quickWin = tested
    .filter(t => (t.avg ?? 0) >= 60 && (t.avg ?? 0) < 80)
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0]
    ?? tested.filter(t => (t.avg ?? 0) >= 50 && (t.avg ?? 0) < 80)
       .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0]

  // Move 2 — Urgent Gap: lowest tested confidence > 0 (started but struggling)
  const urgentGap = tested
    .filter(t => (t.avg ?? 0) > 0 && (t.avg ?? 0) < 50)
    .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))[0]

  // Move 3 — Fresh Start: first untested topic
  const freshStart = topicStats.find(t => t.avg === null)

  const nextMoves: NextMove[] = []
  if (quickWin)   nextMoves.push({ type: 'quickWin',   prefix: quickWin.prefix,   name: quickWin.name,   avg: quickWin.avg   })
  if (urgentGap)  nextMoves.push({ type: 'urgentGap',  prefix: urgentGap.prefix,  name: urgentGap.name,  avg: urgentGap.avg  })
  if (freshStart) nextMoves.push({ type: 'freshStart', prefix: freshStart.prefix, name: freshStart.name, avg: null            })

  return (
    <div
      className="px-5 md:px-8 py-8 max-w-5xl"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <ProgressView
        topics={topicStats}
        overallMastery={overallMastery}
        mastered={mastered}
        shaky={shaky}
        gap={gap}
        untested={untested}
        displayName={displayName}
        yearLabel={YEAR_LABEL[yearGroup] ?? 'HSC'}
        predictedBand={predictedBand}
        targetBand={targetBand}
        nextMoves={nextMoves}
      />
    </div>
  )
}
