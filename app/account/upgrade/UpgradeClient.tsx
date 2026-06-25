'use client'

import { useState }                      from 'react'
import { useRouter, useSearchParams }    from 'next/navigation'

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: '$29', period: '/mo',
    features: [
      '30 questions per day',
      'AI hints — nudges without giving away the answer',
      'AI concept explainer — deep-dive any topic',
      'AI tutor chat — ask anything about the question',
      'Photo or draw your working — AI marks every step',
      'Adaptive difficulty & mission roadmap with XP',
      'Streak tracking & progress dashboard',
    ],
    cta: 'Choose Basic →',
    color: '#185FA5',
    highlight: false,
  },
  {
    id: 'pro', name: 'Pro', price: '$49', period: '/mo',
    features: [
      'Unlimited questions — no daily cap, ever',
      'Full AI tutor — hints, explanations, and open chat',
      'Photo or draw your working — AI marks each step',
      'Adaptive difficulty & mission roadmap with XP',
      'Streak tracking & leaderboard',
      'Full progress dashboard across all topics',
      'Priority support',
    ],
    cta: 'Choose Pro →',
    color: '#7C3AED',
    highlight: true,
  },
]

const REASON_HEADER: Record<string, { title: string; subtitle: string }> = {
  expired: {
    title:    "You've already done the hard part",
    subtitle: "Starting is the hardest step — and you did it. Keep your momentum going.",
  },
  exam: {
    title:    'Exam mode is a paid feature',
    subtitle: 'Upgrade to unlock full exam simulation and all practice modes.',
  },
  limit: {
    title:    'Daily limit reached',
    subtitle: 'Upgrade to keep practising without limits.',
  },
}

export default function UpgradeClient({ basicPriceId, proPriceId }: { basicPriceId: string; proPriceId: string }) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const reason       = searchParams.get('reason') ?? 'expired'
  const [loading,     setLoading]     = useState<string | null>(null)
  const [error,       setError]       = useState<string | null>(null)

  const priceIds: Record<string, string> = { basic: basicPriceId, pro: proPriceId }
  const header = REASON_HEADER[reason] ?? REASON_HEADER.expired

  async function handleUpgrade(planId: string) {
    const priceId = priceIds[planId]
    if (!priceId) {
      setError('Plan not available. Please contact support.')
      return
    }
    setLoading(planId); setError(null)
    try {
      const res = await fetch('/math-nsw/app/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ priceId, plan: planId }),
      })

      // Handle non-JSON responses (e.g. redirect HTML from middleware)
      const contentType = res.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        setError(`Server error (${res.status}). Please refresh and try again.`)
        setLoading(null)
        return
      }

      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Failed to start checkout. Please try again.')
        setLoading(null)
      }
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#F7F3FF 0%,#FDF2F8 50%,#F0FDF4 100%)' }}>

      {/* Card wrapper */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center"
          style={{ borderBottom: '1px solid #F3E8FF' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white mb-5 shadow-md"
            style={{ background: 'linear-gradient(135deg,#3B5BDB,#7C3AED)' }}>
            N
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">{header.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line max-w-sm">
            {header.subtitle}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">
          {PLANS.map(plan => (
            <div key={plan.id}
              className="relative flex flex-col rounded-2xl p-5"
              style={{ border: `2px solid ${plan.color}`, background: 'white' }}>

              {/* Most popular badge (Pro only) */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-black text-white px-4 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p className="text-base font-black text-gray-900 mb-1">{plan.name}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                <span className="text-xs text-gray-400 font-medium">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5 6.5-7" stroke={plan.color} strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading !== null}
                className="w-full py-3 rounded-xl text-sm font-black text-white min-h-[48px] disabled:opacity-60 active:scale-[0.98] transition-all"
                style={{ background: loading === plan.id ? '#9CA3AF' : plan.color }}>
                {loading === plan.id ? 'Redirecting…' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center pb-6">
          <button onClick={() => router.back()}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            ← Go back
          </button>
        </div>
      </div>
    </div>
  )
}
