'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function setAIDisclosureDismissed(userId: string): Promise<void> {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('users')
    .update({ ai_disclosure_dismissed: true })
    .eq('id', userId)

  if (error) {
    console.error('[setAIDisclosureDismissed]', error.message)
  }
}

export async function setLeaderboardVisible(userId: string, visible: boolean): Promise<void> {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('users')
    .update({ leaderboard_visible: visible })
    .eq('id', userId)

  if (error) {
    console.error('[setLeaderboardVisible]', error.message)
  }
}

export async function requestDataDeletion(userId: string): Promise<void> {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('users')
    .update({
      deletion_requested:    true,
      deletion_requested_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('[requestDataDeletion]', error.message)
    throw new Error('Failed to request deletion.')
  }
}

export async function acceptLegalVersion(
  userId: string,
  termsVersion: string,
  privacyVersion: string,
): Promise<void> {
  const supabase = createSupabaseServerClient()
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('users')
    .update({
      terms_version:       termsVersion,
      terms_accepted_at:   now,
      privacy_version:     privacyVersion,
      privacy_accepted_at: now,
    })
    .eq('id', userId)

  if (error) {
    console.error('[acceptLegalVersion]', error.message)
    throw new Error('Failed to save acceptance.')
  }
}
