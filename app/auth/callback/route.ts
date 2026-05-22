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

    const msg = encodeURIComponent(exchangeError?.message ?? 'Authentication failed')
    return NextResponse.redirect(`${appBase}/auth/login?error=${msg}`)
  }

  // No code present — redirect to login
  return NextResponse.redirect(`${appBase}/auth/login`)
}
