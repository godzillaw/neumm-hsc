/**
 * POST /api/generate-questions
 * Generates HSC questions for a topic on-the-fly using Claude.
 * Called by PracticeSession when a topic has no questions in DB.
 * maxDuration = 60 allows Pro-tier Vercel functions to generate without timeout.
 */

import { NextRequest, NextResponse }    from 'next/server'
import { createServerClient }           from '@supabase/ssr'
import { cookies }                      from 'next/headers'
import Anthropic                        from '@anthropic-ai/sdk'

export const dynamic    = 'force-dynamic'
export const maxDuration = 60   // seconds — Vercel Pro: up to 60s

// ─── Topic metadata ────────────────────────────────────────────────────────────

const TOPIC_META: Record<string, { name: string; nesa: string }> = {
  'MA-CALC-D01': { name: 'Differentiation basics — power rule, sum rule, constant rule',      nesa: 'MA-C1' },
  'MA-CALC-D02': { name: 'Differentiation — product rule and quotient rule',                   nesa: 'MA-C1' },
  'MA-CALC-D03': { name: 'Differentiation — chain rule and composite functions',               nesa: 'MA-C1' },
  'MA-CALC-D04': { name: 'Differentiation of trigonometric functions sin, cos, tan',           nesa: 'MA-C3' },
  'MA-CALC-D05': { name: 'Differentiation of exponential functions',                           nesa: 'MA-C2' },
  'MA-CALC-D06': { name: 'Differentiation of logarithmic functions',                           nesa: 'MA-C2' },
  'MA-CALC-D07': { name: 'Differentiation applications — tangents and normals',                nesa: 'MA-C1' },
  'MA-CALC-D08': { name: 'Differentiation applications — stationary points',                   nesa: 'MA-C1' },
  'MA-CALC-D09': { name: 'Differentiation applications — optimisation problems',               nesa: 'MA-C1' },
  'MA-CALC-D10': { name: 'Differentiation applications — rates of change',                     nesa: 'MA-C1' },
  'MA-CALC-D11': { name: 'Second derivative — concavity and points of inflection',             nesa: 'MA-C1' },
  'MA-CALC-D12': { name: 'Implicit differentiation and parametric differentiation',            nesa: 'MA-C1' },
  'MA-CALC-I01': { name: 'Integration basics — antiderivatives and indefinite integrals',      nesa: 'MA-C4' },
  'MA-CALC-I02': { name: 'Integration of polynomial functions',                                nesa: 'MA-C4' },
  'MA-CALC-I03': { name: 'Integration of trigonometric functions',                             nesa: 'MA-C4' },
  'MA-CALC-I04': { name: 'Integration of exponential and logarithmic functions',               nesa: 'MA-C4' },
  'MA-CALC-I05': { name: 'Integration by substitution',                                        nesa: 'MA-C4' },
  'MA-CALC-I06': { name: 'Definite integrals and the Fundamental Theorem of Calculus',         nesa: 'MA-C4' },
  'MA-CALC-I07': { name: 'Area under a curve using definite integrals',                        nesa: 'MA-C4' },
  'MA-CALC-I08': { name: 'Area between two curves',                                            nesa: 'MA-C4' },
  'MA-CALC-I09': { name: 'Volumes of solids of revolution',                                    nesa: 'MA-C4' },
  'MA-CALC-I10': { name: 'Integration applications — kinematics',                              nesa: 'MA-C4' },
  'MA-CALC-I11': { name: 'Trapezoidal rule and numerical integration',                         nesa: 'MA-C4' },
  'MA-CALC-I12': { name: 'Exponential growth and decay',                                       nesa: 'MA-C4' },
  'MA-TRIG-01':  { name: 'Trigonometric ratios — exact values 30, 45, 60 degrees',             nesa: 'MA-T1' },
  'MA-TRIG-02':  { name: 'Trigonometric graphs — sine cosine tangent and transformations',     nesa: 'MA-T1' },
  'MA-TRIG-03':  { name: 'Trigonometric identities — Pythagorean and reciprocal',              nesa: 'MA-T2' },
  'MA-TRIG-04':  { name: 'Trigonometric equations — solving in given domains',                 nesa: 'MA-T2' },
  'MA-TRIG-05':  { name: 'Inverse trigonometric functions arcsin arccos arctan',               nesa: 'MA-T2' },
  'MA-TRIG-06':  { name: 'Compound angle and double angle formulas',                           nesa: 'MA-T3' },
  'MA-TRIG-07':  { name: 'Sine rule cosine rule and area formula',                             nesa: 'MA-T1' },
  'MA-TRIG-08':  { name: 'Bearings and 3D trigonometry problems',                             nesa: 'MA-T1' },
  'MA-TRIG-09':  { name: 'Radians — conversion arc length sector area',                       nesa: 'MA-T2' },
  'MA-EXP-01':   { name: 'Exponential functions — graphs properties transformations',          nesa: 'MA-E1' },
  'MA-EXP-02':   { name: 'Solving exponential equations',                                      nesa: 'MA-E1' },
  'MA-EXP-03':   { name: 'Logarithm laws — product quotient power rules',                     nesa: 'MA-E1' },
  'MA-EXP-04':   { name: 'Solving logarithmic equations',                                      nesa: 'MA-E1' },
  'MA-EXP-05':   { name: 'Natural logarithm — properties and equations with e',               nesa: 'MA-E1' },
  'MA-EXP-06':   { name: 'Applications of exponential functions — population and finance',    nesa: 'MA-E2' },
  'MA-FUNC-01':  { name: 'Functions — domain range function notation',                         nesa: 'MA-F1' },
  'MA-FUNC-02':  { name: 'Types of functions — one-to-one many-to-one odd even',              nesa: 'MA-F1' },
  'MA-FUNC-03':  { name: 'Composite functions and function of a function',                     nesa: 'MA-F1' },
  'MA-FUNC-04':  { name: 'Inverse functions — finding and graphing inverses',                  nesa: 'MA-F1' },
  'MA-FUNC-05':  { name: 'Graph transformations — translations reflections dilations',         nesa: 'MA-F1' },
  'MA-FUNC-06':  { name: 'Absolute value functions and equations',                             nesa: 'MA-F1' },
  'MA-FUNC-07':  { name: 'Polynomial functions — sketching and end behaviour',                 nesa: 'MA-F2' },
  'MA-FUNC-08':  { name: 'Rational functions and asymptotes',                                  nesa: 'MA-F2' },
  'MA-FUNC-09':  { name: 'Limits and continuity of functions',                                 nesa: 'MA-F2' },
  'MA-ALG-01':   { name: 'Quadratic equations — factoring completing the square formula',     nesa: 'MA-A1' },
  'MA-ALG-02':   { name: 'Quadratic functions — graphs vertex discriminant',                   nesa: 'MA-A1' },
  'MA-ALG-03':   { name: 'Simultaneous equations — linear and non-linear',                    nesa: 'MA-A1' },
  'MA-ALG-04':   { name: 'Polynomial equations — factor theorem remainder theorem',            nesa: 'MA-A1' },
  'MA-ALG-05':   { name: 'Inequalities — linear and quadratic',                               nesa: 'MA-A1' },
  'MA-ALG-06':   { name: 'Arithmetic sequences and series',                                    nesa: 'MA-A2' },
  'MA-ALG-07':   { name: 'Geometric sequences and series',                                     nesa: 'MA-A2' },
  'MA-ALG-08':   { name: 'Surds — simplifying and rationalising denominators',                nesa: 'MA-A1' },
  'MA-STAT-01':  { name: 'Data representation — histograms box plots dot plots',              nesa: 'MA-S1' },
  'MA-STAT-02':  { name: 'Measures of central tendency — mean median mode',                   nesa: 'MA-S1' },
  'MA-STAT-03':  { name: 'Measures of spread — range IQR standard deviation variance',        nesa: 'MA-S1' },
  'MA-STAT-04':  { name: 'Correlation and regression — scatterplots line of best fit',        nesa: 'MA-S2' },
  'MA-STAT-05':  { name: 'Normal distribution — z-scores and empirical rule',                 nesa: 'MA-S3' },
  'MA-STAT-06':  { name: 'Sampling and statistical inference',                                 nesa: 'MA-S4' },
  'MA-PROB-01':  { name: 'Basic probability — sample spaces events',                           nesa: 'MA-S1' },
  'MA-PROB-02':  { name: 'Conditional probability and independence',                           nesa: 'MA-S1' },
  'MA-PROB-03':  { name: 'Discrete probability distributions',                                 nesa: 'MA-S1' },
  'MA-PROB-04':  { name: 'Binomial distribution — probability mean variance',                 nesa: 'MA-S1' },
  'MA-PROB-05':  { name: 'Counting techniques — permutations and combinations',               nesa: 'MA-S1' },
  'MA-FIN-01':   { name: 'Simple interest calculations',                                       nesa: 'MA-M1' },
  'MA-FIN-02':   { name: 'Compound interest — future value and present value',                nesa: 'MA-M1' },
  'MA-FIN-03':   { name: 'Annuities — future value and present value',                        nesa: 'MA-M1' },
  'MA-FIN-04':   { name: 'Loans and reducible interest — repayment schedules',                nesa: 'MA-M1' },
  'MA-FIN-05':   { name: 'Investment analysis and financial planning',                         nesa: 'MA-M1' },
  'MA-COORD-01': { name: 'Coordinate geometry — distance midpoint gradient',                   nesa: 'MA-G2' },
  'MA-COORD-02': { name: 'Equations of lines — various forms parallel perpendicular',          nesa: 'MA-G2' },
  'MA-COORD-03': { name: 'Circles — equations tangents chords',                               nesa: 'MA-G2' },
  'MA-COORD-04': { name: 'Parabolas — focus directrix tangents',                              nesa: 'MA-G2' },
  'MA-COORD-05': { name: 'Locus problems and parametric equations',                            nesa: 'MA-G2' },
  'MA-EXT-01':   { name: 'Mathematical induction — divisibility and inequalities',             nesa: 'MA-P1' },
  'MA-EXT-02':   { name: 'Binomial theorem — expansion and coefficients',                     nesa: 'MA-A3' },
  'MA-EXT-03':   { name: 'Further integration by parts',                                       nesa: 'MA-C5' },
  'MA-EXT-04':   { name: 'Differential equations — formation and solution',                    nesa: 'MA-C5' },
  'MA-EXT-05':   { name: 'Mechanics — projectile motion',                                     nesa: 'MA-M2' },
  'MA-EXT-06':   { name: 'Vectors — operations dot product projections',                      nesa: 'MA-V1' },
  'MA-EXT-07':   { name: 'Complex numbers — operations modulus argument polar form',           nesa: 'MA-N1' },
  'MA-EXT-08':   { name: 'Further trigonometry — t-formula and auxiliary angle method',       nesa: 'MA-T4' },
}

function createSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,    // service role to bypass RLS for inserts
    {
      cookies: {
        getAll()            { return cookieStore.getAll() },
        setAll(list)        { list.forEach(({ name, value, options }) => { try { cookieStore.set(name, value, options) } catch {} }) },
      },
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json() as { topic?: string }
    if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 })

    const meta = TOPIC_META[topic]
    if (!meta) return NextResponse.json({ error: 'Unknown topic' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('[generate-questions] ANTHROPIC_API_KEY not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const supabase = createSupabase()

    // Double-check questions don't already exist (avoid race conditions)
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .ilike('outcome_id', `${topic}%`)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ status: 'already_exists', count: existing.length })
    }

    const client  = new Anthropic({ apiKey })
    const allRows: Record<string, unknown>[] = []

    // Generate 1 band at a time — start with band 3 (medium) for immediate use.
    // Keeps the request under ~5s, safe for all Vercel tiers.
    // Background seed will fill remaining bands over time.
    for (const band of [3]) {
      try {
        const prompt = `Generate exactly 12 HSC Advanced Mathematics multiple choice questions on: "${meta.name}"
Difficulty: medium (band ${band}) — multi-step, requires understanding.

Return ONLY a valid JSON array — no markdown, no extra text.
Each object must have exactly these fields:
{
  "outcome_id": "${topic}-B${band}",
  "nesa_outcome_code": "${meta.nesa}",
  "difficulty_band": ${band},
  "question_text": "complete self-contained question",
  "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...",
  "correct_option": "a",
  "explanation": "2-3 sentences explaining correct answer",
  "step_by_step": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
}
Generate exactly 12 unique questions with plausible distractors. Start JSON array with [ immediately.`

        const res = await client.messages.create({
          model:      'claude-haiku-4-5',
          max_tokens: 4096,
          messages:   [{ role: 'user', content: prompt }],
        })

        const text = res.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map(b => b.text)
          .join('')

        // Parse JSON array
        const start = text.indexOf('[')
        if (start === -1) { console.warn(`[generate-questions] No JSON array in band ${band} response`); continue }

        let parsed: Record<string, unknown>[] = []
        try {
          const end = text.lastIndexOf(']')
          if (end !== -1) parsed = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>[]
        } catch {
          // extract objects individually on parse failure
          const chunk = text.slice(start)
          let depth = 0, inStr = false, escape = false, objStart = -1
          for (let i = 0; i < chunk.length; i++) {
            const ch = chunk[i]
            if (escape) { escape = false; continue }
            if (ch === '\\' && inStr) { escape = true; continue }
            if (ch === '"') { inStr = !inStr; continue }
            if (inStr) continue
            if (ch === '{') { if (depth === 0) objStart = i; depth++ }
            else if (ch === '}') {
              depth--
              if (depth === 0 && objStart !== -1) {
                try { parsed.push(JSON.parse(chunk.slice(objStart, i + 1)) as Record<string, unknown>) } catch {}
                objStart = -1
              }
            }
          }
        }

        if (parsed.length === 0) { console.warn(`[generate-questions] Parsed 0 questions for band ${band}`); continue }

        const rows = parsed.map(q => ({
          outcome_id:        String(q.outcome_id ?? `${topic}-B${band}`),
          course:            'Advanced Mathematics',
          difficulty_band:   Number(q.difficulty_band ?? band),
          format:            'multiple_choice',
          content_json: {
            question_text: String(q.question_text ?? ''),
            option_a:      String(q.option_a ?? ''),
            option_b:      String(q.option_b ?? ''),
            option_c:      String(q.option_c ?? ''),
            option_d:      String(q.option_d ?? ''),
          },
          correct_answer:    String(q.correct_option ?? 'a').toLowerCase(),
          explanation:       String(q.explanation ?? ''),
          step_by_step:      Array.isArray(q.step_by_step) ? q.step_by_step : [],
          nesa_outcome_code: String(q.nesa_outcome_code ?? meta.nesa),
          served_to:         [],
        }))

        const { data: inserted, error: insertErr } = await supabase
          .from('questions')
          .insert(rows)
          .select('id')

        if (insertErr) console.error(`[generate-questions] Insert error band ${band}:`, insertErr.message)
        else allRows.push(...(inserted ?? []))

      } catch (bandErr) {
        console.error(`[generate-questions] Band ${band} failed:`, bandErr)
      }
    }

    return NextResponse.json({ status: 'ok', inserted: allRows.length })

  } catch (err) {
    console.error('[generate-questions] Unhandled error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
