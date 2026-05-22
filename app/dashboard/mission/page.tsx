import { requireAuth }              from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getMission }                  from '@/lib/curriculum'
import {
  getUserStageCompletions,
  getUserPoints,
}                                      from '@/lib/actions/gamification'
import MissionClient                   from './MissionClient'
import Link                            from 'next/link'

export default async function MissionPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group, course')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: userRow } = await supabase
    .from('users')
    .select('display_name, total_points, streak')
    .eq('id', user.id)
    .maybeSingle()

  const yearStr    = (profile as { year_group?: string } | null)?.year_group ?? 'year_12'
  const course     = (profile as { course?: string } | null)?.course ?? 'advanced'
  const year       = parseInt(yearStr.replace('year_', ''), 10)
  const mission    = getMission(year, course)
  const points     = await getUserPoints(user.id)

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">No mission set yet</h2>
        <p className="text-sm text-gray-500 mb-6">Choose your year and course to unlock your personalised mission roadmap.</p>
        <Link
          href="/onboarding/year"
          className="px-6 py-3 rounded-2xl text-white font-black text-sm"
          style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)' }}
        >
          Set up my mission →
        </Link>
      </div>
    )
  }

  const completedStages = await getUserStageCompletions(user.id, mission.missionId)
  const displayName     = (userRow as { display_name?: string } | null)?.display_name ?? 'Student'
  const streak          = (userRow as { streak?: number } | null)?.streak ?? 0

  return (
    <MissionClient
      mission={mission}
      completedStageIds={Array.from(completedStages)}
      totalPoints={points}
      displayName={displayName}
      streak={streak}
      userId={user.id}
    />
  )
}
