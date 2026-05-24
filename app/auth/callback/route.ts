import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'

/**
 * GET /auth/callback
 *
 * Supabase PKCE + OAuth callback handler.
 *
 * Cookie strategy: accumulate every Set-Cookie call from exchangeCodeForSession
 * into a plain array, then write them directly onto the final NextResponse.redirect.
 * This guarantees the browser receives session cookies on the same response it
 * uses to navigate — no secondary request needed to pick them up.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code             = searchParams.get('code')
  const next             = searchParams.get('next') ?? '/dashboard'
  const error            = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const appBase = `${origin}/math-nsw/app`

  // ── OAuth provider returned an error (e.g. user cancelled, state reused) ───
  if (error) {
    const msg = encodeURIComponent(errorDescription ?? error)
    return NextResponse.redirect(`${appBase}/auth/login?error=${msg}`)
  }

  if (code) {
    // Accumulate every cookie write so we can replay them onto the redirect
    const pendingCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              pendingCookies.push({ name, value, options: options ?? {} })
            )
          },
        },
      },
    )

    const { data: { user }, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)

    /** Write every accumulated cookie onto a redirect response and return it */
    const redirect = (destination: string) => {
      const res = NextResponse.redirect(destination)
      pendingCookies.forEach(({ name, value, options }) =>
        res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2])
      )
      return res
    }

    if (!exchangeError && user) {
      // Determine destination — skip onboarding if user already set year_group
      let destination = next

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

      return redirect(`${appBase}${destination}`)
    }

    // ── Code exchange failed (PKCE verifier missing, code already used, etc.) ─
    // Check if this browser session is already authenticated and route sensibly.
    const { data: { user: existingUser } } = await supabase.auth.getUser()
    if (existingUser) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('year_group')
        .eq('user_id', existingUser.id)
        .maybeSingle()
      const destination = profile?.year_group ? '/dashboard' : '/onboarding/year'
      return redirect(`${appBase}${destination}`)
    }

    // Truly unauthenticated — go to login without a confusing error message
    return NextResponse.redirect(`${appBase}/auth/login`)
  }

  return NextResponse.redirect(`${appBase}/auth/login`)
}
