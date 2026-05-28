import Link from 'next/link'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Nav */}
      <header style={{ background: '#0D3349', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#185FA5,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 14 }}>
              N
            </div>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 15 }}>Neumm</span>
          </Link>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0D3349', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
          © 2026 Caplix Pty Ltd. All rights reserved. Neumm is a product of Caplix Pty Ltd.
        </p>
      </footer>
    </div>
  )
}
