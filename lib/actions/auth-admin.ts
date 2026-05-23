'use server'

import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'

/**
 * Create a Supabase user via the Admin API with email already confirmed.
 * This bypasses email confirmation entirely so users can access the app
 * immediately after signing up — no email link required.
 *
 * The DB trigger (002_auth_trigger.sql) still fires and creates the users +
 * student_profiles rows automatically.
 */
export async function adminCreateUser(
  email:       string,
  password:    string,
  displayName: string,
): Promise<{ error: { message: string } | null; data: { userId: string } | null }> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName, full_name: displayName },
  })

  if (error) return { error: { message: error.message }, data: null }
  return { error: null, data: { userId: data.user.id } }
}

/**
 * Combined signup + sign-in in a single server action.
 *
 * 1. Creates the user via Admin API (email pre-confirmed, no verification email)
 * 2. Signs them in server-side so the session cookies are set in the HTTP response
 *    headers — guaranteed to be present on the very next browser request.
 *
 * The caller should use `window.location.href` (hard reload) not `router.push`
 * after this returns, so the browser picks up the new session cookies before
 * hitting the middleware.
 */
export async function signupAndLogin(
  email:       string,
  password:    string,
  displayName: string,
): Promise<{ error: string | null }> {
  // ── Step 1: Create user (admin API, email pre-confirmed) ──────────────────
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName, full_name: displayName },
  })

  if (createErr) return { error: createErr.message }

  // ── Step 2: Sign in server-side (sets session cookies in response) ────────
  // Using the server client means the Set-Cookie headers are included in the
  // server action response — the browser stores them before the next navigation.
  const supabase = createSupabaseServerClient()
  const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })

  if (loginErr) return { error: loginErr.message }

  return { error: null }
}
