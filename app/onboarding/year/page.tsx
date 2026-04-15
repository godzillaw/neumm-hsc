'use client'

import { useState }                       from 'react'
import { useRouter }                      from 'next/navigation'
import NeummLogo                          from '@/components/NeummLogo'
import { createSupabaseBrowserClient }    from '@/lib/supabase-browser'

const YEAR_OPTIONS = [
  { id: 'year_9',  label: 'Year 9',  icon: '9'  },
  { id: 'year_10', label: 'Year 10', icon: '10' },
  { id: 'year_11', label: 'Year 11', icon: '11' },
  { id: 'year_12', label: 'Year 12', icon: '12' },
]

export default function YearPage() {
  const router = useRouter()
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
        { user_id: user.id, year_group: selected, placement_probe_completed: false },
        { onConflict: 'user_id' },
      )

    if (dbErr) {
      setError('Could not save your selection. Please try again.')
      setSaving(false)
      return
    }

    router.push('/onboarding/probe')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Step bar */}
      <div className="px-6 pt-10 pb-2 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <NeummLogo size={36} />
        <div className="flex items-center gap-1.5">
          {[1,2,3,4].map(n => (
            <div key={n} className="h-1.5 rounded-full transition-all"
              style={{ width: n <= 2 ? 24 : 8, backgroundColor: n <= 2 ? '#185FA5' : '#E5E7EB' }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Which year are you in?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {"We'll show you the right content for your stage."}
          </p>
        </div>

        {/* Year cards — single column, large tap targets */}
        <div className="flex flex-col gap-3 flex-1">
          {YEAR_OPTIONS.map(opt => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]"
                style={{
                  minHeight: 72,
                  borderColor:     isSelected ? '#185FA5' : '#E5E7EB',
                  backgroundColor: isSelected ? '#E6F1FB' : '#FAFAFA',
                }}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Year badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all"
                    style={{
                      backgroundColor: isSelected ? '#185FA5' : '#E5E7EB',
                      color:           isSelected ? '#FFFFFF'  : '#6B7280',
                    }}
                  >
                    {opt.icon}
                  </div>

                  {/* Label */}
                  <span
                    className="font-bold text-lg leading-tight flex-1"
                    style={{ color: isSelected ? '#0C447C' : '#111827' }}
                  >
                    {opt.label}
                  </span>

                  {/* Radio dot */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{
                      borderColor:     isSelected ? '#185FA5' : '#D1D5DB',
                      backgroundColor: isSelected ? '#185FA5' : 'transparent',
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
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
        <div className="mt-8 space-y-3">
          <button
            onClick={handleContinue}
            disabled={!selected || saving}
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
            onClick={() => router.push('/onboarding/probe')}
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
