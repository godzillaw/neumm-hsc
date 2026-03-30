import { requireAuth }          from '@/lib/auth-server'
import { createPracticeSession } from './actions'
import PracticeSession           from './PracticeSession'
import AppSidebar                from '@/components/AppSidebar'

export default async function PracticePage() {
  const user      = await requireAuth()
  const sessionId = await createPracticeSession(user.id)

  if (!sessionId) {
    return (
      <div className="flex min-h-screen bg-[#F4F6FA] items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
          <p className="text-sm text-gray-500">{"Couldn't start a session. Please refresh."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <div className="flex-1 min-w-0">
        <PracticeSession userId={user.id} sessionId={sessionId} />
      </div>
    </div>
  )
}
