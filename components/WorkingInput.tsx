'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Point  { x: number; y: number }
interface Stroke { points: Point[]; color: string; width: number }

interface WorkingInputProps {
  onChange:  (base64: string | null) => void
  disabled?: boolean
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const PEN_COLORS = [
  { hex: '#111827', label: 'Black'  },
  { hex: '#1D4ED8', label: 'Blue'   },
  { hex: '#DC2626', label: 'Red'    },
  { hex: '#16A34A', label: 'Green'  },
]

const PEN_WIDTHS = [
  { value: 1.5, label: 'Fine'   },
  { value: 2.5, label: 'Medium' },
  { value: 4,   label: 'Thick'  },
]

// Canvas internal resolution — tall so there's room to write full solutions
const CANVAS_W = 900
const CANVAS_H = 2000   // tall internal canvas; display height is controlled separately

const MIN_DISPLAY_H = 280
const MAX_DISPLAY_H = 1400

// ─── Component ─────────────────────────────────────────────────────────────────

export default function WorkingInput({ onChange, disabled }: WorkingInputProps) {
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const cameraInputRef  = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const isDrawing       = useRef(false)
  const liveStrokeRef   = useRef<Stroke | null>(null)
  const resizeDragRef   = useRef(false)
  const resizeStartRef  = useRef({ y: 0, h: 0 })

  // Track which pointer ID is currently drawing (prevents multitouch parallel strokes)
  const activePointerIdRef  = useRef<number | null>(null)
  // Track the pointerType of the active stroke ('pen', 'touch', 'mouse')
  const activePointerTypeRef = useRef<string | null>(null)

  const [strokes,           setStrokes]           = useState<Stroke[]>([])
  const [penColor,          setPenColor]          = useState(PEN_COLORS[0].hex)
  const [penWidth,          setPenWidth]          = useState(PEN_WIDTHS[1].value)
  const [mode,              setMode]              = useState<'draw' | 'photo'>('draw')
  const [photoPreview,      setPhotoPreview]      = useState<string | null>(null)
  const [canvasDisplayH,    setCanvasDisplayH]    = useState(320)

  // ── Redraw helper ────────────────────────────────────────────────────────────

  const redraw = useCallback((strokeList: Stroke[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    for (const s of strokeList) {
      if (s.points.length < 1) continue
      ctx.beginPath()
      ctx.strokeStyle = s.color
      ctx.lineWidth   = s.width
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      if (s.points.length === 1) {
        ctx.arc(s.points[0].x, s.points[0].y, s.width / 2, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.fill()
      } else {
        ctx.moveTo(s.points[0].x, s.points[0].y)
        for (const p of s.points.slice(1)) ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
    }
  }, [])

  useEffect(() => { redraw(strokes) }, [strokes, redraw])

  // ── Export ───────────────────────────────────────────────────────────────────
  //
  // Crops to the bounding box of all strokes (+ padding) so we don't send
  // 2000px of blank whitespace to the AI.  Exports as JPEG for smaller payload.

  const exportCanvas = useCallback((strokeList: Stroke[]) => {
    if (strokeList.length === 0) { onChange(null); return }
    redraw(strokeList)
    const canvas = canvasRef.current
    if (!canvas) { onChange(null); return }

    let minY = CANVAS_H, maxY = 0, minX = CANVAS_W, maxX = 0
    for (const s of strokeList) {
      for (const p of s.points) {
        if (p.y < minY) minY = p.y
        if (p.y > maxY) maxY = p.y
        if (p.x < minX) minX = p.x
        if (p.x > maxX) maxX = p.x
      }
    }

    const PAD    = 50
    const cropX  = Math.max(0, minX - PAD)
    const cropY  = Math.max(0, minY - PAD)
    const cropW  = Math.min(CANVAS_W - cropX, Math.max(300, maxX - minX + PAD * 2))
    const cropH  = Math.min(CANVAS_H - cropY, Math.max(200, maxY - minY + PAD * 2))

    const tmp     = document.createElement('canvas')
    tmp.width     = cropW
    tmp.height    = cropH
    const tmpCtx  = tmp.getContext('2d')!
    tmpCtx.fillStyle = '#FFFFFF'
    tmpCtx.fillRect(0, 0, cropW, cropH)
    tmpCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

    const dataUrl = tmp.toDataURL('image/jpeg', 0.85)
    onChange(dataUrl.split(',')[1] ?? null)
  }, [onChange, redraw])

  // ── Canvas coordinate helper ──────────────────────────────────────────────
  //
  // Always use rect.width / rect.height (actual rendered size) rather than
  // any stale React state, so coordinates are correct even after the canvas
  // is resized or the viewport is scaled (e.g. iPad with zoom).

  function canvasPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left)  / rect.width)  * CANVAS_W,
      y: ((e.clientY - rect.top)   / rect.height) * CANVAS_H,
    }
  }

  // ── Palm rejection helper ─────────────────────────────────────────────────
  //
  // On iPad with Apple Pencil:
  //   - Pencil events arrive as pointerType === 'pen'
  //   - Palm/finger events arrive as pointerType === 'touch'
  //
  // Rule: once a 'pen' stroke is active, ignore all 'touch' events.
  // This prevents the palm from drawing while you write with the Pencil.
  // Finger drawing still works normally when no Pencil stroke is in progress.

  function shouldIgnorePointer(e: React.PointerEvent<HTMLCanvasElement>): boolean {
    // If a pen is actively drawing, reject all touch events (palm rejection)
    if (activePointerTypeRef.current === 'pen' && e.pointerType === 'touch') return true
    // If a different pointer is already drawing, reject the new one (no multitouch draw)
    if (activePointerIdRef.current !== null && activePointerIdRef.current !== e.pointerId) return true
    return false
  }

  // ── Pointer handlers ─────────────────────────────────────────────────────

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return
    if (shouldIgnorePointer(e)) return
    e.preventDefault()
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)

    activePointerIdRef.current   = e.pointerId
    activePointerTypeRef.current = e.pointerType

    isDrawing.current = true
    const pos = canvasPoint(e)
    const stroke: Stroke = { points: [pos], color: penColor, width: penWidth }
    liveStrokeRef.current = stroke
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, penWidth / 2, 0, Math.PI * 2)
      ctx.fillStyle = penColor
      ctx.fill()
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !liveStrokeRef.current || disabled) return
    if (e.pointerId !== activePointerIdRef.current) return
    e.preventDefault()

    const pos  = canvasPoint(e)
    const prev = liveStrokeRef.current.points[liveStrokeRef.current.points.length - 1]
    const ctx  = canvasRef.current?.getContext('2d')
    if (ctx && prev) {
      ctx.beginPath()
      ctx.strokeStyle = liveStrokeRef.current.color
      ctx.lineWidth   = liveStrokeRef.current.width
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    liveStrokeRef.current = {
      ...liveStrokeRef.current,
      points: [...liveStrokeRef.current.points, pos],
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !liveStrokeRef.current) return
    if (e.pointerId !== activePointerIdRef.current) return

    isDrawing.current            = false
    activePointerIdRef.current   = null
    activePointerTypeRef.current = null

    const finished = liveStrokeRef.current
    liveStrokeRef.current = null
    const next = [...strokes, finished]
    setStrokes(next)
    exportCanvas(next)
  }

  function handlePointerCancel(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerId !== activePointerIdRef.current) return
    isDrawing.current            = false
    activePointerIdRef.current   = null
    activePointerTypeRef.current = null
    liveStrokeRef.current        = null
    // Redraw without the cancelled stroke
    redraw(strokes)
  }

  // ── Canvas resize drag handle ────────────────────────────────────────────

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    ;(e.target as HTMLDivElement).setPointerCapture(e.pointerId)
    resizeDragRef.current  = true
    resizeStartRef.current = { y: e.clientY, h: canvasDisplayH }
  }

  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeDragRef.current) return
    const delta = e.clientY - resizeStartRef.current.y
    const newH  = Math.max(MIN_DISPLAY_H, Math.min(MAX_DISPLAY_H, resizeStartRef.current.h + delta))
    setCanvasDisplayH(newH)
  }

  function handleResizePointerUp() {
    resizeDragRef.current = false
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  function handleUndo() {
    const next = strokes.slice(0, -1)
    setStrokes(next)
    if (next.length === 0) onChange(null)
    else exportCanvas(next)
  }

  function handleClear() {
    setStrokes([])
    onChange(null)
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = ev => {
      const originalDataUrl = ev.target?.result as string
      setPhotoPreview(originalDataUrl)

      const img = new window.Image()
      img.onload = () => {
        const MAX = 1024
        let w = img.naturalWidth  || img.width
        let h = img.naturalHeight || img.height
        if (w > MAX || h > MAX) {
          if (w >= h) { h = Math.round(h * MAX / w); w = MAX }
          else        { w = Math.round(w * MAX / h); h = MAX }
        }
        const c   = document.createElement('canvas')
        c.width   = w
        c.height  = h
        const ctx = c.getContext('2d')!
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        const compressed = c.toDataURL('image/jpeg', 0.82).split(',')[1]
        onChange(compressed ?? null)
      }
      img.onerror = () => onChange(originalDataUrl.split(',')[1] ?? null)
      img.src = originalDataUrl
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRemovePhoto() {
    setPhotoPreview(null)
    onChange(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: '#DDD6FE' }}>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      {/* Horizontal scroll on narrow screens so tools never wrap to a 2nd row */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          background: 'linear-gradient(135deg,#F5F3FF,#FDF2F8)',
          borderBottom: '1px solid #EDE9FE',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',          // Firefox
          msOverflowStyle: 'none',         // IE
        }}>

        <span className="text-xs font-black shrink-0" style={{ color: '#7C3AED' }}>✏️ Working</span>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-purple-200 ml-auto shrink-0">
          {(['draw', 'photo'] as const).map(m => (
            <button key={m} type="button"
              onClick={() => setMode(m)}
              className="px-3 py-1 text-xs font-bold transition-colors"
              style={{
                background: mode === m ? '#7C3AED' : 'white',
                color:      mode === m ? 'white'   : '#7C3AED',
              }}>
              {m === 'draw' ? '✏️ Draw' : '📷 Photo'}
            </button>
          ))}
        </div>

        {/* Draw-mode controls */}
        {mode === 'draw' && (
          <>
            <div className="flex items-center gap-1.5 shrink-0">
              {PEN_COLORS.map(({ hex, label }) => (
                <button key={hex} type="button" title={label}
                  onClick={() => setPenColor(hex)}
                  className="w-6 h-6 rounded-full border-2 transition-all shrink-0"
                  style={{
                    backgroundColor: hex,
                    borderColor:     penColor === hex ? '#7C3AED' : 'transparent',
                    transform:       penColor === hex ? 'scale(1.25)' : 'scale(1)',
                    minWidth: 24, minHeight: 24,   // prevent squeeze on iPad
                  }}
                />
              ))}
            </div>

            <select value={penWidth}
              onChange={e => setPenWidth(Number(e.target.value))}
              className="text-xs rounded-lg px-2 py-1 border border-purple-200 shrink-0"
              style={{ color: '#6D28D9', background: 'white', minHeight: 32 }}>
              {PEN_WIDTHS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <button type="button" onClick={handleUndo} disabled={strokes.length === 0 || !!disabled}
              className="px-2 py-1 text-xs font-bold rounded-lg disabled:opacity-30 transition-all active:scale-95 shrink-0"
              style={{ background: 'white', border: '1px solid #DDD6FE', color: '#7C3AED', minHeight: 32 }}>
              ↩ Undo
            </button>
            <button type="button" onClick={handleClear} disabled={strokes.length === 0 || !!disabled}
              className="px-2 py-1 text-xs font-bold rounded-lg disabled:opacity-30 transition-all active:scale-95 shrink-0"
              style={{ background: 'white', border: '1px solid #FCA5A5', color: '#DC2626', minHeight: 32 }}>
              🗑 Clear
            </button>
          </>
        )}
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────────────── */}
      {mode === 'draw' && (
        <>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{
              width:       '100%',
              height:      canvasDisplayH,
              background:  '#FFFFFF',
              cursor:      disabled ? 'not-allowed' : 'crosshair',
              // Prevent ALL default touch behaviour (scroll, zoom, long-press menu)
              touchAction: 'none',
              display:     'block',
              // Prevent text/image selection popups on long press (iOS Safari)
              userSelect:          'none',
              WebkitUserSelect:    'none',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              WebkitTouchCallout:  'none' as any,
              // Promote to GPU layer for smoother drawing on iPad
              willChange: 'transform',
            }}
          />

          {/* ── Drag-to-resize handle ──────────────────────────────────────── */}
          <div
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{
              cursor:         'ns-resize',
              touchAction:    'none',
              background:     'linear-gradient(135deg,#F5F3FF,#FDF2F8)',
              borderTop:      '1px solid #EDE9FE',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            6,
              padding:        '6px 12px',   // slightly taller hit target for touch
              userSelect:     'none',
              minHeight:      36,            // easier to grab on iPad
            }}>
            <span style={{ fontSize: 11, color: '#A78BFA', fontWeight: 700, pointerEvents: 'none' }}>
              ⇕ Drag to expand
            </span>
            <div style={{ display: 'flex', gap: 3, pointerEvents: 'none' }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#C4B5FD' }} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Photo upload ────────────────────────────────────────────────────── */}
      {mode === 'photo' && (
        <div className="p-4 flex flex-col items-center gap-3"
          style={{ background: '#FAFAFA', minHeight: 220 }}>
          {photoPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Your working"
                className="max-h-72 rounded-xl object-contain w-full"
                style={{ border: '1px solid #E5E7EB' }} />
              <button type="button" onClick={handleRemovePhoto}
                className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
                style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
                🗑 Remove photo
              </button>
            </>
          ) : (
            <>
              <div className="text-5xl mt-2">📷</div>
              <p className="text-sm font-semibold text-center" style={{ color: '#6B7280' }}>
                Work it out on paper, then take a photo or upload
              </p>

              <div className="flex gap-3 flex-wrap justify-center">
                <label
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black text-white transition-all active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', minHeight: 44 }}>
                  📷 Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>

                <label
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black cursor-pointer transition-all active:scale-95"
                  style={{ background: 'white', border: '2px solid #DDD6FE', color: '#7C3AED', minHeight: 44 }}>
                  🖼️ Upload Photo
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
                onChange={handlePhotoChange} className="hidden" />
            </>
          )}
        </div>
      )}

      {/* ── Footer hint ─────────────────────────────────────────────────────── */}
      <div className="px-3 py-2 flex items-center gap-1.5"
        style={{ background: '#F5F3FF', borderTop: '1px solid #EDE9FE' }}>
        <span className="text-[11px]" style={{ color: '#8B5CF6' }}>
          💡 {mode === 'draw'
            ? 'Apple Pencil or finger — show every step. Drag handle to expand canvas.'
            : 'Write your working on paper, then take a clear photo with good lighting'}
        </span>
      </div>
    </div>
  )
}
