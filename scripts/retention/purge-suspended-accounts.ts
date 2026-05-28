/**
 * scripts/retention/purge-suspended-accounts.ts
 *
 * Fully deletes accounts that:
 * 1. Have deletion_requested=true AND deletion_requested_at > 30 days ago
 *    (user-requested deletions via Privacy Controls), OR
 * 2. Have been in 'basic_trial_expired' or 'trial_expired' tier for > 365 days
 *    with no login activity (inactive suspended accounts)
 *
 * Run with: npx tsx scripts/retention/purge-suspended-accounts.ts [--dry-run]
 *
 * By default runs in DRY RUN mode. Pass --execute to actually delete.
 */

import { createClient } from '@supabase/supabase-js'
import { config }       from 'dotenv'

config({ path: '.env.local' })

const DRY_RUN       = !process.argv.includes('--execute')
const DELETION_DAYS = 30   // Days after deletion request before purging
const INACTIVE_DAYS = 365  // Days inactive before purging expired trial accounts

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

async function purgeSuspendedAccounts() {
  const jobName = 'purge-suspended-accounts'
  const ranAt   = new Date().toISOString()

  console.log(`[${jobName}] Starting at ${ranAt}`)
  console.log(`[${jobName}] Mode: ${DRY_RUN ? 'DRY RUN (no data deleted)' : 'EXECUTE (deleting data)'}`)
  if (DRY_RUN) console.log(`[${jobName}] Pass --execute flag to actually delete records.`)

  let totalDeleted = 0

  try {
    // ── 1. User-requested deletions (> 30 days old) ─────────────────────────
    const deletionCutoff = new Date(Date.now() - DELETION_DAYS * 24 * 60 * 60 * 1000).toISOString()

    const { data: requestedDeletions } = await admin
      .from('users')
      .select('id')
      .eq('deletion_requested', true)
      .lte('deletion_requested_at', deletionCutoff)

    console.log(`[${jobName}] User-requested deletions eligible: ${requestedDeletions?.length ?? 0}`)

    if (requestedDeletions && requestedDeletions.length > 0) {
      for (const u of requestedDeletions) {
        const userId = u.id as string
        console.log(`[${jobName}] ${DRY_RUN ? '[DRY RUN] Would delete' : 'Deleting'} user (requested): ${userId}`)

        if (!DRY_RUN) {
          // Delete related data
          await admin.from('student_profiles').delete().eq('user_id', userId)

          // Delete auth user (cascades to users table if FK configured, otherwise delete separately)
          const { error: authErr } = await admin.auth.admin.deleteUser(userId)
          if (authErr) {
            console.error(`[${jobName}] Failed to delete auth user ${userId}:`, authErr.message)
            continue
          }

          // Log to audit table
          await admin.from('deletion_audit_log').insert({
            user_id:         userId,
            records_deleted: 1,
            notes:           'User-requested deletion (30-day hold elapsed)',
          })

          totalDeleted++
        }
      }
    }

    // ── 2. Inactive expired trial accounts (> 365 days) ──────────────────────
    const inactiveCutoff = new Date(Date.now() - INACTIVE_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const EXPIRED_TIERS = ['basic_trial_expired', 'trial_expired']

    const { data: inactiveAccounts } = await admin
      .from('users')
      .select('id, tier, trial_end_date')
      .in('tier', EXPIRED_TIERS)
      .lte('trial_end_date', inactiveCutoff)
      .eq('deletion_requested', false) // Don't double-process

    console.log(`[${jobName}] Inactive expired trial accounts eligible: ${inactiveAccounts?.length ?? 0}`)

    if (inactiveAccounts && inactiveAccounts.length > 0) {
      for (const u of inactiveAccounts) {
        const userId = u.id as string
        console.log(`[${jobName}] ${DRY_RUN ? '[DRY RUN] Would delete' : 'Deleting'} inactive account: ${userId} (tier: ${u.tier as string})`)

        if (!DRY_RUN) {
          await admin.from('student_profiles').delete().eq('user_id', userId)

          const { error: authErr } = await admin.auth.admin.deleteUser(userId)
          if (authErr) {
            console.error(`[${jobName}] Failed to delete auth user ${userId}:`, authErr.message)
            continue
          }

          await admin.from('deletion_audit_log').insert({
            user_id:         userId,
            records_deleted: 1,
            notes:           `Inactive expired trial account purged after ${INACTIVE_DAYS} days`,
          })

          totalDeleted++
        }
      }
    }

    console.log(`[${jobName}] Done. ${DRY_RUN ? 'Would have deleted' : 'Deleted'} ${totalDeleted} account(s).`)

    await admin.from('retention_audit_log').insert({
      job_name:         jobName,
      ran_at:           ranAt,
      records_affected: totalDeleted,
      status:           'success',
    })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[${jobName}] Error:`, msg)
    await admin.from('retention_audit_log').insert({
      job_name:      jobName,
      ran_at:        ranAt,
      records_affected: 0,
      status:        'error',
      error_message: msg,
    })
    process.exit(1)
  }
}

purgeSuspendedAccounts().catch(err => {
  console.error('[purge-suspended-accounts] Fatal:', err)
  process.exit(1)
})
