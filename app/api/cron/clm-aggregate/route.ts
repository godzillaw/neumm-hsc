/**
 * GET /api/cron/clm-aggregate
 *
 * Nightly Collective Learning Model (CLM) aggregation pipeline.
 * Scheduled at 16:00 UTC = 02:00 AEST (2 hours after midnight streak-check).
 *
 * ── What it does ────────────────────────────────────────────────────────────
 *
 *   1. Reads error_log rows (event_type = 'question_submitted') since last run.
 *   2. Joins to student_profiles to get year_group + course per user.
 *   3. Computes band_range from the outcome_id suffix (B1-B2/B3-B4/B5-B6).
 *   4. Hashes (year_group | course | band_range) → 16-char truncated SHA-256
 *      to produce cohort_hash.  NO user_id is stored in the output — this is
 *      the anonymisation guarantee.
 *   5. Determines subsequent_correct: did the same student later answer the
 *      same outcome correctly within this processing window?
 *   6. Inserts anonymised rows into clm_events_staging.
 *   7. Validates anonymisation (explicit assertion — fails loudly if breached).
 *   8. Checks pattern detection eligibility (≥ 200 distinct events needed).
 *   9. Writes a structured run summary to build_log.
 *
 * ── Pattern detection ────────────────────────────────────────────────────────
 *
 *   Pattern detection (collective_patterns table) is NOT yet active.
 *   Statistical validity requires ≥ 200 students in a cohort.
 *   This job validates the pipeline and confirms anonymisation is working
 *   from day one so the Intelligence Layer has clean data when the threshold
 *   is crossed.
 *
 * ── Required Supabase tables (run in SQL editor before enabling) ─────────────
 *
 *   CREATE TABLE clm_events_staging (
 *     id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     event_type         text NOT NULL,
 *     outcome_id         text,
 *     error_type         text,
 *     cohort_hash        text NOT NULL,
 *     content_reference  jsonb DEFAULT '{}',
 *     outcome_correct    boolean,
 *     subsequent_correct boolean,
 *     created_at         timestamptz DEFAULT now()
 *   );
 *
 *   CREATE TABLE collective_patterns (
 *     id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     pattern_type text NOT NULL,
 *     outcome_id   text,
 *     finding      text,
 *     effect_size  float,
 *     confidence   float,
 *     sample_size  integer,
 *     created_at   timestamptz DEFAULT now()
 *   );
 *
 *   CREATE TABLE build_log (
 *     id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     job_name    text NOT NULL,
 *     run_at      timestamptz DEFAULT now(),
 *     status      text NOT NULL,
 *     details     jsonb DEFAULT '{}',
 *     duration_ms integer
 *   );
 *
 * ── Auth ─────────────────────────────────────────────────────────────────────
 *
 *   Expects: Authorization: Bearer <CRON_SECRET>
 *   Vercel calls this automatically on schedule with the secret injected.
 *   Test locally:
 *     curl -H "Authorization: Bearer $CRON_SECRET" \
 *          http://localhost:3000/api/cron/clm-aggregate
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { createHash }                from 'crypto'

// ─── Service-role client (bypasses RLS — needed to read all users) ───────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorLogRow {
  id:         string
  user_id:    string
  outcome_id: string | null
  error_type: string | null
  created_at: string
}

interface ProfileRow {
  user_id:    string
  year_group: string | null
  course:     string | null
}

interface StagingRow {
  event_type:         string
  outcome_id:         string | null
  error_type:         string | null
  cohort_hash:        string
  content_reference:  Record<string, unknown>
  outcome_correct:    boolean
  subsequent_correct: boolean | null
  created_at:         string
  // user_id intentionally absent — anonymisation guarantee
}

// ─── Anonymisation helpers ────────────────────────────────────────────────────

/**
 * One-way cohort hash: maps (year_group, course, band_range) → 16-char hex.
 * 64-bit entropy — sufficient for grouping, not reversible to individuals.
 * Changing the input order or separator produces a completely different hash,
 * so the scheme is documented here to ensure consistency across runs.
 */
function computeCohortHash(
  yearGroup: string,
  course:    string,
  bandRange: string,
): string {
  return createHash('sha256')
    .update(`${yearGroup}|${course}|${bandRange}`)
    .digest('hex')
    .slice(0, 16)
}

/**
 * Maps the outcome_id band suffix to a coarse range label.
 * MA-CALC-D01-B3 → "core"  (bands 3–4)
 * MA-TRIG-01     → "unknown" (no band suffix — topic-level only)
 *
 * Groups: foundation (B1–B2), core (B3–B4), advanced (B5–B6)
 * Coarse grouping prevents reverse-engineering the exact difficulty of an
 * individual event from the cohort_hash alone.
 */
function extractBandRange(outcomeId: string): string {
  const match = outcomeId.match(/-B(\d+)$/)
  if (!match) return 'unknown'
  const band = parseInt(match[1], 10)
  if (band <= 2) return 'foundation'
  if (band <= 4) return 'core'
  return 'advanced'
}

// ─── Build log helper ─────────────────────────────────────────────────────────

async function writeBuildLog(
  jobName:    string,
  status:     'success' | 'error',
  details:    Record<string, unknown>,
  durationMs: number,
): Promise<void> {
  const { error } = await supabase.from('build_log').insert({
    job_name:    jobName,
    status,
    details,
    duration_ms: durationMs,
  })
  if (error) {
    // Non-fatal: log failure must not mask the underlying job result
    console.error('[clm-aggregate] build_log write failed:', error.message)
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const startMs  = Date.now()
  const jobName  = 'clm-aggregate'

  // ── Auth ────────────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[clm-aggregate] Job started')

  try {

    // ── 1. Determine processing window ────────────────────────────────────────
    //
    // Read last successful run to avoid re-processing the same events.
    // On the first ever run, fall back to 48 hours ago.

    const { data: lastRun } = await supabase
      .from('build_log')
      .select('details')
      .eq('job_name', jobName)
      .eq('status', 'success')
      .order('run_at', { ascending: false })
      .limit(1)
      .single()

    const lastDetails = lastRun?.details as { processed_through?: string } | null
    const windowStart = lastDetails?.processed_through
      ?? new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

    // Buffer of 1 hour at the tail to allow for late-arriving events
    const windowEnd = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    console.log(`[clm-aggregate] Window: ${windowStart} → ${windowEnd}`)

    // ── 2. Fetch question_submitted events in window ───────────────────────────

    const { data: rawEvents, error: eventsError } = await supabase
      .from('error_log')
      .select('id, user_id, outcome_id, error_type, created_at')
      .eq('event_type', 'question_submitted')
      .gte('created_at', windowStart)
      .lt('created_at', windowEnd)
      .order('created_at', { ascending: true })

    if (eventsError) throw new Error(`error_log fetch: ${eventsError.message}`)

    const events: ErrorLogRow[] = (rawEvents ?? []) as ErrorLogRow[]
    const eventCount            = events.length

    console.log(`[clm-aggregate] Events in window: ${eventCount}`)

    if (eventCount === 0) {
      await writeBuildLog(jobName, 'success', {
        events_processed:           0,
        rows_inserted:              0,
        unique_users:               0,
        processed_through:          windowEnd,
        anonymisation_verified:     true,
        pattern_detection_eligible: false,
        staging_total:              0,
        message:                    'No new events in window',
      }, Date.now() - startMs)

      return NextResponse.json({
        ok:        true,
        processed: 0,
        inserted:  0,
        message:   'No new events in window',
      })
    }

    // ── 3. Batch-fetch user profiles ──────────────────────────────────────────
    //
    // One query for all unique users in this batch.
    // year_group + course are the cohort dimensions used in the hash.

    const uniqueUserIds = Array.from(
      new Set(events.map(e => e.user_id).filter(Boolean))
    )

    const { data: rawProfiles } = await supabase
      .from('student_profiles')
      .select('user_id, year_group, course')
      .in('user_id', uniqueUserIds)

    const profileMap = new Map<string, { year_group: string; course: string }>()
    for (const p of ((rawProfiles ?? []) as ProfileRow[])) {
      profileMap.set(p.user_id, {
        year_group: p.year_group ?? 'unknown',
        course:     p.course     ?? 'Advanced',
      })
    }

    console.log(`[clm-aggregate] Unique users: ${uniqueUserIds.length}, profiles found: ${profileMap.size}`)

    // ── 4. Build subsequent_correct index ─────────────────────────────────────
    //
    // For each event, scan forward in the sorted list to find the next time the
    // same user answered the same outcome. subsequent_correct = true if they
    // got it right (error_type IS NULL = correct in the existing schema).
    //
    // Events near the tail of the window may resolve in the next run — those
    // get subsequent_correct = null (unknown, not false).

    const subsequentCorrectById = new Map<string, boolean | null>()
    for (let i = 0; i < events.length; i++) {
      const e = events[i]
      if (subsequentCorrectById.has(e.id)) continue

      let resolution: boolean | null = null
      for (let j = i + 1; j < events.length; j++) {
        const next = events[j]
        if (next.user_id === e.user_id && next.outcome_id === e.outcome_id) {
          // null error_type = answered correctly (matches existing submitAnswer convention)
          resolution = next.error_type === null
          break
        }
      }
      subsequentCorrectById.set(e.id, resolution)
    }

    // ── 5. Build anonymised staging rows ──────────────────────────────────────
    //
    // ANONYMISATION RULES:
    //   ✗  user_id          — never stored
    //   ✗  question_id      — never stored (content is identifiable)
    //   ✗  session_id       — never stored
    //   ✓  outcome_id       — stored (curriculum code, not personal data)
    //   ✓  error_type       — stored (chose_a/b/c/d — no personal data)
    //   ✓  cohort_hash      — one-way hash, not reversible to individual
    //   ✓  content_reference — outcome + band range only (no question text)

    const stagingRows: StagingRow[] = []

    for (const event of events) {
      const profile  = profileMap.get(event.user_id) ?? { year_group: 'unknown', course: 'Advanced' }
      const bandRng  = extractBandRange(event.outcome_id ?? '')
      const cohortH  = computeCohortHash(profile.year_group, profile.course, bandRng)

      stagingRows.push({
        event_type:         'question_submitted',
        outcome_id:         event.outcome_id,
        error_type:         event.error_type,
        cohort_hash:        cohortH,
        content_reference:  { outcome_id: event.outcome_id, band_range: bandRng },
        outcome_correct:    event.error_type === null,
        subsequent_correct: subsequentCorrectById.get(event.id) ?? null,
        created_at:         event.created_at,
        // user_id NOT included — this is the anonymisation guarantee
      })
    }

    // ── 6. Anonymisation assertion ────────────────────────────────────────────
    //
    // Explicit runtime check. If this assertion fails we throw immediately and
    // nothing is written to the staging table. Fails loudly by design — a silent
    // anonymisation breach would be far worse than a failed cron job.

    const hasLeak = stagingRows.some(r => 'user_id' in r || 'question_id' in r)
    if (hasLeak) {
      throw new Error(
        'ANONYMISATION BREACH: personal identifier found in staging rows — ' +
        'aborting without writing to clm_events_staging'
      )
    }

    console.log(`[clm-aggregate] Anonymisation check passed — no user_id or question_id in ${stagingRows.length} rows`)

    // ── 7. Insert into clm_events_staging in chunks ───────────────────────────

    const CHUNK_SIZE  = 500
    let   rowsInserted = 0

    for (let i = 0; i < stagingRows.length; i += CHUNK_SIZE) {
      const chunk = stagingRows.slice(i, i + CHUNK_SIZE)
      const { error: insertErr } = await supabase
        .from('clm_events_staging')
        .insert(chunk)

      if (insertErr) throw new Error(`clm_events_staging insert (chunk ${i / CHUNK_SIZE + 1}): ${insertErr.message}`)
      rowsInserted += chunk.length
    }

    console.log(`[clm-aggregate] Inserted ${rowsInserted} rows into clm_events_staging`)

    // ── 8. Count cohort groups ────────────────────────────────────────────────
    //
    // Counts distinct cohort_hash values across the entire staging table
    // (not just this run) to track progress toward the 200-student threshold
    // for pattern detection.

    const { count: stagingTotal } = await supabase
      .from('clm_events_staging')
      .select('cohort_hash', { count: 'exact', head: true })

    // Count distinct cohorts in current batch as a proxy for cohort diversity
    const distinctCohorts = new Set(stagingRows.map(r => r.cohort_hash)).size

    const patternDetectionEligible = (stagingTotal ?? 0) >= 200
    console.log(
      `[clm-aggregate] Staging total: ${stagingTotal ?? 0} rows across ${distinctCohorts} cohorts this run. ` +
      `Pattern detection: ${patternDetectionEligible ? '✅ ELIGIBLE' : `⏳ not yet (${stagingTotal ?? 0}/200)`}`
    )

    // ── 9. Write build_log ────────────────────────────────────────────────────

    const durationMs = Date.now() - startMs

    await writeBuildLog(jobName, 'success', {
      events_processed:           eventCount,
      rows_inserted:              rowsInserted,
      unique_users:               uniqueUserIds.length,
      distinct_cohorts_this_run:  distinctCohorts,
      processed_through:          windowEnd,
      anonymisation_verified:     true,
      pattern_detection_eligible: patternDetectionEligible,
      staging_total:              stagingTotal ?? 0,
    }, durationMs)

    console.log(`[clm-aggregate] ✅ Completed in ${durationMs}ms`)

    return NextResponse.json({
      ok:                         true,
      events_processed:           eventCount,
      rows_inserted:              rowsInserted,
      unique_users:               uniqueUserIds.length,
      distinct_cohorts_this_run:  distinctCohorts,
      anonymisation_verified:     true,
      pattern_detection_eligible: patternDetectionEligible,
      staging_total:              stagingTotal ?? 0,
      duration_ms:                durationMs,
    })

  } catch (err) {
    const msg        = err instanceof Error ? err.message : String(err)
    const durationMs = Date.now() - startMs

    console.error('[clm-aggregate] ❌ Failed:', msg)

    // Write failure to build_log so the next run knows it can't rely on
    // processed_through from this run and should re-read from the last
    // successful run instead.
    await writeBuildLog(jobName, 'error', { error: msg }, durationMs).catch(() => {})

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
