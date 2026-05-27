'use server'

/**
 * Tier access checker.
 *
 * Tier hierarchy:
 *  free               — permanent free plan, 5 questions per UTC day
 *  basic_trial        — 7-day free trial, 8 questions per UTC day
 *  basic_trial_expired — trial ended without subscribing → falls back to free (5q/day)
 *  basic              — paid Basic plan $29/mo, 30 questions per UTC day
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
  dailyLimit:         number    // -1 = unlimited; 5 for free; 8 for trial; 30 for basic
  questionsRemaining: number    // -1 = unlimited
  questionsToday:     number
  showSoftBanner:     boolean   // ≤ 2 remaining on free/trial; ≤ 5 on basic
  dailyLimitReached:  boolean   // hit daily cap
  trialSoftBannerAt:  number    // questionsToday multiple of 5 while in trial (0 = no banner)
}

const FREE_DAILY_LIMIT         = 5
const BASIC_TRIAL_DAILY_LIMIT  = 8
const BASIC_DAILY_LIMIT        = 30

// Only hard-block on payment failure (card declined)
const BLOCKED_TIERS = new Set<string>(['payment_failed'])
const TRIAL_TIERS   = new Set<string>(['basic_trial', 'pro_trial'])

// Tiers that have a daily question limit
const LIMITED_TIERS = new Set<string>(['free', 'basic', 'basic_trial', 'basic_trial_expired', 'trial_expired'])

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
    if (tier === 'pro')                                      return -1
    if (tier === 'basic')                                    return BASIC_DAILY_LIMIT
    if (tier === 'basic_trial' && isTrial)                   return BASIC_TRIAL_DAILY_LIMIT
    if (LIMITED_TIERS.has(tier))                             return FREE_DAILY_LIMIT
    return -1
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
  const softThreshold  = dailyLimit === BASIC_DAILY_LIMIT ? 5 : 2
  const showSoftBanner = dailyLimit > 0
    && questionsRemaining >= 0
    && questionsRemaining <= softThreshold
    && !dailyLimitReached

  // For trial users: fire a soft banner every 5 questions (5, 10 — but limit is 8 so only 5)
  const trialSoftBannerAt = isTrial && questionsToday > 0 && questionsToday % 5 === 0
    ? questionsToday
    : 0

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
    trialSoftBannerAt,
  }
}
