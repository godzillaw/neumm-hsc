import { requireAuth }      from '@/lib/auth-server'
import { getAttemptResult }  from '../../mock-actions'
import MockTestReview         from '../../MockTestReview'
import AppSidebar             from '@/components/AppSidebar'
import MobileBottomNav        from '@/components/MobileBottomNav'
import { redirect }           from 'next/navigation'

export default async function ReviewPage({
  params,
}: {
  params: { attemptId: string }
}) {
  await requireAuth()

  const result = await getAttemptResult(params.attemptId)

  if (!result) redirect('/exam')

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F3FF' }}>
      <AppSidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <MockTestReview result={result} />
      </div>
      <MobileBottomNav />
    </div>
  )
}
