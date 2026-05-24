import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'

const BASE = '/math-nsw/app'

/**
 * GET /auth/callback
 *
 * WHY a Route Handler instead of a client component:
 *   Every client-side approach has a race condition: @supabase/ssr v0.9.0
 *   hardcodes detectSessionInUrl:true and auto-exchanges the PKCE code the
 *   moment createBrowserClient() is called.  Calling exchangeCodeForSession
 *   manually races the auto-exchange — the loser gets "code already used",
 *   getSession() returns null, and the user lands on the login page.
 *
 * WHY a 200 HTML response instead of a 302 redirect:
 *   Set-Cookie headers on redirect responses are silently dropped by Vercel's
 *   CDN layer.  The browser follows the redirect before the cookies are stored,
 *   so middleware sees no session and redirects to /auth/login.
 *
 *   A 200 response with Set-Cookie + a JavaScript redirect is bulletproof:
 *   the browser stores all cookies from the 200 response BEFORE the script
 *   executes, so the very next request to /onboarding/year carries valid
 *   session cookies that middleware can verify.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code             = searchParams.get('code')
  const error            = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const loginUrl = new URL(`${BASE}/auth/login`, request.url)

  // ── OAuth provider returned an error ────────────────────────────────────────
  if (error) {
    loginUrl.searchParams.set('error', encodeURIComponent(errorDescription ?? error))
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    return NextResponse.redirect(loginUrl)
  }

  // ── Server-side code exchange ──────────────────────────────────────────────
  // The PKCE code verifier was stored in the browser cookie when the user
  // clicked "Continue with Google". The browser sends it automatically in
  // the request headers here.  We collect all cookies written by the
  // exchange so we can attach them to the response ourselves.
  const pendingCookies: {
    name: string
    value: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any
  }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => list.forEach(c => pendingCookies.push(c)),
      },
    }
  )

  const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeErr || !data.user) {
    console.error('[/auth/callback] code exchange failed:', exchangeErr?.message)
    return NextResponse.redirect(loginUrl)
  }

  // ── Decide destination ──────────────────────────────────────────────────────
  // New Google user → no profile row yet → send to onboarding.
  // Returning user who completed onboarding → send to dashboard.
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group')
    .eq('user_id', data.user.id)
    .maybeSingle()

  const dest = profile?.year_group ? `${BASE}/dashboard` : `${BASE}/onboarding/year`

  // ── 200 HTML + Set-Cookie + JS redirect ────────────────────────────────────
  // A 200 response guarantees the browser processes ALL Set-Cookie headers
  // before the <script> redirect fires — unlike a 302 where Vercel drops them.
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signing in…</title>
  <style>
    body { display:flex; align-items:center; justify-content:center;
           min-height:100vh; font-family:'Nunito',sans-serif;
           background:#fff; margin:0; }
    p { color:#6B7280; font-size:15px; font-weight:600; }
  </style>
</head>
<body>
  <p>Signing in…</p>
  <script>window.location.replace(${JSON.stringify(dest)})</script>
</body>
</html>`

  const response = new NextResponse(html, {
    status:  200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })

  // Attach the session cookies to this 200 response.
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}
