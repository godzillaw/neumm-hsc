import Link                            from 'next/link'
import { requireAuth }                 from '@/lib/auth-server'
import { checkTierAccess }             from '@/lib/tier'
import { createPracticeSession }       from './actions'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import PracticeSession                 from './PracticeSession'
import AppSidebar                      from '@/components/AppSidebar'
import TrialExpiredModal               from '@/components/TrialExpiredModal'
import MobileBottomNav                 from '@/components/MobileBottomNav'

function DailyLimitCard() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 text-center max-w-sm w-full">
      <div className="text-5xl mb-4">⚡</div>
      <h2 className="text-lg font-black text-gray-900 mb-2">
        You&apos;ve hit today&apos;s limit
      </h2>
      <p className="text-sm text-gray-500 mb-1">
        Basic plan allows <strong>50 questions per day</strong>.
      </p>
      <p className="text-sm text-gray-400 mb-6">
        Your limit resets at midnight UTC. Upgrade to Pro for unlimited access.
      </p>
      <Link
        href="/account/upgrade"
        className="inline-block w-full py-3 rounded-2xl text-sm font-black text-white"
        style={{ background: 'linear-gradient(135deg,#185FA5,#1E7BC4)' }}
      >
        Upgrade to Pro →
      </Link>
      <Link href="/dashboard"
        className="block mt-3 text-xs font-semibold text-gray-400 hover:text-gray-600">
        ← Back to dashboard
      </Link>
    </div>
  )
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { topic?: string }
}) {
  const user   = await requireAuth()
  const access = await checkTierAccess(user.id)
  const topic  = searchParams.topic ?? null

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

  // Basic daily limit reached — soft block with upgrade prompt
  if (access.dailyLimitReached) {
    return (
      <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg,#F7F3FF,#FDF2F8,#F0FDF4)' }}>
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center px-6">
          <DailyLimitCard />
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
        <PracticeSession userId={user.id} sessionId={sessionId} topicFilter={topic} yearGroup={yearGroup} />
      </div>
      <MobileBottomNav />
    </div>
  )
}
