'use client'

/**
 * MathText — renders a string that may contain LaTeX math delimiters
 * using KaTeX.
 *
 *   $$...$$ → display-mode math (centred, larger)
 *   $...$   → inline math
 *   plain text segments are rendered as-is
 *
 * Usage:
 *   <MathText text={question.content.question_text} />
 *   <MathText text={optionText} className="text-sm font-semibold" />
 */

import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathTextProps {
  text:       string | null | undefined
  className?: string
  style?:     React.CSSProperties
  as?:        'span' | 'p' | 'div'
}

export default function MathText({ text, className, style, as: Tag = 'span' }: MathTextProps) {
  if (!text) return null

  // Split on $$...$$ (display) before $...$ (inline) so display math isn't
  // greedily consumed by the inline pattern.
  const segments = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)

  const nodes = segments.map((seg, i) => {
    // ── Display math  $$...$$
    if (seg.startsWith('$$') && seg.endsWith('$$') && seg.length > 4) {
      const math = seg.slice(2, -2).trim()
      return (
        <span
          key={i}
          className="block text-center my-1"
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(math, {
              displayMode:  true,
              throwOnError: false,
              output:       'html',
            }),
          }}
        />
      )
    }

    // ── Inline math  $...$
    if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) {
      const math = seg.slice(1, -1).trim()
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(math, {
              displayMode:  false,
              throwOnError: false,
              output:       'html',
            }),
          }}
        />
      )
    }

    // ── Plain text
    return seg ? <span key={i}>{seg}</span> : null
  })

  return (
    <Tag className={className} style={style}>
      {nodes}
    </Tag>
  )
}
