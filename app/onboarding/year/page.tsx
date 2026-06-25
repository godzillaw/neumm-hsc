'use client'

import { useState }                    from 'react'
import { useRouter }                   from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const YEAR_OPTIONS = [
  { id: 'year_9',  label: 'Year 9',  icon: '9'  },
  { id: 'year_10', label: 'Year 10', icon: '10' },
  { id: 'year_11', label: 'Year 11', icon: '11' },
  { id: 'year_12', label: 'Year 12', icon: '12' },
]

interface Course { id: string; label: string; emoji: string }

const COURSES: Course[] = [
  { id: 'standard',   label: 'Standard',    emoji: '📘' },
  { id: 'advanced',   label: 'Advanced',    emoji: '📗' },
  { id: 'extension1', label: 'Extension 1', emoji: '📙' },
  { id: 'extension2', label: 'Extension 2', emoji: '📕' },
]

export default function YearPage() {
  const router = useRouter()

  const [selectedYear,   setSelectedYear]   = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState<string | null>(null)

  const needsCourse = selectedYear === 'year_11' || selectedYear === 'year_12'
  const canContinue = selectedYear !== null && (!needsCourse || selectedCourse !== null)

  function handleYearSelect(id: string) {
    setSelectedYear(id)
    if (id === 'year_9' || id === 'year_10') setSelectedCourse(null)
  }

  async function handleContinue() {
    if (!canContinue || saving) return
    setSaving(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const course = needsCourse ? selectedCourse! : 'all'

    const { error: dbErr } = await supabase
      .from('student_profiles')
      .upsert(
        {
          user_id:                  user.id,
          year_group:               selectedYear,
          course,
          placement_probe_completed: true,
          ...(needsCourse ? { course_set_at: new Date().toISOString() } : {}),
        },
        { onConflict: 'user_id' },
      )

    if (dbErr) {
      setError('Could not save your selection. Please try again.')
      setSaving(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07090F',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Purple radial glow */}
      <div style={{
        position: 'absolute',
        width: 800,
        height: 800,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        pointerEvents: 'none',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px 60px',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              color: 'white',
            }}>N</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>neumm</span>
          </div>
        </div>

        {/* Glass card */}
        <div style={{
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 'clamp(28px, 5vw, 40px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {[1, 2, 3, 4].map(n => (
              <div
                key={n}
                style={{
                  height: 4,
                  borderRadius: 99,
                  transition: 'all 0.2s',
                  width: n <= 1 ? 24 : 8,
                  backgroundColor: n <= 1 ? '#6366F1' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}>
            Which year are you in?
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>
            {"We'll show you the right content for your stage."}
          </p>

          {/* Year options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {YEAR_OPTIONS.map(opt => {
              const isSel = selectedYear === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => handleYearSelect(opt.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 14,
                    border: isSel ? '1.5px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: isSel ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: isSel ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 900,
                    flexShrink: 0,
                    background: isSel ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.06)',
                    color: isSel ? 'white' : 'rgba(255,255,255,0.4)',
                  }}>
                    {opt.icon}
                  </div>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 16,
                    flex: 1,
                    color: isSel ? 'white' : 'rgba(255,255,255,0.7)',
                  }}>
                    {opt.label}
                  </span>
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: isSel ? '2px solid #6366F1' : '2px solid rgba(255,255,255,0.2)',
                    backgroundColor: isSel ? '#6366F1' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isSel && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'white' }} />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Course selection (Year 11 / 12) */}
          {needsCourse && (
            <div style={{ marginTop: 28 }}>
              <h2 style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'white',
                marginBottom: 6,
                letterSpacing: '-0.02em',
              }}>
                Which course are you studying?
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
                You can change this later in Settings.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {COURSES.map(c => {
                  const isSel = selectedCourse === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCourse(c.id)}
                      style={{
                        textAlign: 'left',
                        borderRadius: 12,
                        border: isSel ? '1.5px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: isSel ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        padding: '14px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: isSel ? '0 0 16px rgba(99,102,241,0.15)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{c.emoji}</div>
                      <p style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: isSel ? '#818CF8' : 'rgba(255,255,255,0.7)',
                        lineHeight: 1.3,
                        margin: 0,
                      }}>
                        {c.label}
                      </p>
                    </button>
                  )
                })}
              </div>

              {selectedCourse && (
                <div style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>🎯</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#818CF8', margin: 0 }}>Mission unlocked!</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                      {selectedYear === 'year_11' ? 'Year 11' : 'Year 12'}{' '}
                      {COURSES.find(c => c.id === selectedCourse)?.label} — your personalised roadmap is ready.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              fontSize: 13,
              color: '#FCA5A5',
            }}>
              {error}
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 28 }}>
            <button
              onClick={handleContinue}
              disabled={!canContinue || saving}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 14,
                border: 'none',
                background: canContinue && !saving
                  ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                  : 'rgba(255,255,255,0.08)',
                color: canContinue && !saving ? 'white' : 'rgba(255,255,255,0.3)',
                fontSize: 15,
                fontWeight: 700,
                cursor: canContinue && !saving ? 'pointer' : 'not-allowed',
                letterSpacing: '-0.01em',
                boxShadow: canContinue && !saving ? '0 8px 32px rgba(99,102,241,0.35)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {saving ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : "Let's go →"}
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: 10,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
      <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
