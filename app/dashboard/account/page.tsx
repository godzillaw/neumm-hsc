import { requireAuth }                 from '@/lib/auth-server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import AccountClient                   from './AccountClient'

export default async function AccountPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  const [profileRes, studyRes] = await Promise.all([
    supabase.from('users').select('display_name, email, tier, trial_end').eq('id', user.id).single(),
    supabase.from('student_profiles').select('course, year_group').eq('user_id', user.id).single(),
  ])

  const profile = profileRes.data  as { display_name?: string; tier?: string; trial_end?: string } | null
  const study   = studyRes.data    as { course?: string; year_group?: string } | null

  return (
    <div className="px-5 md:px-8 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Account</h1>
      <AccountClient
        userId={user.id}
        email={user.email ?? ''}
        displayName={profile?.display_name ?? ''}
        tier={profile?.tier ?? 'basic_trial'}
        trialEnd={profile?.trial_end ?? null}
        course={study?.course ?? 'Advanced'}
        yearGroup={study?.year_group ?? 'year_12'}
      />
    </div>
  )
}
