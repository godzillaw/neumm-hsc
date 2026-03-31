'use client'

import Link        from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard',          label: 'Home',     icon: '🏠' },
  { href: '/practice',           label: 'Practice', icon: '⚡' },
  { href: '/exam',               label: 'Exam',     icon: '📋' },
  { href: '/dashboard/progress', label: 'Progress', icon: '📈' },
  { href: '/dashboard/account',  label: 'Account',  icon: '👤' },
]

/**
 * Fixed bottom navigation bar for mobile (hidden on md+ where AppSidebar takes over).
 * Renders on all /dashboard/* pages and on /practice and /exam.
 *
 * Safe-area-inset-bottom padding ensures the nav bar clears the iPhone home
 * indicator on edge-to-edge devices.
 */
export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around px-1 pt-1 pb-1">
        {NAV_ITEMS.map(item => {
          // Mark active if exact match OR if the path starts with the href
          // (except for /dashboard which must be an exact match to avoid
          //  highlighting Home on every /dashboard/* sub-page)
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[48px]"
              style={{ color: isActive ? '#185FA5' : '#9CA3AF' }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? '#185FA5' : '#9CA3AF' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
