'use client'

import { useState, useEffect }  from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { acceptLegalVersion }    from '@/lib/actions/compliance'
import ConsentCheckboxes         from '@/components/auth/ConsentCheckboxes'

/**
 * /auth/reaccept — shown when terms/privacy versions are outdated.
 * User must re-accept before accessing the dashboard.
 */
export default function ReacceptPage() {
  const BASE = '/math-nsw/app'

  const [userId,         setUserId]         = useState<string | null>(null)
  const [consentChecked, setConsentChecked] = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = `${BASE}/auth/signup`
        return
      }
      setUserId(user.id)
    })
  }, [])

  async function handleAccept() {
    if (!userId || !consentChecked) return
    setLoading(true)
    setError(null)

    try {
      const termsVersion   = process.env.NEXT_PUBLIC_CURRENT_TERMS_VERSION   ?? '1.0'
      const privacyVersion = process.env.NEXT_PUBLIC_CURRENT_PRIVACY_VERSION ?? '1.0'

      // Use Server Action so the update runs with a valid server-side session
      // and is guaranteed to persist before we navigate away.
      await acceptLegalVersion(userId, termsVersion, privacyVersion)

      // Full page navigation (not router.replace) so middleware re-reads the
      // DB with fresh data and doesn't bounce back to /auth/reaccept.
      window.location.href = `${BASE}/dashboard`
    } catch {
      setError('Failed to save. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Nunito', sans-serif", background: '#F9FAFB',
    }}>
      <div style={{
        maxWidth: 480, width: '100%',
        background: 'white', borderRadius: 20, padding: '36px 32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg,#185FA5,#2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900, fontSize: 20,
            margin: '0 auto 12px',
          }}>
            N
          </div>
          <h2 style={{ color: '#0D3349', fontWeight: 900, fontSize: 22, marginBottom: 8, marginTop: 0 }}>
            Updated Terms &amp; Privacy Policy
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Our Terms and Conditions and Privacy Policy have been updated. Please review and accept the new versions to continue using Neumm.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <a
            href="/math-nsw/app/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, minWidth: 120, padding: '10px 16px',
              borderRadius: 10, border: '1.5px solid #BFDBFE',
              background: '#EFF6FF', color: '#1D4ED8',
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
              textAlign: 'center', display: 'block',
            }}
          >
            Terms & Conditions →
          </a>
          <a
            href="/math-nsw/app/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, minWidth: 120, padding: '10px 16px',
              borderRadius: 10, border: '1.5px solid #BFDBFE',
              background: '#EFF6FF', color: '#1D4ED8',
              fontWeight: 700, fontSize: 13, textDecoration: 'none',
              textAlign: 'center', display: 'block',
            }}
          >
            Privacy Policy →
          </a>
        </div>

        <ConsentCheckboxes checked={consentChecked} onChange={setConsentChecked} />

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', fontSize: 13, color: '#B91C1C', marginTop: 12,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={() => void handleAccept()}
          disabled={!consentChecked || loading || !userId}
          style={{
            marginTop: 16, width: '100%', padding: '13px', borderRadius: 12,
            border: 'none', background: '#185FA5', color: 'white',
            fontWeight: 900, fontSize: 14, cursor: 'pointer',
            opacity: consentChecked && !loading ? 1 : 0.5,
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Saving…' : 'Accept and Continue →'}
        </button>
      </div>
    </div>
  )
}
