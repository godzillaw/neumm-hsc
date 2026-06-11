'use client'

import { useEffect } from 'react'

export default function AttemptError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AttemptError]', error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F3FF', fontFamily: "'Nunito',sans-serif", padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontWeight: 900, fontSize: 18, color: '#111', marginBottom: 8 }}>Something went wrong</p>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8, wordBreak: 'break-word' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.digest && (
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>Error ID: {error.digest}</p>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ padding: '10px 20px', borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer' }}
          >
            Try again
          </button>
          <a
            href="/math-nsw/app/exam"
            style={{ padding: '10px 20px', borderRadius: 14, background: 'white', color: '#7C3AED', fontWeight: 900, fontSize: 14, border: '2px solid #DDD6FE', textDecoration: 'none' }}
          >
            ← Back to Exam
          </a>
        </div>
      </div>
    </div>
  )
}
