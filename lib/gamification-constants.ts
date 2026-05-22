/**
 * lib/gamification-constants.ts
 *
 * Shared constants for the gamification system.
 * Kept separate from lib/actions/gamification.ts so they can be
 * imported by both client and server components without violating
 * Next.js 'use server' restrictions.
 */

export const POINTS = {
  CORRECT:        10,
  INCORRECT:      -5,
  STAGE_COMPLETE: 100,
  LEVEL_COMPLETE: 1000,
} as const
