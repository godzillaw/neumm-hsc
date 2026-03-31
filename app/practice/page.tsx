import { requireAuth }          from '@/lib/auth-server'
import { checkTierAccess }      from '@/lib/tier'
import { createPracticeSession } from './actions'
import PracticeSession           from './PracticeSession'
import AppSidebar                from '@/components/AppSidebar'
import TrialExpiredModal         from '@/components/TrialExpiredModal'
import DailyLimitBanner          from '@/components/DailyLimitBanner'
import MobileBottomNav           from '@/components/MobileBottomNav'

export default async function PracticePage() {
  const user   = await requireAuth()
  const access = await checkTierAccess(user.id)

  // ── Hard-blocked: show full-screen modal, no session needed ──────────────────
  if (access.isBlocked) {
    return (
      <div className="flex min-h-screen bg-[#F4F6FA]">
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <TrialExpiredModal tier={access.tier} />
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  // ── Daily limit reached: show friendly wall ──────────────────────────────────
  if (!access.canAnswer) {
    return (
      <div className="flex min-h-screen bg-[#F4F6FA]">
        <AppSidebar />
        <div className="flex-1 min-w-0 flex items-center justify-center px-6 pb-20 md:pb-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
            <span className="text-4xl mb-4 block">⚡</span>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {"You've reached today's limit"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {access.isTrial
                ? `Trial accounts get ${access.dailyLimit} questions per day. Come back tomorrow or upgrade to keep going.`
                : `Your plan includes ${access.dailyLimit} questions per day. Come back tomorrow or upgrade to Pro for unlimited access.`
              }
            </p>
            <a
              href="/account/upgrade"
              className="inline-block w-full py-3 rounded-xl font-bold text-sm text-white text-center min-h-[44px]"
              style={{ backgroundColor: '#185FA5' }}
            >
              Upgrade for unlimited access →
            </a>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  // ── Start session ─────────────────────────────────────────────────────────────
  const sessionId = await createPracticeSession(user.id)

  if (!sessionId) {
    return (
      <div className="flex min-h-screen bg-[#F4F6FA] items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
          <p className="text-sm text-gray-500">{"Couldn't start a session. Please refresh."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        {/* Soft banner when approaching limit */}
        {access.showSoftBanner && (
          <div className="px-5 md:px-8 pt-5">
            <DailyLimitBanner
              questionsRemaining={access.questionsRemaining}
              dailyLimit={access.dailyLimit}
              isTrial={access.isTrial}
            />
          </div>
        )}
        <PracticeSession
          userId={user.id}
          sessionId={sessionId}
          questionsRemaining={access.questionsRemaining}
          dailyLimit={access.dailyLimit}
        />
      </div>
      <MobileBottomNav />
    </div>
  )
}
