import { requireAuth } from '@/lib/auth-server'
import Link from 'next/link'
import NeummLogo from '@/components/NeummLogo'

export default async function ProbePage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-6">
          <NeummLogo size={48} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF4FB] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#185FA5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Placement Probe
          </h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            A quick 10-question diagnostic to map your starting point across all HSC topics.
            Takes about 5 minutes.
          </p>

          <div className="flex items-center gap-3 bg-[#F4F6FA] rounded-xl px-4 py-3 mb-6 text-left">
            <div className="text-2xl">⚡</div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Profile: {user.email}</p>
              <p className="text-xs text-gray-400">Onboarding complete</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="block w-full py-3.5 rounded-xl text-white font-semibold text-sm text-center transition-all"
            style={{ backgroundColor: '#185FA5' }}
          >
            Go to Dashboard →
          </Link>

          <p className="mt-4 text-xs text-gray-400">
            Placement probe coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
