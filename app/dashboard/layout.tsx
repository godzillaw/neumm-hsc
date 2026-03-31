import { requireAuth }      from '@/lib/auth-server'
import { checkTierAccess }  from '@/lib/tier'
import AppSidebar           from '@/components/AppSidebar'
import TierGateShell        from '@/components/TierGateShell'
import MobileBottomNav      from '@/components/MobileBottomNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user   = await requireAuth()
  const access = await checkTierAccess(user.id)

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {/*
          TierGateShell renders:
            - TrialExpiredModal (full-screen overlay) if access.isBlocked
            - DailyLimitBanner (soft top banner)      if access.showSoftBanner
          Either way, children are still rendered underneath.
          The modal is position:fixed so it sits on top regardless.
        */}
        <TierGateShell access={access}>
          {children}
        </TierGateShell>
      </main>
      {/* Mobile bottom navigation — hidden on md+ where sidebar takes over */}
      <MobileBottomNav />
    </div>
  )
}
