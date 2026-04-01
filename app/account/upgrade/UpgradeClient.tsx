'use client'

import { useState }                      from 'react'
import { useRouter, useSearchParams }    from 'next/navigation'

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: '$9.99', period: '/mo', emoji: '⚡',
    features: ['Unlimited questions', 'AI Socratic tutor', 'Progress tracking', 'Mastery map'],
    cta: 'Start Basic',
    gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    highlight: false,
  },
  {
    id: 'pro', name: 'Pro', price: '$19.99', period: '/mo', emoji: '🚀',
    features: ['Everything in Basic', 'Exam mode', 'Full analytics', 'Leaderboard', 'Priority support'],
    cta: 'Go Pro 🔥',
    gradient: 'linear-gradient(135deg,#7C3AED,#EC4899)',
    highlight: true,
  },
]

const REASON_TEXT: Record<string, string> = {
  exam:    '📝 Exam mode is available on all paid plans.',
  limit:   '⚡ Upgrade to keep practising without limits.',
  expired: '⏰ Your trial has ended — subscribe to continue.',
}

export default function UpgradeClient({ basicPriceId, proPriceId }: { basicPriceId: string; proPriceId: string }) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const reason       = searchParams.get('reason') ?? ''
  const [loading, setLoading] = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)

  const priceIds: Record<string, string> = { basic: basicPriceId, pro: proPriceId }

  async function handleUpgrade(planId: string) {
    const priceId = priceIds[planId]
    if (!priceId) {
      setError('Plan not available. Please contact support.')
      return
    }
    setLoading(planId); setError(null)
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Failed to start checkout. Please try again.')
        setLoading(null)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#F7F3FF 0%,#FDF2F8 50%,#F0FDF4 100%)' }}>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>N</div>
        <h1 className="text-2xl font-black text-gray-900">Level up your prep 🚀</h1>
        {reason && REASON_TEXT[reason] && (
          <p className="text-sm text-gray-500 mt-2 bg-white/70 rounded-2xl px-4 py-2 inline-block border border-purple-100">
            {REASON_TEXT[reason]}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 text-sm text-red-700 max-w-md w-full text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {PLANS.map(plan => (
          <div key={plan.id}
            className={`bg-white rounded-3xl p-6 flex flex-col shadow-sm ${plan.highlight ? 'ring-2 ring-violet-400' : 'border border-purple-50'}`}>
            {plan.highlight && (
              <span className="text-xs font-black text-white px-3 py-1 rounded-full self-start mb-3"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                ⭐ Most popular
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{plan.emoji}</span>
              <h2 className="text-lg font-black text-gray-900">{plan.name}</h2>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-black text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-400">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-black">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => handleUpgrade(plan.id)} disabled={loading !== null}
              className="w-full py-3 rounded-2xl text-sm font-black text-white min-h-[48px] disabled:opacity-60 active:scale-[0.98] transition-all"
              style={{ background: loading === plan.id ? '#9CA3AF' : plan.gradient }}>
              {loading === plan.id ? 'Redirecting…' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => router.back()}
        className="mt-8 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
        ← Go back
      </button>
    </div>
  )
}
