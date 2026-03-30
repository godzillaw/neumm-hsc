// ─── AEST date helpers (UTC+10 fixed offset) ──────────────────────────────────
// AEST = UTC+10 (standard). AEDT = UTC+11 (daylight saving).
// We use a fixed +10h which is off by 1h during AEDT (Oct–Apr).
// The nightly cron corrects any edge-case drift.

export function todayAEST(): string {
  const now  = new Date()
  const aest = new Date(now.getTime() + 10 * 60 * 60 * 1000)
  return aest.toISOString().slice(0, 10)  // "YYYY-MM-DD"
}

export function yesterdayAEST(): string {
  const now  = new Date()
  const aest = new Date(now.getTime() + 10 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000)
  return aest.toISOString().slice(0, 10)
}
