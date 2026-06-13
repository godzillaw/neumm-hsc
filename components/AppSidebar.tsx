'use client'

import Link                            from 'next/link'
import { usePathname }                 from 'next/navigation'

// ── Nav items ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/dashboard/mission',           label: 'Mission',          icon: '🎯' },
  { href: '/exam',                        label: 'Mock Test',             icon: '📝' },
  { href: '/dashboard/account',           label: 'Account',          icon: '👤' },
  { href: '/dashboard/settings/privacy',  label: 'Privacy Settings', icon: '🔒' },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: 220,
        minHeight: '100vh',
        background: '#0D1525',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-7 pb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black text-white"
          style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)' }}
        >
          N
        </div>
        <div>
          <p className="font-black text-white text-base leading-none">neumm</p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            HSC Maths
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const onPractice = pathname === '/practice' || pathname.startsWith('/practice/')
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/') ||
            (onPractice && item.href === '/dashboard/mission')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={isActive ? {
                background: 'linear-gradient(135deg,rgba(24,95,165,0.5),rgba(37,99,235,0.3))',
                color: 'white',
                border: '1px solid rgba(37,99,235,0.4)',
              } : {
                color: 'rgba(255,255,255,0.45)',
                border: '1px solid transparent',
              }}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-4 rounded-full"
                  style={{ background: 'linear-gradient(180deg,#60A5FA,#2563EB)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 pb-5 pt-4">
        <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.18)' }}>
          © 2025 Neumm
        </p>
      </div>
    </aside>
  )
}
