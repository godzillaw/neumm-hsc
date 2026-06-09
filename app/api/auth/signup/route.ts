import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

/**
 * POST /api/auth/signup
 *
 * Creates the user via Supabase Admin API (email pre-confirmed — no
 * verification email) and saves compliance fields.  Returns JSON so the
 * client can call signInWithPassword via createBrowserClient, which sets
 * session cookies synchronously in document.cookie before navigating.
 *
 * WHY browser-side sign-in (not server-side):
 *   createServerClient + signInWithPassword in a Route Handler does not
 *   reliably call the setAll cookie callback in @supabase/ssr v0.9.0.
 *   pendingCookies ends up empty, so the HTML response carries no Set-Cookie
 *   headers, and the middleware finds no session on the next request.
 *
 *   createBrowserClient.signInWithPassword writes session cookies
 *   synchronously via document.cookie — they are present in every subsequent
 *   request, including the middleware check on /onboarding/year.
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

    // ── 2. Create user via Admin API (email pre-confirmed) ───────────────────
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName, full_name: displayName },
    })

    if (createErr) {
      return NextResponse.json({ error: createErr.message }, { status: 400 })
    }

    // ── 3. Save compliance fields to users table ──────────────────────────────
    if (newUser?.user?.id) {
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
          .eq('id', newUser.user.id)

        if (updateErr) {
          console.warn('[POST /api/auth/signup] compliance update failed:', updateErr.message)
        }
      }
    }

    // ── 4. Return success — client will sign in from the browser ─────────────
    // The client's createBrowserClient.signInWithPassword writes session
    // cookies synchronously via document.cookie, guaranteeing they exist
    // when window.location.href fires the navigation to /onboarding/year.
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[POST /api/auth/signup] unexpected error:', err)
    return NextResponse.json({ error: 'Signup failed. Please try again.' }, { status: 500 })
  }
}
