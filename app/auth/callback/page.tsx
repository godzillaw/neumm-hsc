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
    const next             = searchParams.get('next') ?? '/dashboard'
    const error            = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // ── OAuth provider returned an error ───────────────────────────────────
    if (error) {
      const msg = encodeURIComponent(errorDescription ?? error)
      window.location.href = `${BASE}/auth/login?error=${msg}`
      return
    }

    if (!code) {
      window.location.href = `${BASE}/auth/login`
      return
    }

    // ── Exchange the code for a session IN THE BROWSER ────────────────────
    // createBrowserClient writes the session directly to document.cookie.
    // The next window.location.href navigation sends those cookies to the
    // server so middleware can authenticate the request.
    const supabase = createSupabaseBrowserClient()

    supabase.auth.exchangeCodeForSession(code).then(async ({ data, error: exchangeErr }) => {
      if (exchangeErr) {
        setStatus('Something went wrong — checking your session…')

        // The code may have already been used (e.g. back-button re-visit).
        // If the user is already signed in, send them where they need to go.
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('student_profiles')
            .select('year_group')
            .eq('user_id', user.id)
            .maybeSingle()
          window.location.href = profile?.year_group
            ? `${BASE}/dashboard`
            : `${BASE}/onboarding/year`
        } else {
          window.location.href = `${BASE}/auth/login`
        }
        return
      }

      // ── Exchange succeeded — decide where to send the user ───────────────
      const user = data.user
      let destination = next

      if (next.startsWith('/onboarding') && user) {
        // Skip onboarding if the user already set their year group
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('year_group')
          .eq('user_id', user.id)
          .maybeSingle()
        if (profile?.year_group) {
          destination = '/dashboard'
        }
      }

      setStatus('Signed in! Redirecting…')
      window.location.href = `${BASE}${destination}`
    })
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
