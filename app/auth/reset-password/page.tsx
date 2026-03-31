'use client'

import { useState }                    from 'react'
import Link                            from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import NeummLogo                       from '@/components/NeummLogo'

export default function ResetPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const BASE_PATH = '/math-nsw/app'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase    = createSupabaseBrowserClient()
    const redirectTo  = `${window.location.origin}${BASE_PATH}/auth/update-password`
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <NeummLogo size={48} />
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <Link href="/auth/login" className="text-sm text-[#185FA5] font-medium hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Forgot password?</h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white min-h-[44px] disabled:opacity-60"
                style={{ backgroundColor: '#185FA5' }}
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              <Link href="/auth/login" className="text-[#185FA5] font-medium hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
