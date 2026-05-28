/**
 * scripts/process-deletions.ts
 *
 * Finds users with deletion_requested=true and deletion_requested_at older
 * than 30 days, then logs what would be deleted.
 *
 * NOTE: Actual row deletion in auth.users requires Supabase service role.
 * This script uses the service role client but only REPORTS by default.
 * To actually delete, uncomment the deletion blocks marked with "UNCOMMENT TO DELETE".
 *
 * Run with:
 *   npx tsx scripts/process-deletions.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config }       from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

async function processDeletions() {
  console.log('[process-deletions] Starting run at', new Date().toISOString())

  // Find users eligible for deletion (requested > 30 days ago)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: usersToDelete, error } = await supabase
    .from('users')
    .select('id, deletion_requested_at')
    .eq('deletion_requested', true)
    .lte('deletion_requested_at', thirtyDaysAgo)

  if (error) {
    console.error('[process-deletions] Query failed:', error.message)
    process.exit(1)
  }

  if (!usersToDelete || usersToDelete.length === 0) {
    console.log('[process-deletions] No users eligible for deletion.')
    return
  }

  console.log(`[process-deletions] Found ${usersToDelete.length} user(s) eligible for deletion.`)

  for (const user of usersToDelete) {
    const userId = user.id as string
    console.log(`[process-deletions] Would delete user: ${userId}`)

    // ── DRY RUN — log what would be deleted ───────────────────────────────────

    // Count records in related tables
    const tables = [
      'student_profiles',
      'age_gate_blocks',
    ]

    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      console.log(`  - ${table}: ${count ?? 0} records`)
    }

    // ── UNCOMMENT TO DELETE (requires careful testing first) ──────────────────
    //
    // // 1. Delete from student_profiles
    // await supabase.from('student_profiles').delete().eq('user_id', userId)
    //
    // // 2. Delete from users table (keeps auth.users for audit — auth deletion requires admin.deleteUser)
    // // WARNING: Do NOT delete from users table before auth.users or you'll lose the FK reference
    //
    // // 3. Delete auth.users via admin API (this also deletes the users row via cascade if FK set)
    // const { error: authDeleteErr } = await supabase.auth.admin.deleteUser(userId)
    // if (authDeleteErr) {
    //   console.error(`  Failed to delete auth.users for ${userId}:`, authDeleteErr.message)
    //   continue
    // }
    //
    // // 4. Log to deletion_audit_log
    // await supabase.from('deletion_audit_log').insert({
    //   user_id: userId,
    //   records_deleted: 1,
    //   notes: 'User-requested deletion via Privacy Controls',
    // })
    //
    // console.log(`  ✓ Deleted user ${userId}`)

    console.log(`  [DRY RUN] No data was deleted. Uncomment deletion blocks to activate.`)
  }

  console.log('[process-deletions] Done.')
}

processDeletions().catch(err => {
  console.error('[process-deletions] Fatal error:', err)
  process.exit(1)
})
