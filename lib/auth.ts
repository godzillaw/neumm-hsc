'use client'

import { createSupabaseBrowserClient } from './supabase-browser'

// ─── App base URL ─────────────────────────────────────────────────────────────
//
// Always derive the base URL from the *current* browser origin + the known
// basePath.  This ensures the PKCE code verifier cookie (set on the current
// domain) is readable when Supabase redirects back to /auth/callback on the
// same domain — whether that's neumm-hsc.vercel.app, localhost, or the
// custom domain.  Hardcoding NEXT_PUBLIC_APP_URL breaks PKCE when the app
// is accessed from a different domain (e.g. vercel.app preview vs custom domain).
//
const BASE_PATH = '/math-nsw/app'

function appBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${BASE_PATH}`
  }
  // SSR fallback (should not be reached for OAuth/signup flows)
  return process.env.NEXT_PUBLIC_APP_URL ?? `http://localhost:3000${BASE_PATH}`
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
