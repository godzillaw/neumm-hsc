'use client'

/**
 * /auth/callback — client-side OAuth / PKCE callback handler
 *
 * WHY client-side instead of a Route Handler:
 *   Every server-side approach (Route Handler + NextResponse.redirect,
 *   cookies() from next/headers, etc.) has the same fundamental problem on
 *   Vercel: Set-Cookie headers are not reliably delivered to the browser
 *   when they travel on a redirect response.  The browser follows the
 *   redirect without session cookies, middleware sees no auth, redirects
 *   to /auth/login.
 *
 *   The only 100% reliable solution is to exchange the code IN THE BROWSER
 *   using createBrowserClient.  The browser client writes directly to
 *   document.cookie, which is guaranteed to be in the Cookie header of the
 *   very next request — no server-side propagation needed.
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams }               from 'next/navigation'
import { createSupabaseBrowserClient }   from '@/lib/supabase-browser'

const BASE = '/math-nsw/app'

function CallbackHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus]   = useState('Completing sign in…')

  useEffect(() => {
    const error            = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // ── OAuth provider returned an error ───────────────────────────────────
    if (error) {
      const msg = encodeURIComponent(errorDescription ?? error)
      window.location.href = `${BASE}/auth/login?error=${msg}`
      return
    }

    // ── Use onAuthStateChange instead of manual exchangeCodeForSession ─────
    //
    // WHY: @supabase/ssr v0.9.0 hardcodes `detectSessionInUrl: isBrowser()`
    // AFTER spreading options, so it cannot be overridden. The moment
    // createBrowserClient() is called in a browser context with a `code`
    // param in the URL, it automatically fires exchangeCodeForSession() in
    // the background. Calling it again manually races with this — the loser
    // gets "code already used" and we end up with no session.
    //
    // The fix: subscribe to onAuthStateChange SYNCHRONOUSLY (before any
    // network I/O can complete) so we reliably catch the SIGNED_IN event
    // that the auto-exchange fires. We also check getSession() immediately
    // in case the exchange somehow already finished.
    const supabase = createSupabaseBrowserClient()

    let done = false

    async function handleSession(userId: string) {
      // New user signing up via Google → send to onboarding unless they've
      // already completed it.
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('year_group')
        .eq('user_id', userId)
        .maybeSingle()

      const destination = profile?.year_group ? '/dashboard' : '/onboarding/year'
      setStatus('Signed in! Redirecting…')
      window.location.href = `${BASE}${destination}`
    }

    // Subscribe BEFORE auto-exchange can complete (network I/O is async,
    // this subscription setup is synchronous).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !done) {
          done = true
          subscription.unsubscribe()
          clearTimeout(fallbackTimer)
          await handleSession(session.user.id)
        }
      }
    )

    // Also check if a session already exists (handles the "code already
    // used" case where detectSessionInUrl finished before our subscription).
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && !done) {
        done = true
        subscription.unsubscribe()
        clearTimeout(fallbackTimer)
        await handleSession(session.user.id)
      }
    })

    // Fallback: if nothing resolves in 10 s, send to login.
    const fallbackTimer = setTimeout(() => {
      if (!done) {
        done = true
        subscription.unsubscribe()
        window.location.href = `${BASE}/auth/login`
      }
    }, 10_000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallbackTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', fontFamily: "'Nunito', sans-serif",
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Spinner */}
        <svg
          style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}
          width="36" height="36" viewBox="0 0 24 24" fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="4" />
          <path fill="#185FA5" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <p style={{ color: '#6B7280', fontSize: 15, fontWeight: 600 }}>{status}</p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', backgroundColor: '#FFFFFF',
        }} />
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}
