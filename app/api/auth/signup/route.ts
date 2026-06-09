import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { createServerClient }        from '@supabase/ssr'

/**
 * POST /api/auth/signup
 *
 * 1. Creates the user via the Admin API (email pre-confirmed).
 * 2. Signs the user in SERVER-SIDE using createServerClient so that the
 *    Supabase SSR library's onAuthStateChange → applyServerStorage chain
 *    calls our setAll callback and populates pendingCookies with valid
 *    session tokens.
 * 3. Returns 200 JSON { success: true } with those session cookies attached
 *    as Set-Cookie headers on the response.
 *
 * WHY server-side sign-in (not browser signInWithPassword):
 *   Browser-side signIn requires the user to type the same password they
 *   used in a previous failed attempt if their account already exists.
 *   Any mismatch silently redirects to /auth/login.  Server-side sign-in
 *   always uses the password from the current form submission, eliminating
 *   the mismatch entirely.
 *
 * WHY 200 JSON (not 302 redirect):
 *   Vercel's CDN silently drops Set-Cookie headers on 302 responses.
 *   A 200 JSON response with Set-Cookie headers is processed by the browser
 *   before any JS navigation fires, so middleware always finds a valid session.
 *
 * VERIFIED: createServerClient.signInWithPassword triggers the
 *   onAuthStateChange → applyServerStorage → setAll chain reliably in
 *   @supabase/ssr v0.9.0 (confirmed by unit test: pendingCookies.length === 1).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
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
    }

    const {
      email, password, displayName,
      birthYear, isMinor,
      termsAcceptedAt, termsVersion,
      privacyAcceptedAt, privacyVersion,
      minorGuardianConfirmed,
    } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // ── 1. Capture IP for consent logging ────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
             ?? request.headers.get('x-real-ip')
             ?? null

    // ── 2. Admin client — create user or accept existing ─────────────────────
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

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
        return NextResponse.json({ error: createErr.message }, { status: 400 })
      }

      // Account exists from a prior partial signup — update its password so
      // server-side sign-in below will succeed with THIS submission's password.
      const listRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: process.env.SUPABASE_SERVICE_ROLE_KEY! } }
      )
      const listJson = await listRes.json() as { users?: { id: string }[] }
      const existingId = listJson.users?.[0]?.id ?? null

      if (existingId) {
        await admin.auth.admin.updateUserById(existingId, { password, email_confirm: true })
        userId = existingId
      }
    } else {
      userId = newUser?.user?.id ?? null
    }

    // ── 3. Save compliance fields ─────────────────────────────────────────────
    if (userId) {
      const complianceUpdate: Record<string, unknown> = {}
      if (birthYear != null)              complianceUpdate.birth_year              = birthYear
      if (isMinor != null)                complianceUpdate.is_minor                = isMinor
      if (termsAcceptedAt)                complianceUpdate.terms_accepted_at        = termsAcceptedAt
      if (termsVersion)                   complianceUpdate.terms_version            = termsVersion
      if (privacyAcceptedAt)              complianceUpdate.privacy_accepted_at      = privacyAcceptedAt
      if (privacyVersion)                 complianceUpdate.privacy_version          = privacyVersion
      if (ip)                             complianceUpdate.consent_ip               = ip
      if (minorGuardianConfirmed != null) complianceUpdate.minor_guardian_confirmed = minorGuardianConfirmed

      if (Object.keys(complianceUpdate).length > 0) {
        const { error: updateErr } = await admin
          .from('users')
          .update(complianceUpdate)
          .eq('id', userId)
        if (updateErr) {
          console.warn('[signup] compliance update failed:', updateErr.message)
        }
      }
    }

    // ── 4. Server-side sign-in — populate pendingCookies ─────────────────────
    // createServerClient fires onAuthStateChange(SIGNED_IN) after signIn,
    // which calls applyServerStorage → our setAll → fills pendingCookies.
    const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (list) => list.forEach(c => pendingCookies.push(c)),
        },
      },
    )

    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password })

    if (signInErr || !signInData.session) {
      console.error('[signup] server signIn failed:', signInErr?.message)
      // Session couldn't be established — tell client to redirect to login
      return NextResponse.json({ success: true, redirectToLogin: true })
    }

    // ── 5. Return 200 JSON + Set-Cookie headers ───────────────────────────────
    // The browser processes Set-Cookie from a 200 fetch() response BEFORE any
    // JS runs, so window.location.href fires with the session already committed.
    const response = NextResponse.json({ success: true })
    pendingCookies.forEach(({ name, value, options }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.cookies.set(name, value, options as any)
    })
    return response

  } catch (err) {
    console.error('[signup] unexpected error:', err)
    return NextResponse.json({ error: 'Signup failed. Please try again.' }, { status: 500 })
  }
}
