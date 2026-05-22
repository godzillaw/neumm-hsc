'use server'

/**
 * lib/actions/gamification.ts
 *
 * Points system:
 *   +10  per correct question answer
 *   −5   per incorrect question answer
 *   +100 when a Stage is completed (all questions answered for that stage)
 *   +1000 when a Level is completed (all stages in the level done)
 *
 * Completion is detected server-side based on mastery_map confidence ≥ 70
 * for all outcomeIds in the stage/level.
 */

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { findStage, getMission }       from '@/lib/curriculum'
import { POINTS }                      from '@/lib/gamification-constants'

// ── Award points for a question answer ───────────────────────────────────────

export async function awardQuestionPoints(
  userId:    string,
  isCorrect: boolean,
): Promise<{ pointsDelta: number; newTotal: number }> {
  const delta   = isCorrect ? POINTS.CORRECT : POINTS.INCORRECT
  const supabase = createSupabaseServerClient()

  // Increment total_points (or decrement), never go below 0
  const { data: current } = await supabase
    .from('users')
    .select('total_points')
    .eq('id', userId)
    .single()

  const currentPoints = (current as { total_points?: number } | null)?.total_points ?? 0
  const newTotal      = Math.max(0, currentPoints + delta)

  await supabase
    .from('users')
    .update({ total_points: newTotal })
    .eq('id', userId)

  return { pointsDelta: delta, newTotal }
}

// ── Check if a stage is now complete & award points ───────────────────────────

export async function checkAndAwardStageCompletion(
  userId:   string,
  stageId:  string,
): Promise<{
  stageComplete: boolean
  levelComplete: boolean
  stagePoints:   number
  levelPoints:   number
  stageName:     string
  levelName:     string
}> {
  const found = findStage(stageId)
  if (!found) return { stageComplete: false, levelComplete: false, stagePoints: 0, levelPoints: 0, stageName: '', levelName: '' }

  const { mission, level, stage } = found
  const supabase                  = createSupabaseServerClient()

  // ── Check stage completion ──────────────────────────────────────────────────
  // A stage is complete when confidence ≥ 70 for ALL its outcome IDs
  const { data: masteryRows } = await supabase
    .from('mastery_map')
    .select('outcome_id, confidence_pct')
    .eq('user_id', userId)
    .in('outcome_id', stage.outcomeIds.flatMap(oid => [1,2,3,4,5,6].map(b => `${oid}-B${b}`)).concat(stage.outcomeIds))

  // Build a map: topicPrefix → avg confidence across bands
  const prefixConf: Record<string, number[]> = {}
  for (const row of (masteryRows ?? [])) {
    const prefix = (row.outcome_id as string).replace(/-B\d+$/, '')
    if (!prefixConf[prefix]) prefixConf[prefix] = []
    prefixConf[prefix].push(row.confidence_pct as number ?? 0)
  }

  const avgConf = (prefix: string): number => {
    const vals = prefixConf[prefix]
    if (!vals || vals.length === 0) return 0
    return vals.reduce((s, v) => s + v, 0) / vals.length
  }

  const stageTopicsMastered = stage.topicIds.every(t => avgConf(t) >= 70)
  let stageComplete   = false
  let levelComplete   = false
  let stagePoints     = 0
  let levelPoints     = 0

  if (stageTopicsMastered) {
    // Check if we already awarded stage points
    const { data: existing } = await supabase
      .from('stage_completions')
      .select('id')
      .eq('user_id', userId)
      .eq('stage_id', stageId)
      .maybeSingle()

    if (!existing) {
      stageComplete = true
      stagePoints   = POINTS.STAGE_COMPLETE

      await supabase.from('stage_completions').insert({
        user_id:      userId,
        mission_id:   mission.missionId,
        level_id:     level.levelId,
        stage_id:     stageId,
        points_earned: stagePoints,
      })

      // Increment total_points by stage bonus
      const { data: u } = await supabase.from('users').select('total_points').eq('id', userId).single()
      const cur = (u as { total_points?: number } | null)?.total_points ?? 0
      await supabase.from('users').update({ total_points: cur + stagePoints }).eq('id', userId)

      // ── Check level completion ────────────────────────────────────────────
      const allStageIds  = level.stages.map(s => s.stageId)
      const { data: completedStages } = await supabase
        .from('stage_completions')
        .select('stage_id')
        .eq('user_id', userId)
        .eq('level_id', level.levelId)
        .in('stage_id', allStageIds)

      const completedSet = new Set((completedStages ?? []).map((r: { stage_id: string }) => r.stage_id))
      const levelDone    = allStageIds.every(sid => completedSet.has(sid))

      if (levelDone) {
        // Check if level bonus already awarded
        const { data: lvlExisting } = await supabase
          .from('stage_completions')
          .select('id')
          .eq('user_id', userId)
          .eq('level_id', level.levelId)
          .is('stage_id', null)
          .maybeSingle()

        if (!lvlExisting) {
          levelComplete = true
          levelPoints   = POINTS.LEVEL_COMPLETE

          await supabase.from('stage_completions').insert({
            user_id:       userId,
            mission_id:    mission.missionId,
            level_id:      level.levelId,
            stage_id:      null,
            points_earned: levelPoints,
          })

          const { data: u2 } = await supabase.from('users').select('total_points').eq('id', userId).single()
          const cur2 = (u2 as { total_points?: number } | null)?.total_points ?? 0
          await supabase.from('users').update({ total_points: cur2 + levelPoints }).eq('id', userId)
        }
      }
    }
  }

  return {
    stageComplete,
    levelComplete,
    stagePoints,
    levelPoints,
    stageName: stage.title,
    levelName: level.title,
  }
}

// ── Get/ensure invite code for a user ────────────────────────────────────────

export async function getUserInviteCode(userId: string): Promise<string> {
  const supabase = createSupabaseServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('invite_code')
    .eq('id', userId)
    .single()

  const existing = (user as { invite_code?: string } | null)?.invite_code
  if (existing) return existing

  // Generate a new code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  await supabase.from('users').update({ invite_code: code }).eq('id', userId)
  return code
}

// ── Accept a friend invite ────────────────────────────────────────────────────

export async function acceptInvite(
  currentUserId: string,
  inviteCode:    string,
): Promise<{ success: boolean; friendName: string | null; error?: string }> {
  const supabase = createSupabaseServerClient()

  // Find the user with this code
  const { data: inviter } = await supabase
    .from('users')
    .select('id, display_name')
    .eq('invite_code', inviteCode.toUpperCase())
    .maybeSingle()

  if (!inviter) return { success: false, friendName: null, error: 'Invalid invite code' }
  if ((inviter as { id: string }).id === currentUserId) {
    return { success: false, friendName: null, error: "That's your own code!" }
  }

  const inviterId = (inviter as { id: string; display_name: string }).id

  // Check if already friends
  const { data: existing } = await supabase
    .from('friendships')
    .select('id')
    .eq('user_id', currentUserId)
    .eq('friend_id', inviterId)
    .maybeSingle()

  if (existing) return { success: true, friendName: (inviter as { display_name: string }).display_name }

  // Create bidirectional friendship
  await supabase.from('friendships').insert([
    { user_id: currentUserId, friend_id: inviterId, status: 'accepted' },
    { user_id: inviterId,     friend_id: currentUserId, status: 'accepted' },
  ])

  return { success: true, friendName: (inviter as { display_name: string }).display_name }
}

// ── Get friend list with points ───────────────────────────────────────────────

export interface FriendEntry {
  id:           string
  displayName:  string
  totalPoints:  number
  streak:       number
  isMe:         boolean
}

export async function getFriendLeaderboard(userId: string): Promise<FriendEntry[]> {
  const supabase = createSupabaseServerClient()

  // Get friend IDs
  const { data: friendships } = await supabase
    .from('friendships')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', 'accepted')

  const friendIds = [userId, ...((friendships ?? []).map((f: { friend_id: string }) => f.friend_id))]

  const { data: users } = await supabase
    .from('users')
    .select('id, display_name, total_points, streak')
    .in('id', friendIds)
    .order('total_points', { ascending: false })

  return (users ?? []).map((u: { id: string; display_name: string; total_points: number; streak: number }) => ({
    id:          u.id,
    displayName: u.display_name || 'Anonymous',
    totalPoints: u.total_points ?? 0,
    streak:      u.streak ?? 0,
    isMe:        u.id === userId,
  }))
}

// ── Get total points for a user ───────────────────────────────────────────────

export async function getUserPoints(userId: string): Promise<number> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('users')
    .select('total_points')
    .eq('id', userId)
    .single()
  return (data as { total_points?: number } | null)?.total_points ?? 0
}

// ── Get stage completions for a user (for mission UI) ────────────────────────

export async function getUserStageCompletions(
  userId:    string,
  missionId: string,
): Promise<Set<string>> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('stage_completions')
    .select('stage_id')
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .not('stage_id', 'is', null)

  return new Set((data ?? []).map((r: { stage_id: string }) => r.stage_id).filter(Boolean))
}

// ── Get mission for a user based on their student_profile ────────────────────

export async function getUserMission(userId: string) {
  const supabase = createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group, course')
    .eq('user_id', userId)
    .maybeSingle()

  const yearStr = (profile as { year_group?: string } | null)?.year_group ?? 'year_12'
  const course  = (profile as { course?: string } | null)?.course ?? 'advanced'
  const year    = parseInt(yearStr.replace('year_', ''), 10)

  return getMission(year, course)
}
