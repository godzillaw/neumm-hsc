/**
 * scripts/retention/purge-chat-logs.ts
 *
 * Purges old AI tutor chat messages beyond the retention period.
 * Retention policy: 2 years from session date (configurable via CHAT_LOG_RETENTION_DAYS).
 *
 * Run with: npx tsx scripts/retention/purge-chat-logs.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config }       from 'dotenv'

config({ path: '.env.local' })

const RETENTION_DAYS = parseInt(process.env.CHAT_LOG_RETENTION_DAYS ?? '730') // 2 years default

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

async function purgeChatLogs() {
  const jobName  = 'purge-chat-logs'
  const ranAt    = new Date().toISOString()
  const cutoff   = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  console.log(`[${jobName}] Running at ${ranAt}`)
  console.log(`[${jobName}] Purging chat logs older than ${RETENTION_DAYS} days (cutoff: ${cutoff})`)

  try {
    // NOTE: Adjust table/column names to match your actual schema.
    // This assumes a 'chat_messages' or similar table with a 'created_at' column.
    // If no dedicated chat log table exists, this script is a no-op.
    const { data, error } = await admin
      .from('chat_messages')
      .delete()
      .lt('created_at', cutoff)
      .select('id')

    if (error) {
      // Table may not exist — log and continue
      if (error.code === '42P01') {
        console.log(`[${jobName}] Table 'chat_messages' does not exist — skipping.`)
        await logAudit(jobName, ranAt, 0, 'success')
        return
      }
      throw error
    }

    const count = Array.isArray(data) ? data.length : 0
    console.log(`[${jobName}] Deleted ${count} chat log records.`)
    await logAudit(jobName, ranAt, count, 'success')

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[${jobName}] Error:`, msg)
    await logAudit(jobName, ranAt, 0, 'error', msg)
    process.exit(1)
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

purgeChatLogs().catch(err => {
  console.error('[purge-chat-logs] Fatal:', err)
  process.exit(1)
})
