'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NeummLogo from '@/components/NeummLogo'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const OPTIONS = [
  {
    id: 'exam_prep',
    label: 'Prepare for my HSC exam',
    emoji: '🎯',
    description: 'Focused exam practice and revision',
  },
  {
    id: 'finding_gaps',
    label: 'Find my knowledge gaps',
    emoji: '🔍',
    description: 'Discover what I don&apos;t know yet',
  },
  {
    id: 'getting_ahead',
    label: 'Get ahead of the class',
    emoji: '🚀',
    description: 'Learn topics before they\'re taught',
  },
  {
    id: 'not_sure',
    label: 'Not sure yet',
    emoji: '🤔',
    description: 'Help me figure out where to start',
  },
]

export default function IntentPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    if (!selected || saving) return
    setSaving(true)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/auth/login'); return }

    // Upsert student_profiles row with intent
    await supabase
      .from('student_profiles')
      .upsert({ user_id: user.id, intent: selected, placement_probe_completed: false }, { onConflict: 'user_id' })

    router.push('/onboarding/year')
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <NeummLogo size={32} />
        <span className="text-sm text-gray-400 font-medium">Step 1 of 2</span>
      </div>

      {/* Progress bar */}
      <div className="mx-6 mt-3 h-1 rounded-full bg-gray-200">
        <div className="h-1 rounded-full bg-[#185FA5] transition-all" style={{ width: '50%' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-10 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            What are you trying to do right now?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {"We'll personalise your experience based on your goal."}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 flex-1">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="w-full text-left rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]"
                style={{
                  minHeight: 72,
                  borderColor: isSelected ? '#185FA5' : '#E5E7EB',
                  backgroundColor: isSelected ? '#EEF4FB' : '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Emoji */}
                  <span className="text-2xl leading-none shrink-0">{opt.emoji}</span>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-base leading-tight"
                      style={{ color: isSelected ? '#185FA5' : '#111827' }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isSelected ? '#185FA5' : '#D1D5DB',
                      backgroundColor: isSelected ? '#185FA5' : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

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
                <Spinner /> Saving…
              </span>
            ) : (
              'Continue →'
            )}
          </button>

          <button
            onClick={() => router.push('/onboarding/year')}
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
