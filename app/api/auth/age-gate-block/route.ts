import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

/**
 * POST /api/auth/age-gate-block
 *
 * Logs an under-13 signup attempt. Stores only IP and user-agent (no PII).
 */
export async function POST(request: NextRequest) {
  try {
    const ip        = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                    ?? request.headers.get('x-real-ip')
                    ?? null
    const userAgent = request.headers.get('user-agent') ?? null

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    await admin.from('age_gate_blocks').insert({
      ip_address: ip,
      user_agent: userAgent,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[age-gate-block]', err)
    // Non-critical — don't expose errors to client
    return NextResponse.json({ ok: true })
  }
}
