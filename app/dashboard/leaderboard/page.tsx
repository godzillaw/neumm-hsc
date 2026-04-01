import { requireAuth }                from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AppSidebar                     from '@/components/AppSidebar'
import MobileBottomNav                from '@/components/MobileBottomNav'

interface LeaderboardEntry {
  rank:         number
  display_name: string
  streak:       number
  mastery:      number
  isMe:         boolean
}

async function getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('users')
    .select('id, display_name, streak')
    .order('streak', { ascending: false })
    .limit(20)

  if (!data) return []
  return data.map((row, i) => ({
    rank:         i + 1,
    display_name: (row.display_name as string) || 'Anonymous',
    streak:       (row.streak as number) || 0,
    mastery:      0,
    isMe:         row.id === userId,
  }))
}

const RANK_EMOJI = ['🥇', '🥈', '🥉']
const RANK_COLORS = ['from-yellow-400 to-amber-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-amber-700']

export default async function LeaderboardPage() {
  const user    = await requireAuth()
  const entries = await getLeaderboard(user.id)
  const myRank  = entries.find(e => e.isMe)?.rank ?? null

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F3FF 0%, #FDF2F8 50%, #F0FDF4 100%)' }}>
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-24 md:pb-8 px-5 md:px-8 py-6 max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Leaderboard 🏆</h1>
          <p className="text-sm text-gray-500 mt-1">Top streaks this week</p>
        </div>

        {/* My rank banner */}
        {myRank && (
          <div
            className="rounded-2xl p-4 mb-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white' }}
          >
            <div>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">Your rank</p>
              <p className="text-2xl font-black">#{myRank}</p>
            </div>
            <div className="text-4xl">
              {myRank <= 3 ? RANK_EMOJI[myRank - 1] : '⚡'}
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-2">
          {entries.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🏆</div>
              <p className="font-semibold">No data yet — be the first!</p>
            </div>
          )}
          {entries.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${entry.isMe ? 'ring-2 ring-violet-400' : ''}`}
              style={{
                background: entry.isMe
                  ? 'linear-gradient(135deg, #EDE9FE, #FCE7F3)'
                  : 'white',
              }}
            >
              {/* Rank */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 ${entry.rank <= 3 ? `bg-gradient-to-br ${RANK_COLORS[entry.rank - 1]}` : 'bg-gray-100'}`}
                style={entry.rank > 3 ? { color: '#6B7280' } : {}}>
                {entry.rank <= 3 ? RANK_EMOJI[entry.rank - 1] : `#${entry.rank}`}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${entry.isMe ? 'text-violet-700' : 'text-gray-900'}`}>
                  {entry.display_name}{entry.isMe ? ' (you)' : ''}
                </p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-lg">🔥</span>
                <span className="font-black text-sm text-gray-800">{entry.streak}</span>
                <span className="text-xs text-gray-400 ml-0.5">days</span>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Start practising to get on the leaderboard!
          </p>
        )}
      </main>
      <MobileBottomNav />
    </div>
  )
}
