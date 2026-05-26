'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter }   from 'next/navigation'
import type { Mission, Level, Stage, ExplanationBlock } from '@/lib/curriculum'
import { POINTS }      from '@/lib/gamification-constants'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Props {
  mission:           Mission
  completedStageIds: string[]
  totalPoints:       number
  displayName:       string
  streak:            number
  userId:            string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatPoints(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

// ── KaTeX Formula renderer ────────────────────────────────────────────────────

function KaTeXFormula({ latex, block = true }: { latex: string; block?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import('katex').then(katex => {
      katex.default.render(latex, ref.current!, {
        throwOnError:   false,
        displayMode:    block,
        output:         'html',
        trust:          false,
      })
    })
  }, [latex, block])
  return <span ref={ref} />
}

// Renders a string that may contain $...$ inline math segments
function InlineMath({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g)
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('$') && part.endsWith('$') && part.length > 2
          ? <KaTeXFormula key={i} latex={part.slice(1, -1)} block={false} />
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

// ── Rich explanation block renderer ──────────────────────────────────────────

function ExplanationRenderer({ blocks, color }: { blocks: ExplanationBlock[]; color: string }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        switch (block.type) {

          case 'text':
            return (
              <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
                {block.body}
              </p>
            )

          case 'formula':
            return (
              <div
                key={i}
                className="rounded-xl px-4 py-3 flex flex-col items-center gap-1"
                style={{ background: `${color}18`, border: `1px solid ${color}44` }}
              >
                {block.label && (
                  <p className="text-[10px] font-black uppercase tracking-wide self-start" style={{ color: `${color}BB` }}>
                    {block.label}
                  </p>
                )}
                <div className="text-white text-base overflow-x-auto w-full text-center py-1">
                  <KaTeXFormula latex={block.latex} block={true} />
                </div>
              </div>
            )

          case 'rules':
            return (
              <div key={i} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {block.heading && (
                  <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {block.heading}
                  </p>
                )}
                <ul className="space-y-1.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )

          case 'steps':
            return (
              <div key={i} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {block.heading && (
                  <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {block.heading}
                  </p>
                )}
                <ol className="space-y-1.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                        style={{ background: color, color: 'white' }}
                      >
                        {j + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )

          case 'example':
            return (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${color}44` }}>
                <div className="px-4 py-2" style={{ background: `${color}28` }}>
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color }}>✏️ Worked Example</p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    <InlineMath text={block.question} />
                  </p>
                </div>
                <div className="px-4 py-3 space-y-1.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {block.steps.map((step, j) => (
                    <p key={j} className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      <span className="font-bold" style={{ color: `${color}CC` }}>Step {j + 1}: </span>
                      <InlineMath text={step} />
                    </p>
                  ))}
                </div>
              </div>
            )

          case 'tip':
            return (
              <div
                key={i}
                className="rounded-xl px-4 py-3 flex items-start gap-2"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)' }}
              >
                <span className="text-base shrink-0 mt-0.5">💡</span>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{block.body}</p>
              </div>
            )

          case 'table':
            return (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: `${color}28` }}>
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-3 py-2 text-left text-[11px] font-black uppercase tracking-wide" style={{ color }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} style={{ background: j % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)' }}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

// ── Points Banner ──────────────────────────────────────────────────────────────

function PointsBanner({ totalPoints, displayName, streak, missionTitle }: {
  totalPoints:  number
  displayName:  string
  streak:       number
  missionTitle: string
}) {
  return (
    <div
      className="w-full mb-6 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1B2E 0%, #112240 60%, #0D1B2E 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Hero row */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {displayName}&apos;s Mission
        </p>
        <h2 className="text-xl font-black text-white leading-tight mb-4">{missionTitle}</h2>

        {/* Stats row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* XP */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-lg">⚡</span>
            <div>
              <p className="text-xl font-black text-white leading-none">{formatPoints(totalPoints)}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>XP</p>
            </div>
          </div>

          {/* Streak */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: streak > 0 ? 'rgba(255,107,53,0.25)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${streak > 0 ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-xl font-black text-white leading-none">{streak}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Streak</p>
            </div>
          </div>

          {/* Rank soon */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-lg">📊</span>
            <div>
              <p className="text-xl font-black leading-none" style={{ color: 'rgba(255,255,255,0.3)' }}>—</p>
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>Rank soon</p>
            </div>
          </div>
        </div>

        {/* XP guide */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {[
            { label: `+${POINTS.CORRECT} per question`, color: '#4ADE80' },
            { label: `+${POINTS.STAGE_COMPLETE} per stage`, color: '#60A5FA' },
            { label: `+${POINTS.LEVEL_COMPLETE} per level`, color: '#FBBF24' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
              <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Stage Row (inside level card) ─────────────────────────────────────────────

function StageRow({
  stage, isCompleted, levelColor, onClick,
}: {
  stage:       Stage
  isCompleted: boolean
  levelColor:  string
  onClick:     () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left transition-all duration-150"
      style={{
        background:  hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
        transform: hovered ? 'translateX(3px)' : 'none',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Stage code badge */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
          style={{
            background: isCompleted ? '#22C55E' : levelColor,
            color: 'white',
          }}
        >
          {isCompleted ? '✓' : stage.code}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black leading-tight truncate" style={{ color: isCompleted ? 'rgba(255,255,255,0.5)' : 'white' }}>
            {stage.title}
          </p>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {isCompleted ? '✨ Stage complete' : `+${POINTS.CORRECT} XP per question`}
          </p>
        </div>

        {/* Right side */}
        {isCompleted ? (
          <span className="text-xs font-black px-2.5 py-1 rounded-lg shrink-0" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ADE80' }}>
            Done
          </span>
        ) : (
          <div
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white"
            style={{ background: `linear-gradient(135deg, ${levelColor}, ${levelColor}BB)` }}
          >
            ▶ Start
          </div>
        )}
      </div>
    </button>
  )
}

// ── Level Card ─────────────────────────────────────────────────────────────────

function LevelCard({
  level, completedSet, onStageClick,
}: {
  level:        Level
  completedSet: Set<string>
  onStageClick: (stage: Stage, level: Level) => void
}) {
  // All levels start collapsed — student can open any
  const [expanded, setExpanded] = useState(false)
  const totalStages     = level.stages.length
  const completedCount  = level.stages.filter(s => completedSet.has(s.stageId)).length
  const isLevelComplete = completedCount === totalStages

  return (
    <div
      className="mb-4 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: `4px solid ${level.color}`,
        borderRadius: 16,
      }}
    >
      {/* Level header */}
      <button
        className="w-full text-left"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="px-5 py-4 flex items-center gap-4">
          {/* Level badge — colored circle */}
          <div
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0"
            style={{ background: isLevelComplete ? '#22C55E' : level.color, color: 'white' }}
          >
            <span className="text-[9px] font-black uppercase tracking-wide">LVL</span>
            <span className="text-base font-black leading-none">{level.levelNum}</span>
          </div>

          {/* Title & progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-black text-white leading-tight">
                {level.title}
              </h3>
              {isLevelComplete && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.2)', color: '#4ADE80' }}>
                  +{POINTS.LEVEL_COMPLETE} XP
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{
                    width: totalStages > 0 ? `${Math.round((completedCount / totalStages) * 100)}%` : '0%',
                    background: isLevelComplete ? '#22C55E' : level.color,
                  }}
                />
              </div>
              <span className="text-[11px] font-black shrink-0" style={{ color: isLevelComplete ? '#4ADE80' : 'rgba(255,255,255,0.5)' }}>
                {completedCount}/{totalStages}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <svg
            className="w-5 h-5 shrink-0 transition-transform duration-200"
            style={{ color: 'rgba(255,255,255,0.4)', transform: expanded ? 'rotate(180deg)' : 'none' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Stages list */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-2">
          {level.stages.map(stage => {
            const isCompleted = completedSet.has(stage.stageId)
            return (
              <StageRow
                key={stage.stageId}
                stage={stage}
                isCompleted={isCompleted}
                levelColor={level.color}
                onClick={() => onStageClick(stage, level)}
              />
            )
          })}

          {/* +1000 XP Level Bonus strip */}
          {!isLevelComplete && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl mt-1"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.05))',
                border: '1px dashed rgba(251,191,36,0.3)',
              }}
            >
              <span className="text-lg">🏆</span>
              <div>
                <p className="text-[11px] font-black" style={{ color: 'rgba(251,191,36,0.7)' }}>Complete all stages to earn</p>
                <p className="text-sm font-black" style={{ color: '#FBBF24' }}>+{POINTS.LEVEL_COMPLETE} XP Level Bonus</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Stage Intro Sheet (shown when tapping a stage) ────────────────────────────

function StageIntroSheet({
  stage, level, onStart, onClose,
}: {
  stage:   Stage
  level:   Level
  onStart: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 mb-4 md:mb-0 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: '#0D1B2E',
          border: '1px solid rgba(255,255,255,0.1)',
          borderLeft: `4px solid ${level.color}`,
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0"
              style={{ background: level.color, color: 'white' }}
            >
              <span className="text-[9px] font-black uppercase tracking-wide">LVL</span>
              <span className="text-base font-black leading-none">{level.levelNum}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: level.color }}>
                Level {level.levelNum} · Stage {stage.code}
              </p>
              <h3 className="text-xl font-black text-white leading-tight">{stage.title}</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Explanation */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              📖 What you&apos;ll learn
            </p>
            {stage.content && stage.content.length > 0
              ? <ExplanationRenderer blocks={stage.content} color={level.color} />
              : <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{stage.explanation}</p>
            }
          </div>

          {/* Key concept tags */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              🧠 Key concepts
            </p>
            <div className="flex flex-wrap gap-2">
              {stage.topicIds.map(tid => (
                <span
                  key={tid}
                  className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: `${level.color}22`, color: level.color, border: `1px solid ${level.color}44` }}
                >
                  {tid}
                </span>
              ))}
            </div>
          </div>

          {/* XP reward strip */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,0,0.08))',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
          >
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-[11px] font-black" style={{ color: 'rgba(255,215,0,0.7)' }}>XP rewards</p>
              <p className="text-sm font-black" style={{ color: '#FFD700' }}>
                +{POINTS.CORRECT} XP per question · +{POINTS.STAGE_COMPLETE} XP on completion
              </p>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-white font-black text-base transition-all active:scale-[0.97]"
            style={{ background: `linear-gradient(135deg, ${level.color}, ${level.color}CC)` }}
          >
            Start Stage {stage.code} ▶
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-semibold transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Client Component ──────────────────────────────────────────────────────

export default function MissionClient({
  mission, completedStageIds, totalPoints, displayName, streak,
}: Props) {
  const router         = useRouter()
  const completedSet   = new Set(completedStageIds)
  const [activeStage, setActiveStage] = useState<{ stage: Stage; level: Level } | null>(null)

  // Total mission progress
  const allStages      = mission.levels.flatMap(l => l.stages)
  const completedCount = allStages.filter(s => completedSet.has(s.stageId)).length
  const totalStages    = allStages.length
  const missionPct     = Math.round((completedCount / totalStages) * 100)

  function handleStageClick(stage: Stage, level: Level) {
    // Go straight to practice — no intro popup
    const topic = stage.topicIds[0] ?? stage.outcomeIds[0]
    void level  // level arg kept for future use
    router.push(`/practice?topic=${encodeURIComponent(topic)}&stage=${encodeURIComponent(stage.stageId)}`)
  }

  function handleStartStage() {
    if (!activeStage) return
    const topicIds = activeStage.stage.topicIds
    const topic    = topicIds[0] ?? activeStage.stage.outcomeIds[0]
    setActiveStage(null)
    router.push(`/practice?topic=${encodeURIComponent(topic)}&stage=${encodeURIComponent(activeStage.stage.stageId)}`)
  }

  return (
    <div
      style={{
        fontFamily: "'Nunito',sans-serif",
        background: '#080D16',
        minHeight: '100vh',
        color: 'white',
      }}
      className="pb-8 px-4 pt-5"
    >

      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">🎯 Mission</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Complete stages and levels to earn XP and climb the leaderboard.
        </p>
      </div>

      {/* Points banner */}
      <PointsBanner
        totalPoints={totalPoints}
        displayName={displayName}
        streak={streak}
        missionTitle={mission.title}
      />

      {/* Overall mission progress */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex-1">
          <p className="text-xs font-black mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Mission progress</p>
          <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-2.5 rounded-full transition-all duration-700"
              style={{
                width: `${missionPct}%`,
                background: missionPct >= 100 ? '#22C55E' : 'linear-gradient(90deg,#185FA5,#2563EB)',
              }}
            />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-black" style={{ color: '#60A5FA' }}>{missionPct}%</p>
          <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {completedCount}/{totalStages} stages
          </p>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-4">
        <h2 className="text-xs font-black uppercase tracking-wide mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {mission.levels.length} Levels to master
        </h2>

        {mission.levels.map(level => (
          <LevelCard
            key={level.levelId}
            level={level}
            completedSet={completedSet}
            onStageClick={handleStageClick}
          />
        ))}
      </div>

      {/* Motivation footer */}
      <div
        className="rounded-2xl px-5 py-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <p className="text-sm font-black text-white mb-1">
          {completedCount === 0
            ? "🚀 Your mission starts here. Complete Stage 1A to earn your first XP!"
            : completedCount === totalStages
              ? "🏆 Mission complete! You've mastered every stage. Time for the next mission!"
              : `💪 ${totalStages - completedCount} stage${totalStages - completedCount === 1 ? '' : 's'} remaining. Keep going — you've got this!`
          }
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {formatPoints(totalPoints)} XP earned so far
        </p>
      </div>

      {/* Stage intro sheet */}
      {activeStage && (
        <StageIntroSheet
          stage={activeStage.stage}
          level={activeStage.level}
          onStart={handleStartStage}
          onClose={() => setActiveStage(null)}
        />
      )}
    </div>
  )
}
