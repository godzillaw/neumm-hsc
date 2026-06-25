'use client'

import { useState }              from 'react'
import { signInWithGoogle }      from '@/lib/auth'
import { signUpAction }          from '@/app/actions/auth'
import MinorConsentNotice        from '@/components/auth/MinorConsentNotice'

// ─── Age gate months ──────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

type Step = 'age-gate' | 'form'

export default function SignupPage() {
  const [step,           setStep]           = useState<Step>('age-gate')
  const [birthYear,      setBirthYear]      = useState<number | null>(null)
  const [isMinor,        setIsMinor]        = useState(false)
  const [under13,        setUnder13]        = useState(false)
  const [showMinorModal, setShowMinorModal] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  // Age gate fields
  const [day,   setDay]   = useState('')
  const [month, setMonth] = useState('')
  const [year,  setYear]  = useState('')
  const [ageError, setAgeError] = useState<string | null>(null)

  // Form fields
  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 96 }, (_, i) => currentYear - 5 - i)
  const daysInMonth = month && year ? new Date(parseInt(year), parseInt(month), 0).getDate() : 31
  const dayOptions  = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // ── Age gate ──────────────────────────────────────────────────────────────
  function handleAgeSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAgeError(null)
    const d = parseInt(day), m = parseInt(month), y = parseInt(year)
    if (!d || !m || !y) { setAgeError('Please select your full date of birth.'); return }
    const dob = new Date(y, m - 1, d)
    if (dob.getDate() !== d || dob.getMonth() !== m - 1) { setAgeError('Please enter a valid date.'); return }
    let age = currentYear - y
    const hadBirthday = new Date().getMonth() + 1 > m || (new Date().getMonth() + 1 === m && new Date().getDate() >= d)
    if (!hadBirthday) age--
    if (age < 13) { setUnder13(true); return }
    setBirthYear(y); setIsMinor(age < 18); setStep('form')
  }

  // ── Consent ───────────────────────────────────────────────────────────────
  function handleConsentChange(checked: boolean) {
    if (checked && isMinor) { setShowMinorModal(true) }
    else { setConsentChecked(checked) }
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
      const result = await signUpAction({
        email, password,
        displayName: `${firstName} ${lastName}`.trim(),
        birthYear, isMinor,
        termsAcceptedAt: now, termsVersion: '1.0',
        privacyAcceptedAt: now, privacyVersion: '1.0',
        minorGuardianConfirmed: isMinor ? true : null,
        ip: null,
      })
      if (!result.ok) { setError(result.error); setLoading(false); return }
      window.location.href = result.redirect
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    if (!consentChecked) { setError('Please agree to the Terms and Privacy Policy before continuing.'); return }
    setGoogleLoading(true)
    const { error: err } = await signInWithGoogle('/onboarding/year')
    if (err) { setError(err.message); setGoogleLoading(false) }
  }

  // ── Under-13 screen ───────────────────────────────────────────────────────
  if (under13) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: 20, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Age Restriction
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Neumm is not available to users under 13 years of age.<br />
            Contact{' '}
            <a href="mailto:support@neumm.com.au" style={{ color: '#818CF8', fontWeight: 600 }}>support@neumm.com.au</a>
            {' '}if this is an error.
          </p>
          <button onClick={() => setUnder13(false)}
            style={{ color: '#818CF8', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Back to sign up
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell wide={step === 'form'}>
      {/* ── STEP 1: AGE GATE ── */}
      {step === 'age-gate' && (
        <>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 6, marginTop: 0 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
            Already have an account?{' '}
            <a href="/math-nsw/app/auth/login" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>Sign in →</a>
          </p>

          {/* Age gate form */}
          <form onSubmit={handleAgeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 10, letterSpacing: '0.02em' }}>
                DATE OF BIRTH
              </label>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 14, marginTop: -4, lineHeight: 1.5 }}>
                We need to verify your age to comply with our eligibility requirements.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 10 }}>
                {[
                  { label: 'Day', value: day, setter: setDay, options: dayOptions.map(d => ({ v: String(d), l: String(d) })) },
                  { label: 'Month', value: month, setter: setMonth, options: MONTHS.map((m, i) => ({ v: String(i+1), l: m })) },
                  { label: 'Year', value: year, setter: setYear, options: yearOptions.map(y => ({ v: String(y), l: String(y) })) },
                ].map(sel => (
                  <div key={sel.label}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{sel.label}</label>
                    <select value={sel.value} onChange={e => sel.setter(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 10px', fontSize: 14, borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: sel.value ? 'white' : 'rgba(255,255,255,0.3)',
                        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                      }}>
                      <option value="" style={{ background: '#1a1a2e' }}>{sel.label}</option>
                      {sel.options.map(o => <option key={o.v} value={o.v} style={{ background: '#1a1a2e' }}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {ageError && <ErrorBox>{ageError}</ErrorBox>}

            <button type="submit" style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white',
              fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: '0 4px 24px rgba(99,102,241,0.45)', letterSpacing: '-0.01em',
            }}>
              Continue →
            </button>
          </form>
        </>
      )}

      {/* ── STEP 2: SIGNUP FORM ── */}
      {step === 'form' && (
        <>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 6, marginTop: 0 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
            Already have an account?{' '}
            <a href="/math-nsw/app/auth/login" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>Sign in →</a>
          </p>

          {/* Minor badge */}
          {isMinor && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', marginBottom: 20 }}>
              <span>👶</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#FCD34D' }}>Under-18 account — parent/guardian consent required</span>
            </div>
          )}

          {/* Free trial badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#34D399' }}>7-day free trial — no credit card required</span>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading || loading || !consentChecked}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', marginBottom: 20, minHeight: 48, fontFamily: 'inherit',
              opacity: (googleLoading || loading || !consentChecked) ? 0.5 : 1, transition: 'all 0.2s',
            }}>
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'FIRST NAME', value: firstName, setter: setFirstName, placeholder: 'Alex', autoComplete: 'given-name' },
                { label: 'LAST NAME',  value: lastName,  setter: setLastName,  placeholder: 'Chen', autoComplete: 'family-name' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, letterSpacing: '0.02em' }}>{f.label}</label>
                  <input type="text" value={f.value} onChange={e => f.setter(e.target.value)}
                    required placeholder={f.placeholder} autoComplete={f.autoComplete}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="alex@email.com" autoComplete="email"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={8} placeholder="At least 8 characters" autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0, display: 'flex' }}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Consent */}
            <label style={{
              display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${consentChecked ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
              transition: 'border-color 0.15s',
            }}>
              <input type="checkbox" checked={consentChecked} onChange={e => handleConsentChange(e.target.checked)}
                style={{ marginTop: 2, accentColor: '#818CF8', flexShrink: 0, width: 15, height: 15, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                I agree to Neumm&apos;s{' '}
                <a href="/math-nsw/app/legal/terms" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>Terms and Conditions</a>
                {' '}and{' '}
                <a href="/math-nsw/app/legal/privacy" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.
                {isMinor && ' If I am under 18, I confirm my parent or guardian has agreed on my behalf.'}
              </span>
            </label>

            {error && <ErrorBox>{error}</ErrorBox>}

            <button type="submit" disabled={loading || googleLoading || !consentChecked}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white',
                fontSize: 15, fontWeight: 700, fontFamily: 'inherit', minHeight: 50,
                boxShadow: '0 4px 24px rgba(99,102,241,0.45)', letterSpacing: '-0.01em',
                opacity: (loading || googleLoading || !consentChecked) ? 0.5 : 1, transition: 'all 0.2s',
              }}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner light />Creating account…</span>
                : 'Create my account →'}
            </button>

            <p style={{ fontSize: 12, textAlign: 'center', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, margin: 0 }}>
              Your data is stored securely in Australia and never sold to third parties.
            </p>
          </form>
        </>
      )}

      {showMinorModal && (
        <MinorConsentNotice onConfirm={() => { setShowMinorModal(false); setConsentChecked(true) }} onCancel={() => { setShowMinorModal(false); setConsentChecked(false) }} />
      )}
    </PageShell>
  )
}

// ─── Shared layout ────────────────────────────────────────────────────────────

function PageShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#07090F',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 65%)' }} />
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: wide ? 480 : 440 }}>
        {/* Logo */}
        <a href="/math-nsw" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, textDecoration: 'none', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.4)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 16V4L10 13V4M10 13V16H16V4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}>Neumm</span>
        </a>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
          padding: '36px 32px', backdropFilter: 'blur(12px)',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: 13, fontWeight: 500 }}>
      {children}
    </div>
  )
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: 10, fontSize: 14,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
  marginBottom: 8, letterSpacing: '0.02em',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke={light ? 'white' : '#818CF8'} strokeWidth="4" />
      <path style={{ opacity: 0.75 }} fill={light ? 'white' : '#818CF8'} d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
