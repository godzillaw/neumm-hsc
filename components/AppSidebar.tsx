'use client'

import Link                            from 'next/link'
import { usePathname }                 from 'next/navigation'
import { useState, useEffect }         from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

function SidebarStreak() {
  const [streak, setStreak] = useState<number | null>(null)
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('streaks').select('current_streak').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setStreak(data.current_streak ?? 0) })
    })
  }, [])
  if (streak === null) return null
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black"
      style={{ background: streak > 0 ? 'linear-gradient(135deg,#FF6B35,#FF8C42)' : '#F3F4F6', color: streak > 0 ? 'white' : '#9CA3AF' }}>
      🔥 {streak}
    </div>
  )
}

const NAV_ITEMS = [
  { href: '/dashboard',            label: 'Home',        emoji: '🏠' },
  { href: '/practice',             label: 'Practice',    emoji: '⚡' },
  { href: '/exam',                 label: 'Exam',        emoji: '📝' },
  { href: '/dashboard/progress',   label: 'Progress',    emoji: '📈' },
  { href: '/dashboard/leaderboard',label: 'Leaderboard', emoji: '🏆' },
  { href: '/dashboard/account',    label: 'Account',     emoji: '👤' },
]

export default function AppSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col shrink-0"
      style={{ width: 220, minHeight: '100vh', background: 'white', borderRight: '1px solid #F3F0FF' }}>

      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-7 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-black text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>N</div>
          <span className="font-black text-gray-900 text-lg tracking-tight">neumm</span>
        </div>
        <SidebarStreak />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all"
              style={isActive ? {
                background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3)',
                color: '#7C3AED',
              } : { color: '#6B7280' }}>
              <span className="text-base">{item.emoji}</span>
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#7C3AED' }} />}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 pb-6 pt-4">
        <p className="text-xs font-medium" style={{ color: '#D8B4FE' }}>© 2025 Neumm ✨</p>
      </div>
    </aside>
  )
}
