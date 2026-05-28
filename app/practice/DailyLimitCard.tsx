'use client'

import { useState }     from 'react'
import Link             from 'next/link'
import { goToCheckout } from '@/lib/goToCheckout'

export default function DailyLimitCard({ tier, dailyLimit }: { tier: string; dailyLimit: number }) {
  const [loading, setLoading] = useState<'basic' | 'pro' | null>(null)
  const isTrial = tier === 'basic_trial'
  const isFree  = tier === 'free' || tier === 'basic_trial_expired' || tier === 'trial_expired'

  if (isTrial) {
    // Full upgrade popup for trial users who hit the 8q limit
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full sm:max-w-xl bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
          style={{ maxHeight: '92vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom,0px)' }}>
          {/* Header */}
          <div className="px-6 pt-7 pb-5 text-center border-b border-gray-100">
            <div className="text-5xl mb-3">⚡</div>
            <h2 className="text-xl font-black text-gray-900">You&apos;ve used all {dailyLimit} trial questions today</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Upgrade to keep practising. Resets at midnight UTC.<br/>
              Your progress, XP and streak are all saved.
            </p>
          </div>
          {/* Plan cards */}
          <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-4">
            {([
              { id: 'basic' as const, name: 'Basic', price: '$29.00', period: '/month (GST incl.)', color: '#185FA5',
                features: ['30 questions per day', 'AI hints, concept explainer & tutor chat', 'AI step-by-step marking', 'Mission roadmap & XP', 'Adaptive difficulty', 'Streak tracking'] },
              { id: 'pro' as const,   name: 'Pro',   price: '$49.00', period: '/month (GST incl.)', color: '#7C3AED', badge: 'Most popular',
                features: ['Unlimited questions', 'Mission roadmap & XP', 'Adaptive difficulty', 'Full AI tutor', 'Streak tracking', 'Priority support'] },
            ]).map(plan => (
              <div key={plan.id} className="flex-1 rounded-2xl border-2 p-5 flex flex-col relative"
                style={{ borderColor: plan.color }}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: plan.color }}>{plan.badge}</span>
                )}
                <p className="font-black text-gray-900 text-base">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1 mb-4">
                  <span className="text-3xl font-extrabold" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="text-xs text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 shrink-0" style={{ color: plan.color }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => void goToCheckout(plan.id, v => setLoading(v ? plan.id : null))}
                  disabled={loading !== null}
                  className="block w-full py-3 rounded-xl font-black text-sm text-white text-center transition-all disabled:opacity-70"
                  style={{ backgroundColor: plan.color }}>
                  {loading === plan.id ? 'Redirecting…' : `Choose ${plan.name} →`}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 pb-5">Cancel anytime · No lock-in</p>
          <div className="text-center pb-6">
            <Link href="/dashboard/mission" className="text-xs font-semibold text-gray-400 hover:text-gray-600">
              ← Back to mission
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 text-center max-w-sm w-full"
      style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="text-5xl mb-4">⚡</div>
      <h2 className="text-lg font-black text-gray-900 mb-2">
        You&apos;ve hit today&apos;s limit
      </h2>
      {isFree ? (
        <>
          <p className="text-sm text-gray-500 mb-1">
            Free plan allows <strong>{dailyLimit} questions per day</strong>.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Resets at midnight UTC. Upgrade to Basic (30/day) or Pro (unlimited).
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-1">
            Basic plan allows <strong>{dailyLimit} questions per day</strong>.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Your limit resets at midnight UTC. Upgrade to Pro for unlimited access.
          </p>
        </>
      )}
      <button
        onClick={() => void goToCheckout(isFree ? 'basic' : 'pro', v => setLoading(v ? (isFree ? 'basic' : 'pro') : null))}
        disabled={loading !== null}
        className="w-full py-3 rounded-2xl text-sm font-black text-white mb-2 disabled:opacity-70"
        style={{ background: 'linear-gradient(135deg,#185FA5,#1E7BC4)' }}
      >
        {loading ? 'Redirecting…' : isFree ? 'Upgrade for more →' : 'Upgrade to Pro →'}
      </button>
      <Link href="/dashboard/mission"
        className="block mt-1 text-xs font-semibold text-gray-400 hover:text-gray-600">
        ← Back to mission
      </Link>
    </div>
  )
}
