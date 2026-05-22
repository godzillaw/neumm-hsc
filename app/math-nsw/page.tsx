/**
 * /math-nsw/app/math-nsw — OAuth fallback catch-route
 *
 * This page only exists to catch a Supabase mis-configuration where the OAuth
 * callback code (or email-confirmation code) lands here instead of at the
 * canonical /auth/callback route.
 *
 * This happens when the Supabase project's "Site URL" is set to
 * https://neumm-hsc.vercel.app/math-nsw/app/math-nsw (or similar) instead of
 * the proper callback path — causing Supabase to redirect to this URL when the
 * explicit `redirectTo` is not in the allowed-redirect-URLs list.
 *
 * Fix: pass everything through to /auth/callback which does the real PKCE
 * code exchange. The PKCE verifier cookie travels with the redirect.
 */
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function MathNswCatchPage({ searchParams }: PageProps) {
  const code  = typeof searchParams.code  === 'string' ? searchParams.code  : null
  const next  = typeof searchParams.next  === 'string' ? searchParams.next  : null
  const error = typeof searchParams.error === 'string' ? searchParams.error : null
  const errorDesc = typeof searchParams.error_description === 'string'
    ? searchParams.error_description : null

  if (error) {
    const msg = encodeURIComponent(errorDesc ?? error)
    redirect(`/auth/login?error=${msg}`)
  }

  if (code) {
    // Pass code (and optional next) through to the real callback handler
    const params = new URLSearchParams()
    params.set('code', code)
    if (next) params.set('next', next)
    redirect(`/auth/callback?${params.toString()}`)
  }

  // No auth params — send to dashboard (middleware redirects to login if needed)
  redirect('/dashboard')
}
