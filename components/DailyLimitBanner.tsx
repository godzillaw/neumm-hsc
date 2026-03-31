'use client'

import { useState }   from 'react'
import { useRouter }  from 'next/navigation'

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

  const label =
    questionsRemaining === 0
      ? `You've used all ${dailyLimit} questions for today`
      : `${questionsRemaining} question${questionsRemaining === 1 ? '' : 's'} remaining today`

  const sub = isTrial
    ? 'Trial accounts are limited to 10 questions per day.'
    : 'Basic accounts are limited to 25 questions per day.'

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 mb-5 border"
      style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}
    >
      {/* Icon + message */}
      <div className="flex items-start gap-2 min-w-0">
        <span className="shrink-0 mt-0.5">⚡</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-orange-800 leading-snug">{label}</p>
          <p className="text-xs text-orange-600 mt-0.5">{sub}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => router.push('/account/upgrade')}
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all active:scale-[0.98]"
          style={{ backgroundColor: '#F97316' }}
        >
          Upgrade →
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
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
