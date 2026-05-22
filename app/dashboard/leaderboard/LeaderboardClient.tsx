'use client'

import { useState, useTransition } from 'react'
import { acceptInvite }            from '@/lib/actions/gamification'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank:        number
  id:          string
  displayName: string
  totalPoints: number
  streak:      number
  isMe:        boolean
}

interface Props {
  globalEntries: LeaderboardEntry[]
  friendEntries: LeaderboardEntry[]
  myRankGlobal:  number | null
  inviteCode:    string
  userId:        string
}

// ── Rank helpers ───────────────────────────────────────────────────────────────

const RANK_EMOJI  = ['🥇', '🥈', '🥉']
const RANK_COLORS = [
  'linear-gradient(135deg,#F59E0B,#D97706)',
  'linear-gradient(135deg,#94A3B8,#64748B)',
  'linear-gradient(135deg,#D97706,#B45309)',
]

function formatPoints(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ── Entry Row ─────────────────────────────────────────────────────────────────

function EntryRow({ entry }: { entry: LeaderboardEntry }) {
  const isTop3 = entry.rank <= 3
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${entry.isMe ? 'ring-2 ring-violet-400' : ''}`}
      style={{ background: entry.isMe ? 'linear-gradient(135deg,#EDE9FE,#FCE7F3)' : 'white' }}
    >
      {/* Rank badge */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
        style={{ background: isTop3 ? RANK_COLORS[entry.rank - 1] : '#F3F4F6', color: isTop3 ? 'white' : '#6B7280' }}
      >
        {isTop3 ? RANK_EMOJI[entry.rank - 1] : `#${entry.rank}`}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm truncate ${entry.isMe ? 'text-violet-700' : 'text-gray-900'}`}>
          {entry.displayName}{entry.isMe ? ' (you)' : ''}
        </p>
        {entry.streak > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">🔥 {entry.streak} day streak</p>
        )}
      </div>

      {/* XP */}
      <div className="shrink-0 text-right">
        <p className="font-black text-sm" style={{ color: entry.isMe ? '#7C3AED' : '#1F2937' }}>
          ⚡ {formatPoints(entry.totalPoints)}
        </p>
        <p className="text-[10px] text-gray-400">XP</p>
      </div>
    </div>
  )
}

// ── Friend Invite Panel ────────────────────────────────────────────────────────

function InvitePanel({ inviteCode, userId }: { inviteCode: string; userId: string }) {
  const [inputCode,  setInputCode]  = useState('')
  const [copied,     setCopied]     = useState(false)
  const [result,     setResult]     = useState<{ success: boolean; message: string } | null>(null)
  const [isPending,  startTransition] = useTransition()

  function handleCopy() {
    const url = `${window.location.origin}/math-nsw/app/invite?code=${inviteCode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleAccept() {
    const code = inputCode.trim().toUpperCase()
    if (!code) return
    startTransition(async () => {
      const res = await acceptInvite(userId, code)
      if (res.success) {
        setResult({ success: true, message: `You and ${res.friendName ?? 'your friend'} are now connected! 🎉` })
        setInputCode('')
      } else {
        setResult({ success: false, message: res.error ?? 'Something went wrong.' })
      }
    })
  }

  return (
    <div className="rounded-3xl overflow-hidden mt-6"
      style={{ background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', border: '1.5px solid #DDD6FE' }}>

      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
        <span className="text-2xl">🤝</span>
        <div>
          <p className="text-sm font-black text-white">Invite Friends</p>
          <p className="text-xs text-purple-200">Challenge friends and compete on the leaderboard</p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Your invite code */}
        <div>
          <p className="text-xs font-black text-violet-700 mb-2 uppercase tracking-wide">Your invite code</p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border-2 border-purple-100">
              <span className="text-lg">🔗</span>
              <span className="font-black text-violet-700 text-base tracking-widest">{inviteCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-3 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
              style={{ background: copied ? 'linear-gradient(135deg,#10B981,#059669)' : 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 pl-1">
            Share this code — friends can enter it below to connect with you.
          </p>
        </div>

        {/* Accept a friend code */}
        <div>
          <p className="text-xs font-black text-violet-700 mb-2 uppercase tracking-wide">Add a friend</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={e => { setInputCode(e.target.value.toUpperCase()); setResult(null) }}
              onKeyDown={e => e.key === 'Enter' && handleAccept()}
              placeholder="Enter friend's code…"
              maxLength={8}
              className="flex-1 bg-white rounded-2xl px-4 py-3 text-sm font-bold outline-none border-2 focus:border-violet-300 transition-colors tracking-widest"
              style={{ borderColor: '#DDD6FE', color: '#374151' }}
            />
            <button
              onClick={handleAccept}
              disabled={!inputCode.trim() || isPending}
              className="px-4 py-3 rounded-2xl font-black text-sm text-white disabled:opacity-40 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#185FA5,#2563EB)' }}
            >
              {isPending ? '…' : 'Add →'}
            </button>
          </div>

          {/* Result feedback */}
          {result && (
            <div
              className="mt-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
              style={{
                background: result.success ? '#D1FAE5' : '#FEE2E2',
                color:      result.success ? '#065F46'  : '#991B1B',
              }}
            >
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Client Component ──────────────────────────────────────────────────────

export default function LeaderboardClient({
  globalEntries,
  friendEntries,
  myRankGlobal,
  inviteCode,
  userId,
}: Props) {
  const [tab, setTab] = useState<'global' | 'friends'>('friends')

  const entries   = tab === 'global' ? globalEntries : friendEntries
  const myEntry   = entries.find(e => e.isMe)
  const myRank    = tab === 'global' ? myRankGlobal : (myEntry?.rank ?? null)
  const hasFriends = friendEntries.length > 1   // more than just "me"

  return (
    <div className="px-5 md:px-8 py-6 max-w-2xl" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Leaderboard 🏆</h1>
        <p className="text-sm text-gray-500 mt-1">
          Earn XP by answering questions and completing stages
        </p>
      </div>

      {/* My rank banner */}
      {myEntry && (
        <div className="rounded-2xl p-4 mb-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white' }}>
          <div>
            <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">
              {tab === 'global' ? 'Global rank' : 'Friends rank'}
            </p>
            <p className="text-3xl font-black">#{myRank}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80 font-semibold uppercase tracking-wide">Your XP</p>
            <p className="text-2xl font-black">⚡ {formatPoints(myEntry.totalPoints)}</p>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: '#F3F4F6' }}>
        {(['friends', 'global'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === t ? 'white' : 'transparent',
              color:      tab === t ? '#7C3AED' : '#9CA3AF',
              boxShadow:  tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {t === 'friends' ? '👥 Friends' : '🌏 Global'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {entries.length === 0 || (tab === 'friends' && !hasFriends) ? (
          <div className="text-center py-12 px-6">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-black text-gray-700 mb-2">No friends yet</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Invite friends using your code below to see them on the leaderboard.
            </p>
          </div>
        ) : (
          entries.map(entry => <EntryRow key={entry.id} entry={entry} />)
        )}
      </div>

      {/* Invite panel */}
      <InvitePanel inviteCode={inviteCode} userId={userId} />
    </div>
  )
}
