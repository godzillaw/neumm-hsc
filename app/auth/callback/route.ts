import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'
import { type CookieOptions }        from '@supabase/ssr'

export const dynamic = 'force-dynamic'

const BASE = '/math-nsw/app'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code             = searchParams.get('code')
  const error            = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const signupUrl = new URL(`${BASE}/auth/signup`, request.url)

  // ── Log every incoming callback for debugging ──────────────────────────────
  const allCookieNames = request.cookies.getAll().map(c => c.name)
  console.log('[callback] hit — code:', code ? code.slice(0, 8) + '…' : 'none',
    '| error:', error ?? 'none',
    '| cookies:', allCookieNames.join(', ') || '(none)')

  if (error) {
    console.error('[callback] OAuth error:', error, errorDescription)
    signupUrl.searchParams.set('error', encodeURIComponent(errorDescription ?? error))
    return NextResponse.redirect(signupUrl)
  }

  if (!code) {
    console.error('[callback] no code in URL')
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
        getAll:  () => request.cookies.getAll(),
        setAll: (list) => {
          cookiesToSet.length = 0
          list.forEach(c => cookiesToSet.push(c))
        },
      },
    },
  )

  const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)

  console.log('[callback] exchange result — user:', data?.user?.id ?? 'none',
    '| error:', exchangeErr?.message ?? 'none',
    '| cookiesToSet count:', cookiesToSet.length,
    '| cookiesToSet names:', cookiesToSet.map(c => c.name).join(', ') || '(none)')

  if (exchangeErr || !data.user) {
    console.error('[callback] code exchange FAILED:', exchangeErr?.message)
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

  console.log('[callback] redirecting to:', dest.toString(),
    '| profile year_group:', profile?.year_group ?? 'none',
    '| attaching', cookiesToSet.length, 'cookies')

  // ── Build redirect and attach session cookies ──────────────────────────────
  // IMPORTANT: we use a 200 HTML + JS redirect rather than a 302 so that
  // Set-Cookie headers are never stripped by CDN or proxies. The browser
  // processes the cookies from the 200 response, then JS fires location.replace.
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Redirecting…</title></head><body>
<script>window.location.replace(${JSON.stringify(dest.toString())})</script>
</body></html>`

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type':  'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })

  cookiesToSet.forEach(({ name, value, options }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.cookies.set(name, value, options as any)
  })

  console.log('[callback] response Set-Cookie count:', response.headers.getSetCookie?.()?.length ?? 'unknown')
  return response
}
