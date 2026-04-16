'use client'

import { useState }                 from 'react'
import Link                         from 'next/link'
import { useRouter }                from 'next/navigation'
import { signUp, signInWithGoogle } from '@/lib/auth'

// ─── Feature bullets (left panel) ─────────────────────────────────────────────
const FEATURES = [
  {
    emoji: '🗺️',
    title: 'Personalised mastery map',
    desc:  'A placement probe finds your exact gaps in 8 questions. No guessing what to study.',
  },
  {
    emoji: '🤖',
    title: 'AI tutor in your corner',
    desc:  'Socratic hints, step-by-step solutions and exam simulation — available 24/7.',
  },
  {
    emoji: '📈',
    title: 'Predict your band before exam day',
    desc:  'Real-time band prediction updates after every session so you always know your trajectory.',
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter()

  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [success,       setSuccess]       = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)

    const displayName = `${firstName} ${lastName}`.trim()
    const { data, error: err } = await signUp(email, password, displayName)
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user && !data.session) { setSuccess(true); setLoading(false) }
    else { router.push('/onboarding/intent'); router.refresh() }
  }

  async function handleGoogle() {
    setError(null); setGoogleLoading(true)
    const { error: err } = await signInWithGoogle()
    if (err) { setError(err.message); setGoogleLoading(false) }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#F0F7FF', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-xl text-center p-10 max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ backgroundColor: '#E6F1FB' }}>🎉</div>
          <h2 className="text-2xl font-black mb-2 text-gray-900">Check your email!</h2>
          <p className="text-sm font-medium text-gray-500 mb-6">
            We sent a confirmation link to{' '}
            <strong className="text-gray-900">{email}</strong>.
            Click it to activate your account and start your free trial.
          </p>
          <Link href="/auth/login"
            className="inline-block px-6 py-3 rounded-2xl text-sm font-black text-white"
            style={{ backgroundColor: '#185FA5' }}>
            Back to sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0C2D5A 0%, #185FA5 60%, #1E7BC4 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-10"
          style={{ border: '2px solid white' }} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full opacity-10"
          style={{ border: '2px solid white' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10"
          style={{ border: '2px solid white' }} />
        <div className="absolute bottom-[80px] right-[-100px] w-80 h-80 rounded-full opacity-10"
          style={{ border: '2px solid white' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
            N
          </div>
          <div>
            <p className="font-black text-white text-lg leading-none">Neumm</p>
            <p className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              HSC Mathematics
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <p className="text-xs font-black uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            ● Adaptive learning platform
          </p>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Your HSC band<br />
            <span style={{ color: '#7EC8F4' }}>starts here.</span>
          </h1>
          <p className="text-base font-medium mb-10"
            style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 380 }}>
            Know exactly where you stand — and the fastest path to where you want to be.
          </p>

          {/* Feature bullets */}
          <div className="space-y-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  {f.emoji}
                </div>
                <div>
                  <p className="font-black text-white text-sm">{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © 2025 Neumm. Built for Australian HSC students.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-black text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold" style={{ color: '#185FA5' }}>
                Log in here
              </Link>
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border transition-all disabled:opacity-50 mb-5 min-h-[48px]"
            style={{ borderColor: '#E5E7EB', backgroundColor: '#FAFAFA', color: '#374151' }}
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* First + Last name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">First name</label>
                <input
                  type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  required placeholder="Alex" autoComplete="given-name"
                  className="w-full px-3.5 py-3 text-sm rounded-xl border outline-none transition-all"
                  style={{ borderColor: '#E5E7EB', fontFamily: 'inherit' }}
                  onFocus={e => (e.target.style.borderColor = '#185FA5')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Last name</label>
                <input
                  type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  required placeholder="Chen" autoComplete="family-name"
                  className="w-full px-3.5 py-3 text-sm rounded-xl border outline-none transition-all"
                  style={{ borderColor: '#E5E7EB', fontFamily: 'inherit' }}
                  onFocus={e => (e.target.style.borderColor = '#185FA5')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="alex@email.com" autoComplete="email"
                className="w-full px-3.5 py-3 text-sm rounded-xl border outline-none transition-all"
                style={{ borderColor: '#E5E7EB', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = '#185FA5')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={8} placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-3 pr-11 text-sm rounded-xl border outline-none transition-all"
                  style={{ borderColor: '#E5E7EB', fontFamily: 'inherit' }}
                  onFocus={e => (e.target.style.borderColor = '#185FA5')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm rounded-xl px-4 py-3 font-semibold text-red-700 bg-red-50 border border-red-200">
                {error}
              </div>
            )}

            {/* Free trial badge */}
            <div className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 border"
              style={{ backgroundColor: '#F0FFF4', borderColor: '#BBF7D0' }}>
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm font-bold text-green-800">
                7-day free trial — no credit card required
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98] disabled:opacity-50 min-h-[50px]"
              style={{ backgroundColor: '#185FA5' }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><Spinner light />Creating account…</span>
                : 'Create my account →'}
            </button>

            {/* Legal */}
            <p className="text-xs text-center text-gray-400 leading-relaxed">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="font-semibold text-gray-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="font-semibold text-gray-600 hover:underline">Privacy Policy</Link>.
              <br />
              Your data is stored securely in Australia and never sold to third parties.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={light ? 'white' : '#185FA5'} strokeWidth="4" />
      <path className="opacity-75" fill={light ? 'white' : '#185FA5'} d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
