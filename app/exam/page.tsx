import { redirect }                   from 'next/navigation'
import { requireAuth }                from '@/lib/auth-server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ExamSession                    from './ExamSession'
import { getCategoryMastery }         from './actions'

// Blocked tiers: expired trial or payment failed only
const EXAM_BLOCKED_TIERS = new Set<string>(['basic_trial_expired', 'trial_expired', 'payment_failed'])

export default async function ExamPage() {
  const user     = await requireAuth()
  const supabase = createSupabaseServerClient()

  const { data: userRow } = await supabase
    .from('users').select('tier').eq('id', user.id).single()

  const tier: string = (userRow as { tier?: string } | null)?.tier ?? 'basic_trial'

  if (EXAM_BLOCKED_TIERS.has(tier)) {
    redirect('/account/upgrade?reason=exam')
  }

  const categoryMastery = await getCategoryMastery(user.id)

  return (
    <div className="flex-1 min-w-0 pb-20 md:pb-0">
      <ExamSession userId={user.id} categoryMastery={categoryMastery} />
    </div>
  )
}
