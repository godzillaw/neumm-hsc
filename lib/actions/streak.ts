'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { todayAEST, yesterdayAEST }  from '@/lib/date-utils'

// ─── Result shape (returned to client so it can animate / toast) ────────────────
export interface StreakResult {
  currentStreak: number
  longestStreak: number
  isNewDay:      boolean  // first activity today → streak was touched
  didReset:      boolean  // gap detected → streak was reset to 1
}

// ─── updateStreak ──────────────────────────────────────────────────────────────
//
// Call after every practice answer.
// Rules (AEST-local dates):
//   last_active = yesterday  → increment
//   last_active = today      → no-op (already counted this calendar day)
//   last_active < yesterday  → reset to 1 (gap)
//
export async function updateStreak(userId: string): Promise<StreakResult> {
  const supabase   = createSupabaseServerClient()
  const todayStr   = todayAEST()
  const yesterdayStr = yesterdayAEST()

  const { data: row } = await supabase
    .from('streaks')
    .select('current_streak, longest_streak, last_active_date')
    .eq('user_id', userId)
    .single()

  // ── No row yet (shouldn't happen if auth trigger ran, but be defensive) ──────
  if (!row) {
    await supabase.from('streaks').upsert({
      user_id:         userId,
      current_streak:  1,
      longest_streak:  1,
      last_active_date: todayStr,
    }, { onConflict: 'user_id' })
    return { currentStreak: 1, longestStreak: 1, isNewDay: true, didReset: false }
  }

  const lastActive = (row.last_active_date as string | null) ?? ''

  // ── Already counted today — no-op ─────────────────────────────────────────────
  if (lastActive === todayStr) {
    return {
      currentStreak: row.current_streak ?? 1,
      longestStreak: row.longest_streak ?? 1,
      isNewDay:      false,
      didReset:      false,
    }
  }

  // ── Determine new streak ──────────────────────────────────────────────────────
  const isConsecutive = lastActive === yesterdayStr
  const newStreak     = isConsecutive ? (row.current_streak ?? 0) + 1 : 1
  const didReset      = !isConsecutive && lastActive !== ''
  const newLongest    = Math.max(newStreak, row.longest_streak ?? 0)

  await supabase.from('streaks').update({
    current_streak:   newStreak,
    longest_streak:   newLongest,
    last_active_date: todayStr,
  }).eq('user_id', userId)

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    isNewDay:      true,
    didReset,
  }
}
