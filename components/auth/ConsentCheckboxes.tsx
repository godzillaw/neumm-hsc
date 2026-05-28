'use client'

interface Props {
  onChange: (checked: boolean) => void
  checked: boolean
}

export default function ConsentCheckboxes({ onChange, checked }: Props) {
  return (
    <label
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        cursor: 'pointer', padding: '12px 16px',
        background: '#F9FAFB', borderRadius: 12,
        border: `1.5px solid ${checked ? '#006D77' : '#E5E7EB'}`,
        transition: 'border-color 0.15s',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: '#006D77', flexShrink: 0, width: 16, height: 16, cursor: 'pointer' }}
      />
      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
        I agree to Neumm&apos;s{' '}
        <a
          href="/math-nsw/app/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#185FA5', fontWeight: 700 }}
          onClick={e => e.stopPropagation()}
        >
          Terms and Conditions
        </a>
        {' '}and{' '}
        <a
          href="/math-nsw/app/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#185FA5', fontWeight: 700 }}
          onClick={e => e.stopPropagation()}
        >
          Privacy Policy
        </a>
        . If I am under 18, I confirm my parent or guardian has agreed on my behalf.
      </span>
    </label>
  )
}
