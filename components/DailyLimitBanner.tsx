'use client'

import { useState }  from 'react'
import { useRouter } from 'next/navigation'

interface DailyLimitBannerProps {
  questionsRemaining: number
  dailyLimit:         number
  isTrial:            boolean
}

export default function DailyLimitBanner({
  questionsRemaining,
  dailyLimit,
  isTrial,
}: DailyLimitBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  if (dismissed) return null

  const label = questionsRemaining === 1
    ? '1 question remaining today'
    : `${questionsRemaining} questions remaining today`

  const sub = isTrial
    ? `Trial: ${dailyLimit} questions/day. Upgrade for more.`
    : `Basic: ${dailyLimit} questions/day. Resets midnight UTC.`

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-2"
      style={{ background: 'linear-gradient(90deg,#F97316,#FB923C)', color: '#fff' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 text-sm">⚡</span>
        <span className="text-xs font-semibold truncate">
          {label} · {sub}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => router.push('/account/upgrade')}
          className="text-xs font-black px-3 py-1 rounded-full bg-white"
          style={{ color: '#F97316' }}
        >
          Upgrade →
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
