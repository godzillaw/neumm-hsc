import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

/**
 * POST /api/auth/signup
 *
 * Creates the user via Supabase Admin API (email pre-confirmed — no
 * verification email).  Returns { success: true } and lets the browser
 * call signInWithPassword() via createBrowserClient, which is the exact
 * same code path as a normal login and reliably writes session cookies to
 * document.cookie.
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

    // ── 2. User created — return success so the browser can sign in ───────────
    // The browser will call signInWithPassword() using createBrowserClient,
    // which is the SAME code path as a normal login and reliably writes session
    // cookies to document.cookie. No server-side cookie handoff needed.
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[POST /api/auth/signup] unexpected error:', err)
    return NextResponse.json({ error: 'Signup failed. Please try again.' }, { status: 500 })
  }
}
