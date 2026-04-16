'use server'

/**
 * Tier access checker.
 *
 * Tier hierarchy:
 *  basic_trial        — 7-day free trial, unlimited questions while active
 *  basic_trial_expired — trial ended without subscribing → dashboard + upgrade only
 *  basic              — paid Basic plan, 50 questions per UTC day
 *  pro                — paid Pro plan, unlimited
 *  payment_failed     — card declined → dashboard + upgrade only
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'

export type TierState =
  | 'basic_trial' | 'pro_trial'
  | 'basic' | 'pro'
  | 'basic_trial_expired' | 'trial_expired' | 'payment_failed'

export interface TierAccess {
  tier:               string
  isBlocked:          boolean   // trial expired or payment failed → only dashboard + upgrade
  isTrial:            boolean   // currently in active trial
  canAnswer:          boolean   // false when blocked OR daily limit reached
  dailyLimit:         number    // -1 = unlimited; 50 for basic
  questionsRemaining: number    // -1 = unlimited
  questionsToday:     number
  showSoftBanner:     boolean   // ≤ 10 remaining — show soft warning
  dailyLimitReached:  boolean   // basic has hit 50 for the day
}

const BASIC_DAILY_LIMIT = 50

const BLOCKED_TIERS = new Set<string>(['basic_trial_expired', 'trial_expired', 'payment_failed'])
const TRIAL_TIERS   = new Set<string>(['basic_trial', 'pro_trial'])

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

  // ── Daily limit (paid Basic only) ──────────────────────────────────────────
  let dailyLimit         = -1
  let questionsToday     = 0
  let questionsRemaining = -1
  let dailyLimitReached  = false

  if (tier === 'basic' && !isBlocked) {
    // UTC day boundary
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('error_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())

    questionsToday     = count ?? 0
    dailyLimit         = BASIC_DAILY_LIMIT
    questionsRemaining = Math.max(0, BASIC_DAILY_LIMIT - questionsToday)
    dailyLimitReached  = questionsRemaining === 0
  }

  const canAnswer     = !isBlocked && !dailyLimitReached
  const showSoftBanner = tier === 'basic'
    && questionsRemaining >= 0
    && questionsRemaining <= 10
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
