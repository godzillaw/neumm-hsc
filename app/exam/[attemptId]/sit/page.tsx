import { requireAuth }      from '@/lib/auth-server'
import { loadAttemptConfig } from '../../mock-actions'
import MockTestSession        from '../../MockTestSession'
import { redirect }           from 'next/navigation'

export default async function SitPage({
  params,
}: {
  params: { attemptId: string }
}) {
  await requireAuth()

  const result = await loadAttemptConfig(params.attemptId)

  if ('error' in result) {
    redirect('/exam')
  }

  return (
    <MockTestSession
      attemptId={params.attemptId}
      config={result.config}
      questions={result.questions}
    />
  )
}
