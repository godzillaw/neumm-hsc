'use client'

import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import { signOut }   from '@/lib/auth'

interface Props {
  userId:      string
  email:       string
  displayName: string
  tier:        string
  trialEnd:    string | null
}

const TIER_LABELS: Record<string, { label: string; colour: string }> = {
  basic_trial: { label: 'Free Trial',  colour: '#6B7280' },
  basic:       { label: 'Basic',       colour: '#185FA5' },
  pro:         { label: 'Pro',         colour: '#7C3AED' },
  expired:     { label: 'Expired',     colour: '#EF4444' },
}

export default function AccountClient({ email, displayName, tier, trialEnd }: Props) {
  const router          = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const tierMeta = TIER_LABELS[tier] ?? TIER_LABELS['basic_trial']

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    router.replace('/auth/login')
  }

  const trialEndDate = trialEnd ? new Date(trialEnd).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : null

  return (
    <div className="max-w-lg space-y-4">

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Name</p>
            <p className="text-sm font-medium text-gray-900">{displayName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Email</p>
            <p className="text-sm font-medium text-gray-900">{email}</p>
          </div>
        </div>
      </div>

      {/* Plan card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Plan</h2>
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: tierMeta.colour }}
          >
            {tierMeta.label}
          </span>
          {trialEndDate && tier === 'basic_trial' && (
            <span className="text-xs text-gray-400">Trial ends {trialEndDate}</span>
          )}
        </div>
        {tier !== 'pro' && (
          <a
            href="/account/upgrade"
            className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white text-center min-h-[44px]"
            style={{ backgroundColor: '#185FA5' }}
          >
            Upgrade plan →
          </a>
        )}
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Session</h2>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full py-3 rounded-xl text-sm font-bold text-red-600 border border-red-200 min-h-[44px] disabled:opacity-60 hover:bg-red-50 transition-colors"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>

    </div>
  )
}
