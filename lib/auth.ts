'use client'

import { createSupabaseBrowserClient } from './supabase-browser'

// ─── Current user (client) ────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = createSupabaseBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })
}

// ─── Email / password ─────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string
) {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, full_name: displayName },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  // DB trigger (002_auth_trigger.sql) auto-creates users + streaks rows
  // with tier=basic_trial, trial_start=now(), trial_end=now()+7d
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signOut()
}
