import { requireAuth } from '@/lib/auth-server'

export default async function PracticePage() {
  await requireAuth()
  return (
    <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-sm w-full">
        <div className="text-4xl mb-4">🚀</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Practice Session</h1>
        <p className="text-sm text-gray-500">Coming soon — adaptive practice sessions based on your mastery map.</p>
      </div>
    </div>
  )
}
