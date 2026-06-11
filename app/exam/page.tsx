import Link                        from 'next/link'
import { requireAuth }             from '@/lib/auth-server'
import { checkTierAccess }         from '@/lib/tier'
import { getMockTestsForUser }     from './mock-actions'
import MockTestBuilder             from './MockTestBuilder'
import AppSidebar             from '@/components/AppSidebar'
import MobileBottomNav        from '@/components/MobileBottomNav'
import TrialExpiredModal      from '@/components/TrialExpiredModal'

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

export default async function ExamPage() {
  const user   = await requireAuth()
  const access = await checkTierAccess(user.id)

  // Trial expired / payment failed — hard block
  if (access.isBlocked) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F7F3FF' }}>
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <TrialExpiredModal tier={access.tier} />
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  // Basic daily limit reached — soft block (exam questions count toward the daily cap)
  if (access.dailyLimitReached) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F7F3FF' }}>
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center px-6">
          <DailyLimitCard />
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  const existingTests = await getMockTestsForUser()

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F3FF' }}>
      <AppSidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <MockTestBuilder existingTests={existingTests} />
      </div>
      <MobileBottomNav />
    </div>
  )
}
