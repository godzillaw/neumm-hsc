import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'
import { cookies }                   from 'next/headers'

export const dynamic = 'force-dynamic'

const BASE = '/math-nsw/app'

/**
 * GET /auth/callback
 *
 * Handles the PKCE code exchange for Google OAuth (and any future OAuth
 * providers). Uses cookies() from next/headers — the same reliable approach
 * used by the signup/login Server Actions — so session cookies are applied
 * by Next.js at the framework level before any redirect fires.
 *
 * WHY cookies() instead of pendingCookies + response.cookies.set():
 *   The old approach collected cookies in an array and manually attached
 *   them to a NextResponse. On Vercel the mutations were sometimes not
 *   applied, leaving the middleware with no session.  cookies() from
 *   next/headers is written by the framework into the response headers
 *   unconditionally.
 *
 * WHY 302 redirect (not 200 HTML + JS):
 *   With cookies() the session is committed before the redirect fires,
 *   so Vercel CDN stripping is no longer a concern — the cookies are
 *   already in the browser's cookie jar when the redirect lands.
 *   A clean 302 is simpler and avoids the document.write() approach.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code             = searchParams.get('code')
  const error            = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const loginUrl = new URL(`${BASE}/auth/login`, request.url)

  if (error) {
    loginUrl.searchParams.set('error', encodeURIComponent(errorDescription ?? error))
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    return NextResponse.redirect(loginUrl)
  }

  // ── Exchange PKCE code for session via cookies() ───────────────────────────
  const cookieStore = cookies()
  const supabase    = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  ()     => cookieStore.getAll(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll: (list)  => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options as any)),
      },
    },
  )

  const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeErr || !data.user) {
    console.error('[/auth/callback] code exchange failed:', exchangeErr?.message)
    return NextResponse.redirect(loginUrl)
  }

  // ── Decide destination ─────────────────────────────────────────────────────
  const next = searchParams.get('next') ?? '/dashboard'

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group')
    .eq('user_id', data.user.id)
    .maybeSingle()

  // Block Google accounts that arrive via the Login page but have never
  // completed Neumm signup (no student_profiles row).
  const cameFromLoginPage = !next.includes('onboarding')
  if (cameFromLoginPage && !profile?.year_group) {
    // Also block if no public.users row exists at all
    const { data: userRow } = await supabase
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!userRow) {
      await supabase.auth.signOut()
      loginUrl.searchParams.set(
        'error',
        encodeURIComponent('No Neumm account found for this Google account. Please sign up first.'),
      )
      return NextResponse.redirect(loginUrl)
    }
  }

  const dest = profile?.year_group
    ? new URL(`${BASE}/dashboard`,      request.url)
    : new URL(`${BASE}/onboarding/year`, request.url)

  // cookies() mutations are applied by Next.js into the response headers
  // before this redirect is sent — the browser receives the session cookies
  // and the middleware finds them on the very next request.
  return NextResponse.redirect(dest)
}
