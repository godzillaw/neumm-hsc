'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import NeummLogo from '@/components/NeummLogo'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      setError(errorDescription ?? errorParam)
      return
    }

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            setError(error.message)
          } else {
            router.replace('/dashboard')
          }
        })
    } else {
      // Hash-based / implicit flow — Supabase handles this via onAuthStateChange
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.replace('/dashboard')
        } else {
          setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                router.replace('/dashboard')
              } else {
                setError('Authentication failed. Please try again.')
              }
            })
          }, 1500)
        }
      })
    }
  }, [router, searchParams])

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center w-full max-w-[400px]">
        <div className="flex justify-center mb-4">
          <NeummLogo size={48} />
        </div>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign-in failed</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <a
          href="/auth/login"
          className="inline-block px-6 py-2.5 text-sm font-semibold text-white rounded-lg"
          style={{ backgroundColor: '#185FA5' }}
        >
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <NeummLogo size={48} />
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <svg className="animate-spin h-4 w-4 text-[#185FA5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Signing you in…
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] px-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <NeummLogo size={48} />
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="animate-spin h-4 w-4 text-[#185FA5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Signing you in…
            </div>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  )
}
