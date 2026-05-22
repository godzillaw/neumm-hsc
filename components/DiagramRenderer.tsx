'use client'

/**
 * DiagramRenderer — renders HSC-maths diagrams as inline SVG.
 *
 * Supports four types:
 *   cartesian  — x/y axes with curves (polyline) and labelled points
 *   triangle   — labelled polygon with optional angle marks
 *   numberline — horizontal number line with points and shaded intervals
 *   circle     — circle on a coordinate plane
 *
 * The AI generates a `diagram_spec` JSON object stored in content_json.
 * Each step's "📊 Visual:" entry may embed a spec between [SPEC]…[/SPEC].
 */

// ─── Type definitions ──────────────────────────────────────────────────────────

interface CartesianCurve {
  points:  Array<[number, number]>
  color?:  string
  label?:  string
  dashed?: boolean
}

interface CartesianPoint {
  x:       number
  y:       number
  label?:  string
  color?:  string
  filled?: boolean
}

interface CartesianLine {
  x1: number; y1: number; x2: number; y2: number
  color?: string; dashed?: boolean; label?: string
}

interface CartesianRegion {
  points:   Array<[number, number]>
  color?:   string
  opacity?: number
}

export interface CartesianSpec {
  type:     'cartesian'
  title?:   string
  xRange:   [number, number]
  yRange:   [number, number]
  xLabel?:  string
  yLabel?:  string
  curves?:  CartesianCurve[]
  points?:  CartesianPoint[]
  lines?:   CartesianLine[]
  regions?: CartesianRegion[]
}

export interface TriangleVertex { x: number; y: number; label?: string }
export interface TriangleSide   { from: number; to: number; label?: string; color?: string }
export interface TriangleAngle  { vertex: number; label?: string; rightAngle?: boolean }

export interface TriangleSpec {
  type:      'triangle'
  title?:    string
  vertices:  TriangleVertex[]
  sides?:    TriangleSide[]
  angles?:   TriangleAngle[]
}

export interface NLPoint    { x: number; label?: string; filled?: boolean; color?: string }
export interface NLInterval { from: number; to: number; color?: string; label?: string }

export interface NumberLineSpec {
  type:       'numberline'
  title?:     string
  min:        number
  max:        number
  points?:    NLPoint[]
  intervals?: NLInterval[]
}

export interface CircleSpec {
  type:    'circle'
  title?:  string
  center:  { x: number; y: number; label?: string }
  radius:  number
  xRange?: [number, number]
  yRange?: [number, number]
  points?: Array<{ x: number; y: number; label?: string; color?: string }>
}

export type DiagramSpec = CartesianSpec | TriangleSpec | NumberLineSpec | CircleSpec

// ─── Helpers ───────────────────────────────────────────────────────────────────

function niceStep(range: number, maxTicks: number): number {
  const rough  = range / maxTicks
  const pow10  = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1e-10))))
  const norm   = rough / pow10
  const nice   = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10
  return nice * pow10
}

function niceTicks(min: number, max: number, maxTicks = 6): number[] {
  const step   = niceStep(max - min, maxTicks)
  const start  = Math.ceil(min / step) * step
  const ticks: number[] = []
  for (let t = start; t <= max + 1e-9; t += step) {
    const rounded = Math.round(t * 1e8) / 1e8
    ticks.push(rounded)
  }
  return ticks
}

const fmt = (n: number) =>
  Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '')

// ─── Cartesian renderer ────────────────────────────────────────────────────────

function CartesianDiagram({ spec }: { spec: CartesianSpec }) {
  const W = 300, H = 190
  const PL = 38, PR = 16, PT = 20, PB = 28   // padding left/right/top/bottom

  const plotW = W - PL - PR
  const plotH = H - PT - PB

  const toX = (x: number) => PL + ((x - spec.xRange[0]) / (spec.xRange[1] - spec.xRange[0])) * plotW
  const toY = (y: number) => H - PB - ((y - spec.yRange[0]) / (spec.yRange[1] - spec.yRange[0])) * plotH

  const axisY = Math.max(PT, Math.min(H - PB, toY(0)))
  const axisX = Math.max(PL, Math.min(W - PR, toX(0)))

  const xTicks = niceTicks(spec.xRange[0], spec.xRange[1], 7)
  const yTicks = niceTicks(spec.yRange[0], spec.yRange[1], 5)

  const PURPLE = '#7C3AED'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>

      {/* Grid */}
      {xTicks.map(x => (
        <line key={`gx${x}`} x1={toX(x)} y1={PT} x2={toX(x)} y2={H - PB}
          stroke="#F3F4F6" strokeWidth="1" />
      ))}
      {yTicks.map(y => (
        <line key={`gy${y}`} x1={PL} y1={toY(y)} x2={W - PR} y2={toY(y)}
          stroke="#F3F4F6" strokeWidth="1" />
      ))}

      {/* Shaded regions */}
      {spec.regions?.map((r, i) => (
        <polygon key={`rg${i}`}
          points={r.points.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')}
          fill={r.color ?? PURPLE} fillOpacity={r.opacity ?? 0.15} stroke="none" />
      ))}

      {/* Axes */}
      <line x1={PL} y1={axisY} x2={W - PR} y2={axisY} stroke="#6B7280" strokeWidth="1.5" />
      <line x1={axisX} y1={PT} x2={axisX} y2={H - PB} stroke="#6B7280" strokeWidth="1.5" />

      {/* Axis arrows */}
      <polygon points={`${W-PR},${axisY-3} ${W-PR+5},${axisY} ${W-PR},${axisY+3}`} fill="#6B7280" />
      <polygon points={`${axisX-3},${PT} ${axisX},${PT-5} ${axisX+3},${PT}`}       fill="#6B7280" />

      {/* X-axis tick labels */}
      {xTicks.map(x => Math.abs(x) > 1e-9 && (
        <text key={`xl${x}`} x={toX(x)} y={axisY + 14}
          textAnchor="middle" fontSize="9" fill="#6B7280">{fmt(x)}</text>
      ))}

      {/* Y-axis tick labels */}
      {yTicks.map(y => Math.abs(y) > 1e-9 && (
        <text key={`yl${y}`} x={axisX - 5} y={toY(y) + 3}
          textAnchor="end" fontSize="9" fill="#6B7280">{fmt(y)}</text>
      ))}

      {/* Origin label */}
      <text x={axisX - 5} y={axisY + 13} textAnchor="end" fontSize="9" fill="#9CA3AF">0</text>

      {/* Extra line segments */}
      {spec.lines?.map((l, i) => (
        <line key={`ln${i}`}
          x1={toX(l.x1)} y1={toY(l.y1)} x2={toX(l.x2)} y2={toY(l.y2)}
          stroke={l.color ?? '#F59E0B'} strokeWidth="1.5"
          strokeDasharray={l.dashed ? '5,4' : undefined} />
      ))}

      {/* Curves */}
      {spec.curves?.map((curve, i) => {
        const pts = curve.points
          .map(([x, y]) => `${toX(x)},${toY(y)}`)
          .join(' ')
        return (
          <polyline key={`cv${i}`} points={pts}
            fill="none"
            stroke={curve.color ?? PURPLE} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={curve.dashed ? '6,4' : undefined} />
        )
      })}

      {/* Labelled points */}
      {spec.points?.map((pt, i) => {
        const cx = toX(pt.x), cy = toY(pt.y)
        const col = pt.color ?? PURPLE
        // Position label to avoid overlap with axis
        const labelX = cx + (cx > W * 0.75 ? -6 : 7)
        const labelY = cy + (cy < PT + 14 ? 14 : -7)
        return (
          <g key={`pt${i}`}>
            <circle cx={cx} cy={cy} r="4"
              fill={pt.filled !== false ? col : 'white'}
              stroke={col} strokeWidth="2" />
            {pt.label && (
              <text x={labelX} y={labelY}
                fontSize="9" fill="#374151" fontWeight="600">{pt.label}</text>
            )}
          </g>
        )
      })}

      {/* Axis labels */}
      {spec.xLabel && (
        <text x={W - PR - 2} y={axisY - 5}
          fontSize="10" fill="#374151" fontStyle="italic" textAnchor="end">
          {spec.xLabel}
        </text>
      )}
      {spec.yLabel && (
        <text x={axisX + 5} y={PT + 2}
          fontSize="10" fill="#374151" fontStyle="italic">
          {spec.yLabel}
        </text>
      )}

      {/* Curve labels (legend) */}
      {spec.curves?.filter(c => c.label).map((curve, i) => (
        <g key={`cl${i}`}>
          <line x1={PL + 2} y1={PT + 12 + i * 14} x2={PL + 14} y2={PT + 12 + i * 14}
            stroke={curve.color ?? PURPLE} strokeWidth="2.5" strokeLinecap="round" />
          <text x={PL + 17} y={PT + 15 + i * 14} fontSize="9" fill="#374151">{curve.label}</text>
        </g>
      ))}

      {/* Title */}
      {spec.title && (
        <text x={W / 2} y={12} textAnchor="middle" fontSize="10" fill="#5B21B6" fontWeight="700">
          {spec.title}
        </text>
      )}
    </svg>
  )
}

// ─── Triangle renderer ─────────────────────────────────────────────────────────

function TriangleDiagram({ spec }: { spec: TriangleSpec }) {
  const PAD = 40
  const W = 280, H = 200

  // Compute bounding box of vertices
  const xs = spec.vertices.map(v => v.x)
  const ys = spec.vertices.map(v => v.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const rangeX = maxX - minX || 1, rangeY = maxY - minY || 1

  const drawW = W - 2 * PAD, drawH = H - 2 * PAD
  const scale = Math.min(drawW / rangeX, drawH / rangeY)

  const toX = (x: number) => PAD + (x - minX) * scale + (drawW - rangeX * scale) / 2
  const toY = (y: number) => H - PAD - (y - minY) * scale - (drawH - rangeY * scale) / 2

  const verts = spec.vertices.map(v => ({ px: toX(v.x), py: toY(v.y), label: v.label }))
  const polyPoints = verts.map(v => `${v.px},${v.py}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
      {/* Title */}
      {spec.title && (
        <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fill="#5B21B6" fontWeight="700">
          {spec.title}
        </text>
      )}

      {/* Triangle polygon */}
      <polygon points={polyPoints}
        fill="rgba(124,58,237,0.07)" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />

      {/* Angle marks */}
      {spec.angles?.map((ang, i) => {
        const v   = verts[ang.vertex]
        const col = '#059669'
        if (ang.rightAngle) {
          // Draw small square
          const size = 10
          const n1   = ang.vertex === 0 ? 1 : 0
          const n2   = ang.vertex === 0 ? 2 : (ang.vertex === 1 ? 2 : 1)
          const d1x  = (verts[n1].px - v.px) / Math.hypot(verts[n1].px - v.px, verts[n1].py - v.py) * size
          const d1y  = (verts[n1].py - v.py) / Math.hypot(verts[n1].px - v.px, verts[n1].py - v.py) * size
          const d2x  = (verts[n2].px - v.px) / Math.hypot(verts[n2].px - v.px, verts[n2].py - v.py) * size
          const d2y  = (verts[n2].py - v.py) / Math.hypot(verts[n2].px - v.px, verts[n2].py - v.py) * size
          return (
            <polyline key={`ang${i}`}
              points={`${v.px + d1x},${v.py + d1y} ${v.px + d1x + d2x},${v.py + d1y + d2y} ${v.px + d2x},${v.py + d2y}`}
              fill="none" stroke={col} strokeWidth="1.5" />
          )
        }
        return ang.label ? (
          <text key={`ang${i}`} x={v.px} y={v.py - 6}
            textAnchor="middle" fontSize="10" fill={col} fontWeight="700">
            {ang.label}
          </text>
        ) : null
      })}

      {/* Side labels */}
      {spec.sides?.map((side, i) => {
        const a  = verts[side.from], b = verts[side.to]
        const mx = (a.px + b.px) / 2, my = (a.py + b.py) / 2
        // Offset label perpendicular to the side, slightly outward
        const dx = b.px - a.px, dy = b.py - a.py
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy / len * 12, ny = dx / len * 12
        return (
          <text key={`sd${i}`} x={mx + nx} y={my + ny}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fill={side.color ?? '#1D4ED8'} fontWeight="600">
            {side.label}
          </text>
        )
      })}

      {/* Vertex labels */}
      {verts.map((v, i) => {
        const all   = verts.filter((_, j) => j !== i)
        const cx    = all.reduce((s, a) => s + a.px, 0) / all.length
        const cy    = all.reduce((s, a) => s + a.py, 0) / all.length
        const dx    = v.px - cx, dy = v.py - cy
        const len   = Math.hypot(dx, dy) || 1
        const lx    = v.px + (dx / len) * 14
        const ly    = v.py + (dy / len) * 14
        return spec.vertices[i].label ? (
          <text key={`vl${i}`} x={lx} y={ly}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="12" fill="#0F0F14" fontWeight="800">
            {spec.vertices[i].label}
          </text>
        ) : null
      })}
    </svg>
  )
}

// ─── Number line renderer ──────────────────────────────────────────────────────

function NumberLineDiagram({ spec }: { spec: NumberLineSpec }) {
  const W = 300, H = 80
  const PAD = 28
  const lineY = H / 2

  const toX = (v: number) => PAD + ((v - spec.min) / (spec.max - spec.min)) * (W - 2 * PAD)

  const ticks = niceTicks(spec.min, spec.max, 8)
  const PURPLE = '#7C3AED'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 90 }}>
      {/* Title */}
      {spec.title && (
        <text x={W / 2} y={12} textAnchor="middle" fontSize="10" fill="#5B21B6" fontWeight="700">
          {spec.title}
        </text>
      )}

      {/* Intervals (shaded regions) */}
      {spec.intervals?.map((interval, i) => {
        const x1 = toX(interval.from), x2 = toX(interval.to)
        return (
          <rect key={`iv${i}`} x={x1} y={lineY - 6} width={x2 - x1} height={12}
            fill={interval.color ?? PURPLE} fillOpacity="0.25" rx="3" />
        )
      })}

      {/* Main axis line */}
      <line x1={PAD - 8} y1={lineY} x2={W - PAD + 8} y2={lineY}
        stroke="#6B7280" strokeWidth="2" />
      {/* Arrow heads */}
      <polygon points={`${W-PAD+8},${lineY-3} ${W-PAD+14},${lineY} ${W-PAD+8},${lineY+3}`} fill="#6B7280" />
      <polygon points={`${PAD-8},${lineY-3} ${PAD-14},${lineY} ${PAD-8},${lineY+3}`}         fill="#6B7280" />

      {/* Tick marks */}
      {ticks.map(t => (
        <g key={`tk${t}`}>
          <line x1={toX(t)} y1={lineY - 5} x2={toX(t)} y2={lineY + 5}
            stroke="#9CA3AF" strokeWidth="1.5" />
          <text x={toX(t)} y={lineY + 17}
            textAnchor="middle" fontSize="9" fill="#6B7280">{fmt(t)}</text>
        </g>
      ))}

      {/* Interval labels */}
      {spec.intervals?.filter(iv => iv.label).map((iv, i) => (
        <text key={`ivl${i}`} x={(toX(iv.from) + toX(iv.to)) / 2} y={lineY - 10}
          textAnchor="middle" fontSize="9" fill={iv.color ?? PURPLE} fontWeight="600">
          {iv.label}
        </text>
      ))}

      {/* Points */}
      {spec.points?.map((pt, i) => {
        const cx  = toX(pt.x)
        const col = pt.color ?? PURPLE
        return (
          <g key={`pt${i}`}>
            <circle cx={cx} cy={lineY} r="6"
              fill={pt.filled !== false ? col : 'white'}
              stroke={col} strokeWidth="2.5" />
            {pt.label && (
              <text x={cx} y={lineY - 10}
                textAnchor="middle" fontSize="9" fill="#374151" fontWeight="700">
                {pt.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Circle renderer ───────────────────────────────────────────────────────────

function CircleDiagram({ spec }: { spec: CircleSpec }) {
  const W = 280, H = 200
  const PAD = 30

  const r      = spec.radius
  const cx_m   = spec.center.x
  const cy_m   = spec.center.y
  const xRange = spec.xRange ?? [cx_m - r * 1.4, cx_m + r * 1.4] as [number, number]
  const yRange = spec.yRange ?? [cy_m - r * 1.4, cy_m + r * 1.4] as [number, number]

  const plotW = W - 2 * PAD, plotH = H - 2 * PAD

  const toX = (x: number) => PAD + ((x - xRange[0]) / (xRange[1] - xRange[0])) * plotW
  const toY = (y: number) => H - PAD - ((y - yRange[0]) / (yRange[1] - yRange[0])) * plotH

  const axisY = Math.max(PAD, Math.min(H - PAD, toY(0)))
  const axisX = Math.max(PAD, Math.min(W - PAD, toX(0)))

  const cx_px = toX(cx_m), cy_px = toY(cy_m)
  const rx_px = toX(cx_m + r) - cx_px   // radius in px (x direction)
  const ry_px = cy_px - toY(cy_m + r)   // radius in px (y direction)
  const PURPLE = '#7C3AED'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 210 }}>
      {/* Axes */}
      <line x1={PAD} y1={axisY} x2={W - PAD} y2={axisY} stroke="#9CA3AF" strokeWidth="1.5" />
      <line x1={axisX} y1={PAD} x2={axisX} y2={H - PAD} stroke="#9CA3AF" strokeWidth="1.5" />

      {/* Circle */}
      <ellipse cx={cx_px} cy={cy_px} rx={Math.abs(rx_px)} ry={Math.abs(ry_px)}
        fill="rgba(124,58,237,0.06)" stroke={PURPLE} strokeWidth="2.5" />

      {/* Radius line */}
      <line x1={cx_px} y1={cy_px} x2={cx_px + Math.abs(rx_px)} y2={cy_px}
        stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={(cx_px + cx_px + Math.abs(rx_px)) / 2} y={cy_px - 5}
        textAnchor="middle" fontSize="9" fill="#B45309" fontWeight="600">
        r = {r}
      </text>

      {/* Center point */}
      <circle cx={cx_px} cy={cy_px} r="4" fill={PURPLE} />
      {spec.center.label && (
        <text x={cx_px + 7} y={cy_px - 5}
          fontSize="9" fill="#374151" fontWeight="700">{spec.center.label}</text>
      )}

      {/* Extra points */}
      {spec.points?.map((pt, i) => {
        const px = toX(pt.x), py = toY(pt.y)
        return (
          <g key={`pt${i}`}>
            <circle cx={px} cy={py} r="4"
              fill={pt.color ?? '#0EA5E9'} stroke="white" strokeWidth="1.5" />
            {pt.label && (
              <text x={px + 7} y={py - 4}
                fontSize="9" fill="#374151" fontWeight="600">{pt.label}</text>
            )}
          </g>
        )
      })}

      {/* Title */}
      {spec.title && (
        <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fill="#5B21B6" fontWeight="700">
          {spec.title}
        </text>
      )}
    </svg>
  )
}

// ─── Public component ──────────────────────────────────────────────────────────

export default function DiagramRenderer({
  spec,
  className,
}: {
  spec:       DiagramSpec | null | undefined
  className?: string
}) {
  if (!spec) return null

  const wrapper = (
    <div
      className={className}
      style={{
        background:   'white',
        borderRadius: 12,
        border:       '1.5px solid #EDE9FE',
        padding:      '8px 8px 4px',
        overflow:     'hidden',
      }}
    >
      {spec.type === 'cartesian'  && <CartesianDiagram  spec={spec} />}
      {spec.type === 'triangle'   && <TriangleDiagram   spec={spec} />}
      {spec.type === 'numberline' && <NumberLineDiagram spec={spec} />}
      {spec.type === 'circle'     && <CircleDiagram     spec={spec} />}
    </div>
  )

  return wrapper
}

// ─── Utility: extract spec from a "📊 Visual: [SPEC]{...}[/SPEC] text" step ──

export function extractDiagramSpec(stepText: string): {
  spec: DiagramSpec | null
  text: string
} {
  const match = stepText.match(/\[SPEC\]([\s\S]*?)\[\/SPEC\]/)
  if (!match) return { spec: null, text: stepText }

  let spec: DiagramSpec | null = null
  try {
    spec = JSON.parse(match[1]) as DiagramSpec
  } catch {
    // Malformed JSON — fall back to text-only
  }
  const text = stepText.replace(/\[SPEC\][\s\S]*?\[\/SPEC\]/, '').trim()
  return { spec, text }
}
