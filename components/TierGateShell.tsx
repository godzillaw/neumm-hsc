'use client'

/**
 * TierGateShell
 *
 * Client-side shell that conditionally renders:
 *   - <TrialExpiredModal>   when isBlocked is true (full-screen, non-dismissable)
 *   - <DailyLimitBanner>   when showSoftBanner is true (soft, dismissable)
 *
 * Rendered beneath by {children}.
 *
 * Usage (server component parent):
 *   const access = await checkTierAccess(user.id)
 *   return (
 *     <TierGateShell access={access}>
 *       <PageContent />
 *     </TierGateShell>
 *   )
 */

import TrialExpiredModal  from '@/components/TrialExpiredModal'
import DailyLimitBanner   from '@/components/DailyLimitBanner'
import type { TierAccess } from '@/lib/tier'

interface Props {
  access:   TierAccess
  children: React.ReactNode
}

export default function TierGateShell({ access, children }: Props) {
  return (
    <>
      {/* Hard block — full-screen modal when trial/payment expired */}
      {access.isBlocked && (
        <TrialExpiredModal tier={access.tier} />
      )}

      {/* Soft banner — approaching daily limit */}
      {!access.isBlocked && access.showSoftBanner && (
        <div className="px-5 md:px-8 pt-5">
          <DailyLimitBanner
            questionsRemaining={access.questionsRemaining}
            dailyLimit={access.dailyLimit}
            isTrial={access.isTrial}
          />
        </div>
      )}

      {children}
    </>
  )
}
