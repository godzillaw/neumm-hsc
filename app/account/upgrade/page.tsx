import { Suspense }            from 'react'
import UpgradeClient           from './UpgradeClient'

export default function UpgradePage() {
  // Pass price IDs server-side so they're always available
  const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID ?? ''
  const proPriceId   = process.env.STRIPE_PRO_PRICE_ID   ?? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID   ?? ''

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#F7F3FF,#FDF2F8,#F0FDF4)' }}>
        <div className="w-10 h-10 rounded-xl animate-spin"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', animationDuration: '0.8s' }} />
      </div>
    }>
      <UpgradeClient basicPriceId={basicPriceId} proPriceId={proPriceId} />
    </Suspense>
  )
}
