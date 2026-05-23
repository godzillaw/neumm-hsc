import { NextResponse }                from 'next/server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'

/**
 * GET /auth/callback
 *
 * Supabase PKCE callback handler — runs server-side so it has access to the
 * code-verifier cookie set by @supabase/ssr on the same origin.
 *
 * After a successful exchange it redirects to /dashboard.
 * On failure it redirects to /auth/login with an error query param.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Always use request origin — stays on the same domain (www vs non-www, vercel preview, etc.)
  const appBase = `${origin}/math-nsw/app`

  // OAuth provider returned an error (e.g. user cancelled)
  if (error) {
    const msg = encodeURIComponent(errorDescription ?? error)
    return NextResponse.redirect(`${appBase}/auth/login?error=${msg}`)
  }

  if (code) {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError && user) {
      // If the user already completed onboarding (has a year_group), skip onboarding
      // even when next=/onboarding/year — send them straight to the dashboard.
      let destination = next
      if (next === '/onboarding/year') {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('year_group')
          .eq('user_id', user.id)
          .maybeSingle()
        if (profile?.year_group) {
          destination = '/dashboard'
        }
      }
      return NextResponse.redirect(`${appBase}${destination}`)
    }

    // Code exchange failed (e.g. PKCE verifier missing, expired link).
    // This can happen when a confirmation email is clicked in a different
    // browser session after the user already signed in via password.
    // Rather than showing a scary error, check if the user is already
    // authenticated — if so, send them where they need to go.
    const { data: { user: existingUser } } = await supabase.auth.getUser()
    if (existingUser) {
      // Already logged in — send to onboarding if not yet completed, else dashboard
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('year_group')
        .eq('user_id', existingUser.id)
        .maybeSingle()
      const destination = profile?.year_group ? '/dashboard' : '/onboarding/year'
      return NextResponse.redirect(`${appBase}${destination}`)
    }

    // Truly unauthenticated — redirect to login cleanly (no PKCE error message)
    return NextResponse.redirect(`${appBase}/auth/login`)
  }

  // No code present — redirect to login
  return NextResponse.redirect(`${appBase}/auth/login`)
}
