/**
 * GET /api/admin/users
 *
 * Read-only endpoint for checking pilot user status.
 * Protected by ADMIN_SECRET_KEY — pass as a Bearer token or query param.
 *
 * Usage:
 *   curl -H "Authorization: Bearer <ADMIN_SECRET_KEY>" \
 *        https://app.neumm.com.au/api/admin/users
 *
 *   # or via query param (handy for quick browser checks):
 *   curl "https://app.neumm.com.au/api/admin/users?key=<ADMIN_SECRET_KEY>"
 *
 *   # pretty-print with jq:
 *   curl -s -H "Authorization: Bearer <key>" \
 *        https://app.neumm.com.au/api/admin/users | jq '.[] | {email, tier, card_on_file}'
 *
 * Returns:
 *   200  { users: UserRow[], total: number }
 *   401  { error: "Unauthorized" }
 *   500  { error: "..." }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

// Service-role client — bypasses RLS to read all users
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

export async function GET(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────────
  const adminSecret = process.env.ADMIN_SECRET_KEY
  if (!adminSecret) {
    console.error('[admin/users] ADMIN_SECRET_KEY not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  // Accept key via Authorization: Bearer <key>  OR  ?key=<key>
  const authHeader = request.headers.get('authorization') ?? ''
  const bearerKey  = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  const queryKey   = request.nextUrl.searchParams.get('key')
  const provided   = bearerKey ?? queryKey ?? ''

  if (provided !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Query ─────────────────────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('users')
    .select('email, tier, trial_start_date, trial_end_date, card_on_file, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/users] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { users: data ?? [], total: (data ?? []).length },
    {
      status: 200,
      headers: {
        // Never cache admin responses
        'Cache-Control': 'no-store',
      },
    },
  )
}
