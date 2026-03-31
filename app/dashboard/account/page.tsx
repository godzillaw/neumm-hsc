import { requireAuth }                 from '@/lib/auth-server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import AppSidebar                      from '@/components/AppSidebar'
import MobileBottomNav                 from '@/components/MobileBottomNav'
import AccountClient                   from './AccountClient'

export default async function AccountPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: profile } = await supabase
    .from('users')
    .select('display_name, email, tier, trial_end')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0 px-5 md:px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Account</h1>
        <AccountClient
          userId={user.id}
          email={user.email ?? ''}
          displayName={(profile as { display_name?: string } | null)?.display_name ?? ''}
          tier={(profile as { tier?: string } | null)?.tier ?? 'basic_trial'}
          trialEnd={(profile as { trial_end?: string } | null)?.trial_end ?? null}
        />
      </main>
      <MobileBottomNav />
    </div>
  )
}
