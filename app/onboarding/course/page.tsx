'use client'

import { useState, Suspense }          from 'react'
import { useRouter, useSearchParams }  from 'next/navigation'
import NeummLogo                       from '@/components/NeummLogo'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface CourseOption {
  id:          string
  label:       string
  badge:       string
  description: string
  emoji:       string
  color:       string
  bg:          string
}

const YEAR_11_COURSES: CourseOption[] = [
  {
    id: 'standard', label: 'Standard',
    badge: 'Year 11 Standard',
    description: 'Practical maths with real-world focus. Covers algebra, measurement, financial maths, statistics and networks.',
    emoji: '📘', color: '#0EA5E9', bg: '#E0F2FE',
  },
  {
    id: 'advanced', label: 'Advanced',
    badge: 'Year 11 Advanced',
    description: 'Solid theory and depth. Covers functions, trigonometry, exponential/log functions, calculus and statistics.',
    emoji: '📗', color: '#10B981', bg: '#D1FAE5',
  },
  {
    id: 'extension1', label: 'Extension 1',
    badge: 'Year 11 Extension 1',
    description: 'Extension of Advanced. Includes harder algebra, inverse trig, advanced functions, introductory proof and further calculus.',
    emoji: '📙', color: '#F59E0B', bg: '#FEF3C7',
  },
]

const YEAR_12_COURSES: CourseOption[] = [
  {
    id: 'standard', label: 'Standard',
    badge: 'Year 12 Standard',
    description: 'Practical applications: financial maths, networks, statistical analysis and measurement.',
    emoji: '📘', color: '#0EA5E9', bg: '#E0F2FE',
  },
  {
    id: 'advanced', label: 'Advanced',
    badge: 'Year 12 Advanced',
    description: 'Graphing techniques, trigonometric functions, advanced differentiation and integration, statistical analysis.',
    emoji: '📗', color: '#10B981', bg: '#D1FAE5',
  },
  {
    id: 'extension1', label: 'Extension 1',
    badge: 'Year 12 Extension 1',
    description: 'Proof by induction, vectors, further trig, integration by parts, differential equations, and inverse functions.',
    emoji: '📙', color: '#F59E0B', bg: '#FEF3C7',
  },
  {
    id: 'extension2', label: 'Extension 2',
    badge: 'Year 12 Extension 2',
    description: 'Complex numbers, mechanics, advanced proof, integration techniques, vectors in 3D. The most challenging HSC maths course.',
    emoji: '📕', color: '#EF4444', bg: '#FEE2E2',
  },
]

function CoursePageInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const yearParam    = searchParams.get('year') ?? 'year_12'
  const yearNum      = yearParam === 'year_11' ? 11 : 12
  const courses      = yearNum === 11 ? YEAR_11_COURSES : YEAR_12_COURSES

  const [selected, setSelected] = useState<string | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleContinue() {
    if (!selected || saving) return
    setSaving(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const { error: dbErr } = await supabase
      .from('student_profiles')
      .upsert(
        { user_id: user.id, course: selected, course_set_at: new Date().toISOString() },
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
      {/* Step bar */}
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
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className="h-1.5 rounded-full transition-all"
              style={{
                width:           n <= 3 ? 24 : 8,
                backgroundColor: n <= 3 ? '#185FA5' : '#E5E7EB',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-6 pb-10 max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
            <span className="text-xs font-black uppercase tracking-wide">
              Year {yearNum} · Choose your course
            </span>
          </div>
          <h1 className="text-2xl font-black leading-tight text-gray-900">
            Which course are you studying?
          </h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            This sets your <strong>Mission roadmap</strong> — the exact topics you need to master.
            You can change this anytime in Settings.
          </p>
        </div>

        {/* Course cards */}
        <div className="flex flex-col gap-3 flex-1">
          {courses.map(course => {
            const isSelected = selected === course.id
            return (
              <button
                key={course.id}
                onClick={() => setSelected(course.id)}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]"
                style={{
                  borderColor:     isSelected ? course.color : '#E5E7EB',
                  backgroundColor: isSelected ? course.bg    : '#FAFAFA',
                  boxShadow:       isSelected ? `0 4px 20px ${course.color}22` : 'none',
                }}
              >
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Emoji badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl transition-all"
                    style={{
                      backgroundColor: isSelected ? course.color : '#F3F4F6',
                    }}
                  >
                    {course.emoji}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-black text-base"
                        style={{ color: isSelected ? course.color : '#111827' }}
                      >
                        {course.label}
                      </span>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{
                          background: isSelected ? course.color : '#F3F4F6',
                          color:      isSelected ? 'white' : '#6B7280',
                        }}
                      >
                        {course.badge}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                      {course.description}
                    </p>
                  </div>

                  {/* Radio */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all"
                    style={{
                      borderColor:     isSelected ? course.color : '#D1D5DB',
                      backgroundColor: isSelected ? course.color : 'transparent',
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Gaming framing */}
        {selected && (
          <div
            className="mt-4 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1.5px solid #93C5FD' }}
          >
            <span className="text-xl">🎯</span>
            <div>
              <p className="text-xs font-black text-blue-800">Mission unlocked!</p>
              <p className="text-xs text-blue-600">
                {courses.find(c => c.id === selected)?.badge} — your personalised roadmap is ready.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleContinue}
            disabled={!selected || saving}
            className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: '#185FA5', minHeight: 56 }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Setting up your mission…
              </span>
            ) : (
              "Start Mission →"
            )}
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

export default function CoursePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CoursePageInner />
    </Suspense>
  )
}
