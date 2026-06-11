'use client'

import Link from 'next/link'
import type { HistoryAttempt } from '../mock-actions'

function bandColor(band: number): string {
  if (band >= 5) return '#10B981'
  if (band >= 3) return '#F59E0B'
  return '#EF4444'
}

function formatTime(secs: number): string {
  if (secs < 60) return `${secs}s`
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function modeLabel(mode: string) {
  return mode === 'school_test' ? '🏫 School Test'
    : mode === 'hsc_trial' ? '📋 HSC Trial' : '🎓 HSC'
}

export default function MockTestHistoryView({ history }: { history: HistoryAttempt[] }) {
  // Group by mockTestId
  const groups = new Map<string, HistoryAttempt[]>()
  for (const a of history) {
    if (!groups.has(a.mockTestId)) groups.set(a.mockTestId, [])
    groups.get(a.mockTestId)!.push(a)
  }

  return (
    <div className="px-5 md:px-8 py-6 max-w-2xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Test History</h1>
          <p className="text-sm text-gray-400 mt-0.5">All your mock test attempts</p>
        </div>
        <Link
          href="/exam"
          className="text-xs font-black px-4 py-2 rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
        >
          + New Test
        </Link>
      </div>

      {history.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-black text-gray-900">No tests yet</h2>
          <p className="text-sm text-gray-400 mt-1 mb-5">Create your first mock test to start tracking progress</p>
          <Link
            href="/exam"
            className="inline-block px-6 py-3 rounded-2xl text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
          >
            Create Mock Test →
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {Array.from(groups.entries()).map(([testId, attempts]) => {
          const latest  = attempts[0]
          const oldest  = attempts[attempts.length - 1]
          const improving = attempts.length > 1 && latest.scorePct > oldest.scorePct

          return (
            <div key={testId}>
              {/* Test header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {modeLabel(latest.mode)}
                </span>
                <h2 className="font-black text-gray-900">{latest.title}</h2>
                {improving && (
                  <span className="text-xs font-black text-green-600 ml-auto">↑ Improving</span>
                )}
              </div>

              {/* Attempt rows */}
              <div className="space-y-2">
                {attempts.map((a, i) => (
                  <div
                    key={a.attemptId}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                      #{a.attemptNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">
                        {new Date(a.completedAt).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                        {' · '}{formatTime(a.timeTakenSecs)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">{Math.round(a.scorePct)}%</p>
                        <p className="text-[10px] font-black" style={{ color: bandColor(a.predictedBand) }}>
                          Band {a.predictedBand}
                        </p>
                      </div>
                      {/* Trend arrow */}
                      {i < attempts.length - 1 && (
                        <span className="text-sm font-black"
                          style={{ color: a.scorePct > attempts[i+1].scorePct ? '#10B981' : a.scorePct < attempts[i+1].scorePct ? '#EF4444' : '#9CA3AF' }}>
                          {a.scorePct > attempts[i+1].scorePct ? '↑' : a.scorePct < attempts[i+1].scorePct ? '↓' : '→'}
                        </span>
                      )}
                      <Link
                        href={`/exam/${a.attemptId}/review`}
                        className="text-xs font-black px-3 py-1.5 rounded-xl text-violet-600 bg-violet-50 hover:bg-violet-100"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
