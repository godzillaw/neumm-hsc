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
    const code             = searchParams.get('code')
    const error            = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // ── OAuth provider returned an error ───────────────────────────────────
    if (error) {
      const msg = encodeURIComponent(errorDescription ?? error)
      window.location.href = `${BASE}/auth/login?error=${msg}`
      return
    }

    // ── Session resolution strategy ────────────────────────────────────────
    //
    // createBrowserClient() is a module-level singleton. If it was already
    // initialised on the signup page (before the ?code= was in the URL),
    // its internal detectSessionInUrl auto-exchange never ran for this code,
    // so onAuthStateChange will never fire SIGNED_IN on its own.
    //
    // Strategy (in priority order):
    //  1. onAuthStateChange subscription — catches SIGNED_IN/TOKEN_REFRESHED
    //     fired by auto-exchange when the singleton is freshly created here.
    //  2. getSession() — catches sessions the singleton already holds.
    //  3. Manual exchangeCodeForSession(code) — covers the singleton-cached
    //     case where auto-exchange never ran; onAuthStateChange then fires.
    //  4. Post-exchange getSession() retry — covers the edge case where
    //     exchangeCodeForSession wrote cookies but the event was missed.
    //  5. 10-second fallback → login.
    const supabase = createSupabaseBrowserClient()
    let done = false

    async function redirect(userId: string) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('year_group')
        .eq('user_id', userId)
        .maybeSingle()
      setStatus('Signed in! Redirecting…')
      window.location.href = `${BASE}${profile?.year_group ? '/dashboard' : '/onboarding/year'}`
    }

    function finish(session: { user: { id: string } }) {
      if (done) return
      done = true
      subscription.unsubscribe()
      clearTimeout(fallbackTimer)
      redirect(session.user.id)
    }

    // 1. Subscribe BEFORE any async work so we catch auto-exchange events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { if (session) finish(session) }
    )

    // 2 + 3. Check existing session; if none, exchange the code manually.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) { finish(session); return }

      if (!code) {
        // No code and no session — nothing to do.
        if (!done) {
          done = true
          subscription.unsubscribe()
          clearTimeout(fallbackTimer)
          window.location.href = `${BASE}/auth/login`
        }
        return
      }

      // Manual exchange — fires onAuthStateChange(SIGNED_IN) on success.
      const { error: exchErr } = await supabase.auth.exchangeCodeForSession(code)

      if (exchErr && !done) {
        // 4. Exchange failed (e.g. code already used). Check session one more
        //    time — auto-exchange may have written it before our subscription.
        const { data: { session: retrySession } } = await supabase.auth.getSession()
        if (retrySession) { finish(retrySession); return }
        // Still nothing — fallback timer will redirect to login.
      }
      // On success onAuthStateChange fires and finish() is called from there.
    })

    // 5. Hard fallback.
    const fallbackTimer = setTimeout(() => {
      if (!done) {
        done = true
        subscription.unsubscribe()
        window.location.href = `${BASE}/auth/login`
      }
    }, 10_000)

    return () => { subscription.unsubscribe(); clearTimeout(fallbackTimer) }
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
