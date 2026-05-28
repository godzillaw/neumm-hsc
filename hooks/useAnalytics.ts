'use client'

import { useEffect, useRef } from 'react'

const CONSENT_KEY = 'neumm_cookie_consent'

interface ConsentData {
  accepted: boolean
  timestamp: string
  version: string
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return false
    const data = JSON.parse(stored) as ConsentData
    return data.accepted === true
  } catch {
    return false
  }
}

export function useAnalytics() {
  const hasConsent = useRef(hasAnalyticsConsent())

  useEffect(() => {
    function handleConsent() {
      hasConsent.current = true
    }
    window.addEventListener('cookie-consent-accepted', handleConsent)
    return () => window.removeEventListener('cookie-consent-accepted', handleConsent)
  }, [])

  function trackEvent(name: string, properties?: Record<string, unknown>) {
    if (!hasConsent.current) return
    // In production, send to analytics provider
    // For now, log to console in dev
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', name, properties)
    }
    // GA4 gtag integration (if GA is configured)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as { gtag: (...args: unknown[]) => void }).gtag('event', name, properties ?? {})
    }
  }

  return { trackEvent }
}
