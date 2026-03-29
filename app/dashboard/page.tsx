import { requireAuth } from '@/lib/auth-server'

export default async function DashboardPage() {
  const user = await requireAuth()
  return (
    <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm">Signed in as {user.email}</p>
      </div>
    </div>
  )
}
