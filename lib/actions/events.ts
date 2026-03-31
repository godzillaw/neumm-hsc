'use server'

/**
 * Learning event logger — Intelligence Layer data feed.
 *
 * Every student interaction is recorded with structured data for downstream
 * analysis, adaptive algorithm tuning, and per-student learning model updates.
 *
 * ── Required schema additions (run once in Supabase SQL editor) ────────────────
 *
 *   ALTER TABLE error_log
 *     ADD COLUMN IF NOT EXISTS event_type  text,
 *     ADD COLUMN IF NOT EXISTS metadata    jsonb DEFAULT '{}';
 *
 *   ALTER TABLE mastery_map
 *     ADD COLUMN IF NOT EXISTS individual_learning_model jsonb DEFAULT '{}';
 *
 * ── Event → DB mapping ────────────────────────────────────────────────────────
 *
 *   All events  → error_log row (event_type + mapped legacy columns + metadata)
 *   question_submitted  → mastery_map.individual_learning_model (accuracy, timing, hints, errors)
 *   explanation_viewed  → mastery_map.individual_learning_model (explanation_views++)
 *   visual_opened       → mastery_map.individual_learning_model (visual_opens++)
 *   visual_skipped      → mastery_map.individual_learning_model (visual_skips, time_on_visual)
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'

// ─── Event payload types ─────────────────────────────────────────────────────

export type LearningEventType =
  | 'question_submitted'
  | 'explanation_viewed'
  | 'session_started'
  | 'session_ended'
  | 'topic_overridden'
  | 'visual_opened'
  | 'visual_skipped'

export interface EventPayloadMap {
  question_submitted: {
    question_id:  string
    outcome_id:   string          // mastery_outcome_id e.g. "MA-CALC-D01-B3"
    correct:      boolean
    error_type:   string | null   // e.g. "chose_b"
    time_ms:      number
    hint_used:    boolean
  }
  explanation_viewed: {
    question_id:  string
    outcome_id:   string
  }
  session_started: {
    session_id?:  string
    outcome_id?:  string
  }
  session_ended: {
    session_id?:          string
    duration_ms:          number
    questions_attempted:  number
    accuracy_pct:         number
  }
  topic_overridden: {
    from_outcome_id:  string
    to_outcome_id:    string
    session_id?:      string
  }
  visual_opened: {
    visual_type:  string
    outcome_id:   string
    session_id?:  string
  }
  visual_skipped: {
    visual_type:        string
    time_on_visual_ms:  number
    outcome_id?:        string
    session_id?:        string
  }
}

// ─── Individual Learning Model ────────────────────────────────────────────────
//
// Stored as JSONB in mastery_map.individual_learning_model per (user, outcome).
// Gives the Intelligence Layer rich behavioural signal beyond confidence_pct.

export interface ILMData {
  answer_count:         number    // total attempts on this outcome
  correct_count:        number
  accuracy:             number    // 0–1, running average
  hints_used:           number    // times hint was requested before answering
  hint_rate:            number    // 0–1
  total_time_ms:        number    // cumulative time across all attempts
  avg_time_ms:          number    // mean time per attempt
  explanation_views:    number    // times step-by-step explanation was requested
  error_patterns:       string[]  // rolling last-20 wrong-option codes e.g. ["chose_b","chose_b"]
  visual_opens:         number
  visual_skips:         number
  total_visual_time_ms: number    // cumulative time spent on visuals before skipping
  last_updated_at:      string    // ISO timestamp
}

const EMPTY_ILM: ILMData = {
  answer_count:         0,
  correct_count:        0,
  accuracy:             0,
  hints_used:           0,
  hint_rate:            0,
  total_time_ms:        0,
  avg_time_ms:          0,
  explanation_views:    0,
  error_patterns:       [],
  visual_opens:         0,
  visual_skips:         0,
  total_visual_time_ms: 0,
  last_updated_at:      '',
}

// ─── Public entry point ───────────────────────────────────────────────────────
//
// Never throws — logging failures are silent so they never break the UX.

export async function logLearningEvent<T extends LearningEventType>(
  userId:    string,
  eventType: T,
  payload:   EventPayloadMap[T],
): Promise<void> {
  try {
    await _log(userId, eventType, payload as EventPayloadMap[LearningEventType])
  } catch (err) {
    // Non-fatal: log to console but never surface to caller
    console.error(`[logLearningEvent] silent failure for "${eventType}":`, err)
  }
}

// ─── Internal implementation ─────────────────────────────────────────────────

async function _log(
  userId:    string,
  eventType: LearningEventType,
  payload:   EventPayloadMap[LearningEventType],
): Promise<void> {
  const supabase = createSupabaseServerClient()
  const now      = new Date().toISOString()

  // ── 1. Build error_log row ──────────────────────────────────────────────────
  //
  // Maps structured payload onto the existing legacy columns where applicable,
  // plus the new event_type + metadata columns for full fidelity.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logRow: Record<string, any> = {
    user_id:    userId,
    event_type: eventType,
    metadata:   payload,
    created_at: now,
  }

  switch (eventType) {
    case 'question_submitted': {
      const p = payload as EventPayloadMap['question_submitted']
      logRow.question_id          = p.question_id
      logRow.outcome_id           = p.outcome_id
      logRow.error_type           = p.error_type
      logRow.hint_used            = p.hint_used
      logRow.time_to_respond_ms   = p.time_ms
      break
    }
    case 'explanation_viewed': {
      const p = payload as EventPayloadMap['explanation_viewed']
      logRow.question_id = p.question_id
      logRow.outcome_id  = p.outcome_id
      break
    }
    case 'topic_overridden': {
      const p = payload as EventPayloadMap['topic_overridden']
      logRow.outcome_id = p.from_outcome_id
      break
    }
    case 'visual_opened':
    case 'visual_skipped': {
      const p = payload as EventPayloadMap['visual_opened'] | EventPayloadMap['visual_skipped']
      const withOutcome = p as { outcome_id?: string }
      logRow.outcome_id = withOutcome.outcome_id ?? null
      break
    }
    // session_started / session_ended: no legacy column mapping needed
  }

  const { error: logError } = await supabase.from('error_log').insert(logRow)
  if (logError) {
    console.error(`[logLearningEvent] error_log insert failed (${eventType}):`, logError.message)
    // Continue — still attempt ILM update even if log insert failed
  }

  // ── 2. Update individual_learning_model ────────────────────────────────────
  await updateILM(userId, eventType, payload, now)
}

// ─── ILM update ──────────────────────────────────────────────────────────────

async function updateILM(
  userId:    string,
  eventType: LearningEventType,
  payload:   EventPayloadMap[LearningEventType],
  now:       string,
): Promise<void> {
  // Only events with a clear outcome_id context update the ILM
  const UPDATES_ILM = new Set<LearningEventType>([
    'question_submitted',
    'explanation_viewed',
    'visual_opened',
    'visual_skipped',
  ])
  if (!UPDATES_ILM.has(eventType)) return

  const supabase = createSupabaseServerClient()

  // Resolve outcome_id for this event
  let outcomeId: string | null = null
  switch (eventType) {
    case 'question_submitted':
      outcomeId = (payload as EventPayloadMap['question_submitted']).outcome_id
      break
    case 'explanation_viewed':
      outcomeId = (payload as EventPayloadMap['explanation_viewed']).outcome_id
      break
    case 'visual_opened':
      outcomeId = (payload as EventPayloadMap['visual_opened']).outcome_id
      break
    case 'visual_skipped':
      outcomeId = (payload as EventPayloadMap['visual_skipped']).outcome_id ?? null
      break
  }
  if (!outcomeId) return

  // Read current ILM (row may not exist yet for non-question events)
  const { data: row } = await supabase
    .from('mastery_map')
    .select('individual_learning_model')
    .eq('user_id', userId)
    .eq('outcome_id', outcomeId)
    .single()

  // Row doesn't exist yet — only question_submitted creates a mastery_map row
  // (done in submitAnswer before logLearningEvent is called).
  // For other events, silently skip rather than creating a partial row.
  if (!row) return

  const current = (row.individual_learning_model ?? {}) as Partial<ILMData>
  const ilm: ILMData = { ...EMPTY_ILM, ...current }

  // ── Apply mutation ──────────────────────────────────────────────────────────

  switch (eventType) {
    case 'question_submitted': {
      const p = payload as EventPayloadMap['question_submitted']

      ilm.answer_count  += 1
      if (p.correct)  ilm.correct_count += 1
      if (p.hint_used) ilm.hints_used   += 1

      ilm.accuracy  = ilm.answer_count > 0 ? ilm.correct_count / ilm.answer_count : 0
      ilm.hint_rate = ilm.answer_count > 0 ? ilm.hints_used    / ilm.answer_count : 0

      ilm.total_time_ms += p.time_ms
      ilm.avg_time_ms    = ilm.answer_count > 0 ? Math.round(ilm.total_time_ms / ilm.answer_count) : 0

      if (p.error_type) {
        // Rolling last-20 wrong-answer codes — captures recency of error patterns
        ilm.error_patterns = [...ilm.error_patterns.slice(-19), p.error_type]
      }
      break
    }
    case 'explanation_viewed': {
      ilm.explanation_views += 1
      break
    }
    case 'visual_opened': {
      ilm.visual_opens += 1
      break
    }
    case 'visual_skipped': {
      const p = payload as EventPayloadMap['visual_skipped']
      ilm.visual_skips         += 1
      ilm.total_visual_time_ms += p.time_on_visual_ms
      break
    }
  }

  ilm.last_updated_at = now

  // Write back — update only the ILM column, leaving confidence_pct etc. intact
  const { error: ilmError } = await supabase
    .from('mastery_map')
    .update({ individual_learning_model: ilm })
    .eq('user_id', userId)
    .eq('outcome_id', outcomeId)

  if (ilmError) {
    console.error('[logLearningEvent] ILM update failed:', ilmError.message)
  }
}
