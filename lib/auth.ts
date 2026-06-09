'use client'

import { createSupabaseBrowserClient } from './supabase-browser'

// ─── App base URL ─────────────────────────────────────────────────────────────
//
// CRITICAL: the redirectTo URL passed to Supabase OAuth MUST match one of the
// allowed redirect URLs configured in Supabase Auth settings.  If it doesn't,
// Supabase silently falls back to its configured Site URL — which may be a
// different domain (e.g. neumm-hsc.vercel.app instead of neumm.com.au).
//
// When that happens, the PKCE code verifier cookie (set on the origin where
// signInWithOAuth was called) is NOT sent to the callback on the different
// domain — so exchangeCodeForSession fails with "PKCE code verifier missing".
//
// Fix: always use NEXT_PUBLIC_APP_URL (set in Vercel env vars to
// https://neumm.com.au/math-nsw/app) so the redirectTo is always the same
// canonical domain that Supabase has in its allowed-redirect list.
//
const BASE_PATH = '/math-nsw/app'

function appBaseUrl(): string {
  // Prefer the explicit env var so the redirect URL is canonical and always
  // matches what is registered in Supabase Auth → URL Configuration.
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  // Fallback to current origin (works for localhost dev where there is no
  // custom domain and no env var set).
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${BASE_PATH}`
  }
  return `http://localhost:3000${BASE_PATH}`
}

// ─── Current user (client) ────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = createSupabaseBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export async function signInWithGoogle(next = '/dashboard') {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appBaseUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
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
      emailRedirectTo: `${appBaseUrl()}/auth/callback?next=/onboarding/year`,
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
