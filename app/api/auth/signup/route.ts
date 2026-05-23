import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

/**
 * POST /api/auth/signup
 *
 * 1. Creates the user via Supabase Admin API (email pre-confirmed — no
 *    verification email sent to the user).
 * 2. Signs them in with a plain (non-SSR) anon client and returns the raw
 *    access_token + refresh_token in the JSON body.
 *
 * WHY return tokens instead of setting cookies server-side:
 *   @supabase/ssr's server-side cookie writes (via Set-Cookie headers) are
 *   unreliable when called from a Route Handler that was initiated by a
 *   client-side fetch() — the browser may or may not apply them before the
 *   next navigation.  Instead we return the tokens as JSON and let the
 *   browser Supabase client call setSession(), which writes directly to
 *   document.cookie and is guaranteed to be present on the very next request.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email: string; password: string; displayName: string }
    const { email, password, displayName } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // ── 1. Create user via Admin API (email pre-confirmed) ───────────────────
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

    if (createErr) {
      return NextResponse.json({ error: createErr.message }, { status: 400 })
    }

    // ── 2. Sign in with a plain anon client to obtain session tokens ─────────
    // We do NOT use createServerClient here because we are returning tokens as
    // JSON — the browser will call setSession() to store them in document.cookie.
    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { data: signInData, error: loginErr } = await anon.auth.signInWithPassword({ email, password })

    if (loginErr || !signInData.session) {
      return NextResponse.json(
        { error: loginErr?.message ?? 'Sign-in after signup failed.' },
        { status: 400 },
      )
    }

    // Return the raw tokens — the browser will store them via setSession()
    return NextResponse.json({
      access_token:  signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    })

  } catch (err) {
    console.error('[POST /api/auth/signup] unexpected error:', err)
    return NextResponse.json({ error: 'Signup failed. Please try again.' }, { status: 500 })
  }
}
