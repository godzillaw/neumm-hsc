'use server'

/**
 * Tier access checker.
 *
 * Tier states and daily question limits:
 *   basic_trial          → active trial,  10 q/day
 *   pro_trial            → active trial,  10 q/day
 *   basic                → paid,          25 q/day
 *   pro                  → paid,          unlimited
 *   basic_trial_expired  → trial ended,   0 q/day, BLOCKED
 *   trial_expired        → alias,         0 q/day, BLOCKED
 *   payment_failed       → payment error, 0 q/day, BLOCKED
 *
 * "Approaching limit" soft banner fires when ≤ 3 questions remain today.
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { todayAEST }                  from '@/lib/date-utils'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TierState =
  | 'basic_trial'
  | 'pro_trial'
  | 'basic'
  | 'pro'
  | 'basic_trial_expired'
  | 'trial_expired'
  | 'payment_failed'

export interface TierAccess {
  tier:               string
  dailyLimit:         number   // -1 = unlimited, 0 = blocked
  questionsToday:     number
  questionsRemaining: number   // -1 = unlimited
  isBlocked:          boolean  // trial_expired / payment_failed
  isTrial:            boolean  // basic_trial or pro_trial
  canAnswer:          boolean  // not blocked AND within daily limit
  showSoftBanner:     boolean  // ≤ 3 remaining (trials/basic only)
}

// ─── Tier config ────────────────────────────────────────────────────────────────

const DAILY_LIMITS: Record<string, number> = {
  basic_trial:         10,
  pro_trial:           10,
  basic:               25,
  pro:                 -1,   // unlimited
  basic_trial_expired:  0,
  trial_expired:        0,
  payment_failed:       0,
}

const BLOCKED_TIERS = new Set<string>([
  'basic_trial_expired',
  'trial_expired',
  'payment_failed',
])

const TRIAL_TIERS = new Set<string>([
  'basic_trial',
  'pro_trial',
])

// ─── checkTierAccess ────────────────────────────────────────────────────────────

export async function checkTierAccess(
  userId:  string,
  _feature?: string,
): Promise<TierAccess> {
  const supabase = createSupabaseServerClient()

  // 1. Fetch tier from users table
  const { data: userRow } = await supabase
    .from('users')
    .select('tier')
    .eq('id', userId)
    .single()

  const tier: string = (userRow as { tier?: string } | null)?.tier ?? 'basic_trial'

  // 2. Determine daily limit
  const dailyLimit = DAILY_LIMITS[tier] ?? 10

  // 3. Count today's answered questions (via error_log — one row per answered q)
  const todayStart = todayAEST() + 'T00:00:00+10:00'

  const { count: questionsToday } = await supabase
    .from('error_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(todayStart).toISOString())

  const todayCount = questionsToday ?? 0

  // 4. Compute derived fields
  const isBlocked         = BLOCKED_TIERS.has(tier)
  const isTrial           = TRIAL_TIERS.has(tier)
  const withinLimit       = dailyLimit === -1 || todayCount < dailyLimit
  const canAnswer         = !isBlocked && withinLimit

  const questionsRemaining =
    dailyLimit === -1 ? -1
    : isBlocked       ? 0
    : Math.max(0, dailyLimit - todayCount)

  // Soft banner: trial/basic users with ≤ 3 questions remaining (but not yet blocked)
  const showSoftBanner =
    !isBlocked &&
    dailyLimit !== -1 &&
    questionsRemaining <= 3 &&
    questionsRemaining >= 0

  return {
    tier,
    dailyLimit,
    questionsToday: todayCount,
    questionsRemaining,
    isBlocked,
    isTrial,
    canAnswer,
    showSoftBanner,
  }
}
