'use client'

import { useRouter } from 'next/navigation'

// ─── Plan data ──────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id:       'basic',
    name:     'Basic',
    price:    '$29',
    period:   '/mo',
    color:    '#185FA5',
    features: [
      '30 questions per day',
      'Mission roadmap & XP',
      'Adaptive difficulty',
      'AI hint system',
      'Streak tracking',
    ],
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    '$49',
    period:   '/mo',
    color:    '#7C3AED',
    badge:    'Most popular',
    features: [
      'Unlimited questions',
      'Mission roadmap & XP',
      'Adaptive difficulty',
      'Full AI tutor (hints + explanations)',
      'Streak tracking',
      'Priority support',
    ],
  },
]

// ─── Component ──────────────────────────────────────────────────────────────────

export default function TrialExpiredModal({ tier }: { tier: string }) {
  const router  = useRouter()
  const isPaymentFailed = tier === 'payment_failed'

  const heading = isPaymentFailed
    ? 'Payment failed'
    : 'Your free trial has ended'

  const subtext = isPaymentFailed
    ? "We couldn't process your last payment. Update your payment details to keep practising."
    : 'Upgrade to continue practising. Your mastery map, XP, streak, and progress are all saved.'

  return (
    /* Full-screen overlay — not dismissable */
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full sm:max-w-xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '92vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5 text-center border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black text-xl"
            style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)' }}>
            N
          </div>
          <h2 className="text-xl font-bold text-gray-900">{heading}</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">{subtext}</p>
        </div>

        {/* Free tier note */}
        <div className="px-5 sm:px-7 pt-4 pb-0">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
            <span className="text-lg">✅</span>
            <p className="text-xs font-semibold text-green-700">
              Free plan available — 5 questions per day, forever.
              Upgrade any time for more.
            </p>
          </div>
        </div>

        {/* Plan cards */}
        <div className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row gap-4">
          {PLANS.map(plan => (
            <div key={plan.id}
              className="flex-1 rounded-2xl border-2 p-5 flex flex-col relative"
              style={{ borderColor: plan.color }}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: plan.color }}>
                  {plan.badge}
                </span>
              )}
              <p className="font-bold text-gray-900 text-base">{plan.name}</p>
              <div className="flex items-baseline gap-1 mt-1 mb-4">
                <span className="text-3xl font-extrabold" style={{ color: plan.color }}>{plan.price}</span>
                <span className="text-xs text-gray-400">{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 shrink-0" style={{ color: plan.color }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push(`/account/upgrade?plan=${plan.id}`)}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] min-h-[44px]"
                style={{ backgroundColor: plan.color }}>
                Choose {plan.name} →
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6 px-6">
          Cancel anytime · No lock-in contracts
        </p>
      </div>
    </div>
  )
}
