'use client'

import { useState }      from 'react'
import { useRouter }     from 'next/navigation'
import { createMockTest, retryMockTest, getMockTestsForUser } from './mock-actions'
import type { Mission }  from '@/lib/curriculum'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode    = 'school_test' | 'hsc_trial' | 'hsc' | 'naplan_y9' | 'prelim_y11'
type Step    = 'mode' | 'topics' | 'confirm'
type Course  = 'standard' | 'advanced' | 'extension1' | 'extension2'

const COURSE_CONFIGS: Record<Course, { label: string; timeMins: number; qCount: number }> = {
  standard:   { label: 'Standard 2',   timeMins: 150, qCount: 40 },
  advanced:   { label: 'Advanced',     timeMins: 180, qCount: 40 },
  extension1: { label: 'Extension 1',  timeMins: 120, qCount: 30 },
  extension2: { label: 'Extension 2',  timeMins: 180, qCount: 40 },
}

// NAPLAN Y9: fixed format (ACARA 2023+ online adaptive)
const NAPLAN_CONFIG = { timeMins: 65, qCount: 40 }

// Prelim Y11: school-based, NSW syllabus
const PRELIM_CONFIGS: Record<Course, { label: string; timeMins: number; qCount: number }> = {
  standard:   { label: 'Standard 2',  timeMins: 90,  qCount: 35 },
  advanced:   { label: 'Advanced',    timeMins: 120, qCount: 40 },
  extension1: { label: 'Extension 1', timeMins: 120, qCount: 35 },
  extension2: { label: 'Extension 2', timeMins: 120, qCount: 35 },
}


function bandColor(band: number | null): string {
  if (!band) return '#9CA3AF'
  if (band >= 5) return '#10B981'
  if (band >= 3) return '#F59E0B'
  return '#EF4444'
}

function formatMins(mins: number): string {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ─── Past Tests List ──────────────────────────────────────────────────────────

function PastTestCard({
  test,
  onRetry,
}: {
  test: Awaited<ReturnType<typeof getMockTestsForUser>>[number]
  onRetry: (mockTestId: string) => void
}) {
  const modeLabel = test.mode === 'school_test' ? '🏫 School Test'
    : test.mode === 'hsc_trial'  ? '📋 HSC Trial'
    : test.mode === 'naplan_y9'  ? '📐 NAPLAN Y9'
    : test.mode === 'prelim_y11' ? '📓 Prelim Y11'
    : '🎓 HSC'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{modeLabel}</span>
          {test.testDate && (
            <span className="text-xs text-gray-400">
              Test: {new Date(test.testDate).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}
            </span>
          )}
        </div>
        <p className="font-black text-gray-900 truncate">{test.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {test.questionCount} questions · {formatMins(test.timeLimitMins)}
          {test.attemptCount > 0 && ` · ${test.attemptCount} attempt${test.attemptCount > 1 ? 's' : ''}`}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {test.lastBand !== null && (
          <div className="text-center">
            <p className="text-lg font-black" style={{ color: bandColor(test.lastBand) }}>
              Band {test.lastBand}
            </p>
            <p className="text-[10px] text-gray-400">{test.lastScore}%</p>
          </div>
        )}
        <button
          onClick={() => onRetry(test.id)}
          className="px-4 py-2 rounded-xl text-sm font-black text-white"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
        >
          {test.attemptCount === 0 ? 'Start →' : 'Retry →'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export default function MockTestBuilder({
  existingTests,
  mission,
  userYear    = 12,
  userCourse  = 'advanced',
}: {
  existingTests: Awaited<ReturnType<typeof getMockTestsForUser>>
  mission:       Mission
  userYear?:     number
  userCourse?:   Course
}) {
  const router = useRouter()
  const [step,             setStep]       = useState<Step>('mode')
  const [mode,             setMode]       = useState<Mode | null>(null)
  const [course,           setCourse]     = useState<Course>(userCourse)
  // selectedStageIds: set of stageId strings from the curriculum
  const [selectedStageIds, setSelected]  = useState<Set<string>>(new Set())
  // expandedLevelIds: levels with stages shown
  const [expandedLevels,   setExpanded]  = useState<Set<string>>(new Set())

  const [qCount,           setQCount]    = useState(15)
  const [timeMins,         setTimeMins]  = useState(30)
  const [title,            setTitle]     = useState('')
  const [loading,          setLoading]   = useState(false)
  const [error,            setError]     = useState('')

  // Collect all topicId prefixes from selected stages
  function getSelectedPrefixes(): string[] {
    const prefixes = new Set<string>()
    for (const level of mission.levels) {
      for (const stage of level.stages) {
        if (selectedStageIds.has(stage.stageId)) {
          stage.topicIds.forEach(p => prefixes.add(p))
        }
      }
    }
    return Array.from(prefixes)
  }

  // ── Toggle a single stage ──────────────────────────────────────────────────
  function toggleStage(stageId: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(stageId)) next.delete(stageId)
      else next.add(stageId)
      return next
    })
  }

  // ── Toggle all stages in a level ──────────────────────────────────────────
  function toggleLevel(levelId: string, stageIds: string[]) {
    const allSelected = stageIds.every(id => selectedStageIds.has(id))
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) stageIds.forEach(id => next.delete(id))
      else stageIds.forEach(id => next.add(id))
      return next
    })
    // Auto-expand when selecting a level
    if (!allSelected) {
      setExpanded(prev => new Set(Array.from(prev).concat(levelId)))
    }
  }

  function toggleExpand(levelId: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(levelId)) next.delete(levelId)
      else next.add(levelId)
      return next
    })
  }

  // ── Auto time suggestion ───────────────────────────────────────────────────
  function suggestedTime(count: number) {
    return Math.max(10, Math.round(count * 2.5))
  }

  // ── Go to topics step ──────────────────────────────────────────────────────
  function handleModeSelect(m: Mode) {
    setMode(m)
    if (m === 'naplan_y9') {
      setQCount(NAPLAN_CONFIG.qCount)
      setTimeMins(NAPLAN_CONFIG.timeMins)
      setStep('topics')
    } else if (m === 'prelim_y11') {
      // Use the student's enrolled course — no picker needed
      const c = userCourse
      setCourse(c)
      const cfg = PRELIM_CONFIGS[c]
      setQCount(cfg.qCount)
      setTimeMins(cfg.timeMins)
      setStep('topics')   // topics step shows confirm card for curriculum modes
    } else if (m === 'hsc_trial' || m === 'hsc') {
      const c = userCourse
      setCourse(c)
      const cfg = COURSE_CONFIGS[c]
      setQCount(cfg.qCount)
      setTimeMins(cfg.timeMins)
      setStep('topics')
    } else {
      // school_test — go to topic picker
      setStep('topics')
    }
  }

  // ── Build → create test + navigate ────────────────────────────────────────
  async function handleGenerate() {
    setLoading(true)
    setError('')

    const prefixes = mode === 'school_test'
      ? getSelectedPrefixes()
      : [] // empty = full curriculum for HSC modes

    const autoTitle = title.trim() || (
      mode === 'school_test'  ? 'School Test'
      : mode === 'hsc_trial'  ? `HSC Trial — ${COURSE_CONFIGS[course].label}`
      : mode === 'naplan_y9'  ? 'NAPLAN Year 9 Numeracy'
      : mode === 'prelim_y11' ? `Preliminary Y11 — ${PRELIM_CONFIGS[course].label}`
      : `HSC Simulation — ${COURSE_CONFIGS[course].label}`
    )

    const timeLimitForMode =
      mode === 'school_test'  ? timeMins
      : mode === 'naplan_y9'  ? NAPLAN_CONFIG.timeMins
      : mode === 'prelim_y11' ? PRELIM_CONFIGS[course].timeMins
      : COURSE_CONFIGS[course].timeMins

    const questionCountForMode =
      mode === 'school_test'  ? qCount
      : mode === 'naplan_y9'  ? NAPLAN_CONFIG.qCount
      : mode === 'prelim_y11' ? PRELIM_CONFIGS[course].qCount
      : COURSE_CONFIGS[course].qCount

    const needsCourse = mode === 'hsc_trial' || mode === 'hsc' || mode === 'prelim_y11'

    const result = await createMockTest({
      title:         autoTitle,
      mode:          mode!,
      course:        needsCourse ? course : undefined,
      topicPrefixes: prefixes,

      questionCount: questionCountForMode,
      timeLimitMins: timeLimitForMode,
    })

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/exam/${result.attemptId}/sit`)
  }

  // ── Retry existing test ────────────────────────────────────────────────────
  async function handleRetry(mockTestId: string) {
    setLoading(true)
    const result = await retryMockTest(mockTestId)
    if ('error' in result) { setLoading(false); return }
    router.push(`/exam/${result.attemptId}/sit`)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="px-5 md:px-8 py-6 max-w-2xl" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#0F0F14' }}>Mock Test</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666672' }}>
            Adaptive · No hints · Full review after
          </p>
        </div>
        <button
          onClick={() => router.push('/exam/history')}
          className="text-xs font-black px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          📋 History
        </button>
      </div>

      {/* ── Step: Mode ─────────────────────────────────────────────────── */}
      {step === 'mode' && (
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: '#666672' }}>
            What are you preparing for?
          </p>

          {([
            { mode: 'school_test' as Mode, icon: '🏫', label: 'School Test',         desc: 'Choose specific topics to prepare for an upcoming school test',          show: true },
            { mode: 'naplan_y9'  as Mode, icon: '📐', label: 'NAPLAN Year 9',        desc: 'NSW numeracy — 40 questions, 65 min, all strands (ACARA format)',         show: userYear === 9 },
            { mode: 'prelim_y11' as Mode, icon: '📓', label: 'Year 11 Preliminary',  desc: 'NSW Prelim exam simulation — full Year 11 syllabus with real timing',     show: true },
            { mode: 'hsc_trial'  as Mode, icon: '📋', label: 'HSC Trial',            desc: 'Full simulation of your trial exam — all topics, real timing',            show: true },
            { mode: 'hsc'        as Mode, icon: '🎓', label: 'HSC Exam',             desc: 'Final HSC preparation — full curriculum, exam conditions',                show: true },
          ] as const).filter(opt => opt.show).map(opt => (
            <button
              key={opt.mode}
              onClick={() => handleModeSelect(opt.mode)}
              className="w-full text-left rounded-2xl p-5 flex items-center gap-4 transition-all active:scale-[0.99] hover:shadow-md"
              style={{ background: '#0F0F14', border: '1.5px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-3xl">{opt.icon}</span>
              <div>
                <p className="font-black text-white">{opt.label}</p>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{opt.desc}</p>
              </div>
              <span className="ml-auto text-white/40">→</span>
            </button>
          ))}

          {/* Past tests */}
          {existingTests.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#666672' }}>
                Your tests
              </p>
              <div className="space-y-3">
                {existingTests.slice(0, 5).map(t => (
                  <PastTestCard key={t.id} test={t} onRetry={handleRetry} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Step: Topics ───────────────────────────────────────────────── */}
      {step === 'topics' && (
        <div>
          <button onClick={() => setStep('mode')} className="text-sm font-bold text-violet-600 mb-5 flex items-center gap-1">
            ← Back
          </button>

          {/* School test: curriculum topic picker */}
          {mode === 'school_test' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#666672' }}>
                  {mission.title}
                </p>
                <span className="text-xs text-gray-400">
                  {selectedStageIds.size} stage{selectedStageIds.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="space-y-2 mb-6">
                {mission.levels.map(level => {
                  const stageIds    = level.stages.map(s => s.stageId)
                  const allSelected = stageIds.every(id => selectedStageIds.has(id))
                  const someSelected = stageIds.some(id => selectedStageIds.has(id))
                  const isExpanded  = expandedLevels.has(level.levelId)

                  return (
                    <div key={level.levelId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      {/* Level row */}
                      <div className="flex items-center gap-2 px-3 py-3">
                        {/* Level checkbox */}
                        <button
                          onClick={() => toggleLevel(level.levelId, stageIds)}
                          className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
                          style={{
                            borderColor: allSelected ? '#7C3AED' : someSelected ? '#A855F7' : '#D1D5DB',
                            background:  allSelected ? '#7C3AED' : someSelected ? 'rgba(124,58,237,0.15)' : 'white',
                          }}
                        >
                          {allSelected  && <span className="text-white text-[10px] font-black">✓</span>}
                          {someSelected && !allSelected && <span className="text-[10px] font-black" style={{ color: '#7C3AED' }}>–</span>}
                        </button>

                        {/* Level emoji + title (expand/collapse) */}
                        <button
                          onClick={() => toggleExpand(level.levelId)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                            style={{ background: `${level.color}22` }}
                          >
                            {level.emoji}
                          </div>
                          <div className="flex-1">
                            <span className="font-black text-sm text-gray-900">{level.title}</span>
                            <span className="text-xs text-gray-400 ml-2">{level.stages.length} stages</span>
                          </div>
                          <span className="text-gray-400 text-xs mr-1">{isExpanded ? '▲' : '▼'}</span>
                        </button>
                      </div>

                      {/* Stage rows — shown when expanded */}
                      {isExpanded && (
                        <div className="border-t border-gray-50">
                          {level.stages.map(stage => {
                            const isChosen = selectedStageIds.has(stage.stageId)
                            return (
                              <button
                                key={stage.stageId}
                                onClick={() => toggleStage(stage.stageId)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left border-b border-gray-50 last:border-0"
                                style={{ background: isChosen ? 'rgba(124,58,237,0.04)' : 'white' }}
                              >
                                <div
                                  className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ml-7"
                                  style={{
                                    borderColor: isChosen ? '#7C3AED' : '#D1D5DB',
                                    background:  isChosen ? '#7C3AED' : 'white',
                                  }}
                                >
                                  {isChosen && <span className="text-white text-[9px] font-black">✓</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs font-black text-gray-400 mr-1.5">{stage.code}</span>
                                  <span className="text-sm font-semibold text-gray-800">{stage.title}</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Test settings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#666672' }}>
                  Test settings
                </p>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <label className="text-sm text-gray-500 shrink-0">Number of questions</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={qCount}
                      onChange={e => {
                        const v = Math.min(50, Math.max(1, parseInt(e.target.value) || 1))
                        setQCount(v)
                        setTimeMins(suggestedTime(v))
                      }}
                      className="w-16 text-center text-sm font-black text-gray-900 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200 outline-none focus:border-violet-400"
                      style={{ fontSize: 16 }}
                    />
                    <span className="text-xs text-gray-400 shrink-0">max 50</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="text-gray-500 shrink-0">Time limit (mins)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={240}
                      value={timeMins}
                      onChange={e => setTimeMins(Math.min(240, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center text-sm font-black text-gray-900 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200 outline-none focus:border-violet-400"
                      style={{ fontSize: 16 }}
                    />
                    <span className="text-xs text-gray-400 shrink-0">max 240</span>
                  </div>
                </div>
              </div>

            </>
          )}

          {/* NAPLAN Y9: fixed format info */}
          {mode === 'naplan_y9' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📐</span>
                  <div>
                    <p className="font-black text-gray-900">NAPLAN Year 9 Numeracy</p>
                    <p className="text-xs text-gray-400 mt-0.5">ACARA 2023+ online adaptive format</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Questions', value: '40' },
                    { label: 'Time', value: '65 min' },
                    { label: 'Format', value: 'Adaptive' },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="font-black text-lg text-gray-900">{item.value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                  {['Number & Algebra', 'Measurement & Geometry', 'Statistics & Probability'].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Prelim Y11 / HSC Trial / HSC: summary confirm card (course auto-detected from profile) */}
          {(mode === 'prelim_y11' || mode === 'hsc_trial' || mode === 'hsc') && (() => {
            const configs = mode === 'prelim_y11' ? PRELIM_CONFIGS : COURSE_CONFIGS
            const cfg     = configs[course]
            const modeIcon  = mode === 'prelim_y11' ? '📓' : mode === 'hsc_trial' ? '📋' : '🎓'
            const modeTitle = mode === 'prelim_y11' ? 'Year 11 Preliminary' : mode === 'hsc_trial' ? 'HSC Trial Exam' : 'HSC Exam'
            const formatNote = mode === 'prelim_y11'
              ? 'Section I: 10 MCQ · Section II: Short answer + extended response'
              : 'Section I: 10 MCQ (15 min) · Section II: Extended response with full working'
            return (
              <div className="mb-6">
                {/* Hero card */}
                <div className="rounded-3xl p-6 mb-4 text-white" style={{ background: 'linear-gradient(135deg,#0F0F14,#1A1A2E)' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl">{modeIcon}</span>
                    <div>
                      <p className="font-black text-lg text-white leading-tight">{modeTitle}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: '#A78BFA' }}>{cfg.label}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    {[
                      { label: 'Questions', value: String(cfg.qCount) },
                      { label: 'Time',      value: formatMins(cfg.timeMins) },
                      { label: 'Format',    value: 'Exam' },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl py-3 px-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <p className="font-black text-base text-white">{item.value}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{formatNote}</p>
                </div>

                {/* Scope bullets */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                  <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#666672' }}>What&apos;s covered</p>
                  <div className="space-y-2">
                    {[
                      `Full ${cfg.label} syllabus`,
                      'Adaptive difficulty — harder as you improve',
                      'Step-by-step AI review after',
                      'Band prediction + topic readiness report',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-violet-500 shrink-0">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Optional title */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
            <label className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: '#666672' }}>
              Test name (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={mode === 'school_test' ? 'e.g. Week 5 Calculus Test' : mode === 'hsc_trial' ? 'e.g. Trial Mock #1' : 'e.g. HSC Final Prep'}
              className="w-full text-sm font-semibold text-gray-900 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-violet-400"
              style={{ fontSize: 16 }}
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || (mode === 'school_test' && selectedStageIds.size === 0) || (mode === 'prelim_y11' && !course)}
            className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)', minHeight: 56 }}
          >
            {loading ? 'Generating test…' : 'Generate Test →'}
          </button>

          {mode === 'school_test' && selectedStageIds.size === 0 && (
            <p className="text-xs text-center text-gray-400 mt-2">Select at least one topic to continue</p>
          )}
        </div>
      )}
    </div>
  )
}
