'use client'

import { useRouter }              from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface TopicStat {
  prefix:      string
  name:        string
  avg:         number   // 0-100
  category:    string
}

export interface DashboardData {
  displayName:    string
  course:         string
  streak:         number
  longestStreak:  number
  todayQuestions: number
  overallMastery: number   // 0-100
  topTopics:      TopicStat[]
  weakTopic:      TopicStat | null
  totalTopics:    number
  masteredCount:  number
}

// ─── Colour helpers ─────────────────────────────────────────────────────────────
function masteryColor(avg: number): string {
  if (avg >= 80) return '#10B981'
  if (avg >= 50) return '#F59E0B'
  return '#EF4444'
}

function masteryLabel(avg: number): string {
  if (avg >= 80) return 'Mastered'
  if (avg >= 50) return 'Shaky'
  return 'Gap'
}

// ─── Animated count-up hook ────────────────────────────────────────────────────
// Reads localStorage for a pending streak animation written by PracticeSession.
// Starts at target (no hydration mismatch), then counts up on mount if needed.

function useStreakCountUp(target: number): { count: number; isAnimating: boolean } {
  const [count,       setCount]       = useState(target)
  const [isAnimating, setIsAnimating] = useState(false)
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    try {
      const stored = localStorage.getItem('neumm_streak_anim')
      if (!stored) return
      const { from, to, ts } = JSON.parse(stored) as { from: number; to: number; ts: number }
      // Only animate if the animation was written within the last 5 minutes
      if (to !== target || typeof from !== 'number' || from >= to) return
      if (Date.now() - ts > 5 * 60 * 1000) return
      localStorage.removeItem('neumm_streak_anim')

      // Brief delay to let the page paint first
      setTimeout(() => {
        setCount(from)
        setIsAnimating(true)
        const duration   = 900
        const startTime  = Date.now()

        const tick = () => {
          const elapsed  = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(from + (to - from) * eased))
          if (progress < 1) {
            requestAnimationFrame(tick)
          } else {
            setIsAnimating(false)
          }
        }
        requestAnimationFrame(tick)
      }, 400)
    } catch {}
  }, [target])

  return { count, isAnimating }
}

// ─── Streak card ───────────────────────────────────────────────────────────────

function StreakCard({
  streak, longestStreak,
}: {
  streak:        number
  longestStreak: number
}) {
  const { count, isAnimating } = useStreakCountUp(streak)
  const isHot = count >= 3

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 mb-5"
    >
      {/* Flame icon — pulses while animating */}
      <div
        className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{
          backgroundColor: count === 0 ? '#F3F4F6' : '#FEF2F2',
          animation: isAnimating ? 'flamePulse 0.5s ease infinite alternate' : 'none',
        }}
      >
        {count === 0 ? '🔥' : '🔥'}
      </div>

      {/* Count + label */}
      <div className="flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-4xl font-extrabold tabular-nums leading-none"
            style={{
              color: count === 0 ? '#9CA3AF' : isHot ? '#EF4444' : '#F97316',
              transition: 'color 0.4s',
            }}
          >
            {count}
          </span>
          <span className="text-sm font-semibold text-gray-400">
            {count === 1 ? 'day streak' : 'day streak'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {count === 0
            ? 'Practice today to start your streak!'
            : longestStreak > count
              ? `Personal best: ${longestStreak} days`
              : count >= longestStreak && count > 1
                ? '🏆 Personal best!'
                : 'Keep going — practice every day!'}
        </p>
      </div>

      {/* Mini 7-day dots */}
      <div className="hidden sm:flex flex-col items-end gap-1">
        <p className="text-xs text-gray-400 font-medium">7-day goal</p>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const filled = i < Math.min(count, 7)
            return (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-colors"
                style={{ backgroundColor: filled ? '#EF4444' : '#F3F4F6' }}
              />
            )
          })}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes flamePulse {
          from { transform: scale(1);    }
          to   { transform: scale(1.12); }
        }
      `}</style>
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: accent ?? '#111827' }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Topic row ────────────────────────────────────────────────────────────────
function TopicRow({ topic }: { topic: TopicStat }) {
  const color = masteryColor(topic.avg)
  const label = masteryLabel(topic.avg)
  return (
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-700 truncate">{topic.name}</p>
          <span className="text-xs font-bold shrink-0 ml-2" style={{ color }}>{topic.avg}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${topic.avg}%`, backgroundColor: color }}
          />
        </div>
        <p className="text-xs mt-0.5" style={{ color }}>{label}</p>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function DashboardContent({ data }: { data: DashboardData }) {
  const router = useRouter()

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const firstName = data.displayName.split(' ')[0]

  return (
    <div className="px-5 md:px-8 py-8 max-w-2xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm text-gray-400 font-medium">{greeting}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{firstName} 👋</h1>
          <p className="text-sm text-gray-400 mt-1">{data.course} Mathematics</p>
        </div>

        {/* Top-bar streak pill — stays visible at a glance */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm shadow-sm"
          style={{
            backgroundColor: data.streak === 0 ? '#F3F4F6' : '#FEF2F2',
            color:            data.streak === 0 ? '#9CA3AF' : '#EF4444',
          }}
        >
          <span>🔥</span>
          <span>{data.streak}</span>
        </div>
      </div>

      {/* ── Streak card (prominent, animated) ── */}
      <StreakCard streak={data.streak} longestStreak={data.longestStreak} />

      {/* ── Stat cards ── */}
      <div className="flex gap-3 mb-5">
        <StatCard
          label="Today"
          value={data.todayQuestions}
          sub="questions answered"
          accent="#185FA5"
        />
        <StatCard
          label="Mastery"
          value={`${data.overallMastery}%`}
          sub={`${data.masteredCount} of ${data.totalTopics} topics`}
          accent={data.overallMastery >= 80 ? '#10B981' : data.overallMastery >= 50 ? '#F59E0B' : '#EF4444'}
        />
      </div>

      {/* ── Continue Practice CTA ── */}
      <div
        className="rounded-2xl p-5 mb-5 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #185FA5 0%, #1a74c8 100%)' }}
      >
        <p className="text-xs font-semibold text-blue-200 uppercase tracking-wide mb-1">Recommended</p>
        {data.weakTopic ? (
          <>
            <h2 className="text-lg font-bold text-white mb-0.5">{data.weakTopic.name}</h2>
            <p className="text-sm text-blue-200 mb-4">
              Your lowest topic at {data.weakTopic.avg}% — a focused session here will boost your score fast.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-white mb-0.5">Start your first session</h2>
            <p className="text-sm text-blue-200 mb-4">
              {"Practice questions are tailored to your mastery map."}
            </p>
          </>
        )}
        <button
          onClick={() => router.push('/practice')}
          className="w-full py-3 rounded-xl bg-white font-bold text-sm transition-all active:scale-[0.98]"
          style={{ color: '#185FA5' }}
        >
          Continue Practice →
        </button>
      </div>

      {/* ── Topic mastery list ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-900">Your topics</p>
          <button
            onClick={() => router.push('/onboarding/map')}
            className="text-xs font-semibold"
            style={{ color: '#185FA5' }}
          >
            Full map →
          </button>
        </div>

        {data.topTopics.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Complete the placement probe to see your topic mastery.
          </p>
        ) : (
          <div className="space-y-4">
            {data.topTopics.map(t => (
              <TopicRow key={t.prefix} topic={t} />
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile bottom nav ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-safe pt-2 z-50">
        {[
          { href: '/dashboard', label: 'Home', icon: '🏠' },
          { href: '/practice',  label: 'Practice', icon: '⚡' },
          { href: '/dashboard/progress', label: 'Progress', icon: '📈' },
          { href: '/dashboard/account', label: 'Account', icon: '👤' },
        ].map(item => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs text-gray-500 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
