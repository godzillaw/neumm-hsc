'use client'

import { useState }                    from 'react'
import { useRouter }                   from 'next/navigation'
import Link                            from 'next/link'
import { signOut }                     from '@/lib/auth'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

interface Props {
  userId:      string
  email:       string
  displayName: string
  tier:        string
  trialEnd:    string | null
  course:      string
  yearGroup:   string
}

const TIER_LABELS: Record<string, { label: string; colour: string }> = {
  basic_trial: { label: 'Free Trial', colour: '#6B7280' },
  basic:       { label: 'Basic',      colour: '#185FA5' },
  pro:         { label: 'Pro',        colour: '#7C3AED' },
  expired:     { label: 'Expired',    colour: '#EF4444' },
}

const COURSES = [
  { id: 'Standard',    label: 'Standard',     desc: 'Mathematics Standard 1 & 2' },
  { id: 'Advanced',    label: 'Advanced',     desc: 'Mathematics Advanced'        },
  { id: 'Extension 1', label: 'Extension 1',  desc: 'Mathematics Extension 1'     },
  { id: 'Extension 2', label: 'Extension 2',  desc: 'Mathematics Extension 2'     },
]

const YEARS = [
  { id: 'year_9',  label: 'Year 9'  },
  { id: 'year_10', label: 'Year 10' },
  { id: 'year_11', label: 'Year 11' },
  { id: 'year_12', label: 'Year 12' },
]

export default function AccountClient({
  userId, email, displayName, tier, trialEnd, course, yearGroup,
}: Props) {
  const router = useRouter()

  const [signingOut,   setSigningOut]   = useState(false)
  const [selCourse,    setSelCourse]    = useState(course)
  const [selYear,      setSelYear]      = useState(yearGroup)
  const [saving,       setSaving]       = useState(false)
  const [saveResult,   setSaveResult]   = useState<'saved' | 'error' | null>(null)

  const tierMeta = TIER_LABELS[tier] ?? TIER_LABELS['basic_trial']
  const trialEndDate = trialEnd
    ? new Date(trialEnd).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const isDirty = selCourse !== course || selYear !== yearGroup

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    router.replace('/auth/login')
  }

  async function handleSaveStudy() {
    if (!isDirty || saving) return
    setSaving(true)
    setSaveResult(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase
        .from('student_profiles')
        .upsert(
          { user_id: userId, course: selCourse, year_group: selYear },
          { onConflict: 'user_id' },
        )
      if (error) throw error
      setSaveResult('saved')
      // Refresh server data
      router.refresh()
    } catch {
      setSaveResult('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-4" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Name</p>
            <p className="text-sm font-semibold text-gray-900">{displayName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Email</p>
            <p className="text-sm font-semibold text-gray-900">{email}</p>
          </div>
        </div>
      </div>

      {/* ── Study Settings ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-1">Study Settings</h2>
        <p className="text-xs text-gray-400 mb-5">
          Change your course or year and all practice questions will update immediately.
        </p>

        {/* Course selector */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-700 mb-2">Mathematics Course</p>
          <div className="grid grid-cols-2 gap-2">
            {COURSES.map(c => {
              const active = selCourse === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelCourse(c.id); setSaveResult(null) }}
                  className="text-left rounded-xl border-2 px-3 py-2.5 transition-all"
                  style={{
                    borderColor:     active ? '#185FA5' : '#E5E7EB',
                    backgroundColor: active ? '#E6F1FB' : '#FAFAFA',
                  }}>
                  <p className="text-sm font-black leading-tight"
                    style={{ color: active ? '#0C447C' : '#374151' }}>
                    {c.label}
                  </p>
                  <p className="text-[11px] font-medium mt-0.5"
                    style={{ color: active ? '#185FA5' : '#9CA3AF' }}>
                    {c.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Year selector */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-700 mb-2">Year Group</p>
          <div className="grid grid-cols-4 gap-2">
            {YEARS.map(y => {
              const active = selYear === y.id
              return (
                <button
                  key={y.id}
                  onClick={() => { setSelYear(y.id); setSaveResult(null) }}
                  className="rounded-xl border-2 py-2 text-center transition-all"
                  style={{
                    borderColor:     active ? '#185FA5' : '#E5E7EB',
                    backgroundColor: active ? '#E6F1FB' : '#FAFAFA',
                  }}>
                  <p className="text-sm font-black"
                    style={{ color: active ? '#0C447C' : '#374151' }}>
                    {y.label.replace('Year ', '')}
                  </p>
                  <p className="text-[10px] font-semibold"
                    style={{ color: active ? '#185FA5' : '#9CA3AF' }}>
                    {y.label.split(' ')[0]}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Save button + feedback */}
        <button
          onClick={handleSaveStudy}
          disabled={!isDirty || saving}
          className="w-full py-3 rounded-xl text-sm font-black text-white transition-all disabled:opacity-40 min-h-[44px]"
          style={{ backgroundColor: saveResult === 'saved' ? '#22C55E' : '#185FA5' }}>
          {saving          ? 'Saving…'          :
           saveResult === 'saved' ? '✓ Saved!'  :
           saveResult === 'error' ? 'Error — try again' :
           isDirty                ? 'Save changes'      : 'No changes'}
        </button>

        {saveResult === 'saved' && (
          <p className="text-xs text-center mt-2 font-semibold" style={{ color: '#16A34A' }}>
            Your practice questions will now match your updated settings.
          </p>
        )}
      </div>

      {/* ── Plan ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-4">Plan</h2>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-black text-white"
            style={{ backgroundColor: tierMeta.colour }}>
            {tierMeta.label}
          </span>
          {trialEndDate && tier === 'basic_trial' && (
            <span className="text-xs text-gray-400">Trial ends {trialEndDate}</span>
          )}
        </div>
        {tier !== 'pro' && (
          <Link href="/account/upgrade"
            className="inline-block w-full py-3 rounded-xl text-sm font-black text-white text-center min-h-[44px]"
            style={{ backgroundColor: '#185FA5' }}>
            Upgrade plan →
          </Link>
        )}
      </div>

      {/* ── Sign out ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-4">Session</h2>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full py-3 rounded-xl text-sm font-bold text-red-600 border border-red-200 min-h-[44px] disabled:opacity-60 hover:bg-red-50 transition-colors">
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>

    </div>
  )
}
