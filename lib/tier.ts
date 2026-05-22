'use server'

/**
 * Tier access checker.
 *
 * Tier hierarchy:
 *  free               — permanent free plan, 5 questions per UTC day
 *  basic_trial        — 7-day free trial, unlimited questions while active
 *  basic_trial_expired — trial ended without subscribing → falls back to free (5q/day)
 *  basic              — paid Basic plan $29/mo, 25 questions per UTC day
 *  pro                — paid Pro plan $49/mo, unlimited
 *  payment_failed     — card declined → dashboard + upgrade only
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'

export type TierState =
  | 'free'
  | 'basic_trial' | 'pro_trial'
  | 'basic' | 'pro'
  | 'basic_trial_expired' | 'trial_expired' | 'payment_failed'

export interface TierAccess {
  tier:               string
  isBlocked:          boolean   // payment failed → only dashboard + upgrade
  isTrial:            boolean   // currently in active trial
  canAnswer:          boolean   // false when blocked OR daily limit reached
  dailyLimit:         number    // -1 = unlimited; 5 for free; 25 for basic
  questionsRemaining: number    // -1 = unlimited
  questionsToday:     number
  showSoftBanner:     boolean   // ≤ 3 remaining on free or ≤ 5 on basic — show soft warning
  dailyLimitReached:  boolean   // hit daily cap
}

const FREE_DAILY_LIMIT  = 5
const BASIC_DAILY_LIMIT = 25

// Only hard-block on payment failure (card declined)
const BLOCKED_TIERS = new Set<string>(['payment_failed'])
const TRIAL_TIERS   = new Set<string>(['basic_trial', 'pro_trial'])

// Tiers that have a daily question limit
const LIMITED_TIERS = new Set<string>(['free', 'basic', 'basic_trial_expired', 'trial_expired'])

export async function checkTierAccess(userId: string): Promise<TierAccess> {
  const supabase = createSupabaseServerClient()

  const { data: userRow } = await supabase
    .from('users')
    .select('tier, trial_end_date')
    .eq('id', userId)
    .single()

  const raw = userRow as { tier?: string; trial_end_date?: string | null } | null

  const rawTier      = raw?.tier           ?? 'basic_trial'
  const trialEndDate = raw?.trial_end_date ?? null

  // Check if trial has expired by date
  const now            = new Date()
  const isTrialExpired = trialEndDate ? new Date(trialEndDate) < now : false

  // Effective tier (promote to expired if trial ran out)
  const tier = TRIAL_TIERS.has(rawTier) && isTrialExpired
    ? 'basic_trial_expired'
    : rawTier

  const isBlocked = BLOCKED_TIERS.has(tier)
  const isTrial   = TRIAL_TIERS.has(rawTier) && !isTrialExpired

  // Resolve daily limit for this tier
  const dailyLimit: number = (() => {
    if (tier === 'basic')                                    return BASIC_DAILY_LIMIT
    if (tier === 'free' || LIMITED_TIERS.has(tier))         return FREE_DAILY_LIMIT
    return -1  // unlimited for trial / pro
  })()

  // ── Daily question count ───────────────────────────────────────────────────
  let questionsToday     = 0
  let questionsRemaining = -1
  let dailyLimitReached  = false

  if (!isBlocked && dailyLimit > 0) {
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('error_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())

    questionsToday     = count ?? 0
    questionsRemaining = Math.max(0, dailyLimit - questionsToday)
    dailyLimitReached  = questionsRemaining === 0
  }

  const canAnswer      = !isBlocked && !dailyLimitReached
  const softThreshold  = dailyLimit === FREE_DAILY_LIMIT ? 2 : 5
  const showSoftBanner = dailyLimit > 0
    && questionsRemaining >= 0
    && questionsRemaining <= softThreshold
    && !dailyLimitReached

  return {
    tier,
    isBlocked,
    isTrial,
    canAnswer,
    dailyLimit,
    questionsRemaining,
    questionsToday,
    showSoftBanner,
    dailyLimitReached,
  }
}
