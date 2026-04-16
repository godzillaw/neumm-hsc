import { redirect }           from 'next/navigation'
import { requireAuth }        from '@/lib/auth-server'
import { checkTierAccess }    from '@/lib/tier'
import ExamSession            from './ExamSession'
import { getCategoryMastery } from './actions'

export default async function ExamPage() {
  const user   = await requireAuth()
  const access = await checkTierAccess(user.id)

  if (access.isBlocked) {
    redirect('/account/upgrade?reason=expired')
  }

  const categoryMastery = await getCategoryMastery(user.id)

  return (
    <div className="flex-1 min-w-0 pb-20 md:pb-0">
      <ExamSession userId={user.id} categoryMastery={categoryMastery} />
    </div>
  )
}
