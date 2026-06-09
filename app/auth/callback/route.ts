import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'
import { type CookieOptions }        from '@supabase/ssr'

export const dynamic = 'force-dynamic'

const BASE = '/math-nsw/app'

/**
 * GET /auth/callback
 *
 * Handles the PKCE code exchange for Google OAuth.
 *
 * Cookie strategy: collect every cookie Supabase wants to set via setAll,
 * then explicitly attach them to the NextResponse via response.cookies.set().
 * This is the ONLY reliable pattern in a Next.js Route Handler — cookies()
 * from next/headers does NOT auto-apply mutations to an explicit NextResponse.
 * (cookies() auto-apply only works in Server Actions, not Route Handlers.)
 *
 * The route is force-dynamic so Vercel CDN never caches it, meaning
 * Set-Cookie headers on the redirect response are always delivered to the
 * browser intact.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code             = searchParams.get('code')
  const error            = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const signupUrl = new URL(`${BASE}/auth/signup`, request.url)

  if (error) {
    signupUrl.searchParams.set('error', encodeURIComponent(errorDescription ?? error))
    return NextResponse.redirect(signupUrl)
  }

  if (!code) {
    return NextResponse.redirect(signupUrl)
  }

  // ── Collect cookies that Supabase wants to set ─────────────────────────────
  type CookieItem = { name: string; value: string; options: CookieOptions }
  const cookiesToSet: CookieItem[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read from the incoming request cookies (code-verifier for PKCE)
        getAll:  () => request.cookies.getAll(),
        // Collect — will be applied to the response below
        setAll: (list) => {
          cookiesToSet.length = 0
          list.forEach(c => cookiesToSet.push(c))
        },
      },
    },
  )

  const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeErr || !data.user) {
    console.error('[/auth/callback] code exchange failed:', exchangeErr?.message)
    return NextResponse.redirect(signupUrl)
  }

  // ── Decide destination ─────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group')
    .eq('user_id', data.user.id)
    .maybeSingle()

  const dest = profile?.year_group
    ? new URL(`${BASE}/dashboard`,       request.url)
    : new URL(`${BASE}/onboarding/year`, request.url)

  // ── Build redirect and attach session cookies ──────────────────────────────
  const response = NextResponse.redirect(dest)

  cookiesToSet.forEach(({ name, value, options }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.cookies.set(name, value, options as any)
  })

  return response
}
