'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import type { Mission, Level, Stage } from '@/lib/curriculum'
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

// ── Points Banner ──────────────────────────────────────────────────────────────

function PointsBanner({ totalPoints, displayName, streak, missionTitle }: {
  totalPoints:  number
  displayName:  string
  streak:       number
  missionTitle: string
}) {
  return (
    <div
      className="rounded-3xl overflow-hidden mb-6 shadow-lg"
      style={{ background: 'linear-gradient(135deg,#0C2D5A 0%,#185FA5 55%,#1D4ED8 100%)' }}
    >
      <div className="px-5 pt-5 pb-4">
        {/* Mission label */}
        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          🎯 {displayName}&apos;s Mission
        </p>
        <h2 className="text-lg font-black text-white leading-tight mb-1">{missionTitle}</h2>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3">
          {/* Points */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl flex-1"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-2xl font-black text-white leading-none">{formatPoints(totalPoints)}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Total XP</p>
            </div>
          </div>

          {/* Streak */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{ background: streak > 0 ? 'rgba(255,107,53,0.7)' : 'rgba(255,255,255,0.08)' }}
          >
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-2xl font-black text-white leading-none">{streak}</p>
              <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>day streak</p>
            </div>
          </div>
        </div>

        {/* XP guide */}
        <div className="flex items-center gap-4 mt-3">
          {[
            { label: `+${POINTS.CORRECT} per question`, color: '#4ADE80' },
            { label: `+${POINTS.STAGE_COMPLETE} per stage`, color: '#60A5FA' },
            { label: `+${POINTS.LEVEL_COMPLETE} per level`, color: '#FBBF24' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
              <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Stage Node ─────────────────────────────────────────────────────────────────

function StageNode({
  stage, isCompleted, isLocked, levelColor, onClick,
}: {
  stage:       Stage
  isCompleted: boolean
  isLocked:    boolean
  levelColor:  string
  onClick:     () => void
}) {
  const [hovered, setHovered] = useState(false)

  const state = isCompleted ? 'done' : isLocked ? 'locked' : 'available'

  const cfg = {
    done:      { bg: '#DCFCE7', border: '#4ADE80', icon: '✓', iconColor: '#16A34A', textColor: '#065F46' },
    available: { bg: `${levelColor}12`, border: levelColor, icon: stage.code, iconColor: levelColor, textColor: '#111827' },
    locked:    { bg: '#F9FAFB', border: '#E5E7EB', icon: '🔒', iconColor: '#9CA3AF', textColor: '#9CA3AF' },
  }[state]

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      onMouseEnter={() => !isLocked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={isLocked}
      className="w-full text-left rounded-2xl border-2 transition-all duration-150 disabled:cursor-not-allowed"
      style={{
        background:   cfg.bg,
        borderColor:  hovered ? levelColor : cfg.border,
        transform:    hovered && !isLocked ? 'translateX(4px)' : 'none',
        boxShadow:    hovered && !isLocked ? `4px 4px 16px ${levelColor}22` : 'none',
        opacity:      isLocked ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Stage code badge */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
          style={{ background: state === 'done' ? '#4ADE80' : levelColor, color: 'white' }}
        >
          {isCompleted ? '✓' : stage.code}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black leading-tight truncate" style={{ color: cfg.textColor }}>
            {stage.title}
          </p>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#9CA3AF' }}>
            {isCompleted ? '✨ Stage complete' : isLocked ? 'Complete previous stages first' : `+${POINTS.CORRECT} XP per question`}
          </p>
        </div>

        {/* Arrow / Done */}
        {!isLocked && (
          <div className="shrink-0">
            {isCompleted
              ? <span className="text-sm font-black text-green-500 px-2 py-1 rounded-lg bg-green-50">Done</span>
              : <svg className="w-5 h-5" style={{ color: levelColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            }
          </div>
        )}
      </div>
    </button>
  )
}

// ── Level Card ─────────────────────────────────────────────────────────────────

function LevelCard({
  level, completedSet, isUnlocked, onStageClick,
}: {
  level:        Level
  completedSet: Set<string>
  isUnlocked:   boolean
  onStageClick: (stage: Stage, level: Level) => void
}) {
  const [expanded, setExpanded] = useState(isUnlocked)
  const totalStages     = level.stages.length
  const completedCount  = level.stages.filter(s => completedSet.has(s.stageId)).length
  const isLevelComplete = completedCount === totalStages
  const pct             = Math.round((completedCount / totalStages) * 100)

  return (
    <div
      className="rounded-3xl overflow-hidden mb-4 border-2 transition-all duration-200"
      style={{
        borderColor: isLevelComplete ? '#4ADE80' : isUnlocked ? level.color : '#E5E7EB',
        background:  'white',
        opacity:     isUnlocked ? 1 : 0.6,
      }}
    >
      {/* Level header */}
      <button
        className="w-full text-left"
        onClick={() => isUnlocked && setExpanded(v => !v)}
        disabled={!isUnlocked}
      >
        <div
          className="px-5 py-4 flex items-center gap-4"
          style={{ background: isLevelComplete ? 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' : `${level.color}0A` }}
        >
          {/* Level badge */}
          <div
            className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm"
            style={{ background: isLevelComplete ? '#22C55E' : level.color, color: 'white' }}
          >
            <span className="text-lg leading-none">{isLevelComplete ? '🏆' : level.emoji}</span>
            <span className="text-[9px] font-black mt-0.5">LVL {level.levelNum}</span>
          </div>

          {/* Title & progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-black text-gray-900 leading-tight">
                Level {level.levelNum}: {level.title}
              </h3>
              {isLevelComplete && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  +{POINTS.LEVEL_COMPLETE} XP
                </span>
              )}
              {!isUnlocked && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                  🔒 Locked
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: '#F3F4F6' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: isLevelComplete ? '#22C55E' : level.color }}
                />
              </div>
              <span className="text-[11px] font-black shrink-0" style={{ color: isLevelComplete ? '#16A34A' : level.color }}>
                {completedCount}/{totalStages}
              </span>
            </div>
          </div>

          {/* Chevron */}
          {isUnlocked && (
            <svg
              className="w-5 h-5 shrink-0 transition-transform duration-200"
              style={{ color: level.color, transform: expanded ? 'rotate(180deg)' : 'none' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {/* Progress strip */}
        {isLevelComplete && (
          <div
            className="px-5 py-2 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', borderTop: '1px solid #BBF7D0' }}
          >
            <span className="text-sm">🎉</span>
            <p className="text-xs font-black text-green-700">Level complete! +{POINTS.LEVEL_COMPLETE} XP earned</p>
          </div>
        )}
      </button>

      {/* Stages list */}
      {isUnlocked && expanded && (
        <div className="px-4 pb-4 pt-2 space-y-2.5">
          {level.stages.map((stage, idx) => {
            // First stage is always available; subsequent stages available once previous is done
            const isLocked    = idx > 0 && !completedSet.has(level.stages[idx - 1].stageId)
            const isCompleted = completedSet.has(stage.stageId)
            return (
              <StageNode
                key={stage.stageId}
                stage={stage}
                isCompleted={isCompleted}
                isLocked={isLocked}
                levelColor={level.color}
                onClick={() => onStageClick(stage, level)}
              />
            )
          })}

          {/* Level completion reward preview */}
          {!isLevelComplete && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed"
              style={{ borderColor: '#FCD34D', background: '#FFFBEB' }}
            >
              <span className="text-lg">🏆</span>
              <div>
                <p className="text-xs font-black text-amber-700">Complete all stages to earn</p>
                <p className="text-sm font-black" style={{ color: '#D97706' }}>+{POINTS.LEVEL_COMPLETE} XP Level Bonus</p>
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
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 mb-4 md:mb-0 rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'white', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ background: `linear-gradient(135deg,${level.color}15,${level.color}05)` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
              style={{ background: level.color, color: 'white' }}
            >
              {level.emoji}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: level.color }}>
                Level {level.levelNum} · Stage {stage.code}
              </p>
              <h3 className="text-lg font-black text-gray-900 leading-tight">{stage.title}</h3>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📖</span>
            <h4 className="text-sm font-black text-gray-800">What you&apos;ll learn</h4>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 mb-5">{stage.explanation}</p>

          {/* Key concepts visual placeholder */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: `${level.color}0A`, border: `1.5px solid ${level.color}30` }}
          >
            <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: level.color }}>
              🧠 Key concepts
            </p>
            <div className="flex flex-wrap gap-2">
              {stage.topicIds.map(tid => (
                <span
                  key={tid}
                  className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: level.color, color: 'white' }}
                >
                  {tid}
                </span>
              ))}
            </div>
          </div>

          {/* Reward preview */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5"
            style={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '1.5px solid #FCD34D' }}
          >
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-xs font-black text-amber-700">Stage reward</p>
              <p className="text-sm font-black text-amber-600">
                +{POINTS.CORRECT} XP per question · +{POINTS.STAGE_COMPLETE} XP on completion
              </p>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-white font-black text-base transition-all active:scale-[0.97]"
            style={{ background: `linear-gradient(135deg,${level.color},${level.color}CC)` }}
          >
            Start Stage {stage.code} →
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 mt-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
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
    setActiveStage({ stage, level })
  }

  function handleStartStage() {
    if (!activeStage) return
    const topicIds = activeStage.stage.topicIds
    const topic    = topicIds[0] ?? activeStage.stage.outcomeIds[0]
    setActiveStage(null)
    router.push(`/practice?topic=${encodeURIComponent(topic)}&stage=${encodeURIComponent(activeStage.stage.stageId)}`)
  }

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif" }} className="pb-8">

      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">🎯 Mission</h1>
        <p className="text-sm mt-0.5 text-gray-500">
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
        style={{ background: 'white', border: '1.5px solid #F3F4F6' }}
      >
        <div className="flex-1">
          <p className="text-xs font-black text-gray-700 mb-1">Mission progress</p>
          <div className="h-2.5 rounded-full bg-gray-100">
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
          <p className="text-xl font-black text-blue-700">{missionPct}%</p>
          <p className="text-[10px] font-semibold text-gray-400">{completedCount}/{totalStages} stages</p>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-4">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-3">
          {mission.levels.length} Levels to master
        </h2>

        {mission.levels.map((level, levelIdx) => {
          // Level is unlocked if it's the first, OR the previous level has at least 1 completed stage
          const isUnlocked = levelIdx === 0
            || mission.levels[levelIdx - 1].stages.some(s => completedSet.has(s.stageId))

          return (
            <LevelCard
              key={level.levelId}
              level={level}
              completedSet={completedSet}
              isUnlocked={isUnlocked}
              onStageClick={handleStageClick}
            />
          )
        })}
      </div>

      {/* Motivation footer */}
      <div
        className="rounded-2xl px-5 py-4 text-center"
        style={{ background: 'linear-gradient(135deg,#F0F9FF,#E0F2FE)' }}
      >
        <p className="text-sm font-black text-blue-800 mb-1">
          {completedCount === 0
            ? "🚀 Your mission starts here. Complete Stage 1A to earn your first XP!"
            : completedCount === totalStages
              ? "🏆 Mission complete! You've mastered every stage. Time for the next mission!"
              : `💪 ${totalStages - completedCount} stage${totalStages - completedCount === 1 ? '' : 's'} remaining. Keep going — you've got this!`
          }
        </p>
        <p className="text-xs text-blue-600">
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
