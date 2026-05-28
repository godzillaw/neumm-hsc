import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal — Neumm',
  description: 'Legal documents for Neumm HSC Mathematics, operated by Caplix Pty Ltd.',
}

const LEGAL_DOCS = [
  {
    href:        '/legal/terms',
    title:       'Terms and Conditions',
    description: 'Rules governing your use of Neumm, subscriptions, refunds, and intellectual property.',
  },
  {
    href:        '/legal/privacy',
    title:       'Privacy Policy',
    description: 'How we collect, use, store, and protect your personal information under the Australian Privacy Act.',
  },
  {
    href:        '/legal/children-data',
    title:       "Children's Data Notice",
    description: 'Special notice about how we handle data for users under 18 years of age.',
  },
  {
    href:        '/legal/acceptable-use',
    title:       'Acceptable Use Policy',
    description: 'What you can and cannot do when using Neumm.',
  },
  {
    href:        '/legal/cookies',
    title:       'Cookie Policy',
    description: 'What cookies we use, why, and how to manage them.',
  },
]

export default function LegalHubPage() {
  return (
    <div>
      <h1 style={{ color: '#006D77', fontSize: 32, fontWeight: 900, marginBottom: 8, marginTop: 0 }}>
        Legal
      </h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
        These documents govern your use of Neumm, a product of Caplix Pty Ltd. Please read them carefully.
      </p>

      <div style={{ display: 'grid', gap: 16 }}>
        {LEGAL_DOCS.map(doc => (
          <Link
            key={doc.href}
            href={doc.href}
            style={{ display: 'block', background: 'white', borderRadius: 16, padding: '20px 24px', border: '1.5px solid #E5E7EB', textDecoration: 'none', transition: 'border-color 0.15s' }}
          >
            <p style={{ color: '#006D77', fontWeight: 900, fontSize: 16, margin: '0 0 4px' }}>{doc.title}</p>
            <p style={{ color: '#6B7280', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{doc.description}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48, padding: '20px 24px', background: '#F0F9FF', borderRadius: 16, border: '1.5px solid #BAE6FD' }}>
        <p style={{ color: '#0369A1', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>Questions?</p>
        <p style={{ color: '#374151', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Contact us at <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5', fontWeight: 700 }}>support@neumm.com.au</a> or{' '}
          <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5', fontWeight: 700 }}>privacy@neumm.com.au</a> for privacy matters.
        </p>
      </div>
    </div>
  )
}
