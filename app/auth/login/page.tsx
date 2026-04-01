'use client'

import { useState }                        from 'react'
import Link                                from 'next/link'
import { useRouter }                       from 'next/navigation'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    const { error } = await signInWithEmail(email, password)
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }  // basePath prepended automatically by Next.js
  }

  async function handleGoogleLogin() {
    setError(null); setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #F7F3FF 0%, #FDF2F8 50%, #F0FDF4 100%)' }}>
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>N</div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Ready to crush some HSC prep?</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-7">

          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[48px]">
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-gray-300" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/auth/reset-password" className="text-xs font-medium" style={{ color: '#7C3AED' }}>
                  Forgot?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-gray-300" />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">{error}</div>
            )}

            <button type="submit" disabled={loading || googleLoading}
              className="btn-gradient w-full py-3 rounded-2xl text-sm font-black min-h-[48px]">
              {loading ? <span className="flex items-center justify-center gap-2"><Spinner light />Signing in…</span> : 'Sign in ✨'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            No account?{' '}
            <Link href="/auth/signup" className="font-black" style={{ color: '#7C3AED' }}>
              Start free trial 🚀
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
function Spinner({ light = false }: { light?: boolean }) {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={light ? 'white' : 'currentColor'} strokeWidth="4"/>
      <path className="opacity-75" fill={light ? 'white' : 'currentColor'} d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}
