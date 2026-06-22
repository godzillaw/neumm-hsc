'use client'

import { useState } from 'react'

interface Props { color?: string }


// ── Tab 1: Function Machine ───────────────────────────────────────────────────

const MACHINES = [
  { label:'f(x) = x²',     fn:(x:number)=>x*x,       rule:'Square the input',      display:(x:number)=>`f(${x}) = ${x}² = ${x*x}` },
  { label:'f(x) = 2x − 1', fn:(x:number)=>2*x-1,     rule:'Double, subtract 1',    display:(x:number)=>`f(${x}) = 2×${x}−1 = ${2*x-1}` },
  { label:'f(x) = x² − 4', fn:(x:number)=>x*x-4,     rule:'Square, subtract 4',    display:(x:number)=>`f(${x}) = ${x}²−4 = ${x*x-4}` },
  { label:'f(x) = |x|',    fn:(x:number)=>Math.abs(x),rule:'Take absolute value',   display:(x:number)=>`f(${x}) = |${x}| = ${Math.abs(x)}` },
]

const INPUTS_M = [-3,-2,-1,0,1,2,3]

function MachineTab({ color }: { color:string }) {
  const [mIdx, setMIdx] = useState(0)
  const [input, setInput] = useState(2)
  const m = MACHINES[mIdx]
  const output = m.fn(input)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {MACHINES.map((m,i) => (
          <button key={i} onClick={()=>setMIdx(i)} className="px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all"
            style={i===mIdx ? {background:color,color:'white'} : {background:`${color}22`,color}}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Machine diagram */}
      <div className="flex items-center gap-1 justify-center flex-wrap">
        {/* Input */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[9px] font-black uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.4)' }}>INPUT x</p>
          <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5"
            style={{ background:`${color}33`, border:`2px solid ${color}` }}>
            <span className="text-2xl font-black text-white leading-none">{input}</span>
            <span className="text-[9px] font-black" style={{ color }}>x = {input}</span>
          </div>
        </div>

        {/* Arrow */}
        <svg width="32" height="16"><line x1="2" y1="8" x2="24" y2="8" stroke={color} strokeWidth="2"/><polygon points="22,4 30,8 22,12" fill={color}/></svg>

        {/* Rule box */}
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[9px] font-black uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.4)' }}>RULE</p>
          <div className="w-32 h-16 rounded-2xl flex flex-col items-center justify-center px-2"
            style={{ background:`${color}33`, border:`2px solid ${color}88` }}>
            <p className="text-[10px] font-bold text-white text-center leading-tight">{m.rule}</p>
            <p className="text-xs font-black mt-0.5" style={{ color }}>{m.label}</p>
          </div>
        </div>

        {/* Arrow */}
        <svg width="32" height="16"><line x1="2" y1="8" x2="24" y2="8" stroke="#34D399" strokeWidth="2"/><polygon points="22,4 30,8 22,12" fill="#34D399"/></svg>

        {/* Output */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[9px] font-black uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.4)' }}>OUTPUT</p>
          <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5"
            style={{ background:'rgba(52,211,153,0.18)', border:'2px solid #34D399' }}>
            <span className="text-2xl font-black text-white leading-none">{output}</span>
            <span className="text-[9px] font-black" style={{ color:'#34D399' }}>f({input})</span>
          </div>
        </div>
      </div>

      {/* Notation display */}
      <div className="rounded-xl px-4 py-2.5 text-center" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
        <p className="text-sm font-black text-white">{m.display(input)}</p>
      </div>

      {/* Input picker */}
      <div>
        <p className="text-[10px] font-black uppercase mb-1.5" style={{ color:'rgba(255,255,255,0.4)' }}>Try inputs:</p>
        <div className="flex gap-1.5 flex-wrap">
          {INPUTS_M.map(v => (
            <button key={v} onClick={()=>setInput(v)} className="w-9 h-9 rounded-xl text-sm font-black transition-all"
              style={v===input ? {background:color,color:'white'} : {background:`${color}22`,color}}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Key insight */}
      <div className="rounded-xl px-4 py-2.5" style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)' }}>
        <p className="text-xs font-bold text-white">⚡ Every input x gives exactly <strong>one</strong> output. That is the defining property of a function.</p>
      </div>
    </div>
  )
}

// ── Tab 2: Domain and Range Explorer ─────────────────────────────────────────

const DOMAIN_FNS = [
  {
    label:'f(x) = √x',
    domain:'x ≥ 0',
    domainInterval:'[0, ∞)',
    range:'y ≥ 0',
    rangeInterval:'[0, ∞)',
    reason:'Cannot square root a negative — so x must be ≥ 0',
    pts: Array.from({length:25},(_,i)=>[i*0.16, Math.sqrt(i*0.16)] as [number,number]),
    restrictedPts: Array.from({length:15},(_,i)=>[-0.1-i*0.2, 0] as [number,number]),
    lineColor:'#34D399',
  },
  {
    label:'f(x) = 1/x',
    domain:'x ≠ 0',
    domainInterval:'(-∞,0) ∪ (0,∞)',
    range:'y ≠ 0',
    rangeInterval:'(-∞,0) ∪ (0,∞)',
    reason:'Division by zero is undefined — x = 0 is excluded',
    pts: [
      ...Array.from({length:20},(_,i)=>[0.2+i*0.18, 1/(0.2+i*0.18)] as [number,number]),
      ...Array.from({length:20},(_,i)=>[-0.2-i*0.18, 1/(-0.2-i*0.18)] as [number,number]),
    ],
    restrictedPts: [] as [number,number][],
    lineColor:'#FBBF24',
  },
  {
    label:'f(x) = x²',
    domain:'x ∈ ℝ  (all reals)',
    domainInterval:'(-∞, ∞)',
    range:'y ≥ 0',
    rangeInterval:'[0, ∞)',
    reason:'Any real number can be squared. But the output y = x² is always ≥ 0.',
    pts: Array.from({length:41},(_,i)=>{const x=-4+i*0.2; return [x,x*x] as [number,number]}),
    restrictedPts: [] as [number,number][],
    lineColor:'#60A5FA',
  },
]

function DomainTab({ color }: { color:string }) {
  const [idx, setIdx] = useState(0)
  const f = DOMAIN_FNS[idx]
  const pxMin=20, pxMax=220, vMin=-3, vMax=4
  const pyMin=180, pyMax=10, vyMin=-3, vyMax=9

  function px(v:number){ return pxMin+((v-vMin)/(vMax-vMin))*(pxMax-pxMin) }
  function py(v:number){ return pyMin+((v-vyMin)/(vyMax-vyMin))*(pyMax-pyMin) }

  const pts = f.pts.filter(([x,y])=>x>=vMin&&x<=vMax&&y>=vyMin&&y<=vyMax)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {DOMAIN_FNS.map((fn,i) => (
          <button key={i} onClick={()=>setIdx(i)} className="px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all"
            style={i===idx ? {background:color,color:'white'} : {background:`${color}22`,color}}>
            {fn.label}
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="rounded-xl py-2 px-2" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <svg viewBox="0 0 240 200" width="100%" height="160">
          {/* Axes */}
          <line x1={pxMin} y1={(pyMin+pyMax)/2} x2={pxMax} y2={(pyMin+pyMax)/2} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line x1={px(0)} y1={pyMin} x2={px(0)} y2={pyMax} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          {/* Axis labels */}
          <text x={pxMax+5} y={(pyMin+pyMax)/2+4} fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Nunito,sans-serif">x</text>
          <text x={px(0)+5} y={pyMax+8} fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Nunito,sans-serif">y</text>

          {/* Restricted region shading (for sqrt) */}
          {idx === 0 && (
            <rect x={pxMin} y={pyMax} width={px(0)-pxMin} height={pyMin-pyMax} fill="rgba(248,113,113,0.1)"/>
          )}
          {/* Asymptote (for 1/x) */}
          {idx === 1 && (
            <line x1={px(0)} y1={pyMax} x2={px(0)} y2={pyMin} stroke="#F87171" strokeWidth="1.5" strokeDasharray="4,3"/>
          )}

          {/* Graph curve */}
          {pts.length > 1 && (
            <polyline
              points={pts.map(([x,y])=>`${px(x)},${py(y)}`).join(' ')}
              fill="none" stroke={f.lineColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
            />
          )}

          {/* Labels */}
          <text x="120" y="12" textAnchor="middle" fill={f.lineColor} fontSize="11" fontWeight="900" fontFamily="Nunito,sans-serif">{f.label}</text>
          {idx===0 && <text x={(pxMin+px(0))/2} y={pyMin-5} textAnchor="middle" fill="#F87171" fontSize="9" fontWeight="800" fontFamily="Nunito,sans-serif">undefined here</text>}
        </svg>
      </div>

      {/* Domain / Range pills */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl px-3 py-2.5" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
          <p className="text-[10px] font-black uppercase mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Domain (inputs)</p>
          <p className="text-sm font-black text-white">{f.domain}</p>
          <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{f.domainInterval}</p>
        </div>
        <div className="rounded-xl px-3 py-2.5" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
          <p className="text-[10px] font-black uppercase mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Range (outputs)</p>
          <p className="text-sm font-black text-white">{f.range}</p>
          <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{f.rangeInterval}</p>
        </div>
      </div>

      <div className="rounded-xl px-4 py-2.5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-bold text-white">💡 {f.reason}</p>
      </div>
    </div>
  )
}

// ── Tab 3: Vertical Line Test ─────────────────────────────────────────────────

const VLT_GRAPHS = [
  {
    label:'y = x²',
    isFunction: true,
    desc:'Every vertical line crosses at most once. ✓ Function.',
    pts: Array.from({length:41},(_,i)=>{const x=-4+i*0.2;return [x,x*x]}),
    vMin:-4, vMax:4, vyMin:-1, vyMax:10,
    lineColor:'#34D399',
  },
  {
    label:'y = x³ − x',
    isFunction: true,
    desc:'Wiggly but every x still gives exactly one y. ✓ Function.',
    pts: Array.from({length:61},(_,i)=>{const x=-3+i*0.1;return [x,x*x*x-x]}),
    vMin:-3, vMax:3, vyMin:-5, vyMax:5,
    lineColor:'#60A5FA',
  },
  {
    label:'x² + y² = 9 (circle)',
    isFunction: false,
    desc:'A vertical line through x = 0 hits (0,3) AND (0,−3). ✗ NOT a function.',
    pts: Array.from({length:73},(_,i)=>{const a=(i/72)*2*Math.PI;return [3*Math.cos(a),3*Math.sin(a)]}),
    vMin:-4, vMax:4, vyMin:-4, vyMax:4,
    lineColor:'#F87171',
  },
  {
    label:'x = y² (sideways parabola)',
    isFunction: false,
    desc:'x = 1 maps to both y = 1 and y = −1. ✗ NOT a function.',
    pts: Array.from({length:41},(_,i)=>{const y=-4+i*0.2;return [y*y, y]}),
    vMin:-1, vMax:9, vyMin:-4, vyMax:4,
    lineColor:'#F87171',
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VLTTab({ color }: { color:string }) {
  const [gIdx, setGIdx] = useState(0)
  const [vtX, setVtX] = useState<number|null>(null)
  const g = VLT_GRAPHS[gIdx]

  const W=240, H=200
  const pxl=20, pxr=220, pyt=10, pyb=185
  function px(v:number){ return pxl+((v-g.vMin)/(g.vMax-g.vMin))*(pxr-pxl) }
  function py(v:number){ return pyt+((v-g.vyMin)/(g.vyMax-g.vyMin))*(pyb-pyt) }
  const py0 = py(0), px0 = px(0)

  const validPts = g.pts.filter(([x,y])=>x>=g.vMin&&x<=g.vMax&&y>=g.vyMin&&y<=g.vyMax)

  // How many intersections does vertical line at svgX have?
  function intersections(svgVX: number): [number,number][] {
    const worldX = g.vMin + ((svgVX-pxl)/(pxr-pxl))*(g.vMax-g.vMin)
    const hits: [number,number][] = []
    for (let i=0;i<g.pts.length-1;i++) {
      const [x1,y1]=g.pts[i], [x2,y2]=g.pts[i+1]
      if ((x1<=worldX&&x2>=worldX)||(x2<=worldX&&x1>=worldX)) {
        if (Math.abs(x2-x1) < 0.001) continue
        const t = (worldX-x1)/(x2-x1)
        const yHit = y1+t*(y2-y1)
        if (yHit>=g.vyMin&&yHit<=g.vyMax) hits.push([svgVX, py(yHit)])
      }
    }
    return hits
  }

  const hits = vtX !== null ? intersections(vtX) : []

  function handleMouse(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX-rect.left)/rect.width)*W
    setVtX(Math.max(pxl, Math.min(pxr, relX)))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {VLT_GRAPHS.map((gr,i) => (
          <button key={i} onClick={()=>{setGIdx(i);setVtX(null)}} className="px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all"
            style={i===gIdx ? {background:gr.lineColor,color:'white'} : {background:`${gr.lineColor}22`,color:gr.lineColor}}>
            {gr.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl py-2 px-1" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="160" style={{cursor:'crosshair'}}
          onMouseMove={handleMouse} onMouseLeave={()=>setVtX(null)} onClick={handleMouse}>
          {/* Axes */}
          <line x1={pxl} y1={py0} x2={pxr} y2={py0} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <line x1={px0} y1={pyt} x2={px0} y2={pyb} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          {/* Curve */}
          <polyline points={validPts.map(([x,y])=>`${px(x)},${py(y)}`).join(' ')}
            fill="none" stroke={g.lineColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
          {/* Vertical test line */}
          {vtX !== null && (
            <>
              <line x1={vtX} y1={pyt} x2={vtX} y2={pyb} stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="4,2"/>
              {hits.map(([hx,hy],i) => <circle key={i} cx={hx} cy={hy} r={5} fill="#FBBF24"/>)}
              {hits.length >= 2 && (
                <text x={vtX+6} y={hits[0][1]-6} fill="#FBBF24" fontSize="9" fontWeight="900" fontFamily="Nunito,sans-serif">
                  {hits.length} points!
                </text>
              )}
            </>
          )}
          {/* Function badge */}
          <rect x={pxl} y={pyt} width={70} height={16} rx="4" fill={g.isFunction?'rgba(52,211,153,0.2)':'rgba(248,113,113,0.2)'}/>
          <text x={pxl+35} y={pyt+11} textAnchor="middle" fill={g.isFunction?'#34D399':'#F87171'} fontSize="9" fontWeight="900" fontFamily="Nunito,sans-serif">
            {g.isFunction ? '✓ Function' : '✗ Not a function'}
          </text>
        </svg>
      </div>

      <div className="rounded-xl px-4 py-3" style={{ background:g.isFunction?'rgba(52,211,153,0.1)':'rgba(248,113,113,0.1)', border:`1px solid ${g.isFunction?'#34D399':'#F87171'}44` }}>
        <p className="text-sm font-bold text-white">{g.desc}</p>
      </div>

      <p className="text-[11px] font-bold text-center" style={{ color:'rgba(255,255,255,0.35)' }}>Hover/tap the graph to draw a vertical line</p>
    </div>
  )
}

// ── Tab 4: Notation Practice ──────────────────────────────────────────────────

const NOTATION_QS = [
  { fn:'f(x) = 3x − 1', ask:'Find f(4)',      answer:'11', steps:['f(4) = 3(4) − 1','= 12 − 1','= 11'] },
  { fn:'f(x) = x² + 2', ask:'Find f(−3)',     answer:'11', steps:['f(−3) = (−3)² + 2','= 9 + 2','= 11'] },
  { fn:'f(x) = 2x²',    ask:'Find f(a)',      answer:'2a²', steps:['f(a) = 2(a)²','= 2a²', '(substitute a for x)'] },
  { fn:'f(x) = x − 5',  ask:'Find f(x + 1)', answer:'x−4', steps:['f(x+1) = (x+1) − 5','= x + 1 − 5','= x − 4'] },
  { fn:'f(x) = x²',     ask:'Find f(2) + f(3)', answer:'13', steps:['f(2) = 4, f(3) = 9','f(2) + f(3) = 4 + 9','= 13'] },
]

function NotationTab({ color }: { color:string }) {
  const [qi, setQi] = useState(0)
  const [shown, setShown] = useState(false)
  const q = NOTATION_QS[qi]

  function next() { setQi(i=>(i+1)%NOTATION_QS.length); setShown(false) }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wide" style={{ color:'rgba(255,255,255,0.4)' }}>Worked Example {qi+1} of {NOTATION_QS.length}</p>
        <div className="flex gap-1">
          {NOTATION_QS.map((_,i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background:i===qi?color:`${color}33` }}/>)}
        </div>
      </div>

      <div className="rounded-xl px-4 py-3" style={{ background:`${color}18`, border:`1px solid ${color}44` }}>
        <p className="text-xs font-black uppercase mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Given:</p>
        <p className="text-base font-black text-white">{q.fn}</p>
        <p className="text-xs font-black uppercase mt-2 mb-0.5" style={{ color:'rgba(255,255,255,0.4)' }}>Find:</p>
        <p className="text-xl font-black" style={{ color }}>{q.ask}</p>
      </div>

      <p className="text-xs font-bold" style={{ color:'rgba(255,255,255,0.45)' }}>
        💡 Tip: replace every x in the formula with what&apos;s in the brackets
      </p>

      {!shown ? (
        <button onClick={()=>setShown(true)} className="w-full py-3 rounded-xl text-sm font-black text-white transition-all"
          style={{ background:`${color}44`, border:`1px solid ${color}66` }}>
          Show working →
        </button>
      ) : (
        <div className="rounded-xl px-4 py-3 space-y-1.5" style={{ background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.4)' }}>
          <p className="text-[10px] font-black uppercase tracking-wide" style={{ color:'#34D399' }}>Working</p>
          {q.steps.map((line,i) => (
            <p key={i} className="text-sm font-bold text-white">{line}</p>
          ))}
          <p className="text-base font-black mt-1" style={{ color:'#34D399' }}>Answer: {q.answer}</p>
        </div>
      )}

      {shown && (
        <button onClick={next} className="w-full py-3 rounded-xl text-sm font-black text-white"
          style={{ background:`linear-gradient(135deg,${color},${color}CC)` }}>
          {qi === NOTATION_QS.length-1 ? 'Restart' : 'Next Example →'}
        </button>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

type Tab = 'machine' | 'domain' | 'vlt' | 'notation'

export default function FunctionMachineVisual({ color = '#0EA5E9' }: Props) {
  const [tab, setTab] = useState<Tab>('machine')

  const tabs: { id:Tab; label:string }[] = [
    { id:'machine',  label:'⚙️ Machine' },
    { id:'domain',   label:'🔍 Domain & Range' },
    { id:'vlt',      label:'📏 Vertical Line Test' },
    { id:'notation', label:'✍️ f(x) Notation' },
  ]

  return (
    <div className="rounded-2xl p-4 space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${color}33` }}>
      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
        Interactive — Functions & Function Notation
      </p>

      <div className="flex flex-wrap gap-1.5">
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
            style={tab===t.id ? {background:color,color:'white'} : {background:`${color}22`,color}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==='machine'  && <MachineTab  color={color}/>}
      {tab==='domain'   && <DomainTab   color={color}/>}
      {tab==='vlt'      && <VLTTab      color={color}/>}
      {tab==='notation' && <NotationTab color={color}/>}
    </div>
  )
}
