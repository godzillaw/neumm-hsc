'use server'

import { cookies }            from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient }       from '@supabase/supabase-js'

// ─── helpers ──────────────────────────────────────────────────────────────────

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

/** createServerClient backed by next/headers cookies() — the only
 *  reliable way to set session cookies in Next.js 14 on Vercel.
 *  cookies() mutations are applied to the response by the framework
 *  before any JS navigation fires, so middleware always finds a session. */
function supabaseServer() {
  const store = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  ()     => store.getAll(),
        setAll: (list)  => list.forEach(({ name, value, options }) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          store.set(name, value, options as any)
        ),
      },
    },
  )
}

// ─── signUpAction ──────────────────────────────────────────────────────────────

export type SignupResult =
  | { ok: true;  redirect: string }
  | { ok: false; error: string }

export async function signUpAction(payload: {
  email: string
  password: string
  displayName: string
  birthYear?: number | null
  isMinor?: boolean
  termsAcceptedAt?: string
  termsVersion?: string
  privacyAcceptedAt?: string
  privacyVersion?: string
  minorGuardianConfirmed?: boolean | null
  ip?: string | null
}): Promise<SignupResult> {
  const {
    email, password, displayName,
    birthYear, isMinor,
    termsAcceptedAt, termsVersion,
    privacyAcceptedAt, privacyVersion,
    minorGuardianConfirmed, ip,
  } = payload

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' }
  }

  const admin = supabaseAdmin()

  // ── 1. Create user (pre-confirm email so no verification email is sent) ───
  let userId: string | null = null
  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName, full_name: displayName },
  })

  if (createErr) {
    const alreadyExists =
      createErr.message.toLowerCase().includes('already registered') ||
      createErr.message.toLowerCase().includes('already been registered') ||
      createErr.message.toLowerCase().includes('email address is already')

    if (!alreadyExists) {
      return { ok: false, error: createErr.message }
    }

    // Account exists from a prior partial signup.
    // Update the password to match what the user just typed, then sign in.
    const listRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      },
    )
    const listJson = await listRes.json() as { users?: { id: string }[] }
    const existingId = listJson.users?.[0]?.id ?? null

    if (!existingId) {
      return { ok: false, error: 'Could not locate existing account. Please try again.' }
    }

    await admin.auth.admin.updateUserById(existingId, { password, email_confirm: true })
    userId = existingId
  } else {
    userId = newUser?.user?.id ?? null
  }

  // ── 2. Save compliance fields ─────────────────────────────────────────────
  if (userId) {
    const fields: Record<string, unknown> = {}
    if (birthYear != null)              fields.birth_year              = birthYear
    if (isMinor != null)                fields.is_minor                = isMinor
    if (termsAcceptedAt)                fields.terms_accepted_at        = termsAcceptedAt
    if (termsVersion)                   fields.terms_version            = termsVersion
    if (privacyAcceptedAt)              fields.privacy_accepted_at      = privacyAcceptedAt
    if (privacyVersion)                 fields.privacy_version          = privacyVersion
    if (ip)                             fields.consent_ip               = ip
    if (minorGuardianConfirmed != null) fields.minor_guardian_confirmed = minorGuardianConfirmed

    if (Object.keys(fields).length > 0) {
      await admin.from('users').update(fields).eq('id', userId)
    }
  }

  // ── 3. Sign in via Server Action — cookies() guarantees session is set ────
  const supabase = supabaseServer()
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password })

  if (signInErr || !signInData.session) {
    console.error('[signUpAction] signIn failed:', signInErr?.message)
    return { ok: false, error: 'Account created but sign-in failed. Please sign in manually.' }
  }

  // ── 4. New user → onboarding; existing user with profile → dashboard ───────
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group')
    .eq('user_id', signInData.user.id)
    .maybeSingle()

  const dest = profile?.year_group ? '/math-nsw/app/dashboard' : '/math-nsw/app/onboarding/year'
  return { ok: true, redirect: dest }
}

// ─── loginAction ───────────────────────────────────────────────────────────────

export type LoginResult =
  | { ok: true;  redirect: string }
  | { ok: false; error: string }

export async function loginAction(payload: {
  email: string
  password: string
}): Promise<LoginResult> {
  const { email, password } = payload

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' }
  }

  // ── 1. Sign in via Server Action ─────────────────────────────────────────
  const supabase = supabaseServer()
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password })

  if (signInErr || !signInData.session) {
    const msg = signInErr?.message?.toLowerCase().includes('invalid login credentials')
      ? 'Incorrect email or password.'
      : (signInErr?.message ?? 'Sign-in failed. Please try again.')
    return { ok: false, error: msg }
  }

  // ── 2. Block accounts that were never properly signed up ─────────────────
  // A valid auth user with no public.users row means the account was created
  // outside the normal signup flow.  Deny access and ask them to sign up.
  const admin = supabaseAdmin()
  const { data: userRow } = await admin
    .from('users')
    .select('id')
    .eq('id', signInData.user.id)
    .maybeSingle()

  if (!userRow) {
    // Sign them back out so the session is not left open
    await supabase.auth.signOut()
    return {
      ok: false,
      error: 'No Neumm account found for this email. Please sign up first.',
    }
  }

  // ── 3. Route to last stage ────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group')
    .eq('user_id', signInData.user.id)
    .maybeSingle()

  const dest = profile?.year_group ? '/math-nsw/app/dashboard' : '/math-nsw/app/onboarding/year'
  return { ok: true, redirect: dest }
}
