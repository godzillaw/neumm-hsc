import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { createServerClient }        from '@supabase/ssr'

/**
 * POST /api/auth/signup
 *
 * Creates the user via Supabase Admin API (email pre-confirmed — no
 * verification email). Signs in server-side and attaches session cookies
 * directly to the 200 JSON response so the browser has a valid session
 * before the client navigates to /onboarding/year.
 *
 * WHY server-side sign-in + Set-Cookie on the response body (not a redirect):
 *   Vercel's CDN silently drops Set-Cookie headers on 302 redirect responses.
 *   A 200 JSON response with Set-Cookie headers is processed by the browser
 *   before any JS navigation fires, guaranteeing the middleware can read the
 *   session on the very next request. Same pattern used in /auth/callback.
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

    // ── 4. Sign in server-side and set session cookies on the response ────────
    // Collect cookies written by the sign-in so we can attach them to the
    // response. The browser will store them before any JS navigation fires.
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
      console.warn('[POST /api/auth/signup] server signIn failed:', signInErr?.message)
      // User was created but server sign-in failed — return JSON so the client
      // can attempt a fallback sign-in.
      return NextResponse.json({ success: true, serverSignIn: false })
    }

    // ── 5. Return 200 HTML + Set-Cookie + JS redirect ─────────────────────────
    //
    // WHY HTML instead of JSON (same reason as /auth/callback):
    //   When the browser processes a 200 HTML response, it stores ALL Set-Cookie
    //   headers BEFORE the <script> tag executes.  With a JSON response + client
    //   window.location.href, there is an intermittent race on Vercel where the
    //   session cookies haven't fully committed before the next navigation fires,
    //   causing the middleware to see no session and redirect to /auth/login.
    //
    //   Returning HTML and using document.write() on the client ensures the same
    //   guaranteed ordering: cookies stored → script runs → navigation happens.
    const dest = '/math-nsw/app/onboarding/year'
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Setting up your account…</title>
  <style>
    body { display:flex; align-items:center; justify-content:center;
           min-height:100vh; font-family:'Nunito',sans-serif;
           background:#fff; margin:0; }
    p { color:#6B7280; font-size:15px; font-weight:600; }
  </style>
</head>
<body>
  <p>Setting up your account…</p>
  <script>window.location.replace(${JSON.stringify(dest)})</script>
</body>
</html>`

    const response = new NextResponse(html, {
      status:  200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
    pendingCookies.forEach(({ name, value, options }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.cookies.set(name, value, options as any)
    })
    return response

  } catch (err) {
    console.error('[POST /api/auth/signup] unexpected error:', err)
    return NextResponse.json({ error: 'Signup failed. Please try again.' }, { status: 500 })
  }
}
