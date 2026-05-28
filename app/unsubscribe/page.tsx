import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unsubscribed — Neumm',
  description: 'You have been unsubscribed from Neumm marketing emails.',
}

export default function UnsubscribePage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F9FAFB', padding: 24, fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{
        maxWidth: 440, width: '100%', textAlign: 'center',
        background: 'white', borderRadius: 20, padding: '40px 32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <h1 style={{ color: '#006D77', fontWeight: 900, fontSize: 22, marginBottom: 12, marginTop: 0 }}>
          You&apos;ve been unsubscribed
        </h1>
        <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
          You have been unsubscribed from Neumm marketing emails. You will no longer receive promotional messages from us.
        </p>
        <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
          You will still receive important transactional emails such as account confirmations, password resets, and billing notifications.
        </p>
        <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
          Changed your mind? You can re-subscribe in your{' '}
          <a href="/math-nsw/app/dashboard/settings/privacy" style={{ color: '#185FA5', fontWeight: 700 }}>
            Privacy Settings
          </a>{' '}
          once logged in, or contact{' '}
          <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5', fontWeight: 700 }}>
            privacy@neumm.com.au
          </a>.
        </p>
        <a
          href="https://www.neumm.com.au"
          style={{
            display: 'inline-block', padding: '12px 24px', borderRadius: 12,
            background: '#0D3349', color: 'white',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}
        >
          Back to neumm.com.au →
        </a>
        <p style={{ color: '#9CA3AF', fontSize: 11, marginTop: 24 }}>
          Caplix Pty Ltd, operating as Neumm.
        </p>
      </div>
    </div>
  )
}
