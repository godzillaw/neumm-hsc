import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'

/**
 * GET /auth/callback
 *
 * Supabase PKCE callback handler.
 *
 * CRITICAL: We bind the Supabase client directly to a response object so that
 * the Set-Cookie headers from exchangeCodeForSession are included on the
 * redirect response the browser follows.  Using createSupabaseServerClient()
 * (which writes via Next.js cookies()) does NOT reliably attach cookies to
 * a manually created NextResponse.redirect() — the browser follows the
 * redirect without session cookies and middleware sees an unauthenticated
 * request → redirects to /auth/login.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code             = searchParams.get('code')
  const next             = searchParams.get('next') ?? '/dashboard'
  const error            = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Always use request origin — works on any domain (custom, vercel preview, localhost)
  const appBase = `${origin}/math-nsw/app`

  // ── OAuth provider returned an error (e.g. user cancelled, state reused) ───
  if (error) {
    const msg = encodeURIComponent(errorDescription ?? error)
    return NextResponse.redirect(`${appBase}/auth/login?error=${msg}`)
  }

  if (code) {
    // ── Use a collector response so exchangeCodeForSession can write cookies ──
    // We write all Set-Cookie headers onto `collector`, then copy them to the
    // final redirect response.  This guarantees the browser receives the
    // session cookies even across a 307 redirect.
    const collector = new NextResponse()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll()             { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              collector.cookies.set(name, value, options)
            })
          },
        },
      },
    )

    const { data: { user }, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)

    // Helper: copy all Set-Cookie headers from collector onto a redirect
    const redirectWithCookies = (destination: string) => {
      const res = NextResponse.redirect(destination)
      collector.cookies.getAll().forEach(c => res.cookies.set(c))
      return res
    }

    if (!exchangeError && user) {
      // Determine where to send the user
      let destination = next

      // If this is an onboarding destination, check if they already finished
      if (next.startsWith('/onboarding')) {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('year_group')
          .eq('user_id', user.id)
          .maybeSingle()
        if (profile?.year_group) {
          destination = '/dashboard'
        }
      }

      return redirectWithCookies(`${appBase}${destination}`)
    }

    // ── Code exchange failed (e.g. PKCE verifier missing / already used) ─────
    // Check if the user is already authenticated in this browser session.
    const { data: { user: existingUser } } = await supabase.auth.getUser()
    if (existingUser) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('year_group')
        .eq('user_id', existingUser.id)
        .maybeSingle()
      const destination = profile?.year_group ? '/dashboard' : '/onboarding/year'
      return redirectWithCookies(`${appBase}${destination}`)
    }

    // Truly unauthenticated — go to login without a scary error message
    return NextResponse.redirect(`${appBase}/auth/login`)
  }

  return NextResponse.redirect(`${appBase}/auth/login`)
}
