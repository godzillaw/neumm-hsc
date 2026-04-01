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
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #F3F0FF',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
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
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }} />
              )}
              <span className="text-xl leading-none" style={{ filter: isActive ? 'none' : 'grayscale(0.4) opacity(0.6)' }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold leading-none"
                style={{ color: isActive ? '#7C3AED' : '#9CA3AF' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
