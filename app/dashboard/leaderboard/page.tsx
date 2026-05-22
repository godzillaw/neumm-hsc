import { requireAuth }                from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getFriendLeaderboard, getUserInviteCode } from '@/lib/actions/gamification'
import LeaderboardClient               from './LeaderboardClient'
import type { LeaderboardEntry }       from './LeaderboardClient'

// ── Global top-20 by XP ───────────────────────────────────────────────────────

async function getGlobalLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('users')
    .select('id, display_name, total_points, streak')
    .order('total_points', { ascending: false })
    .limit(20)

  if (!data) return []
  return data.map((row, i) => ({
    rank:        i + 1,
    id:          row.id as string,
    displayName: (row.display_name as string) || 'Anonymous',
    totalPoints: (row.total_points as number) ?? 0,
    streak:      (row.streak as number) ?? 0,
    isMe:        row.id === userId,
  }))
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LeaderboardPage() {
  const user = await requireAuth()

  const [globalEntries, friendData, inviteCode] = await Promise.all([
    getGlobalLeaderboard(user.id),
    getFriendLeaderboard(user.id),
    getUserInviteCode(user.id),
  ])

  // Convert friend data (which is already ranked by points) to LeaderboardEntry[]
  const friendEntries: LeaderboardEntry[] = friendData.map((f, i) => ({
    rank:        i + 1,
    id:          f.id,
    displayName: f.displayName,
    totalPoints: f.totalPoints,
    streak:      f.streak,
    isMe:        f.isMe,
  }))

  const myGlobalEntry = globalEntries.find(e => e.isMe)
  const myRankGlobal  = myGlobalEntry?.rank ?? null

  return (
    <LeaderboardClient
      globalEntries={globalEntries}
      friendEntries={friendEntries}
      myRankGlobal={myRankGlobal}
      inviteCode={inviteCode}
      userId={user.id}
    />
  )
}
