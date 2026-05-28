/**
 * scripts/retention/purge-session-logs.ts
 *
 * Purges old practice session logs and age gate block logs beyond retention periods.
 * Retention policy:
 *   - age_gate_blocks: 90 days (no longer needed after audit window)
 *   - practice sessions (if log table exists): 2 years
 *   - email_suppression_log: 7 years (for legal/audit purposes)
 *
 * Run with: npx tsx scripts/retention/purge-session-logs.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config }       from 'dotenv'

config({ path: '.env.local' })

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

interface PurgeJob {
  name:         string
  table:        string
  dateColumn:   string
  retentionDays: number
  description:  string
}

const PURGE_JOBS: PurgeJob[] = [
  {
    name:          'purge-age-gate-blocks',
    table:         'age_gate_blocks',
    dateColumn:    'attempted_at',
    retentionDays: 90,
    description:   'Age gate block logs (IP/user-agent only, no PII)',
  },
  {
    name:          'purge-practice-sessions',
    table:         'practice_sessions',
    dateColumn:    'created_at',
    retentionDays: 730, // 2 years
    description:   'Practice session metadata',
  },
]

async function purgeSessionLogs() {
  const ranAt = new Date().toISOString()
  console.log(`[purge-session-logs] Starting retention run at ${ranAt}`)

  for (const job of PURGE_JOBS) {
    await runJob(job, ranAt)
  }

  console.log('[purge-session-logs] All jobs complete.')
}

async function runJob(job: PurgeJob, ranAt: string) {
  const cutoff = new Date(Date.now() - job.retentionDays * 24 * 60 * 60 * 1000).toISOString()
  console.log(`[${job.name}] Purging ${job.description} older than ${job.retentionDays} days (cutoff: ${cutoff})`)

  try {
    const { data, error } = await admin
      .from(job.table)
      .delete()
      .lt(job.dateColumn, cutoff)
      .select('id')

    if (error) {
      if (error.code === '42P01') {
        console.log(`[${job.name}] Table '${job.table}' does not exist — skipping.`)
        await logAudit(job.name, ranAt, 0, 'success')
        return
      }
      throw error
    }

    const count = Array.isArray(data) ? data.length : 0
    console.log(`[${job.name}] Deleted ${count} record(s).`)
    await logAudit(job.name, ranAt, count, 'success')

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[${job.name}] Error:`, msg)
    await logAudit(job.name, ranAt, 0, 'error', msg)
  }
}

async function logAudit(
  jobName: string,
  ranAt: string,
  recordsAffected: number,
  status: string,
  errorMessage?: string,
) {
  await admin.from('retention_audit_log').insert({
    job_name:         jobName,
    ran_at:           ranAt,
    records_affected: recordsAffected,
    status,
    error_message:    errorMessage ?? null,
  })
}

purgeSessionLogs().catch(err => {
  console.error('[purge-session-logs] Fatal:', err)
  process.exit(1)
})
