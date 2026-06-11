'use client'

import { useState } from 'react'

interface Props {
  isMinor: boolean
  termsVersion: string | null
  termsAcceptedAt: string | null
  privacyVersion: string | null
  privacyAcceptedAt: string | null
}

export default function PrivacyControls({
  isMinor,
  termsVersion,
  termsAcceptedAt,
  privacyVersion,
  privacyAcceptedAt,
}: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteSuccess,   setDeleteSuccess]  = useState(false)
  const [error,           setError]          = useState<string | null>(null)

  async function handleDataAccessRequest() {
    try {
      const res = await fetch('/math-nsw/app/api/privacy/data-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setError(null)
        alert('Data access request submitted. We will email you within 30 days.')
      } else {
        setError('Failed to submit request. Please contact privacy@neumm.com.au.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
  }

  async function handleDeleteAccount() {
    try {
      const res = await fetch('/math-nsw/app/api/privacy/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setDeleteSuccess(true)
        setShowDeleteModal(false)
      } else {
        setError('Failed to submit deletion request. Please contact privacy@neumm.com.au.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
  }

  function formatDate(iso: string | null) {
    if (!iso) return 'Not accepted'
    const d = new Date(iso)
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (deleteSuccess) {
    return (
      <div style={{ maxWidth: 560, padding: '32px 24px', background: 'white', borderRadius: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
        <h2 style={{ color: '#0D3349', fontWeight: 900, fontSize: 20, marginBottom: 12, marginTop: 0 }}>
          Deletion Request Submitted
        </h2>
        <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7 }}>
          Your account deletion request has been queued. Your account will be permanently deleted within 30 days.
          You have been signed out. If you change your mind, contact{' '}
          <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5', fontWeight: 700 }}>privacy@neumm.com.au</a>.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, fontFamily: "'Nunito', sans-serif" }}>
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#B91C1C', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Leaderboard toggle hidden — out of scope for MVP */}

      {/* 4.2 Data access */}
      <Section title="Request a Copy of Your Data">
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 14 }}>
          You have the right to receive a copy of all personal data we hold about you (APP 12).
          We will respond within 30 days.
        </p>
        <button
          onClick={() => void handleDataAccessRequest()}
          style={{
            padding: '10px 20px', borderRadius: 10,
            border: '1.5px solid #006D77', background: 'transparent',
            color: '#006D77', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Request data export →
        </button>
      </Section>

      {/* 4.5 Legal versions */}
      <Section title="Legal Agreements">
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 18px', border: '1.5px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#374151', fontWeight: 700 }}>Terms & Conditions</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Version {termsVersion ?? 'N/A'} — {formatDate(termsAcceptedAt)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151', fontWeight: 700 }}>Privacy Policy</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Version {privacyVersion ?? 'N/A'} — {formatDate(privacyAcceptedAt)}
            </span>
          </div>
        </div>
      </Section>

      {/* 4.3 + 4.4 Delete account */}
      <Section title={isMinor ? 'Delete My Account (Minor)' : 'Delete My Account'}>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 14 }}>
          Request permanent deletion of your account and all associated data.
          This action is irreversible and will take effect within 30 days.
          {isMinor && ' As a minor user, a parent or guardian may also request this on your behalf by emailing privacy@neumm.com.au.'}
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            padding: '10px 20px', borderRadius: 10,
            border: '1.5px solid #EF4444', background: 'transparent',
            color: '#EF4444', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Request account deletion →
        </button>
      </Section>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: '28px 24px',
            maxWidth: 420, width: '100%', fontFamily: "'Nunito', sans-serif",
          }}>
            <h3 style={{ color: '#DC2626', fontWeight: 900, fontSize: 18, marginBottom: 12, marginTop: 0 }}>
              Confirm Account Deletion
            </h3>
            <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Are you sure? This will permanently delete your account, all learning data, XP, streak, and progress within 30 days. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => void handleDeleteAccount()}
                style={{
                  flex: 1, padding: '11px', borderRadius: 10,
                  border: 'none', background: '#DC2626', color: 'white',
                  fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Yes, delete my account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1, padding: '11px', borderRadius: 10,
                  border: '1.5px solid #E5E7EB', background: 'transparent',
                  color: '#6B7280', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid #F3F4F6' }}>
      <h3 style={{ color: '#0D3349', fontWeight: 900, fontSize: 16, marginBottom: 12, marginTop: 0 }}>
        {title}
      </h3>
      {children}
    </div>
  )
}
