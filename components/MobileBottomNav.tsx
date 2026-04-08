'use client'

import Link          from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard',          label: 'Home',     icon: '🏠' },
  { href: '/practice',           label: 'Practice', icon: '⚡' },
  { href: '/exam',               label: 'Exam',     icon: '📝' },
  { href: '/dashboard/progress', label: 'Progress', icon: '📈' },
  { href: '/dashboard/account',  label: 'Me',       icon: '👤' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: '#0F0F14',
        borderTop: '1.5px solid rgba(255,218,0,0.15)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        fontFamily: "'Nunito', sans-serif",
      }}>
      <div className="flex items-center justify-around px-1 pt-1 pb-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[52px] relative">
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: '#FFDA00' }} />
              )}
              <span className="text-xl leading-none"
                style={{ filter: isActive ? 'none' : 'grayscale(0.5) opacity(0.4)' }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-black leading-none"
                style={{ color: isActive ? '#FFDA00' : 'rgba(255,251,240,0.35)' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
