'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NeummLogo from '@/components/NeummLogo'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const YEAR_OPTIONS = [
  {
    id: 'year_9_10',
    label: 'Year 9 / 10',
    sublabel: 'Building foundations',
    badge: 'Early start',
    badgeColor: '#38B2AC',
  },
  {
    id: 'year_11',
    label: 'Year 11',
    sublabel: 'Preliminary courses',
    badge: '2 years to HSC',
    badgeColor: '#4A90D9',
  },
  {
    id: 'year_12',
    label: 'Year 12',
    sublabel: 'HSC year',
    badge: 'Final year',
    badgeColor: '#185FA5',
  },
]

export default function YearPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue() {
    if (!selected || saving) return
    setSaving(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    const { error: dbError } = await supabase
      .from('student_profiles')
      .upsert(
        { user_id: user.id, year_group: selected, placement_probe_completed: false },
        { onConflict: 'user_id' }
      )

    if (dbError) {
      setError('Could not save your selection. Please try again.')
      setSaving(false)
      return
    }

    router.push('/onboarding/probe')
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <NeummLogo size={32} />
        <span className="text-sm text-gray-400 font-medium">Step 2 of 2</span>
      </div>

      {/* Progress bar */}
      <div className="mx-6 mt-3 h-1 rounded-full bg-gray-200">
        <div className="h-1 rounded-full bg-[#185FA5] transition-all" style={{ width: '100%' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-10 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Which year are you in?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {"We'll show you the right content for your stage."}
          </p>
        </div>

        {/* Year options — large tap targets */}
        <div className="flex flex-col gap-4 flex-1">
          {YEAR_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]"
                style={{
                  minHeight: 88,
                  borderColor: isSelected ? '#185FA5' : '#E5E7EB',
                  backgroundColor: isSelected ? '#EEF4FB' : '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-4 px-6 py-5">
                  {/* Year icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-sm transition-all"
                    style={{ backgroundColor: isSelected ? '#185FA5' : '#E5E7EB' }}
                  >
                    {opt.id === 'year_9_10' ? '9–10' : opt.id === 'year_11' ? 'Y11' : 'Y12'}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-bold text-lg leading-tight"
                        style={{ color: isSelected ? '#185FA5' : '#111827' }}
                      >
                        {opt.label}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: opt.badgeColor }}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{opt.sublabel}</p>
                  </div>

                  {/* Radio */}
                  <div
                    className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isSelected ? '#185FA5' : '#D1D5DB',
                      backgroundColor: isSelected ? '#185FA5' : 'transparent',
                    }}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8">
          <button
            onClick={handleContinue}
            disabled={!selected || saving}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: '#185FA5', minHeight: 56 }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Saving your profile…
              </span>
            ) : (
              <span>{"Let's go \u2192"}</span>
            )}
          </button>

          <button
            onClick={() => router.push('/onboarding/probe')}
            className="w-full mt-3 py-3 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
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
