'use client'

import { setAIDisclosureDismissed } from '@/lib/actions/compliance'

interface Props {
  userId: string
  onDismiss: () => void
}

export default function AIDisclosureBanner({ userId, onDismiss }: Props) {
  async function handleDismiss() {
    await setAIDisclosureDismissed(userId)
    onDismiss()
  }

  return (
    <div
      style={{
        background: '#EFF6FF',
        border: '1.5px solid #BFDBFE',
        borderRadius: 16,
        padding: '14px 18px',
        marginBottom: 16,
        fontFamily: "'Nunito', sans-serif",
      }}
      role="alert"
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 900, color: '#1E40AF', fontSize: 14, margin: '0 0 4px' }}>
            AI-Powered Feature
          </p>
          <p style={{ color: '#1E3A5F', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            This feature uses AI to generate educational hints and explanations. AI responses may occasionally
            be inaccurate. Always verify against NESA resources and your school teacher.
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => void handleDismiss()}
              style={{
                padding: '7px 14px', borderRadius: 8,
                background: '#1D4ED8', border: 'none', color: 'white',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Got it — don&apos;t show again
            </button>
            <a
              href="/math-nsw/app/legal/privacy#section-10"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '7px 14px', borderRadius: 8,
                border: '1.5px solid #BFDBFE',
                background: 'transparent', color: '#1D4ED8',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              Learn more about how our AI works →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
