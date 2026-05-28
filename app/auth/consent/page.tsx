'use client'

import { useState, useEffect } from 'react'
import { useRouter }            from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import ConsentCheckboxes from '@/components/auth/ConsentCheckboxes'
import AgeGate           from '@/components/auth/AgeGate'
import MinorConsentNotice from '@/components/auth/MinorConsentNotice'

/**
 * /auth/consent — shown after Google OAuth for users who haven't yet
 * accepted terms (terms_accepted_at is null in users table).
 */
export default function ConsentPage() {
  const router = useRouter()
  const BASE   = '/math-nsw/app'

  const [userId,         setUserId]         = useState<string | null>(null)
  const [userEmail,      setUserEmail]      = useState<string | null>(null)
  const [step,           setStep]           = useState<'age-gate' | 'consent'>('age-gate')
  const [birthYear,      setBirthYear]      = useState<number | null>(null)
  const [isMinor,        setIsMinor]        = useState(false)
  const [under13,        setUnder13]        = useState(false)
  const [showMinorModal, setShowMinorModal] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = `${BASE}/auth/login`
        return
      }
      setUserId(user.id)
      setUserEmail(user.email ?? null)

      // Check if already has terms accepted
      supabase.from('users')
        .select('terms_accepted_at')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.terms_accepted_at) {
            // Already accepted — go to dashboard
            router.replace('/dashboard')
          }
        })
    })
  }, [router])

  function handleAgeComplete(year: number, minor: boolean) {
    setBirthYear(year)
    setIsMinor(minor)
    setStep('consent')
  }

  function handleConsentChange(checked: boolean) {
    if (checked && isMinor) {
      setShowMinorModal(true)
    } else {
      setConsentChecked(checked)
    }
  }

  async function handleAccept() {
    if (!userId || !consentChecked) return
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const now = new Date().toISOString()

      const update: Record<string, unknown> = {
        terms_accepted_at:   now,
        terms_version:       '1.0',
        privacy_accepted_at: now,
        privacy_version:     '1.0',
      }
      if (birthYear != null) update.birth_year = birthYear
      if (isMinor != null)   update.is_minor   = isMinor
      if (isMinor)           update.minor_guardian_confirmed = true

      const { error: updateErr } = await supabase
        .from('users')
        .update(update)
        .eq('id', userId)

      if (updateErr) {
        setError('Failed to save consent. Please try again.')
        setLoading(false)
        return
      }

      router.replace('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (under13) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#0D3349', fontWeight: 900, fontSize: 20, marginBottom: 12, marginTop: 0 }}>Age Restriction</h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7 }}>
            Neumm is not available to users under 13. Contact{' '}
            <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5', fontWeight: 700 }}>support@neumm.com.au</a>{' '}
            if this is an error.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Nunito', sans-serif", background: '#F9FAFB' }}>
      <div style={{ maxWidth: 480, width: '100%', background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#185FA5,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 20, margin: '0 auto 12px' }}>
            N
          </div>
          <h2 style={{ color: '#0D3349', fontWeight: 900, fontSize: 22, marginBottom: 6, marginTop: 0 }}>
            Almost there, {userEmail?.split('@')[0]}!
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Before you can use Neumm, we need your age and agreement to our terms.
          </p>
        </div>

        {step === 'age-gate' && (
          <AgeGate onComplete={handleAgeComplete} onUnder13={() => setUnder13(true)} />
        )}

        {step === 'consent' && (
          <div>
            {isMinor && (
              <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#92400E', fontWeight: 700 }}>
                Under-18 account — parent/guardian consent required
              </div>
            )}

            <ConsentCheckboxes checked={consentChecked} onChange={handleConsentChange} />

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#B91C1C', marginTop: 12 }}>
                {error}
              </div>
            )}

            <button
              onClick={() => void handleAccept()}
              disabled={!consentChecked || loading}
              style={{
                marginTop: 16, width: '100%', padding: '13px', borderRadius: 12,
                border: 'none', background: '#185FA5', color: 'white',
                fontWeight: 900, fontSize: 14, cursor: 'pointer',
                opacity: consentChecked && !loading ? 1 : 0.5,
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Saving…' : 'Continue to Neumm →'}
            </button>
          </div>
        )}
      </div>

      {showMinorModal && (
        <MinorConsentNotice
          onConfirm={() => { setShowMinorModal(false); setConsentChecked(true) }}
          onCancel={() => { setShowMinorModal(false); setConsentChecked(false) }}
        />
      )}
    </div>
  )
}
