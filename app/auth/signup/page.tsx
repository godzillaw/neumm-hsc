'use client'

import { useState }                    from 'react'
import Link                            from 'next/link'
import { useRouter }                   from 'next/navigation'
import { signUp, signInWithGoogle }    from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [displayName,   setDisplayName]   = useState('')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [success,       setSuccess]       = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault(); setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { data, error } = await signUp(email, password, displayName)
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user && !data.session) { setSuccess(true); setLoading(false) }
    else { router.push('/onboarding/intent'); router.refresh() }
  }

  async function handleGoogleSignup() {
    setError(null); setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#FFFBF0', fontFamily: "'Nunito', sans-serif" }}>
        <div className="rounded-3xl shadow-xl text-center p-10 max-w-sm w-full animate-pop-in"
          style={{ background: '#FFFFFF', border: '1.5px solid #F0E980' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: '#FFDA00' }}>🎉</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#0F0F14' }}>You&apos;re in!</h2>
          <p className="text-sm font-semibold mb-6" style={{ color: '#666672' }}>
            Check <strong style={{ color: '#0F0F14' }}>{email}</strong> for a confirmation link, then start your free trial!
          </p>
          <Link href="/auth/login"
            className="inline-block px-6 py-2.5 rounded-2xl text-sm font-black"
            style={{ background: '#FFDA00', color: '#0F0F14' }}>
            Back to sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: '#FFFBF0', fontFamily: "'Nunito', sans-serif" }}>

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-25"
          style={{ background: '#FFDA00', filter: 'blur(70px)' }} />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: '#FF6B35', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-[400px] relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl"
              style={{ background: '#FFDA00', color: '#0F0F14', boxShadow: '0 8px 32px rgba(255,218,0,0.5)' }}>
              N
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#FFFBF0]"
              style={{ background: '#FF6B35' }} />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0F0F14' }}>
            Start for free 🚀
          </h1>
          <p className="text-sm mt-1 font-semibold" style={{ color: '#666672' }}>
            7 days free — no card needed
          </p>
        </div>

        <div className="rounded-3xl p-7 shadow-xl"
          style={{ background: '#FFFFFF', border: '1.5px solid #F0E980' }}>

          {/* Trial badge */}
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-5"
            style={{ background: '#FFFBF0', border: '1.5px solid #F0E980' }}>
            <span className="text-lg">⭐</span>
            <span className="text-xs font-extrabold" style={{ color: '#0F0F14' }}>
              Full access free for 7 days — then from $29.99/mo
            </span>
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignup} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 min-h-[50px]"
            style={{ background: '#0F0F14', color: '#FFFFFF', border: 'none' }}>
            {googleLoading ? <Spinner light /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#F0E980' }} />
            <span className="text-xs font-bold" style={{ color: '#999' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#F0E980' }} />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-extrabold mb-1.5" style={{ color: '#0F0F14' }}>Your name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required
                placeholder="Alex Smith"
                className="w-full px-4 py-3 text-sm rounded-2xl outline-none transition-all placeholder:text-gray-300"
                style={{ background: '#FFFBF0', border: '1.5px solid #F0E980', color: '#0F0F14', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#FFDA00')}
                onBlur={e => (e.target.style.borderColor = '#F0E980')} />
            </div>
            <div>
              <label className="block text-sm font-extrabold mb-1.5" style={{ color: '#0F0F14' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-sm rounded-2xl outline-none transition-all placeholder:text-gray-300"
                style={{ background: '#FFFBF0', border: '1.5px solid #F0E980', color: '#0F0F14', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#FFDA00')}
                onBlur={e => (e.target.style.borderColor = '#F0E980')} />
            </div>
            <div>
              <label className="block text-sm font-extrabold mb-1.5" style={{ color: '#0F0F14' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                placeholder="8+ characters"
                className="w-full px-4 py-3 text-sm rounded-2xl outline-none transition-all placeholder:text-gray-300"
                style={{ background: '#FFFBF0', border: '1.5px solid #F0E980', color: '#0F0F14', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#FFDA00')}
                onBlur={e => (e.target.style.borderColor = '#F0E980')} />
            </div>

            {error && (
              <div className="text-sm rounded-2xl px-4 py-3 font-semibold"
                style={{ color: '#CC2200', background: '#FFF0EE', border: '1px solid #FFCDC8' }}>{error}</div>
            )}

            <button type="submit" disabled={loading || googleLoading}
              className="btn-gradient w-full py-3.5 rounded-2xl text-sm min-h-[50px] font-black">
              {loading
                ? <span className="flex items-center justify-center gap-2"><Spinner />Creating account…</span>
                : 'Create free account 🎉'}
            </button>

            <p className="text-xs font-semibold text-center" style={{ color: '#999' }}>
              By signing up you agree to our{' '}
              <Link href="/terms" className="underline" style={{ color: '#666672' }}>Terms</Link> &amp;{' '}
              <Link href="/privacy" className="underline" style={{ color: '#666672' }}>Privacy Policy</Link>.
            </p>
          </form>

          <p className="mt-5 text-center text-sm font-bold" style={{ color: '#666672' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-black"
              style={{ color: '#0F0F14', textDecoration: 'underline', textDecorationColor: '#FFDA00', textUnderlineOffset: '3px' }}>
              Sign in
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
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={light ? 'white' : '#0F0F14'} strokeWidth="4"/>
      <path className="opacity-75" fill={light ? 'white' : '#0F0F14'} d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}
