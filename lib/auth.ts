'use client'

import { createSupabaseBrowserClient } from './supabase-browser'

// ─── App base URL ─────────────────────────────────────────────────────────────
//
// NEXT_PUBLIC_APP_URL must include the basePath when set, e.g.:
//   dev:        http://localhost:3000
//   production: https://www.neumm.com.au/math-nsw/app
//
// We MUST NOT use window.location.origin here because origin excludes the
// basePath (/math-nsw/app), which would redirect OAuth/email confirmations
// back to the root of the domain instead of the app.
//
// Fallback: construct from window.location.origin + the known basePath so
// local dev without the env var still works correctly.

function appBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  // Dev fallback: origin + basePath (empty in dev where basePath isn't active)
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return base
}

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
      redirectTo: `${appBaseUrl()}/auth/callback`,
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
      emailRedirectTo: `${appBaseUrl()}/auth/callback`,
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
