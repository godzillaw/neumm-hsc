import { Suspense }              from 'react'
import { requireAuth }          from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getRecommendation }    from '@/lib/actions/recommendation'
import ProgressView             from './ProgressView'
import type { TopicStat }       from './ProgressView'
import type { WeakTopic }       from '@/lib/actions/recommendation'

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

// ─── Recommendation card (async server component, streamed via Suspense) ────────

async function RecommendationCard({ weakTopics }: { weakTopics: WeakTopic[] }) {
  const text = await getRecommendation(weakTopics)
  return (
    <div
      className="rounded-2xl p-5 border mt-2"
      style={{ backgroundColor: '#FFFBF0', borderColor: '#F0E980', fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ backgroundColor: '#FFDA00' }}
        >
          🎯
        </div>
        <div>
          <p
            className="text-xs font-bold uppercase tracking-wide mb-1"
            style={{ color: '#0F0F14' }}
          >
            AI Recommendation
          </p>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: '#0F0F14' }}>{text}</p>
          {weakTopics.length > 1 && (
            <p className="text-xs mt-2" style={{ color: '#666672' }}>
              Also consider: {weakTopics.slice(1).map(t => t.name).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function RecommendationSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 border mt-2 animate-pulse"
      style={{ backgroundColor: '#FFFBF0', borderColor: '#F0E980' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: '#F0E980' }} />
        <div className="flex-1">
          <div className="h-3 rounded w-28 mb-2" style={{ backgroundColor: '#F0E980' }} />
          <div className="h-4 rounded w-full mb-1.5" style={{ backgroundColor: '#F0E980' }} />
          <div className="h-4 rounded w-3/4" style={{ backgroundColor: '#F0E980' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function ProgressPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  // Fetch the full mastery_map
  const { data: masteryRows } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct, status')
    .eq('user_id', user.id)

  // ── Aggregate: group mastery_map rows by topic prefix ──
  const prefixMap: Record<string, number[]> = {}
  for (const row of (masteryRows ?? [])) {
    const prefix = row.outcome_id.replace(/-B\d+$/, '')
    if (!prefixMap[prefix]) prefixMap[prefix] = []
    prefixMap[prefix].push(row.confidence_pct)
  }

  // ── Build full topic list (all known + tested) ──
  // Start with all TOPIC_META keys so untested topics appear as grey
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

  // ── Overall mastery % (only over tested topics) ──
  const overallMastery = tested.length > 0
    ? Math.round(tested.reduce((s, t) => s + (t.avg ?? 0), 0) / tested.length)
    : 0

  // ── Three weakest tested topics (for AI recommendation) ──
  const weakTopics: WeakTopic[] = tested
    .slice()
    .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))
    .slice(0, 3)
    .map(t => ({ prefix: t.prefix, name: t.name, avg: t.avg ?? 0 }))

  return (
    <div
      className="px-5 md:px-8 py-8 max-w-5xl"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >

      {/* ── Page header ── */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: '#0F0F14', fontFamily: "'Nunito', sans-serif" }}
        >
          Progress
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#666672' }}>
          Your HSC Mathematics mastery at a glance
        </p>
      </div>

      {/* ── Main mastery view (circular indicator + tiles) ── */}
      <ProgressView
        topics={topicStats}
        overallMastery={overallMastery}
        mastered={mastered}
        shaky={shaky}
        gap={gap}
        untested={untested}
      />

      {/* ── AI Recommendation (streamed via Suspense) ── */}
      <div className="mt-4 mb-8">
        <h2
          className="text-sm font-bold mb-2"
          style={{ color: '#0F0F14', fontFamily: "'Nunito', sans-serif" }}
        >
          Next focus area
        </h2>
        <Suspense fallback={<RecommendationSkeleton />}>
          {weakTopics.length > 0 ? (
            <RecommendationCard weakTopics={weakTopics} />
          ) : (
            <div
              className="rounded-2xl p-5 border"
              style={{ backgroundColor: '#FFFBF0', borderColor: '#F0E980' }}
            >
              <p className="text-sm" style={{ color: '#666672' }}>
                Complete the placement probe to unlock personalised recommendations.
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
