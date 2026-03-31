'use client'

import { useState }   from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense }   from 'react'
import NeummLogo      from '@/components/NeummLogo'

const PLANS = [
  {
    id:       'basic',
    name:     'Basic',
    price:    '$9.99',
    period:   '/month',
    features: ['30 questions per day', 'AI Socratic tutor', 'Progress tracking', 'Mastery map'],
    cta:      'Upgrade to Basic',
    highlight: false,
    priceId:  process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID ?? '',
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    '$19.99',
    period:   '/month',
    features: ['Unlimited questions', 'AI Socratic tutor', 'Exam mode', 'Full analytics', 'Priority support'],
    cta:      'Upgrade to Pro',
    highlight: true,
    priceId:  process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '',
  },
]

function UpgradeContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const reason       = searchParams.get('reason')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  const reasonText: Record<string, string> = {
    exam:    'Exam mode is available on Basic and Pro plans.',
    limit:   "You've reached today's question limit.",
    expired: 'Your trial has ended.',
  }

  async function handleUpgrade(priceId: string, planId: string) {
    setLoading(planId)
    setError(null)
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Failed to start checkout. Please try again.')
        setLoading(null)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4"><NeummLogo size={48} /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upgrade your plan</h1>
        {reason && reasonText[reason] && (
          <p className="text-sm text-gray-500">{reasonText[reason]}</p>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 max-w-md w-full text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border p-6 flex flex-col ${
              plan.highlight ? 'border-[#185FA5] shadow-md' : 'border-gray-100 shadow-sm'
            }`}
          >
            {plan.highlight && (
              <span className="text-xs font-bold text-[#185FA5] uppercase tracking-wide mb-3">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h2>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.priceId, plan.id)}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl text-sm font-bold text-white min-h-[44px] disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: plan.highlight ? '#185FA5' : '#374151' }}
            >
              {loading === plan.id ? 'Redirecting…' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.back()}
        className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Go back
      </button>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <NeummLogo size={48} />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
