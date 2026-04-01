'use server'

/**
 * Tier access checker — NO per-day limits.
 * The only gate is trial expiry or payment failure.
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'

export type TierState =
  | 'basic_trial' | 'pro_trial'
  | 'basic' | 'pro'
  | 'basic_trial_expired' | 'trial_expired' | 'payment_failed'

export interface TierAccess {
  tier:               string
  isBlocked:          boolean
  isTrial:            boolean
  canAnswer:          boolean
  dailyLimit:         number    // -1 (unlimited) — kept for API compat
  questionsRemaining: number    // -1 (unlimited) — kept for API compat
  questionsToday:     number
  showSoftBanner:     boolean   // false — kept for API compat
}

const BLOCKED_TIERS = new Set<string>(['basic_trial_expired', 'trial_expired', 'payment_failed'])
const TRIAL_TIERS   = new Set<string>(['basic_trial', 'pro_trial'])

export async function checkTierAccess(userId: string): Promise<TierAccess> {
  const supabase = createSupabaseServerClient()
  const { data: userRow } = await supabase
    .from('users').select('tier').eq('id', userId).single()

  const tier      = (userRow as { tier?: string } | null)?.tier ?? 'basic_trial'
  const isBlocked = BLOCKED_TIERS.has(tier)
  const isTrial   = TRIAL_TIERS.has(tier)

  return {
    tier, isBlocked, isTrial,
    canAnswer:          !isBlocked,
    dailyLimit:          -1,
    questionsRemaining:  -1,
    questionsToday:       0,
    showSoftBanner:       false,
  }
}
