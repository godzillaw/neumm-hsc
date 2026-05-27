import { requireAuth }                 from '@/lib/auth-server'
import { checkTierAccess }             from '@/lib/tier'
import { createPracticeSession }       from './actions'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import PracticeSession                 from './PracticeSession'
import DailyLimitCard                  from './DailyLimitCard'
import AppSidebar                      from '@/components/AppSidebar'
import TrialExpiredModal               from '@/components/TrialExpiredModal'
import MobileBottomNav                 from '@/components/MobileBottomNav'

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { topic?: string; stage?: string }
}) {
  const user    = await requireAuth()
  const access  = await checkTierAccess(user.id)
  const topic   = searchParams.topic ?? null
  const stageId = searchParams.stage ?? null

  // Trial expired / payment failed — hard block
  if (access.isBlocked) {
    return (
      <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#F7F3FF,#FDF2F8,#F0FDF4)' }}>
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <TrialExpiredModal tier={access.tier} />
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  // Daily limit reached — soft block with upgrade prompt
  if (access.dailyLimitReached) {
    return (
      <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#F7F3FF,#FDF2F8,#F0FDF4)' }}>
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center px-6">
          <DailyLimitCard tier={access.tier} dailyLimit={access.dailyLimit} />
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  // Fetch year_group so PracticeSession can pass it to generate-questions
  const supabase = createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('year_group')
    .eq('user_id', user.id)
    .single()
  const yearGroup = (profile as { year_group?: string } | null)?.year_group ?? 'year_12'

  const sessionId = await createPracticeSession(user.id)

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6"
        style={{ background: 'linear-gradient(135deg,#F7F3FF,#FDF2F8,#F0FDF4)' }}>
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-8 text-center max-w-sm w-full">
          <div className="text-4xl mb-3">😅</div>
          <p className="text-sm font-semibold text-gray-500">{"Couldn't start a session. Please refresh."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#F7F3FF,#FDF2F8,#F0FDF4)' }}>
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        <PracticeSession
          userId={user.id}
          sessionId={sessionId}
          topicFilter={topic}
          yearGroup={yearGroup}
          tier={access.tier}
          stageId={stageId}
          questionsToday={access.questionsToday}
          isTrial={access.isTrial}
          dailyLimit={access.dailyLimit}
        />
      </div>
      <MobileBottomNav />
    </div>
  )
}
