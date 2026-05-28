import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { verifyUnsubscribeToken }    from '@/lib/email/sendEmail'

/**
 * GET /api/unsubscribe?token=<signed-jwt>
 *
 * Validates the unsubscribe token and sets marketing_emails_opted_out=true.
 * Works without the user being logged in.
 * Redirects to /unsubscribe confirmation page on success.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse('Missing token.', { status: 400 })
  }

  // Verify token
  const payload = await verifyUnsubscribeToken(token)

  if (!payload) {
    return new NextResponse(
      '<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>Invalid or expired unsubscribe link.</h2><p>The link may have expired (links expire after 30 days). Please contact <a href="mailto:privacy@neumm.com.au">privacy@neumm.com.au</a> to unsubscribe.</p></body></html>',
      { status: 400, headers: { 'Content-Type': 'text/html' } },
    )
  }

  // Update the user's opt-out preference
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const { error } = await admin
    .from('users')
    .update({ marketing_emails_opted_out: true })
    .eq('id', payload.userId)

  if (error) {
    console.error('[unsubscribe] update failed:', error.message)
    return new NextResponse('Failed to process unsubscribe. Please contact privacy@neumm.com.au.', { status: 500 })
  }

  console.log('[unsubscribe] Opted out:', payload.userId, payload.email)

  // Redirect to confirmation page
  const url = request.nextUrl.clone()
  url.pathname = '/unsubscribe'
  url.search   = ''
  return NextResponse.redirect(url)
}
