import { redirect }          from 'next/navigation'
import { requireAuth }        from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AppSidebar             from '@/components/AppSidebar'
import MobileBottomNav        from '@/components/MobileBottomNav'
import ExamSession            from './ExamSession'
import { getCategoryMastery } from './actions'

// Tiers that are allowed to access Exam mode (paid only — no trials)
const EXAM_ALLOWED_TIERS = new Set<string>(['basic', 'pro'])

export default async function ExamPage() {
  const user = await requireAuth()

  // ── Tier gate ────────────────────────────────────────────────────────────────
  // Exam mode is a paid-only feature. Trial and expired tiers are redirected.
  const supabase = createSupabaseServerClient()
  const { data: userRow } = await supabase
    .from('users')
    .select('tier')
    .eq('id', user.id)
    .single()

  const tier: string = (userRow as { tier?: string } | null)?.tier ?? 'basic_trial'

  if (!EXAM_ALLOWED_TIERS.has(tier)) {
    // Trials → upgrade prompt; expired/failed → same
    redirect('/account/upgrade?reason=exam')
  }

  // ── Prefetch category mastery for the topic selector ─────────────────────────
  const categoryMastery = await getCategoryMastery(user.id)

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <ExamSession userId={user.id} categoryMastery={categoryMastery} />
      </main>
      <MobileBottomNav />
    </div>
  )
}
