'use client'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export default function MinorConsentNotice({ onConfirm, onCancel }: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: 'white', borderRadius: 20, padding: '32px 28px',
          maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>👨‍👩‍👧</div>
        <h2 style={{ color: '#0D3349', fontWeight: 900, fontSize: 18, marginBottom: 12, marginTop: 0, textAlign: 'center' }}>
          Parent or Guardian Consent Required
        </h2>
        <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 24, textAlign: 'center' }}>
          You are signing up as someone under 18. Neumm requires that a parent or guardian has reviewed and agreed to our{' '}
          <a href="/math-nsw/app/legal/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5', fontWeight: 700 }}>
            Terms
          </a>{' '}
          and{' '}
          <a href="/math-nsw/app/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5', fontWeight: 700 }}>
            Privacy Policy
          </a>{' '}
          on your behalf. By continuing, you confirm that your parent or guardian has agreed.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onConfirm}
            style={{
              padding: '13px', borderRadius: 12, border: 'none',
              background: '#006D77', color: 'white',
              fontWeight: 900, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            I confirm — Continue →
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '13px', borderRadius: 12,
              border: '1.5px solid #E5E7EB',
              background: 'transparent', color: '#6B7280',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
