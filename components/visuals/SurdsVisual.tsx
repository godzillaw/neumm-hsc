'use client'
import { useState } from 'react'

const SIMPLIFY_EXAMPLES = [
  { surd: '√12',  perfect: 4,  other: 3,  result: '2√3',  steps: ['√12 = √(4 × 3)', '= √4 × √3', '= 2√3'] },
  { surd: '√50',  perfect: 25, other: 2,  result: '5√2',  steps: ['√50 = √(25 × 2)', '= √25 × √2', '= 5√2'] },
  { surd: '√72',  perfect: 36, other: 2,  result: '6√2',  steps: ['√72 = √(36 × 2)', '= √36 × √2', '= 6√2'] },
  { surd: '√48',  perfect: 16, other: 3,  result: '4√3',  steps: ['√48 = √(16 × 3)', '= √16 × √3', '= 4√3'] },
  { surd: '3√8',  perfect: 4,  other: 2,  result: '6√2',  steps: ['3√8 = 3√(4 × 2)', '= 3 × √4 × √2', '= 3 × 2√2 = 6√2'] },
]

const ARITHMETIC_EXAMPLES = [
  { type: 'add', expr: '2√3 + 5√3', result: '7√3', note: 'Add the coefficients — same surd ✓' },
  { type: 'add', expr: '√2 + √8', work: '√8 = 2√2', result: '3√2', note: 'Simplify first, then add' },
  { type: 'mul', expr: '√3 × √5', result: '√15', note: 'Multiply under the root' },
  { type: 'mul', expr: '2√3 × 4√5', result: '8√15', note: 'Coefficients × coefficients, surds × surds' },
  { type: 'rat', expr: '1/√2', result: '√2/2', note: 'Multiply by √2/√2 (= 1)' },
  { type: 'rat', expr: '3/(2√5)', result: '3√5/10', note: 'Multiply top & bottom by √5' },
]

const TABS = ['What is a Surd?', 'Simplify', 'Arithmetic']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SurdsVisual({ color }: { color?: string }) {
  const [tab, setTab] = useState(0)
  const [exIdx, setExIdx] = useState(0)
  const [step, setStep] = useState(0)
  const [artIdx, setArtIdx] = useState(0)

  const accent = '#8B5CF6'

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors"
            style={{ background: tab === i ? 'rgba(139,92,246,0.2)' : 'transparent', color: tab === i ? '#A78BFA' : 'rgba(255,255,255,0.4)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Tab 0 — What is a Surd? */}
        {tab === 0 && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              A <strong style={{ color: '#A78BFA' }}>surd</strong> is a root that cannot be simplified to a whole number or fraction. It stays irrational.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '√4 = 2', surd: false, reason: 'Perfect square → rational' },
                { label: '√2 = 1.414…', surd: true,  reason: 'Never ends, never repeats' },
                { label: '√9 = 3', surd: false, reason: 'Perfect square → rational' },
                { label: '√3 = 1.732…', surd: true,  reason: 'Cannot be simplified' },
                { label: '∛8 = 2', surd: false, reason: 'Perfect cube → rational' },
                { label: '∛5 = 1.709…', surd: true,  reason: 'Stays as a surd' },
              ].map(r => (
                <div key={r.label} className="rounded-xl p-3" style={{ background: r.surd ? 'rgba(139,92,246,0.15)' : 'rgba(56,178,172,0.1)', border: `1px solid ${r.surd ? 'rgba(139,92,246,0.3)' : 'rgba(56,178,172,0.3)'}` }}>
                  <div className="text-base font-mono font-bold mb-1" style={{ color: r.surd ? '#A78BFA' : '#38B2AC' }}>{r.label}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.reason}</div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-wide" style={{ color: r.surd ? '#A78BFA' : '#38B2AC' }}>
                    {r.surd ? '✓ SURD' : '✗ NOT A SURD'}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <p className="text-xs font-bold" style={{ color: '#A78BFA' }}>WHY do we care?</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Surds give <em>exact</em> answers. Writing √2 is more precise than 1.41421356… Exams expect exact form.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1 — Simplify */}
        {tab === 1 && (
          <div className="space-y-4">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Find the <strong style={{ color: '#A78BFA' }}>largest perfect square</strong> factor, split, simplify.
            </p>
            {/* Example picker */}
            <div className="flex gap-2 flex-wrap">
              {SIMPLIFY_EXAMPLES.map((e, i) => (
                <button key={i} onClick={() => { setExIdx(i); setStep(0) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
                  style={{ background: exIdx === i ? accent : 'rgba(255,255,255,0.07)', color: exIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {e.surd}
                </button>
              ))}
            </div>
            {/* Step display */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
              {SIMPLIFY_EXAMPLES[exIdx].steps.slice(0, step + 1).map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ background: accent, color: '#fff' }}>{i + 1}</div>
                  <span className="font-mono text-base" style={{ color: i === step ? '#fff' : 'rgba(255,255,255,0.5)' }}>{s}</span>
                </div>
              ))}
              {step === SIMPLIFY_EXAMPLES[exIdx].steps.length - 1 && (
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="text-xs font-bold" style={{ color: '#38B2AC' }}>
                    ✓ Simplified: {SIMPLIFY_EXAMPLES[exIdx].result}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.07)', color: step === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>
                ← Back
              </button>
              <button onClick={() => setStep(Math.min(SIMPLIFY_EXAMPLES[exIdx].steps.length - 1, step + 1))}
                disabled={step === SIMPLIFY_EXAMPLES[exIdx].steps.length - 1}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{ background: step < SIMPLIFY_EXAMPLES[exIdx].steps.length - 1 ? accent : 'rgba(255,255,255,0.07)',
                  color: step < SIMPLIFY_EXAMPLES[exIdx].steps.length - 1 ? '#fff' : 'rgba(255,255,255,0.2)' }}>
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Tab 2 — Arithmetic */}
        {tab === 2 && (
          <div className="space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              {['Add/Sub', 'Multiply', 'Rationalise'].map((lbl, i) => (
                <button key={lbl} onClick={() => setArtIdx(i)}
                  className="px-3 py-1 rounded-lg text-[11px] font-bold transition-colors"
                  style={{ background: artIdx === i ? accent : 'rgba(255,255,255,0.07)', color: artIdx === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {lbl}
                </button>
              ))}
            </div>
            {ARITHMETIC_EXAMPLES
              .filter(e => artIdx === 0 ? e.type === 'add' : artIdx === 1 ? e.type === 'mul' : e.type === 'rat')
              .map((e, i) => (
                <div key={i} className="rounded-xl p-3 space-y-1.5" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-base font-bold" style={{ color: '#fff' }}>{e.expr}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>=</span>
                    <span className="font-mono text-base font-bold" style={{ color: '#A78BFA' }}>{e.result}</span>
                  </div>
                  {e.work && <div className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Hint: {e.work}</div>}
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{e.note}</div>
                </div>
              ))}
            {artIdx === 2 && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <p className="text-xs font-bold" style={{ color: '#A78BFA' }}>The trick</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Multiply by <strong>√n / √n</strong> — that equals 1, so the value doesn&apos;t change. But √n × √n = n (a whole number!), clearing the denominator.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
