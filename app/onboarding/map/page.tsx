import { requireAuth } from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import NeummLogo from '@/components/NeummLogo'

export default async function MapPage() {
  const user = await requireAuth()
  const supabase = createSupabaseServerClient()

  // Load student profile + mastery_map summary
  const [profileRes, masteryRes] = await Promise.all([
    supabase.from('student_profiles').select('course, year_group, intent').eq('user_id', user.id).single(),
    supabase.from('mastery_map').select('status, difficulty_band, outcome_id').eq('user_id', user.id),
  ])

  const profile  = profileRes.data
  const mastery  = masteryRes.data ?? []
  const learning = mastery.filter(m => m.status === 'learning').length
  const needsWork = mastery.filter(m => m.status === 'needs_work').length

  const courseColor: Record<string, string> = {
    'Standard':    '#38B2AC',
    'Advanced':    '#4A90D9',
    'Extension 1': '#185FA5',
    'Extension 2': '#1B3A6B',
  }
  const color = profile?.course ? (courseColor[profile.course] ?? '#185FA5') : '#185FA5'

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <NeummLogo size={44} />
        </div>

        {/* Course card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Your course
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: color }}
            >
              {profile?.course?.split(' ').map((w: string) => w[0]).join('') ?? 'MA'}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {profile?.course ?? 'Advanced'} Mathematics
              </p>
              <p className="text-xs text-gray-400">
                {profile?.year_group?.replace('_', ' / ') ?? 'Year 12'}
              </p>
            </div>
          </div>

          {/* Mastery summary */}
          <div className="grid grid-cols-3 gap-3">
            <StatBox value={mastery.length} label="Outcomes mapped" color={color} />
            <StatBox value={learning}   label="In progress" color="#10B981" />
            <StatBox value={needsWork}  label="Needs work"  color="#F59E0B" />
          </div>
        </div>

        {/* What's next card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-3">{"What's next"}</p>
          <div className="space-y-3">
            <Step n={1} done label="Choose your goal" />
            <Step n={2} done label="Set your year group" />
            <Step n={3} done label="Placement probe" />
            <Step n={4} label="Start your first practice session" />
          </div>
        </div>

        <Link
          href="/dashboard"
          className="block w-full py-4 rounded-2xl text-white font-bold text-base text-center transition-all active:scale-[0.98]"
          style={{ backgroundColor: color }}
        >
          Go to my dashboard →
        </Link>

        <p className="mt-4 text-center text-xs text-gray-400">
          Your mastery map will grow as you practice
        </p>
      </div>
    </div>
  )
}

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#F4F6FA' }}>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function Step({ n, done = false, label }: { n: number; done?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
        style={{
          backgroundColor: done ? '#185FA5' : '#E5E7EB',
          color: done ? '#fff' : '#9CA3AF',
        }}
      >
        {done ? '✓' : n}
      </div>
      <span
        className="text-sm"
        style={{ color: done ? '#111827' : '#9CA3AF', fontWeight: done ? 600 : 400 }}
      >
        {label}
      </span>
    </div>
  )
}
