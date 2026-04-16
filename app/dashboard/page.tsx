import { requireAuth }                 from '@/lib/auth-server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import DashboardContent, {
  type DashboardData,
  type TopicStat,
  type LeaderboardEntry,
} from './DashboardContent'

// ─── Topic meta ────────────────────────────────────────────────────────────────
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
  'MA-CALC-D12': { name: 'Implicit diff',               category: 'Calculus — Differentiation' },
  'MA-CALC-I01': { name: 'Antiderivatives',             category: 'Calculus — Integration' },
  'MA-CALC-I02': { name: 'Polynomial integrals',        category: 'Calculus — Integration' },
  'MA-CALC-I03': { name: 'Trig integration',            category: 'Calculus — Integration' },
  'MA-CALC-I04': { name: 'Exp & log integration',       category: 'Calculus — Integration' },
  'MA-CALC-I05': { name: 'Integration by substitution', category: 'Calculus — Integration' },
  'MA-CALC-I06': { name: 'Definite integrals',          category: 'Calculus — Integration' },
  'MA-CALC-I07': { name: 'Area under curve',            category: 'Calculus — Integration' },
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
  'MA-EXT-01':   { name: 'Induction',                   category: 'Extension Topics' },
  'MA-EXT-02':   { name: 'Binomial theorem',            category: 'Extension Topics' },
  'MA-EXT-03':   { name: 'Integration by parts',        category: 'Extension Topics' },
  'MA-EXT-04':   { name: 'Diff equations',              category: 'Extension Topics' },
  'MA-EXT-05':   { name: 'Projectile motion',           category: 'Extension Topics' },
  'MA-EXT-06':   { name: 'Vectors',                     category: 'Extension Topics' },
  'MA-EXT-07':   { name: 'Complex numbers',             category: 'Extension Topics' },
  'MA-EXT-08':   { name: 'Further trig',                category: 'Extension Topics' },
}

// XP per correct answer (approx)
const XP_PER_CORRECT = 10

// Level thresholds (XP needed to reach each level)
function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(1 + Math.sqrt(xp / 50)))
}

export default async function DashboardPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // ── Parallel queries ─────────────────────────────────────────────────────────
  const [
    { data: userRow },
    { data: profileRaw },
    { data: streakRaw },
    { data: masteryRaw },
    { count: todayCorrect },
    { count: weekCorrect },
    { count: allCorrect },
    { data: leaderboardRaw },
  ] = await Promise.all([
    supabase.from('users').select('tier, trial_end_date, display_name').eq('id', user.id).single(),
    supabase.from('student_profiles').select('course, year_group').eq('user_id', user.id).single(),
    supabase.from('streaks').select('current_streak, longest_streak').eq('user_id', user.id).single(),
    supabase.from('mastery_map').select('outcome_id, confidence_pct').eq('user_id', user.id),
    // Today's questions (using error_log as the source of truth for answered questions)
    supabase.from('error_log').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString()),
    // This week's correct answers for XP
    supabase.from('error_log').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', weekStart.toISOString()),
    // All-time correct answers for level
    supabase.from('error_log').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    // Top-10 leaderboard — join streaks via a subquery approach:
    // fetch top streaks then match display names
    supabase.from('streaks').select('user_id, current_streak')
      .order('current_streak', { ascending: false })
      .limit(10),
  ])

  // ── XP & Level ───────────────────────────────────────────────────────────────
  const totalXp   = (allCorrect  ?? 0) * XP_PER_CORRECT
  const weekXp    = (weekCorrect ?? 0) * XP_PER_CORRECT
  const level     = xpToLevel(totalXp)
  const levelXp   = (level - 1) * (level - 1) * 50
  const nextLvlXp = level * level * 50
  const xpInLevel = totalXp - levelXp
  const xpForNext = nextLvlXp - levelXp

  // ── Mastery map → topic stats ────────────────────────────────────────────────
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
      return { prefix: p, name: TOPIC_META[p].name, category: TOPIC_META[p].category, avg }
    })

  const totalTopics    = Object.keys(TOPIC_META).length
  const masteredCount  = topicStats.filter(t => t.avg >= 60).length
  const overallMastery = topicStats.length === 0 ? 0
    : Math.round(topicStats.reduce((s, t) => s + t.avg, 0) / topicStats.length)

  // Predicted HSC band from top-3 mastery entries
  const top3 = topicStats.slice().sort((a, b) => b.avg - a.avg).slice(0, 3)
  const avgTop3 = top3.length > 0
    ? top3.reduce((s, t) => s + t.avg, 0) / top3.length
    : 0
  const predictedBand = Math.max(1, Math.min(6, parseFloat((1 + (avgTop3 / 100) * 5).toFixed(1))))

  // Learning path = weakest 5 tested topics (these need the most work)
  const learningPath = topicStats
    .slice()
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 5)

  // Mission = weakest topic
  const missionTopic: TopicStat | null = learningPath[0] ?? null

  // ── Leaderboard ───────────────────────────────────────────────────────────────
  const leaderboard: LeaderboardEntry[] = (leaderboardRaw ?? []).map((row, i) => ({
    rank:  i + 1,
    name:  'Student',   // display names fetched separately if needed; streak source is accurate
    xp:    ((row.current_streak as number) ?? 0) * XP_PER_CORRECT,
    isMe:  (row.user_id as string) === user.id,
  }))

  // ── Achievements ──────────────────────────────────────────────────────────────
  const streak = streakRaw?.current_streak ?? 0
  const todayQ = todayCorrect ?? 0

  // ── Assemble ─────────────────────────────────────────────────────────────────
  const rawProfile  = profileRaw as { course?: string; year_group?: string } | null
  const typedUser   = userRow as { tier?: string; trial_end_date?: string | null; display_name?: string } | null
  const displayName = typedUser?.display_name ?? user.email?.split('@')[0] ?? 'Student'

  const data: DashboardData = {
    displayName,
    course:         rawProfile?.course      ?? 'Advanced',
    yearGroup:      rawProfile?.year_group  ?? null,
    streak,
    longestStreak:  streakRaw?.longest_streak ?? 0,
    todayQuestions: todayQ,
    weekXp,
    totalXp,
    level,
    xpInLevel,
    xpForNext,
    overallMastery,
    predictedBand,
    topicStats,
    learningPath,
    missionTopic,
    totalTopics,
    masteredCount,
    leaderboard,
    tier:           typedUser?.tier           ?? 'basic_trial',
    trialEndDate:   typedUser?.trial_end_date ?? null,
  }

  return <DashboardContent data={data} />
}
