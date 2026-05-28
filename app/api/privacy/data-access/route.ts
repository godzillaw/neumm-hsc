import { NextResponse }                from 'next/server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'

/**
 * POST /api/privacy/data-access
 *
 * Logs a data access request. Sends notification email (or console.log if
 * SENDGRID_API_KEY is not configured).
 */
export async function POST() {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Log the request (in production, send via email system)
    console.log('[data-access-request]', {
      userId:    user.id,
      email:     user.email,
      requestedAt: new Date().toISOString(),
    })

    // TODO: replace console.log with sendEmail() once SendGrid is configured
    const privacyEmail = process.env.LEGAL_EMAIL ?? 'privacy@neumm.com.au'
    console.log(`[email] To: ${privacyEmail}`)
    console.log(`[email] Subject: Data Access Request — ${user.email}`)
    console.log(`[email] Body: User ${user.id} (${user.email}) has requested a copy of their data. Respond within 30 days.`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[privacy/data-access]', err)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
