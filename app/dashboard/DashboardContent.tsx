'use client'

import { useRouter } from 'next/navigation'

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface TopicStat {
  prefix:   string
  name:     string
  avg:      number
  category: string
}

export interface LeaderboardEntry {
  rank:  number
  name:  string
  xp:    number
  isMe:  boolean
}

export interface DashboardData {
  displayName:    string
  course:         string
  yearGroup:      string | null
  streak:         number
  longestStreak:  number
  todayQuestions: number
  weekXp:         number
  totalXp:        number
  level:          number
  xpInLevel:      number
  xpForNext:      number
  overallMastery: number
  predictedBand:  number
  topicStats:     TopicStat[]
  learningPath:   TopicStat[]
  missionTopic:   TopicStat | null
  totalTopics:    number
  masteredCount:  number
  leaderboard:    LeaderboardEntry[]
  tier:           string
  trialEndDate:   string | null
}

// ─── Colour helpers ─────────────────────────────────────────────────────────────
function masteryColor(avg: number): string {
  if (avg >= 60) return '#10B981'
  if (avg >= 30) return '#F59E0B'
  return '#EF4444'
}

function masteryStatusLabel(avg: number): string {
  if (avg >= 60) return 'Strong'
  if (avg >= 30) return 'Getting there'
  return 'Gap area'
}

function masteryStars(avg: number): number {
  if (avg >= 80) return 5
  if (avg >= 60) return 4
  if (avg >= 40) return 3
  if (avg >= 20) return 2
  return 1
}

// Initials avatar
function Avatar({ name, size = 32, color = '#185FA5' }: { name: string; size?: number; color?: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

// ─── Tier banner ───────────────────────────────────────────────────────────────
function TierBanner({ tier, trialEndDate }: { tier: string; trialEndDate: string | null }) {
  const router = useRouter()
  if (tier === 'basic_trial' && trialEndDate) {
    const daysLeft = Math.ceil((new Date(trialEndDate).getTime() - Date.now()) / 86400000)
    if (daysLeft > 3) return null
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 mb-4 border"
        style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}>
        <p className="text-sm font-semibold text-amber-800">
          ⏰ {daysLeft <= 0 ? 'Trial ended' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your trial`}
        </p>
        <button onClick={() => router.push('/account/upgrade')}
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-400 text-amber-900">
          Upgrade →
        </button>
      </div>
    )
  }
  return null
}

// ─── Circular progress ─────────────────────────────────────────────────────────
function CircularMastery({ pct, size = 72 }: { pct: number; size?: number }) {
  const r    = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const off  = circ * (1 - pct / 100)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="white" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black text-white leading-none">{pct}%</span>
        <span className="text-white text-center leading-tight font-semibold"
          style={{ fontSize: 8, opacity: 0.8 }}>MASTERY</span>
      </div>
    </div>
  )
}

// ─── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ filled, color }: { filled: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <svg key={n} width="10" height="10" viewBox="0 0 10 10">
          <path d="M5 1l1.2 2.5L9 4l-2 1.9.5 2.6L5 7.2l-2.5 1.3.5-2.6L1 4l2.8-.5z"
            fill={n <= filled ? color : '#E5E7EB'} />
        </svg>
      ))}
    </div>
  )
}

// ─── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ label, color = '#10B981' }: { label: string; color?: string }) {
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}18`, color }}>
      {label}
    </span>
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

  // Streak day-of-week dots (M-Su, today highlighted)
  const today   = new Date().getDay()          // 0=Sun … 6=Sat
  const days    = ['M','T','W','T','F','S','S']
  // Map JS day (0=Sun) to index (0=Mon)
  const todayIdx = today === 0 ? 6 : today - 1
  const streakDays = days.map((d, i) => {
    const daysBack = (todayIdx - i + 7) % 7
    const filled   = daysBack < data.streak
    const isToday  = i === todayIdx
    return { label: d, filled, isToday }
  })

  // Achievements
  const ACHIEVEMENTS = [
    { id: 'first_blood', emoji: '⚡', label: 'First blood',  desc: 'First question',  earned: data.totalXp >= 10 },
    { id: 'on_fire',     emoji: '🔥', label: 'On fire',      desc: `${data.streak}-day streak`, earned: data.streak >= 3 },
    { id: 'speed_run',   emoji: '🚀', label: 'Speed run',    desc: '10 in 3 min',     earned: data.todayQuestions >= 10 },
    { id: 'green_sweep', emoji: '🌿', label: 'Green sweep',  desc: 'Master 5 topics', earned: data.masteredCount >= 5 },
    { id: 'band5',       emoji: '🎯', label: 'Band 5+',      desc: 'Reach predicted 5',earned: data.predictedBand >= 5 },
    { id: 'scholar',     emoji: '🎓', label: 'Scholar',      desc: '100 correct answers', earned: data.totalXp >= 1000 },
  ]

  // XP progress bar %
  const xpPct = data.xpForNext > 0
    ? Math.round((data.xpInLevel / data.xpForNext) * 100)
    : 0

  return (
    <div className="px-5 md:px-8 py-6 max-w-3xl space-y-5"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            {greeting}, {firstName} 🎯
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data.course} Mathematics
            {data.yearGroup ? ` · ${data.yearGroup.replace(/_/g, ' ')}` : ''}
          </p>
        </div>

        {/* Top badges */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black"
            style={{ backgroundColor: data.streak > 0 ? '#FFF3E0' : '#F3F4F6',
                     color: data.streak > 0 ? '#E65100' : '#9CA3AF' }}>
            🔥 {data.streak}-day streak
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black"
            style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
            ⚡ {data.totalXp.toLocaleString()} XP
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black"
            style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
            ★ Level {data.level}
          </span>
        </div>
      </div>

      {/* ── Tier banner ── */}
      <TierBanner tier={data.tier} trialEndDate={data.trialEndDate} />

      {/* ── Today's Mission card ── */}
      {data.missionTopic ? (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg,#0C2D5A 0%,#185FA5 100%)' }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest mb-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              TODAY&apos;S MISSION
            </p>
            <h2 className="text-base font-black text-white leading-snug mb-1">
              Close the {data.missionTopic.name} gap — your biggest opportunity
            </h2>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Mastering {data.missionTopic.name} moves your predicted band up.
              {data.missionTopic.avg < 40
                ? ' Just a few questions stands between you and a green tile.'
                : ' Keep the momentum going!'}
            </p>
            <button
              onClick={() => router.push(`/practice?topic=${encodeURIComponent(data.missionTopic!.prefix)}`)}
              className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)' }}>
              Start mission →
            </button>
          </div>
          <CircularMastery pct={data.missionTopic.avg} size={80} />
        </div>
      ) : (
        <div className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg,#0C2D5A 0%,#185FA5 100%)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1"
            style={{ color: 'rgba(255,255,255,0.55)' }}>READY TO GO?</p>
          <h2 className="text-base font-black text-white mb-1">Start your first practice session</h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Answer a few questions and we&apos;ll build your personal learning path.
          </p>
          <button onClick={() => router.push('/practice')}
            className="px-5 py-2.5 rounded-xl text-sm font-black text-white active:scale-[0.98]"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)' }}>
            Start practising →
          </button>
        </div>
      )}

      {/* ── Stat cards row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: '📝',
            value: data.todayQuestions,
            label: 'Questions today',
            pill: data.todayQuestions > 0 ? `+${data.todayQuestions} today` : 'Start now',
            pillColor: '#185FA5',
          },
          {
            icon: '🎯',
            value: data.predictedBand.toFixed(1),
            label: 'Predicted HSC band',
            pill: data.predictedBand >= 5 ? '🔥 Band 5+' : `${data.overallMastery}% mastery`,
            pillColor: data.predictedBand >= 5 ? '#10B981' : '#F59E0B',
          },
          {
            icon: '⭐',
            value: data.weekXp,
            label: 'XP this week',
            pill: `${data.xpForNext - data.xpInLevel} to Lv.${data.level + 1}`,
            pillColor: '#7C3AED',
          },
          {
            icon: '🔥',
            value: data.streak,
            label: 'Day streak',
            pill: data.longestStreak > 0 && data.streak >= data.longestStreak && data.streak > 0
              ? '🏆 Personal best!'
              : data.streak > 0 ? `Best: ${data.longestStreak}d` : 'Start today',
            pillColor: data.streak > 0 ? '#E65100' : '#9CA3AF',
          },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <StatPill label={s.pill} color={s.pillColor} />
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none mb-0.5">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Learning path ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-sm font-black text-gray-900">⚡ Your learning path</h2>
          <button onClick={() => router.push('/dashboard/progress')}
            className="text-xs font-bold"
            style={{ color: '#185FA5' }}>
            See all {data.totalTopics} topics →
          </button>
        </div>

        {data.learningPath.length === 0 ? (
          <div className="px-5 pb-5 text-center py-8">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-sm font-bold text-gray-700 mb-1">Your learning path is loading up!</p>
            <p className="text-xs text-gray-400 mb-4">Answer a few questions to unlock your personalised path.</p>
            <button onClick={() => router.push('/practice')}
              className="px-6 py-2.5 rounded-xl text-sm font-black text-white"
              style={{ backgroundColor: '#185FA5' }}>
              Start practising →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.learningPath.map((t, idx) => {
              const color   = masteryColor(t.avg)
              const stars   = masteryStars(t.avg)
              const status  = masteryStatusLabel(t.avg)
              const isMission = idx === 0
              return (
                <button key={t.prefix}
                  onClick={() => router.push(`/practice?topic=${encodeURIComponent(t.prefix)}`)}
                  className="w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors hover:bg-gray-50 active:bg-gray-100"
                  style={isMission ? { backgroundColor: '#F0F7FF' } : {}}>
                  {/* Category icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ backgroundColor: `${color}18` }}>
                    {t.category.includes('Calc') ? '∫' : t.category.includes('Trig') ? '△'
                      : t.category.includes('Stat') ? 'σ' : t.category.includes('Alg') ? 'x²'
                      : t.category.includes('Func') ? 'f' : t.category.includes('Exp') ? 'eˣ'
                      : t.category.includes('Fin') ? '$' : t.category.includes('Coord') ? '⊙'
                      : t.category.includes('Ext') ? '★' : '📐'}
                  </div>

                  {/* Topic info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-900 truncate">{t.name}</p>
                      {isMission && (
                        <span className="text-xs font-black px-1.5 py-0.5 rounded-md shrink-0"
                          style={{ backgroundColor: '#185FA5', color: 'white', fontSize: 9 }}>
                          MISSION
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium" style={{ color }}>{status}</p>
                      <span className="text-gray-200">·</span>
                      <Stars filled={stars} color={color} />
                    </div>
                  </div>

                  {/* Mastery % + bar */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black mb-1" style={{ color }}>{t.avg}%</p>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${t.avg}%`, backgroundColor: color }} />
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Streak card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-sm font-black text-gray-900">
              🔥 {data.streak}-day streak{data.streak >= 7 ? ' — you\'re on fire!' : ''}
            </h2>
            {data.streak > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {data.longestStreak > data.streak
                  ? `Personal best: ${data.longestStreak} days`
                  : data.streak >= 3 ? 'Keep the momentum going!' : 'Practice every day to build your streak'}
              </p>
            )}
          </div>
          {data.streak >= 7 && (
            <span className="text-xs font-black px-2 py-1 rounded-full"
              style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>
              Top performer
            </span>
          )}
        </div>

        {/* Day dots */}
        <div className="flex gap-2 mb-4">
          {streakDays.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-xl flex items-center justify-center text-xs font-black transition-all"
                style={{
                  height: 36,
                  backgroundColor: d.filled ? '#185FA5' : d.isToday ? '#E6F1FB' : '#F5F5F5',
                  color:           d.filled ? 'white'    : d.isToday ? '#185FA5' : '#9CA3AF',
                  border:          d.isToday && !d.filled ? '2px solid #185FA5' : 'none',
                }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>

        {/* XP level bar */}
        <div className="rounded-xl p-3 border border-gray-100"
          style={{ backgroundColor: '#F8FAFF' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-600">Level {data.level}</span>
            <span className="text-xs font-semibold text-gray-400">
              {data.xpInLevel} / {data.xpForNext} XP
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%`, backgroundColor: '#185FA5' }} />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {data.xpForNext - data.xpInLevel} XP to Level {data.level + 1}
          </p>
        </div>
      </div>

      {/* ── Achievements ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-gray-900">🏆 Achievements</h2>
          <span className="text-xs font-bold text-gray-400">
            {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl"
              style={{
                backgroundColor: a.earned ? '#F0F7FF' : '#F9F9F9',
                opacity:          a.earned ? 1 : 0.45,
              }}>
              <span className="text-2xl">{a.emoji}</span>
              <p className="text-xs font-black text-center leading-tight text-gray-900">{a.label}</p>
              <p className="text-center text-gray-400" style={{ fontSize: 9 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Leaderboard ── */}
      {data.leaderboard.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-900">🏆 Leaderboard</h2>
            <button onClick={() => router.push('/dashboard/leaderboard')}
              className="text-xs font-bold" style={{ color: '#185FA5' }}>
              View all →
            </button>
          </div>
          <div className="space-y-2.5">
            {data.leaderboard.slice(0, 5).map(entry => {
              const COLORS = ['#F59E0B','#6B7280','#B45309']
              const avatarColor = entry.isMe ? '#185FA5'
                : entry.rank <= 3 ? COLORS[entry.rank - 1] : '#6B7280'
              const maxXp = Math.max(...data.leaderboard.map(e => e.xp), 1)
              return (
                <div key={entry.rank}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: entry.isMe ? '#E6F1FB' : 'transparent' }}>
                  <span className="text-sm font-black w-5 text-center text-gray-400">
                    {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
                  </span>
                  <Avatar name={entry.name} size={28} color={avatarColor} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {entry.isMe ? 'You' : entry.name}
                    </p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full rounded-full"
                        style={{ width: `${Math.round((entry.xp / maxXp) * 100)}%`,
                                 backgroundColor: entry.isMe ? '#185FA5' : '#F59E0B' }} />
                    </div>
                  </div>
                  <span className="text-xs font-black shrink-0"
                    style={{ color: entry.isMe ? '#185FA5' : '#6B7280' }}>
                    {entry.xp.toLocaleString()} XP
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
