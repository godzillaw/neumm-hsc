import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { todayAEST, yesterdayAEST } from '@/lib/date-utils'

// ─── Route: GET /api/cron/streak-check ──────────────────────────────────────────
//
// Scheduled daily at 14:00 UTC (≈ midnight AEST / 01:00 AEDT).
// Resets current_streak to 0 for any user who missed yesterday.
//
// Auth: expects  Authorization: Bearer <CRON_SECRET>
// Configure CRON_SECRET in .env.local / Vercel environment variables.

export async function GET(request: NextRequest) {
  // ── 1. Authorise ──────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Build service-role Supabase client (bypasses RLS) ──────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  // ── 3. Compute cutoff ─────────────────────────────────────────────────────────
  // Any user whose last_active_date is BEFORE yesterday has missed at least one day.
  const todayStr     = todayAEST()
  const yesterdayStr = yesterdayAEST()

  // ── 4. Fetch candidates: streaks not yet reset and last active before yesterday ─
  const { data: stale, error: fetchErr } = await supabase
    .from('streaks')
    .select('user_id, current_streak, last_active_date')
    .gt('current_streak', 0)        // only those with an active streak
    .lt('last_active_date', yesterdayStr)  // missed at least yesterday

  if (fetchErr) {
    console.error('[streak-check cron] fetch error:', fetchErr.message)
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  const staleRows = stale ?? []

  if (staleRows.length === 0) {
    return NextResponse.json({
      ok:    true,
      reset: 0,
      runAt: todayStr,
      msg:   'No stale streaks to reset.',
    })
  }

  // ── 5. Bulk-reset streaks to 0 ───────────────────────────────────────────────
  const userIds = staleRows.map(r => r.user_id as string)

  const { error: updateErr } = await supabase
    .from('streaks')
    .update({ current_streak: 0 })
    .in('user_id', userIds)

  if (updateErr) {
    console.error('[streak-check cron] update error:', updateErr.message)
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  console.log(`[streak-check cron] Reset ${staleRows.length} streaks on ${todayStr}`)

  return NextResponse.json({
    ok:    true,
    reset: staleRows.length,
    runAt: todayStr,
    msg:   `Reset ${staleRows.length} stale streaks.`,
  })
}
