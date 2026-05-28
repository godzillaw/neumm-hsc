'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const CONSENT_KEY = 'neumm_cookie_consent'
const CONSENT_VERSION = '1.0'

interface ConsentData {
  accepted: boolean
  timestamp: string
  version: string
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if consent already given
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored) return

    // Check if user is under 16 — auto Essential Only
    async function checkMinorStatus() {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('users')
            .select('birth_year')
            .eq('id', user.id)
            .single()
          if (data?.birth_year) {
            const age = new Date().getFullYear() - (data.birth_year as number)
            if (age < 16) {
              // Auto set Essential Only for under-16
              saveConsent(false)
              return
            }
          }
        }
      } catch {
        // If we can't determine, show banner anyway
      }
      setVisible(true)
    }

    void checkMinorStatus()
  }, [])

  function saveConsent(accepted: boolean) {
    const consentData: ConsentData = {
      accepted,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData))
    if (accepted) {
      window.dispatchEvent(new Event('cookie-consent-accepted'))
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#0D3349',
        color: 'white',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, flex: '1 1 280px', color: 'rgba(255,255,255,0.85)' }}>
        We use cookies to keep you logged in and improve your experience.{' '}
        <Link href="/legal/cookies" style={{ color: '#7EC8F4', fontWeight: 700 }}>
          Learn more →
        </Link>
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => saveConsent(false)}
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            border: '1.5px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.75)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Essential Only
        </button>
        <button
          onClick={() => saveConsent(true)}
          style={{
            padding: '8px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#006D77',
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
