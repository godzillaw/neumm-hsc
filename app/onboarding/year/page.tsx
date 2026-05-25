'use client'

import { useState }                    from 'react'
import { useRouter }                   from 'next/navigation'
import NeummLogo                       from '@/components/NeummLogo'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

// ─── Data ─────────────────────────────────────────────────────────────────────

const YEAR_OPTIONS = [
  { id: 'year_9',  label: 'Year 9',  icon: '9'  },
  { id: 'year_10', label: 'Year 10', icon: '10' },
  { id: 'year_11', label: 'Year 11', icon: '11' },
  { id: 'year_12', label: 'Year 12', icon: '12' },
]

interface Course { id: string; label: string; emoji: string; color: string; bg: string }

const COURSES: Course[] = [
  { id: 'standard',   label: 'Standard',    emoji: '📘', color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'advanced',   label: 'Advanced',    emoji: '📗', color: '#10B981', bg: '#D1FAE5' },
  { id: 'extension1', label: 'Extension 1', emoji: '📙', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'extension2', label: 'Extension 2', emoji: '📕', color: '#EF4444', bg: '#FEE2E2' },
]

// ─── Component ─────────────────────────────────────────────────────────────────

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
    // Clear course when switching away from Year 11/12
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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Top bar ── */}
      <div className="px-6 pt-10 pb-2 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <NeummLogo size={36} />
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className="h-1.5 rounded-full transition-all"
              style={{
                width:           n <= 2 ? 24 : 8,
                backgroundColor: n <= 2 ? '#185FA5' : '#E5E7EB',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-10">

        {/* Section 1 — Year */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Which year are you in?
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {"We'll show you the right content for your stage."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {YEAR_OPTIONS.map(opt => {
            const isSel = selectedYear === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => handleYearSelect(opt.id)}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]"
                style={{
                  minHeight:       64,
                  borderColor:     isSel ? '#185FA5' : '#E5E7EB',
                  backgroundColor: isSel ? '#E6F1FB' : '#FAFAFA',
                }}
              >
                <div className="flex items-center gap-4 px-5 py-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all"
                    style={{
                      backgroundColor: isSel ? '#185FA5' : '#E5E7EB',
                      color:           isSel ? '#FFFFFF'  : '#6B7280',
                    }}
                  >
                    {opt.icon}
                  </div>
                  <span
                    className="font-bold text-lg leading-tight flex-1"
                    style={{ color: isSel ? '#0C447C' : '#111827' }}
                  >
                    {opt.label}
                  </span>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{
                      borderColor:     isSel ? '#185FA5' : '#D1D5DB',
                      backgroundColor: isSel ? '#185FA5' : 'transparent',
                    }}
                  >
                    {isSel && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Section 2 — Course (only for Year 11 / 12) ── */}
        {needsCourse && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Which course are you studying?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This sets your personalised mission roadmap. You can change it later in Settings.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {COURSES.map(c => {
                const isSel = selectedCourse === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourse(c.id)}
                    className="text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] px-4 py-4"
                    style={{
                      borderColor:     isSel ? c.color : '#E5E7EB',
                      backgroundColor: isSel ? c.bg    : '#FAFAFA',
                      boxShadow:       isSel ? `0 4px 16px ${c.color}30` : 'none',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: isSel ? c.color : '#F3F4F6' }}
                      >
                        {c.emoji}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all"
                        style={{
                          borderColor:     isSel ? c.color : '#D1D5DB',
                          backgroundColor: isSel ? c.color : 'transparent',
                        }}
                      >
                        {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p
                      className="font-black text-sm leading-tight"
                      style={{ color: isSel ? c.color : '#111827' }}
                    >
                      {c.label}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Mission-unlocked banner */}
            {selectedCourse && (
              <div
                className="mt-4 px-4 py-3 rounded-2xl flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
                  border:     '1.5px solid #93C5FD',
                }}
              >
                <span className="text-xl">🎯</span>
                <div>
                  <p className="text-xs font-black text-blue-800">Mission unlocked!</p>
                  <p className="text-xs text-blue-600">
                    {selectedYear === 'year_11' ? 'Year 11' : 'Year 12'}{' '}
                    {COURSES.find(c => c.id === selectedCourse)?.label} — your personalised roadmap is ready.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleContinue}
            disabled={!canContinue || saving}
            className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: '#185FA5', minHeight: 56 }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Saving…
              </span>
            ) : "Let's go →"}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
