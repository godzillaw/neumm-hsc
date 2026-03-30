'use client'

import { useRouter } from 'next/navigation'

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
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 font-medium">{greeting}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{firstName} 👋</h1>
          <p className="text-sm text-gray-400 mt-1">{data.course} Mathematics</p>
        </div>

        {/* Streak pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white font-bold text-sm shadow-sm"
          style={{ backgroundColor: '#EF4444' }}
        >
          <span>🔥</span>
          <span>{data.streak}</span>
        </div>
      </div>

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
