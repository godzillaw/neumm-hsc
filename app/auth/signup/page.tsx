'use client'

import { useState }                   from 'react'
import { signInWithGoogle }            from '@/lib/auth'
import { signUpAction }                from '@/app/actions/auth'
import AgeGate                         from '@/components/auth/AgeGate'
import ConsentCheckboxes               from '@/components/auth/ConsentCheckboxes'
import MinorConsentNotice              from '@/components/auth/MinorConsentNotice'

// ─── Feature bullets (left panel) ─────────────────────────────────────────────
const FEATURES = [
  {
    emoji: '🗺️',
    title: 'Personalised to your level — adaptive learning',
    desc:  'Get more advanced in the maths topics you choose with questions that adapt to your level.',
  },
  {
    emoji: '👩‍🏫',
    title: '24/7 digital tutor with you',
    desc:  'Your 24/7 AI tutor gives step-by-step solutions, clear explanations, and answers your questions instantly — so you actually understand, not just memorise.',
  },
  {
    emoji: '📈',
    title: 'Exam mode built for your Math success',
    desc:  'Choose specific topics to practise or run full HSC-style mock exams. Train under real exam conditions and focus exactly where you need to improve.',
  },
]

type Step = 'age-gate' | 'form'

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [step,           setStep]           = useState<Step>('age-gate')
  const [birthYear,      setBirthYear]      = useState<number | null>(null)
  const [isMinor,        setIsMinor]        = useState(false)
  const [under13,        setUnder13]        = useState(false)
  const [showMinorModal, setShowMinorModal] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  // ── Age gate handlers ─────────────────────────────────────────────────────
  function handleAgeComplete(year: number, minor: boolean) {
    setBirthYear(year)
    setIsMinor(minor)
    setStep('form')
  }

  function handleUnder13() {
    setUnder13(true)
  }

  // ── Consent checkbox handler ──────────────────────────────────────────────
  function handleConsentChange(checked: boolean) {
    if (checked && isMinor) {
      setShowMinorModal(true)
    } else {
      setConsentChecked(checked)
    }
  }

  function handleMinorConfirm() {
    setShowMinorModal(false)
    setConsentChecked(true)
  }

  function handleMinorCancel() {
    setShowMinorModal(false)
    setConsentChecked(false)
  }

  // ── Signup ────────────────────────────────────────────────────────────────
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!consentChecked) { setError('Please agree to the Terms and Privacy Policy.'); return }
    setLoading(true)

    try {
      const now = new Date().toISOString()
      // Server Action: creates user + signs in via cookies() from next/headers.
      // This is the only pattern that guarantees session cookies are committed
      // before window.location.href fires on Vercel.
      const result = await signUpAction({
        email,
        password,
        displayName: `${firstName} ${lastName}`.trim(),
        birthYear,
        isMinor,
        termsAcceptedAt:        now,
        termsVersion:           '1.0',
        privacyAcceptedAt:      now,
        privacyVersion:         '1.0',
        minorGuardianConfirmed: isMinor ? true : null,
        ip:                     null,
      })

      if (!result.ok) {
        setError(result.error)
        setLoading(false)
        return
      }

      // cookies() mutations are applied by Next.js before this line runs.
      // window.location.href triggers a full navigation — middleware finds
      // the session and allows access to the destination.
      window.location.href = result.redirect
    } catch (err) {
      console.error('[signup] unexpected error:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    if (!consentChecked) {
      setError('Please agree to the Terms and Privacy Policy before continuing.')
      return
    }
    setGoogleLoading(true)
    const { error: err } = await signInWithGoogle('/onboarding/year')
    if (err) { setError(err.message); setGoogleLoading(false) }
  }

  // ── Under-13 screen ───────────────────────────────────────────────────────
  if (under13) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#0D3349', fontWeight: 900, fontSize: 20, marginBottom: 12, marginTop: 0 }}>
            Age Restriction
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Neumm is not available to users under 13 years of age.
            Contact{' '}
            <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5', fontWeight: 700 }}>
              support@neumm.com.au
            </a>{' '}
            if this is an error.
          </p>
          <button
            onClick={() => setUnder13(false)}
            style={{ color: '#185FA5', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
            ← Back to sign up
          </button>
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
              Math Year 9 - 12
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
            Your Math<br />
            <span style={{ color: '#7EC8F4' }}>Companion.</span>
          </h1>
          <p className="text-base font-medium mb-10"
            style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 380 }}>
            Helping you in your Math journey.
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
          © 2026 Caplix Pty Ltd. Built for Australian HSC students.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* ── STEP 1: AGE GATE ── */}
          {step === 'age-gate' && (
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-black text-gray-900">Create your account</h2>
                <p className="text-sm text-gray-500 mt-1">First, let&apos;s verify your age.</p>
              </div>
              <AgeGate onComplete={handleAgeComplete} onUnder13={handleUnder13} />
            </>
          )}

          {/* ── STEP 2: SIGNUP FORM ── */}
          {step === 'form' && (
            <>
              {/* Heading */}
              <div className="mb-7">
                <h2 className="text-2xl font-black text-gray-900">Create your account</h2>
              </div>

              {/* Minor badge */}
              {isMinor && (
                <div className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 border"
                  style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}>
                  <span className="text-base">👶</span>
                  <span className="text-sm font-bold text-orange-700">
                    Under-18 account — parent/guardian consent required
                  </span>
                </div>
              )}

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={googleLoading || loading || !consentChecked}
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

                {/* Consent checkbox */}
                <ConsentCheckboxes checked={consentChecked} onChange={handleConsentChange} />

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
                  disabled={loading || googleLoading || !consentChecked}
                  className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98] disabled:opacity-50 min-h-[50px]"
                  style={{ backgroundColor: '#185FA5' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><Spinner light />Creating account…</span>
                    : 'Create my account →'}
                </button>

                <p className="text-xs text-center text-gray-400 leading-relaxed">
                  Your data is stored securely in Australia and never sold to third parties.
                </p>
                <p className="text-xs text-center text-gray-400 mt-3">
                  By using Neumm you agree to our{' '}
                  <a href="/math-nsw/app/legal/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5', fontWeight: 600 }}>Terms &amp; Conditions</a>
                  {' '}and{' '}
                  <a href="/math-nsw/app/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5', fontWeight: 600 }}>Privacy Policy</a>.
                </p>
              </form>

            </>
          )}
        </div>
      </div>

      {/* Minor consent modal */}
      {showMinorModal && (
        <MinorConsentNotice onConfirm={handleMinorConfirm} onCancel={handleMinorCancel} />
      )}
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
