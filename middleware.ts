import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS          = ['/auth/login', '/auth/signup', '/auth/callback', '/auth/reset-password']
const PROTECTED_AUTH_PATHS  = ['/onboarding', '/dashboard', '/practice', '/exam']

// Expired-trial / payment-failed users may ONLY access these paths
const EXPIRED_ALLOWED = ['/dashboard', '/account/upgrade', '/auth', '/api']

const TRIAL_TIERS   = new Set(['basic_trial', 'pro_trial'])
const BLOCKED_TIERS = new Set(['basic_trial_expired', 'trial_expired', 'payment_failed'])

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname }        = request.nextUrl

  // ── 1. Unauthenticated → redirect to login for protected routes ────────────
  const isProtected = PROTECTED_AUTH_PATHS.some(p => pathname.startsWith(p))
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // ── 2-4. Authenticated user checks ────────────────────────────────────────
  if (user) {
    // Run both DB queries in parallel to keep latency low
    const [{ data: userRow }, { data: profile }] = await Promise.all([
      supabase.from('users')
        .select('tier, trial_end_date, terms_version, privacy_version')
        .eq('id', user.id)
        .single(),
      supabase.from('student_profiles')
        .select('year_group')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    const hasCompletedOnboarding = !!(profile as { year_group?: string | null } | null)?.year_group

    // ── 2. Authenticated on auth pages → route based on onboarding status ─────
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = hasCompletedOnboarding ? '/dashboard' : '/onboarding/year'
      return NextResponse.redirect(url)
    }

    // ── 2.5. No onboarding completed → block dashboard / practice / exam ──────
    // Redirect to onboarding so the user completes year-group selection first.
    const requiresOnboarding =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/practice')  ||
      pathname.startsWith('/exam')
    if (requiresOnboarding && !hasCompletedOnboarding) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/year'
      return NextResponse.redirect(url)
    }

    // ── 3. Tier-based route control ────────────────────────────────────────────
    const raw = userRow as {
      tier?: string
      trial_end_date?: string | null
      terms_version?: string | null
      privacy_version?: string | null
    } | null

    const rawTier      = raw?.tier           ?? 'basic_trial'
    const trialEndDate = raw?.trial_end_date ?? null

    const isTrialExpired = trialEndDate ? new Date(trialEndDate) < new Date() : false

    const effectiveTier = TRIAL_TIERS.has(rawTier) && isTrialExpired
      ? 'basic_trial_expired'
      : rawTier

    if (BLOCKED_TIERS.has(effectiveTier)) {
      const allowed = EXPIRED_ALLOWED.some(p => pathname.startsWith(p))
      if (!allowed) {
        const url = request.nextUrl.clone()
        url.pathname = '/account/upgrade'
        url.searchParams.set('reason', 'expired')
        return NextResponse.redirect(url)
      }
    }

    // ── 4. Legal version check — only for dashboard/* paths ─────────────────
    // Skip for /auth/* to avoid redirect loops
    const isDashboardPath = pathname.startsWith('/dashboard')
    const isAuthPath      = pathname.startsWith('/auth')

    if (isDashboardPath && !isAuthPath) {
      const currentTermsVersion   = process.env.CURRENT_TERMS_VERSION   ?? '1.0'
      const currentPrivacyVersion = process.env.CURRENT_PRIVACY_VERSION ?? '1.0'

      const userTermsVersion   = raw?.terms_version   ?? null
      const userPrivacyVersion = raw?.privacy_version ?? null

      const termsOutdated   = !userTermsVersion   || userTermsVersion   !== currentTermsVersion
      const privacyOutdated = !userPrivacyVersion || userPrivacyVersion !== currentPrivacyVersion

      if (termsOutdated || privacyOutdated) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/reaccept'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
