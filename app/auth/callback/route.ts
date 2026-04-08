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
  const next  = searchParams.get('next') ?? '/onboarding/intent'
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
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      return NextResponse.redirect(`${appBase}${next}`)
    }

    const msg = encodeURIComponent(exchangeError.message)
    return NextResponse.redirect(`${appBase}/auth/login?error=${msg}`)
  }

  // No code present — redirect to login
  return NextResponse.redirect(`${appBase}/auth/login`)
}
