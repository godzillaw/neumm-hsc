'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathKeyboardInputProps {
  onChange: (latex: string) => void
  disabled?: boolean
  placeholder?: string
}

// Shortcut buttons: label shown on button, latex inserted, cursor offset from end
const BUTTONS = [
  { label: 'x²',    insert: '^{2}',         hint: 'Power'         },
  { label: 'xⁿ',    insert: '^{}',           hint: 'Exponent'      },
  { label: '√',     insert: '\\sqrt{}',      hint: 'Square root'   },
  { label: 'ⁿ√',    insert: '\\sqrt[n]{}',   hint: 'nth root'      },
  { label: 'a/b',   insert: '\\frac{}{}',    hint: 'Fraction'      },
  { label: 'π',     insert: '\\pi',          hint: 'Pi'            },
  { label: 'θ',     insert: '\\theta',       hint: 'Theta'         },
  { label: '∞',     insert: '\\infty',       hint: 'Infinity'      },
  { label: '≤',     insert: '\\leq ',        hint: 'Less or equal' },
  { label: '≥',     insert: '\\geq ',        hint: 'Greater/equal' },
  { label: '±',     insert: '\\pm ',         hint: 'Plus minus'    },
  { label: '×',     insert: '\\times ',      hint: 'Multiply'      },
  { label: '÷',     insert: '\\div ',        hint: 'Divide'        },
  { label: '∫',     insert: '\\int_{}^{}',   hint: 'Integral'      },
  { label: 'Σ',     insert: '\\sum_{}^{}',   hint: 'Summation'     },
  { label: '|x|',   insert: '|{}|',          hint: 'Absolute value'},
  { label: 'log',   insert: '\\log_{}',      hint: 'Logarithm'     },
  { label: 'sin',   insert: '\\sin(',        hint: 'Sine'          },
  { label: 'cos',   insert: '\\cos(',        hint: 'Cosine'        },
  { label: 'tan',   insert: '\\tan(',        hint: 'Tangent'       },
]

function renderPreview(latex: string): string {
  if (!latex.trim()) return ''
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      output: 'html',
    })
  } catch {
    return ''
  }
}

export default function MathKeyboardInput({
  onChange,
  disabled,
  placeholder = 'Type your answer here, e.g.  3x^{2} + \\frac{1}{2}',
}: MathKeyboardInputProps) {
  const [latex, setLatex] = useState('')
  const [preview, setPreview] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setPreview(renderPreview(latex))
    onChange(latex)
  }, [latex, onChange])

  const insertAt = useCallback((snippet: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? latex.length
    const end   = el.selectionEnd   ?? latex.length
    const next  = latex.slice(0, start) + snippet + latex.slice(end)
    setLatex(next)
    // Place cursor inside the first {} if present
    const innerBrace = snippet.indexOf('{}')
    const cursorPos  = innerBrace !== -1
      ? start + innerBrace + 1
      : start + snippet.length
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorPos, cursorPos)
    })
  }, [latex])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Symbol buttons */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        background: '#F5F3FF', borderRadius: 14, padding: '10px 10px 8px',
        border: '1.5px solid #DDD6FE',
      }}>
        {BUTTONS.map(btn => (
          <button
            key={btn.insert}
            title={btn.hint}
            onClick={() => insertAt(btn.insert)}
            disabled={disabled}
            style={{
              padding: '5px 10px', borderRadius: 8, border: '1.5px solid #DDD6FE',
              background: 'white', color: '#5B21B6', fontWeight: 700, fontSize: 13,
              cursor: disabled ? 'not-allowed' : 'pointer', lineHeight: 1.3,
              minWidth: 38,
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={latex}
        onChange={e => setLatex(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '12px 14px', borderRadius: 12,
          border: '2px solid #DDD6FE', fontFamily: 'monospace', fontSize: 14,
          resize: 'vertical', color: '#1F2937', outline: 'none',
          background: disabled ? '#F9F9F9' : 'white',
        }}
      />

      {/* Shortcut hint */}
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
        Tip: use <code>^</code> for powers, <code>_</code> for subscripts, <code>\frac&#123;&#125;&#123;&#125;</code> for fractions
      </p>

      {/* KaTeX live preview */}
      {latex.trim() && (
        <div style={{
          background: 'white', borderRadius: 12, padding: '12px 16px',
          border: '1.5px solid #DDD6FE', minHeight: 52,
          overflowX: 'auto',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Preview
          </p>
          {preview
            ? <div dangerouslySetInnerHTML={{ __html: preview }} />
            : <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Incomplete expression…</p>
          }
        </div>
      )}
    </div>
  )
}
