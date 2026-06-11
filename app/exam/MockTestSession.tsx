'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter }       from 'next/navigation'
import MathText            from '@/components/MathText'
import WorkingInput        from '@/components/WorkingInput'
import { finalizeMockAttempt, saveTestPhoto } from './mock-actions'
import { createSupabaseBrowserClient }        from '@/lib/supabase-browser'
import type { MockQuestion, MockTestConfig }  from './mock-actions'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

const OPTION_LABELS = ['A','B','C','D'] as const

function isMCQ(q: MockQuestion): boolean {
  return !!(q.optionA || q.optionB || q.optionC || q.optionD)
}

// ─── Answer tracking ──────────────────────────────────────────────────────────

interface AnswerRecord {
  questionId:     string
  position:       number
  topicPrefix:    string
  difficultyBand: number
  studentAnswer:  string | null   // option letter for MCQ; 'attempted' for open
  questionText:   string
  optionA:        string
  optionB:        string
  optionC:        string
  optionD:        string
  startedAt:      number
  timeSecs:       number
}

// ─── Photo Upload Screen ──────────────────────────────────────────────────────

interface UploadedPhoto {
  localUrl:     string
  file:         File
  questionRef:  number | null   // single question tag
  uploading:    boolean
  uploaded:     boolean
  storagePath:  string
  publicUrl:    string
}

function PhotoUploadScreen({
  attemptId,
  questions,
  onSubmit,
  submitting,
}: {
  attemptId:  string
  questions:  MockQuestion[]
  onSubmit:   () => void
  submitting: boolean
}) {
  const [photos,    setPhotos]    = useState<UploadedPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const newPhotos: UploadedPhoto[] = Array.from(files).map(f => ({
      localUrl:    URL.createObjectURL(f),
      file:        f,
      questionRef: null,
      uploading:   false,
      uploaded:    false,
      storagePath: '',
      publicUrl:   '',
    }))
    setPhotos(prev => [...prev, ...newPhotos])
  }

  function updatePhoto(idx: number, patch: Partial<UploadedPhoto>) {
    setPhotos(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p))
  }

  function selectQRef(idx: number, qNum: number) {
    setPhotos(prev => prev.map((p, i) => {
      if (i !== idx) return p
      return { ...p, questionRef: p.questionRef === qNum ? null : qNum }
    }))
  }

  function removePhoto(idx: number) {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  async function uploadAndSave() {
    setUploading(true)
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setUploading(false); return }

    for (let i = 0; i < photos.length; i++) {
      const p = photos[i]
      if (p.uploaded) continue
      updatePhoto(i, { uploading: true })

      const ext       = p.file.name.split('.').pop() ?? 'jpg'
      const path      = `${user.id}/${attemptId}/${Date.now()}_${i}.${ext}`
      const { error } = await supabase.storage
        .from('mock-test-photos')
        .upload(path, p.file, { upsert: true })

      if (error) { updatePhoto(i, { uploading: false }); continue }

      const { data: urlData } = supabase.storage
        .from('mock-test-photos')
        .getPublicUrl(path)

      await saveTestPhoto({
        attemptId,
        storagePath:  path,
        photoUrl:     urlData?.publicUrl ?? '',
        questionRefs: p.questionRef ? [p.questionRef] : [],
        caption:      '',
      })

      updatePhoto(i, { uploading: false, uploaded: true, storagePath: path, publicUrl: urlData?.publicUrl ?? '' })
    }

    setUploading(false)
    onSubmit()
  }

  const totalQ = questions.length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F3FF', fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">📸</div>
          <h1 className="text-xl font-black text-gray-900">Upload your working</h1>
          <p className="text-sm text-gray-500 mt-1">
            Photo your written working and tag each photo to the right questions.
            <br/>You can skip this and submit directly if you prefer.
          </p>
        </div>

        {/* Upload area */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-violet-200 rounded-2xl py-6 flex flex-col items-center gap-2 mb-5 transition-colors hover:border-violet-400 hover:bg-violet-50"
        >
          <span className="text-3xl">+</span>
          <p className="font-black text-violet-600 text-sm">Add photos</p>
          <p className="text-xs text-gray-400">JPEG, PNG, HEIC up to 10 MB each</p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          className="hidden"
          onChange={e => e.target.files && void handleFiles(e.target.files)}
        />

        {/* Photo cards */}
        <div className="space-y-4 mb-6">
          {photos.map((photo, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Photo preview */}
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.localUrl}
                  alt={`Working photo ${idx + 1}`}
                  className="w-full object-cover"
                  style={{ maxHeight: 220 }}
                />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center"
                >
                  ✕
                </button>
                {photo.uploaded && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-black text-white bg-green-500">
                    ✓ Saved
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#666672' }}>
                  Which question? (tap to tag)
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Array.from({ length: totalQ }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => selectQRef(idx, n)}
                      className="w-8 h-8 rounded-lg text-xs font-black transition-all"
                      style={{
                        background: photo.questionRef === n ? '#7C3AED' : '#F3F4F6',
                        color:      photo.questionRef === n ? 'white'   : '#6B7280',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* Show selected question text */}
                {photo.questionRef !== null && (() => {
                  const q = questions[photo.questionRef - 1]
                  return q ? (
                    <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(124,58,237,0.07)', color: '#5B21B6' }}>
                      <span className="font-black text-xs mr-1.5">Q{photo.questionRef}</span>
                      <span className="font-semibold">{q.questionText.length > 120 ? q.questionText.slice(0, 120) + '…' : q.questionText}</span>
                    </div>
                  ) : null
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-600 disabled:opacity-50"
          >
            Skip & Submit
          </button>
          <button
            onClick={() => void uploadAndSave()}
            disabled={uploading || submitting || photos.length === 0}
            className="flex-[2] py-3 rounded-2xl font-black text-sm text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
          >
            {uploading ? 'Saving photos…' : `Save ${photos.length > 0 ? photos.length + ' photo' + (photos.length > 1 ? 's' : '') + ' &' : ''} Submit →`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Session ─────────────────────────────────────────────────────────────

export default function MockTestSession({
  attemptId,
  config,
  questions,
}: {
  attemptId: string
  config:    MockTestConfig
  questions: MockQuestion[]
}) {
  const router = useRouter()

  const totalSecs    = config.timeLimitMins * 60
  const [timeLeft,   setTimeLeft]    = useState(totalSecs)
  const [current,    setCurrent]     = useState(0)
  const [selected,   setSelected]    = useState<string | null>(null)
  const [onPaper,    setOnPaper]     = useState(false)      // open-ended: "I'll work on paper"
  const [submitting, setSubmitting]  = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showUpload, setShowUpload]   = useState(false)     // photo upload screen

  // Track per-question answers
  const answersRef = useRef<AnswerRecord[]>(
    questions.map((q, i) => ({
      questionId:     q.id,
      position:       i + 1,
      topicPrefix:    q.topicPrefix,
      difficultyBand: q.difficultyBand,
      studentAnswer:  null,
      questionText:   q.questionText,
      optionA:        q.optionA,
      optionB:        q.optionB,
      optionC:        q.optionC,
      optionD:        q.optionD,
      startedAt:      Date.now(),
      timeSecs:       0,
    }))
  )
  const questionStartRef = useRef(Date.now())
  const startTimeRef     = useRef(Date.now())
  const timedOutRef      = useRef(false)

  // ── Countdown timer ────────────────────────────────────────────────────────
  const triggerUploadRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          timedOutRef.current = true
          triggerUploadRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    triggerUploadRef.current = () => setShowUpload(true)
  })

  // ── Finalize ───────────────────────────────────────────────────────────────
  const handleFinalize = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)

    try {
      const now = Date.now()
      answersRef.current[current].timeSecs += Math.round((now - questionStartRef.current) / 1000)
      const timeTakenSecs = Math.round((now - startTimeRef.current) / 1000)

      const result = await finalizeMockAttempt({
        attemptId,
        timeTakenSecs,
        timedOut: timedOutRef.current,
        answers:  answersRef.current,
      })

      if ('error' in result) {
        setSubmitError(result.error)
        setSubmitting(false)
        return
      }
      router.push(`/exam/${attemptId}/review`)
    } catch (err) {
      console.error('finalizeMockAttempt error:', err)
      setSubmitError('Something went wrong submitting your test. Please try again.')
      setSubmitting(false)
    }
  }, [attemptId, current, router, submitting])

  // ── Navigate ───────────────────────────────────────────────────────────────
  function goTo(idx: number) {
    const now = Date.now()
    answersRef.current[current].timeSecs += Math.round((now - questionStartRef.current) / 1000)
    questionStartRef.current = now
    const rec = answersRef.current[idx]
    setSelected(rec.studentAnswer)
    setOnPaper(rec.studentAnswer === 'on_paper')
    setCurrent(idx)
  }

  function handleSelectMCQ(option: string) {
    setSelected(option)
    answersRef.current[current].studentAnswer = option
  }

  function handleMarkOnPaper() {
    answersRef.current[current].studentAnswer = 'on_paper'
    setSelected('on_paper')
    setOnPaper(true)
  }

  function handleNext() {
    if (current < questions.length - 1) {
      goTo(current + 1)
    } else {
      setShowConfirm(true)
    }
  }

  function handleSkip() {
    answersRef.current[current].studentAnswer = null
    if (current < questions.length - 1) goTo(current + 1)
    else setShowConfirm(true)
  }

  // ── Upload screen (after time or finish) ──────────────────────────────────
  if (showUpload) {
    return (
      <PhotoUploadScreen
        attemptId={attemptId}
        questions={questions}
        onSubmit={() => void handleFinalize()}
        submitting={submitting}
      />
    )
  }

  if (submitError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F3FF', fontFamily: "'Nunito',sans-serif" }}>
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-md">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="font-black text-lg text-gray-900 mb-2">Submission failed</p>
          <p className="text-sm text-gray-500 mb-6">{submitError}</p>
          <button
            onClick={() => { setSubmitError(null); setShowUpload(true) }}
            className="w-full py-3 rounded-2xl font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080D16' }}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-white font-black text-lg">Marking your test…</p>
          <p className="text-white/40 text-sm mt-1">Generating your results</p>
        </div>
      </div>
    )
  }

  const q         = questions[current]
  const mcq       = isMCQ(q)
  const answered  = answersRef.current.filter(a => a.studentAnswer !== null).length
  const progress  = ((current + 1) / questions.length) * 100
  const timerColor = timeLeft <= 120 ? '#EF4444' : timeLeft <= 300 ? '#F59E0B' : '#10B981'
  const canProceed = mcq
    ? selected !== null
    : (selected === 'attempted' || selected === 'on_paper')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F3FF', fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Fixed top bar ─────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex flex-col">
            <p className="text-xs font-black text-gray-900 truncate max-w-[160px]">{config.title}</p>
            <p className="text-[10px] text-gray-400">Q {current + 1} of {questions.length}</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-sm"
            style={{
              background: timeLeft <= 120 ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.05)',
              color: timerColor,
            }}
          >
            <span>⏱</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs font-black px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500"
          >
            Finish
          </button>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#7C3AED,#A855F7)' }} />
        </div>
      </div>

      {/* ── Question area ────────────────────────────────────────────────── */}
      <div key={current} className={`flex-1 pt-20 px-4 max-w-2xl mx-auto w-full ${mcq ? 'pb-36' : 'pb-28'}`}>

        {/* Topic + band */}
        <div className="flex items-center gap-2 mb-4 mt-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
            {q.topicName}
          </span>
          <span className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-full">
            Band {q.difficultyBand}
          </span>
          {!mcq && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Show working
            </span>
          )}
        </div>

        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-sm border border-purple-50 p-5 mb-4">
          <MathText
            text={q.questionText}
            as="p"
            className="text-base font-semibold text-gray-900 leading-relaxed"
          />
        </div>

        {/* ── MCQ options ──────────────────────────────────────────────── */}
        {mcq && (
          <div className="space-y-3">
            {([q.optionA, q.optionB, q.optionC, q.optionD] as string[]).map((opt, i) => {
              if (!opt) return null
              const label    = OPTION_LABELS[i].toLowerCase()
              const isChosen = selected === label
              return (
                <button
                  key={label}
                  onClick={() => handleSelectMCQ(label)}
                  className="w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.99]"
                  style={{
                    borderColor: isChosen ? '#7C3AED' : '#E5E7EB',
                    background:  isChosen ? 'rgba(124,58,237,0.07)' : 'white',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                    style={{
                      background: isChosen ? '#7C3AED' : '#F3F4F6',
                      color:      isChosen ? 'white'   : '#6B7280',
                    }}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <MathText text={opt} className="flex-1 text-sm font-semibold text-gray-800" />
                </button>
              )
            })}
          </div>
        )}

        {/* ── Open-ended: canvas or on-paper ───────────────────────────── */}
        {!mcq && (
          <div>
            {/* Toggle: canvas vs paper */}
            {!onPaper ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#666672' }}>
                    Your working
                  </p>
                  <button
                    onClick={handleMarkOnPaper}
                    className="text-xs font-bold text-violet-600 underline"
                  >
                    Working on paper instead →
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden border border-purple-100 shadow-sm mb-3">
                  <WorkingInput
                    key={current}
                    onChange={(b64) => {
                      if (b64) {
                        answersRef.current[current].studentAnswer = 'attempted'
                        setSelected('attempted')
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Draw your working above, or tap &quot;Working on paper instead&quot; if you&apos;re writing by hand
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-5 text-center border-2 border-dashed border-violet-200"
                style={{ background: 'rgba(124,58,237,0.04)' }}
              >
                <p className="text-2xl mb-2">📝</p>
                <p className="font-black text-gray-900 text-sm">Working on paper</p>
                <p className="text-xs text-gray-400 mt-1 mb-3">
                  Continue on your physical paper. You&apos;ll upload photos at the end.
                </p>
                <button
                  onClick={() => { setOnPaper(false); setSelected(null); answersRef.current[current].studentAnswer = null }}
                  className="text-xs font-bold text-violet-600 underline"
                >
                  Use canvas instead
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Fixed bottom ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-500"
          >
            Skip →
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-[2] py-3 rounded-2xl font-black text-sm text-white disabled:opacity-40 transition-all"
            style={{ background: canProceed ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : '#D1D5DB' }}
          >
            {current < questions.length - 1 ? 'Next →' : 'Finish Test →'}
          </button>
        </div>

        {/* Question map */}
        <div className="max-w-2xl mx-auto mt-2 flex gap-1 flex-wrap justify-center">
          {questions.map((_, i) => {
            const ans = answersRef.current[i].studentAnswer
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="w-6 h-6 rounded-md text-[10px] font-black flex items-center justify-center"
                style={{
                  background: i === current ? '#7C3AED' : ans ? '#A855F7' : '#F3F4F6',
                  color: i === current || ans ? 'white' : '#9CA3AF',
                }}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Confirm finish modal ──────────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-4xl text-center mb-3">📋</div>
            <h2 className="text-lg font-black text-gray-900 text-center mb-1">Finished?</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              {answered} of {questions.length} questions answered.
              {questions.length - answered > 0 && ` ${questions.length - answered} will be marked skipped.`}
              <br />
              <span className="text-violet-600 font-semibold">You can upload photos of your paper working next.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-600"
              >
                Keep going
              </button>
              <button
                onClick={() => { setShowConfirm(false); setShowUpload(true) }}
                className="flex-1 py-3 rounded-2xl font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
