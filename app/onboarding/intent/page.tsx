'use client'

import { useState }                       from 'react'
import { useRouter }                      from 'next/navigation'
import NeummLogo                          from '@/components/NeummLogo'
import { createSupabaseBrowserClient }    from '@/lib/supabase-browser'

// ─── Options ──────────────────────────────────────────────────────────────────
const OPTIONS = [
  {
    id:          'exam_prep',
    label:       'Exam prep',
    description: 'HSC is coming and I need to be ready',
    emoji:       '🎯',
  },
  {
    id:          'finding_gaps',
    label:       'Find my gaps',
    description: 'I want to know what I don\'t know',
    emoji:       '🔍',
  },
  {
    id:          'getting_ahead',
    label:       'Get ahead',
    description: 'I want to work ahead of my class',
    emoji:       '🚀',
  },
  {
    id:          'not_sure',
    label:       'Not sure',
    description: 'Just show me what this does',
    emoji:       '🤔',
  },
]

// ─── Component ─────────────────────────────────────────────────────────────────
export default function IntentPage() {
  const router  = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving,   setSaving]   = useState(false)

  async function handleContinue() {
    if (!selected || saving) return
    setSaving(true)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    await supabase
      .from('student_profiles')
      .upsert(
        { user_id: user.id, intent: selected, placement_probe_completed: false },
        { onConflict: 'user_id' },
      )

    router.push('/onboarding/year')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Step bar */}
      <div className="px-6 pt-10 pb-2 flex items-center justify-between">
        <NeummLogo size={36} />
        <div className="flex items-center gap-1.5">
          {[1,2,3,4].map(n => (
            <div key={n} className="h-1.5 rounded-full transition-all"
              style={{ width: n === 1 ? 24 : 8, backgroundColor: n === 1 ? '#185FA5' : '#E5E7EB' }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            What are you trying to do right now?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We will personalise your practice based on your answer.
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {OPTIONS.map(opt => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="text-left rounded-2xl border-2 p-4 flex flex-col gap-2 transition-all duration-150 active:scale-[0.97]"
                style={{
                  minHeight: 100,
                  borderColor:     isSelected ? '#185FA5' : '#E5E7EB',
                  backgroundColor: isSelected ? '#E6F1FB' : '#FAFAFA',
                }}
              >
                <span className="text-2xl leading-none">{opt.emoji}</span>
                <div>
                  <p className="font-bold text-sm leading-tight text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{opt.description}</p>
                </div>
              </button>
            )
          })}
        </div>

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
            ) : 'Continue →'}
          </button>

          <button
            onClick={() => router.push('/onboarding/year')}
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
