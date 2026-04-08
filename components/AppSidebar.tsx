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
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black"
      style={{
        background: streak > 0 ? '#FF6B35' : 'rgba(255,251,240,0.1)',
        color: streak > 0 ? '#FFFBF0' : 'rgba(255,251,240,0.4)',
      }}>
      🔥 {streak}
    </div>
  )
}

const NAV_ITEMS = [
  { href: '/dashboard',            label: 'Home',        emoji: '🏠' },
  { href: '/practice',             label: 'Topic Mastery', emoji: '⚡' },
  { href: '/exam',                 label: 'Exam',        emoji: '📝' },
  { href: '/dashboard/progress',   label: 'Progress',    emoji: '📈' },
  { href: '/dashboard/leaderboard',label: 'Leaderboard', emoji: '🏆' },
  { href: '/dashboard/account',    label: 'Account',     emoji: '👤' },
]

export default function AppSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col shrink-0"
      style={{
        width: 224,
        minHeight: '100vh',
        background: '#0F0F14',
        fontFamily: "'Nunito', sans-serif",
      }}>

      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black"
            style={{ background: '#FFDA00', color: '#0F0F14' }}>N</div>
          <span className="font-black text-lg tracking-tight" style={{ color: '#FFFBF0' }}>neumm</span>
        </div>
        <SidebarStreak />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all"
              style={isActive ? {
                background: '#FFDA00',
                color: '#0F0F14',
              } : {
                color: 'rgba(255,251,240,0.50)',
              }}>
              <span className="text-base">{item.emoji}</span>
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#0F0F14' }} />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 pb-6 pt-4">
        <p className="text-xs font-bold" style={{ color: 'rgba(255,218,0,0.3)' }}>© 2025 Neumm ✨</p>
      </div>
    </aside>
  )
}
