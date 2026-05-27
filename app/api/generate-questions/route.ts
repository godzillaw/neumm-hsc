/**
 * POST /api/generate-questions
 * Body: { topic: "MA-ALG-02" }
 *
 * Generates 6 HSC questions for an unseeded topic via Claude Haiku.
 * Uses Supabase service role (no cookie auth needed).
 * Single API call keeps latency ~3-5s, safe on all Vercel tiers.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }             from '@supabase/supabase-js'
import Anthropic                    from '@anthropic-ai/sdk'

export const dynamic     = 'force-dynamic'
export const maxDuration = 60   // Vercel Pro: respected. Hobby: capped at 10s.

// ─── Topic catalogue ──────────────────────────────────────────────────────────

const TOPICS: Record<string, { name: string; nesa: string }> = {
  'MA-CALC-D01': { name: 'Differentiation basics — power rule, sum rule, constant rule',       nesa: 'MA-C1' },
  'MA-CALC-D02': { name: 'Differentiation — product rule and quotient rule',                    nesa: 'MA-C1' },
  'MA-CALC-D03': { name: 'Differentiation — chain rule and composite functions',                nesa: 'MA-C1' },
  'MA-CALC-D04': { name: 'Differentiation of trigonometric functions sin, cos, tan',            nesa: 'MA-C3' },
  'MA-CALC-D05': { name: 'Differentiation of exponential functions',                            nesa: 'MA-C2' },
  'MA-CALC-D06': { name: 'Differentiation of logarithmic functions',                            nesa: 'MA-C2' },
  'MA-CALC-D07': { name: 'Differentiation applications — tangents and normals',                 nesa: 'MA-C1' },
  'MA-CALC-D08': { name: 'Differentiation applications — stationary points',                    nesa: 'MA-C1' },
  'MA-CALC-D09': { name: 'Differentiation applications — optimisation problems',                nesa: 'MA-C1' },
  'MA-CALC-D10': { name: 'Differentiation applications — rates of change',                      nesa: 'MA-C1' },
  'MA-CALC-D11': { name: 'Second derivative — concavity and points of inflection',              nesa: 'MA-C1' },
  'MA-CALC-D12': { name: 'Implicit differentiation and parametric differentiation',             nesa: 'MA-C1' },
  'MA-CALC-I01': { name: 'Integration basics — antiderivatives and indefinite integrals',       nesa: 'MA-C4' },
  'MA-CALC-I02': { name: 'Integration of polynomial functions',                                 nesa: 'MA-C4' },
  'MA-CALC-I03': { name: 'Integration of trigonometric functions',                              nesa: 'MA-C4' },
  'MA-CALC-I04': { name: 'Integration of exponential and logarithmic functions',                nesa: 'MA-C4' },
  'MA-CALC-I05': { name: 'Integration by substitution',                                         nesa: 'MA-C4' },
  'MA-CALC-I06': { name: 'Definite integrals and the Fundamental Theorem of Calculus',          nesa: 'MA-C4' },
  'MA-CALC-I07': { name: 'Area under a curve using definite integrals',                         nesa: 'MA-C4' },
  'MA-CALC-I08': { name: 'Area between two curves',                                             nesa: 'MA-C4' },
  'MA-CALC-I09': { name: 'Volumes of solids of revolution',                                     nesa: 'MA-C4' },
  'MA-CALC-I10': { name: 'Integration applications — kinematics',                               nesa: 'MA-C4' },
  'MA-CALC-I11': { name: 'Trapezoidal rule and numerical integration',                          nesa: 'MA-C4' },
  'MA-CALC-I12': { name: 'Exponential growth and decay',                                        nesa: 'MA-C4' },
  'MA-TRIG-01':  { name: 'Trigonometric ratios — exact values 30°, 45°, 60°',                   nesa: 'MA-T1' },
  'MA-TRIG-02':  { name: 'Trigonometric graphs — sine cosine tangent and transformations',      nesa: 'MA-T1' },
  'MA-TRIG-03':  { name: 'Trigonometric identities — Pythagorean and reciprocal',               nesa: 'MA-T2' },
  'MA-TRIG-04':  { name: 'Trigonometric equations — solving in given domains',                  nesa: 'MA-T2' },
  'MA-TRIG-05':  { name: 'Inverse trigonometric functions sin⁻¹, cos⁻¹, tan⁻¹',               nesa: 'MA-T2' },
  'MA-TRIG-06':  { name: 'Compound angle and double angle formulas',                            nesa: 'MA-T3' },
  'MA-TRIG-07':  { name: 'Sine rule cosine rule and area formula',                              nesa: 'MA-T1' },
  'MA-TRIG-08':  { name: 'Bearings and 3D trigonometry problems',                              nesa: 'MA-T1' },
  'MA-TRIG-09':  { name: 'Radians — conversion arc length sector area',                        nesa: 'MA-T2' },
  'MA-EXP-01':   { name: 'Exponential functions — graphs properties transformations',           nesa: 'MA-E1' },
  'MA-EXP-02':   { name: 'Solving exponential equations',                                       nesa: 'MA-E1' },
  'MA-EXP-03':   { name: 'Logarithm laws — product quotient power rules',                      nesa: 'MA-E1' },
  'MA-EXP-04':   { name: 'Solving logarithmic equations',                                       nesa: 'MA-E1' },
  'MA-EXP-05':   { name: 'Natural logarithm — properties and equations with e',                nesa: 'MA-E1' },
  'MA-EXP-06':   { name: 'Applications of exponential functions — population and finance',     nesa: 'MA-E2' },
  'MA-FUNC-01':  { name: 'Functions — domain range function notation',                          nesa: 'MA-F1' },
  'MA-FUNC-02':  { name: 'Types of functions — one-to-one many-to-one odd even',               nesa: 'MA-F1' },
  'MA-FUNC-03':  { name: 'Composite functions and function of a function',                      nesa: 'MA-F1' },
  'MA-FUNC-04':  { name: 'Inverse functions — finding and graphing inverses',                   nesa: 'MA-F1' },
  'MA-FUNC-05':  { name: 'Graph transformations — translations reflections dilations',          nesa: 'MA-F1' },
  'MA-FUNC-06':  { name: 'Absolute value functions and equations',                              nesa: 'MA-F1' },
  'MA-FUNC-07':  { name: 'Polynomial functions — sketching and end behaviour',                  nesa: 'MA-F2' },
  'MA-FUNC-08':  { name: 'Rational functions and asymptotes',                                   nesa: 'MA-F2' },
  'MA-FUNC-09':  { name: 'Limits and continuity of functions',                                  nesa: 'MA-F2' },
  'MA-ALG-01':   { name: 'Quadratic equations — factoring completing the square formula',      nesa: 'MA-A1' },
  'MA-ALG-02':   { name: 'Quadratic functions — graphs vertex discriminant',                    nesa: 'MA-A1' },
  'MA-ALG-03':   { name: 'Simultaneous equations — linear and non-linear',                     nesa: 'MA-A1' },
  'MA-ALG-04':   { name: 'Polynomial equations — factor theorem remainder theorem',             nesa: 'MA-A1' },
  'MA-ALG-05':   { name: 'Inequalities — linear and quadratic',                                nesa: 'MA-A1' },
  'MA-ALG-06':   { name: 'Arithmetic sequences and series',                                     nesa: 'MA-A2' },
  'MA-ALG-07':   { name: 'Geometric sequences and series',                                      nesa: 'MA-A2' },
  'MA-ALG-08':   { name: 'Surds — simplifying and rationalising denominators',                 nesa: 'MA-A1' },
  'MA-STAT-01':  { name: 'Data representation — histograms box plots dot plots',               nesa: 'MA-S1' },
  'MA-STAT-02':  { name: 'Measures of central tendency — mean median mode',                    nesa: 'MA-S1' },
  'MA-STAT-03':  { name: 'Measures of spread — range IQR standard deviation variance',         nesa: 'MA-S1' },
  'MA-STAT-04':  { name: 'Correlation and regression — scatterplots line of best fit',         nesa: 'MA-S2' },
  'MA-STAT-05':  { name: 'Normal distribution — z-scores and empirical rule',                  nesa: 'MA-S3' },
  'MA-STAT-06':  { name: 'Sampling and statistical inference',                                  nesa: 'MA-S4' },
  'MA-PROB-01':  { name: 'Basic probability — sample spaces events',                            nesa: 'MA-S1' },
  'MA-PROB-02':  { name: 'Conditional probability and independence',                            nesa: 'MA-S1' },
  'MA-PROB-03':  { name: 'Discrete probability distributions',                                  nesa: 'MA-S1' },
  'MA-PROB-04':  { name: 'Binomial distribution — probability mean variance',                  nesa: 'MA-S1' },
  'MA-PROB-05':  { name: 'Counting techniques — permutations and combinations',                nesa: 'MA-S1' },
  'MA-FIN-01':   { name: 'Simple interest calculations',                                        nesa: 'MA-M1' },
  'MA-FIN-02':   { name: 'Compound interest — future value and present value',                 nesa: 'MA-M1' },
  'MA-FIN-03':   { name: 'Annuities — future value and present value',                         nesa: 'MA-M1' },
  'MA-FIN-04':   { name: 'Loans and reducible interest — repayment schedules',                 nesa: 'MA-M1' },
  'MA-FIN-05':   { name: 'Investment analysis and financial planning',                          nesa: 'MA-M1' },
  'MA-COORD-01': { name: 'Coordinate geometry — distance midpoint gradient',                    nesa: 'MA-G2' },
  'MA-COORD-02': { name: 'Equations of lines — various forms parallel perpendicular',           nesa: 'MA-G2' },
  'MA-COORD-03': { name: 'Circles — equations tangents chords',                                nesa: 'MA-G2' },
  'MA-COORD-04': { name: 'Parabolas — focus directrix tangents',                               nesa: 'MA-G2' },
  'MA-COORD-05': { name: 'Locus problems and parametric equations',                             nesa: 'MA-G2' },
  'MA-EXT-01':   { name: 'Mathematical induction — divisibility and inequalities',              nesa: 'MA-P1' },
  'MA-EXT-02':   { name: 'Binomial theorem — expansion and coefficients',                      nesa: 'MA-A3' },
  'MA-EXT-03':   { name: 'Further integration by parts',                                        nesa: 'MA-C5' },
  'MA-EXT-04':   { name: 'Differential equations — formation and solution',                     nesa: 'MA-C5' },
  'MA-EXT-05':   { name: 'Mechanics — projectile motion',                                      nesa: 'MA-M2' },
  'MA-EXT-06':   { name: 'Vectors — operations dot product projections',                       nesa: 'MA-V1' },
  'MA-EXT-07':   { name: 'Complex numbers — operations modulus argument polar form',            nesa: 'MA-N1' },
  'MA-EXT-08':   { name: 'Further trigonometry — t-formula and auxiliary angle method',        nesa: 'MA-T4' },
  // ── First principles (Year 11 MA-C1) ─────────────────────────────────────
  'MA-CALC-D00': { name: 'First principles — limit definition of the derivative',              nesa: 'MA-C1' },
  // ── Year 9 — NSW Stage 5 ─────────────────────────────────────────────────
  'NSW9-IDX-01':   { name: 'Index laws — multiplying and dividing with indices',               nesa: 'MA5-4NA' },
  'NSW9-IDX-02':   { name: 'Negative and zero indices',                                        nesa: 'MA5-4NA' },
  'NSW9-SUR-01':   { name: 'Surds and irrational numbers — simplifying and operations',       nesa: 'MA5-6NA' },
  'NSW9-CON-01':   { name: 'Consumer arithmetic — percentages, rates, ratios and GST',        nesa: 'MA5-2NA' },
  'NSW9-FIN-01':   { name: 'Financial mathematics — simple interest, earning and spending',   nesa: 'MA5-2NA' },
  'NSW9-ALG-01':   { name: 'Algebraic techniques — expanding brackets and factorising',       nesa: 'MA5-5NA' },
  'NSW9-ALG-02':   { name: 'Algebraic fractions — simplifying, adding and multiplying',       nesa: 'MA5-5NA' },
  'NSW9-LIN-01':   { name: 'Linear equations — solving one and two step equations',           nesa: 'MA5-7NA' },
  'NSW9-LIN-02':   { name: 'Linear graphs — gradient, intercepts and direct proportion',      nesa: 'MA5-7NA' },
  'NSW9-SIM-01':   { name: 'Simultaneous equations — graphical and algebraic methods',        nesa: 'MA5-8NA' },
  'NSW9-INEQ-01':  { name: 'Linear inequalities — solving and graphing on a number line',     nesa: 'MA5-8NA' },
  'NSW9-GEOM-01':  { name: 'Properties of geometrical figures — angles, parallel lines, polygons', nesa: 'MA5-11MG' },
  'NSW9-GEOM-02':  { name: "Pythagoras' theorem — finding sides and applications",            nesa: 'MA5-11MG' },
  'NSW9-GEOM-03':  { name: 'Similarity and congruence — scale factors and similar triangles', nesa: 'MA5-12MG' },
  'NSW9-TRIG-01':  { name: 'Trigonometric ratios — sin, cos and tan in right triangles',      nesa: 'MA5-13MG' },
  'NSW9-TRIG-02':  { name: 'Angles of elevation and depression',                              nesa: 'MA5-13MG' },
  'NSW9-MEAS-01':  { name: 'Area and volume — composite shapes and 3D objects',               nesa: 'MA5-14MG' },
  'NSW9-GRAPH-01': { name: 'Non-linear graphs — parabolas, hyperbolas and exponentials',     nesa: 'MA5-9NA' },
  'NSW9-STAT-01':  { name: 'Single variable data analysis — mean, median, mode and range',   nesa: 'MA5-15SP' },
  'NSW9-STAT-02':  { name: 'Bivariate data — scatter plots and lines of best fit',           nesa: 'MA5-16SP' },
  'NSW9-PROB-01':  { name: 'Probability — single and multi-step chance experiments',         nesa: 'MA5-17SP' },
  // ── Year 10 — NSW Stage 5 ────────────────────────────────────────────────
  'NSW10-ALG-01':   { name: 'Factorisation — common factors, difference of squares, trinomials', nesa: 'MA5-6NA' },
  'NSW10-ALG-02':   { name: 'Quadratic equations — factorising, completing the square, formula',  nesa: 'MA5-8NA' },
  'NSW10-ALG-03':   { name: 'Polynomial expressions — operations and factor theorem',             nesa: 'MA5-6NA' },
  'NSW10-ALG-04':   { name: 'Further algebraic techniques — complex fractions and identities',    nesa: 'MA5-6NA' },
  'NSW10-SIM-01':   { name: 'Simultaneous equations — linear and non-linear systems',             nesa: 'MA5-8NA' },
  'NSW10-PROOF-01': { name: 'Algebraic and geometric proof — formal reasoning and deduction',     nesa: 'MA5-3WM' },
  'NSW10-FUNC-01':  { name: 'Quadratic functions — graphs, vertex, axis of symmetry',            nesa: 'MA5-9NA' },
  'NSW10-FUNC-02':  { name: 'Non-linear functions — circles, exponentials and their graphs',     nesa: 'MA5-9NA' },
  'NSW10-EXP-01':   { name: 'Exponential functions — graphs, equations and growth or decay',     nesa: 'MA5-9NA' },
  'NSW10-GRAPH-01': { name: 'Hyperbola and inverse proportion — graphs and equations',           nesa: 'MA5-9NA' },
  'NSW10-LOG-01':   { name: 'Introduction to logarithms — definition and basic log laws',        nesa: 'MA5-9NA' },
  'NSW10-COORD-01': { name: 'Coordinate geometry — distance, midpoint, gradient and line equations', nesa: 'MA5-10NA' },
  'NSW10-TRIG-01':  { name: 'Sine rule and cosine rule — finding sides and angles',              nesa: 'MA5-13MG' },
  'NSW10-TRIG-02':  { name: 'Bearings and 3D trigonometry problems',                             nesa: 'MA5-13MG' },
  'NSW10-MEAS-01':  { name: 'Surface area and volume — prisms, cylinders, cones, spheres',      nesa: 'MA5-14MG' },
  'NSW10-GEOM-01':  { name: 'Circle geometry theorems — chords, tangents and angle properties', nesa: 'MA5-12MG' },
  'NSW10-STAT-01':  { name: 'Data analysis and regression — correlation and line of best fit',   nesa: 'MA5-16SP' },
  'NSW10-PROB-01':  { name: 'Conditional probability — tree diagrams and Venn diagrams',         nesa: 'MA5-17SP' },
  'NSW10-PROB-02':  { name: 'Two-way tables and Venn diagrams — set notation and probability',   nesa: 'MA5-17SP' },
}

// ─── Handler ──────────────────────────────────────────────────────────────────

// Maps year_group DB value to a human-readable label for the prompt
const YEAR_LABEL: Record<string, string> = {
  year_9:  'Year 9',
  year_10: 'Year 10',
  year_11: 'Year 11 (HSC Preliminary)',
  year_12: 'Year 12 (HSC)',
}

export async function POST(req: NextRequest) {
  let topic     = ''
  let yearGroup = 'year_12'
  try {
    const body = await req.json() as { topic?: string; yearGroup?: string }
    topic     = body.topic     ?? ''
    yearGroup = body.yearGroup ?? 'year_12'
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 })

  const meta = TOPICS[topic]
  if (!meta) return NextResponse.json({ error: `Unknown topic: ${topic}` }, { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
  const apiKey      = process.env.ANTHROPIC_API_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('[generate-questions] Missing Supabase env vars')
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
  }
  if (!apiKey) {
    console.error('[generate-questions] ANTHROPIC_API_KEY not set')
    return NextResponse.json({ error: 'AI key not configured' }, { status: 500 })
  }

  // Direct Supabase client — no cookies needed, service role bypasses RLS
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  // ── Idempotency guard — regenerate if MC ratio is too high ───────────────────
  // Fetch existing questions for this topic (format column tells us open vs MC).
  // If < 80% are open-response we delete the old set and regenerate so students
  // get the correct 90% open mix going forward.
  const { data: existing } = await supabase
    .from('questions')
    .select('id, format')
    .ilike('outcome_id', `${topic}-%`)
    .limit(50)

  if (existing && existing.length > 0) {
    const openCount = existing.filter(q => q.format === 'open').length
    const openRatio = openCount / existing.length

    if (openRatio >= 0.8) {
      // Already has a good open ratio — nothing to do
      return NextResponse.json({ status: 'already_exists' })
    }

    // MC-heavy set — delete it so we can regenerate with 90% open
    const ids = existing.map(q => q.id)
    await supabase.from('questions').delete().in('id', ids)
    console.log(`[generate-questions] Deleted ${ids.length} MC-heavy questions for ${topic}, regenerating...`)
  }

  // ── Generate via Claude Haiku ─────────────────────────────────────────────
  const client = new Anthropic({ apiKey })

  const yearLabel = YEAR_LABEL[yearGroup] ?? 'Year 12 (HSC)'

  // Max band for this year group — caps what we ask Claude to generate
  const MAX_BAND: Record<string, number> = {
    year_9: 2, year_10: 3, year_11: 5, year_12: 6,
  }
  const maxBand = MAX_BAND[yearGroup] ?? 6

  // Spread difficulty_band evenly across 1..maxBand (10 questions)
  const bands: number[] = Array.from({ length: 10 }, (_, i) =>
    Math.min(Math.round(1 + (i / 9) * (maxBand - 1)), maxBand)
  )

  // Question 0 is MC, questions 1-9 are open response (90% open)
  const prompt = `Generate exactly 10 NSW Mathematics questions on: "${meta.name}" (NESA code ${meta.nesa}).

These questions are for a ${yearLabel} student. Use age-appropriate language, real-world contexts, and ensure difficulty suits that stage.

Difficulty bands range from 1 (easiest) to ${maxBand} (hardest). The 10 questions must be assigned these bands in order: ${bands.join(', ')}.

QUESTION MIX (must follow exactly):
- Question 1 (band ${bands[0]}): MULTIPLE CHOICE — 4 options (A-D), one correct answer
- Questions 2-10 (bands ${bands[1]}–${bands[9]}): OPEN RESPONSE — student must show full written working; no options

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM SPECS — READ CAREFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Where a visual aids understanding, include a machine-renderable "diagram_spec" object. Use these formats:

CARTESIAN (function graphs, parabolas, trig curves, exponential, area under curve):
{"type":"cartesian","title":"y = x² - 4","xRange":[-3,3],"yRange":[-5,6],"xLabel":"x","yLabel":"y",
 "curves":[{"points":[[-3,5],[-2,0],[-1,-3],[0,-4],[1,-3],[2,0],[3,5]],"color":"#7C3AED","label":"y = x² - 4"}],
 "points":[{"x":-2,"y":0,"label":"(-2,0)","filled":true},{"x":2,"y":0,"label":"(2,0)","filled":true},{"x":0,"y":-4,"label":"vertex (0,-4)","filled":true}]}

TRIANGLE (geometry, trig, Pythagoras):
{"type":"triangle","title":"Right Triangle","vertices":[{"x":0,"y":0,"label":"A"},{"x":4,"y":0,"label":"B"},{"x":0,"y":3,"label":"C"}],
 "sides":[{"from":0,"to":1,"label":"a = 4"},{"from":0,"to":2,"label":"b = 3"},{"from":1,"to":2,"label":"c = 5"}],
 "angles":[{"vertex":0,"label":"90°","rightAngle":true},{"vertex":1,"label":"θ"}]}

NUMBERLINE (inequalities, sequences, number sets):
{"type":"numberline","min":-3,"max":5,"points":[{"x":-1,"label":"-1","filled":true},{"x":3,"label":"3","filled":false}],
 "intervals":[{"from":-1,"to":3,"color":"#7C3AED","label":"-1 < x ≤ 3"}]}

CIRCLE (coordinate geometry, circle theorems):
{"type":"circle","title":"Circle: (x-3)²+(y-4)²=25","center":{"x":3,"y":4,"label":"(3,4)"},"radius":5,
 "xRange":[-3,9],"yRange":[-2,10],"points":[{"x":0,"y":0,"label":"O origin"}]}

For curves, supply 11-15 pre-computed (x,y) points spanning the domain.
For areas under a curve, add "regions":[{"points":[...boundary...],"color":"#7C3AED","opacity":0.18}].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP VISUAL FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In every "📊 Visual:" step, ALWAYS embed the diagram spec using [SPEC]...[/SPEC] markers, followed by a brief text description. Example:
"📊 Visual: [SPEC]{"type":"cartesian","title":"y = x² - 4","xRange":[-3,3],"yRange":[-5,6],"curves":[{"points":[[-3,5],[-2,0],[0,-4],[2,0],[3,5]],"color":"#7C3AED","label":"y = x² - 4"}],"points":[{"x":-2,"y":0,"label":"(-2,0)","filled":true},{"x":2,"y":0,"label":"(2,0)","filled":true},{"x":0,"y":-4,"label":"vertex","filled":true}]}[/SPEC] The parabola opens upward with vertex (0,−4) and x-intercepts at x = ±2."

Include a 📊 Visual step for EVERY question involving: graphs, triangles, circles, inequalities, areas, trig ratios, exponential growth, or geometric figures. Only skip for purely algebraic/arithmetic questions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETURN ONLY a valid JSON array. Start with [ immediately. No markdown, no commentary outside the JSON.

For MULTIPLE CHOICE questions:
{
  "question_type": "multiple_choice",
  "outcome_id": "${topic}-B1",
  "nesa_outcome_code": "${meta.nesa}",
  "difficulty_band": 1,
  "question_text": "self-contained question (include graph description in text if question refers to a graph)",
  "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...",
  "correct_option": "a",
  "diagram_spec": {"type":"cartesian",...} or null,
  "explanation": "2-3 sentences explaining WHY the correct answer is right and why each distractor is wrong",
  "step_by_step": [
    "**1. Understand the concept**\nThe **degree** of a polynomial is the **highest power** of $x$ when the expression is fully expanded.",
    "**2. Identify the factors**\nYou are given:\n$$f(x) = (x-2)(x+3)(x-1)$$\nEach bracket is a **linear factor** — meaning each has degree **1**.",
    "**3. Add the degrees**\nWhen multiplying polynomials, the degrees **add**:\n$$1 + 1 + 1 = 3$$",
    "📊 Visual: [SPEC]{\"type\":\"cartesian\",...}[/SPEC] Brief description of what the graph shows.",
    "✅ Final Answer: The degree of the polynomial is **3**",
    "⚠️ Common mistake: Confusing the number of factors with the degree — they only match here because each factor is linear."
  ]
}

For OPEN RESPONSE questions:
{
  "question_type": "open",
  "outcome_id": "${topic}-B3",
  "nesa_outcome_code": "${meta.nesa}",
  "difficulty_band": 3,
  "question_text": "Full question requiring written working. Include 'Show all working.' or 'Find ... giving reasons.'",
  "marks": 3,
  "model_answer": "Complete correct worked solution showing every algebraic/numerical step",
  "marking_criteria": ["1 mark: correct setup/substitution", "1 mark: correct working", "1 mark: correct final answer with units"],
  "diagram": "Text description of the diagram/sketch context for the student (e.g. 'A parabola y = x² − 4 is shown. Mark the vertex and x-intercepts.'). Set null if no diagram.",
  "diagram_spec": {"type":"cartesian",...} or null,
  "step_by_step": [
    "**1. What we know and what we need to find**\nGiven: **[list known values]**. Find: **[unknown]**.",
    "**2. Choose the method / formula**\nUse the **[rule name]** because [reason it applies]:\n$$\\text{formula here}$$",
    "**3. Substitute**\nReplace variables with the actual numbers:\n$$\\text{substituted expression} = \\text{result}$$",
    "**4. Solve step by step**\nWork through each algebraic manipulation — do not skip:\n$$\\text{step 1}$$\n$$\\text{step 2}$$",
    "📊 Visual: [SPEC]{\"type\":\"cartesian\",...}[/SPEC] Description of the graph/diagram.",
    "✅ Final Answer: [answer with units and rounding as required]",
    "⚠️ Common mistake: [Most common error students make on this type of question]."
  ]
}

RULES for step_by_step:
- EVERY step must use the **N. Title** format: start with **N. Section Title** on its own (the title in double-asterisks), then a newline, then the body explanation
- Body text may use **bold** for key terms and $inline math$ for symbols
- Put display equations on their own line using $$LaTeX$$ (centred block math) — one equation per line
- Use LaTeX notation: $x^2$ not x², $\\sqrt{x}$ not √x, $\\pi$ not π, $\\theta$ not θ, $\\frac{a}{b}$ for fractions
- Show ACTUAL numbers in every step — never write "substitute the values"
- Every question involving graphs/geometry/trig/areas MUST have a 📊 Visual step with [SPEC]...[/SPEC]
- Always end with ✅ Final Answer: then ⚠️ Common mistake:
- Aim for 4-6 main numbered sections plus the Visual, Final Answer, and Common Mistake entries
- Make explanations rich and educational — a student who got it wrong should understand exactly WHY after reading`

  let rawText = ''
  try {
    const res = await client.messages.create({
      model:      'claude-haiku-4-5',
      max_tokens: 9000,
      messages:   [{ role: 'user', content: prompt }],
    })
    rawText = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
  } catch (aiErr) {
    console.error('[generate-questions] Claude call failed:', aiErr)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }

  // ── Parse the JSON array ──────────────────────────────────────────────────
  type RawQ = Record<string, unknown>
  let parsed: RawQ[] = []

  const arrStart = rawText.indexOf('[')
  if (arrStart !== -1) {
    try {
      const arrEnd = rawText.lastIndexOf(']')
      if (arrEnd > arrStart) {
        parsed = JSON.parse(rawText.slice(arrStart, arrEnd + 1)) as RawQ[]
      }
    } catch {
      // Partial response — extract objects one by one
      const chunk = rawText.slice(arrStart)
      let depth = 0, inStr = false, esc = false, objStart = -1
      for (let i = 0; i < chunk.length; i++) {
        const ch = chunk[i]
        if (esc)               { esc = false; continue }
        if (ch === '\\' && inStr) { esc = true; continue }
        if (ch === '"')        { inStr = !inStr; continue }
        if (inStr)             continue
        if (ch === '{')        { if (depth === 0) objStart = i; depth++ }
        else if (ch === '}')   {
          depth--
          if (depth === 0 && objStart !== -1) {
            try { parsed.push(JSON.parse(chunk.slice(objStart, i + 1)) as RawQ) } catch { /* skip */ }
            objStart = -1
          }
        }
      }
    }
  }

  if (parsed.length === 0) {
    console.error('[generate-questions] Parsed 0 questions. Raw:', rawText.slice(0, 300))
    return NextResponse.json({ error: 'No questions parsed from AI response' }, { status: 500 })
  }

  // ── Insert into Supabase ──────────────────────────────────────────────────
  const rows = parsed.map(q => {
    const isOpen = String(q.question_type ?? 'multiple_choice') === 'open'
    // Always derive outcome_id from the known topic + Claude's difficulty_band.
    // Claude frequently generates wrong outcome_ids (e.g. NESA codes like "MA-A1-01"
    // instead of "MA-ALG-08-B1") — never trust q.outcome_id.
    const band = Math.max(1, Math.min(6, Number(q.difficulty_band ?? 3)))
    return {
      outcome_id:      `${topic}-B${band}`,
      course:          'Advanced Mathematics',
      difficulty_band: band,
      format:          isOpen ? 'open' : 'multiple_choice',
      content_json:    isOpen
        ? {
            question_type:    'open',
            question_text:    String(q.question_text ?? ''),
            model_answer:     String(q.model_answer  ?? ''),
            marks:            Number(q.marks         ?? 3),
            marking_criteria: Array.isArray(q.marking_criteria) ? q.marking_criteria as string[] : [],
            diagram:          q.diagram ? String(q.diagram) : null,
            diagram_spec:     (q.diagram_spec && typeof q.diagram_spec === 'object') ? q.diagram_spec : null,
          }
        : {
            question_text: String(q.question_text ?? ''),
            option_a:      String(q.option_a      ?? ''),
            option_b:      String(q.option_b      ?? ''),
            option_c:      String(q.option_c      ?? ''),
            option_d:      String(q.option_d      ?? ''),
            diagram_spec:  (q.diagram_spec && typeof q.diagram_spec === 'object') ? q.diagram_spec : null,
          },
      correct_answer:    isOpen
        ? 'open'
        : String(q.correct_option ?? 'a').toLowerCase().charAt(0),
      explanation:       String(q.explanation    ?? ''),
      step_by_step:      Array.isArray(q.step_by_step) ? q.step_by_step as string[] : [],
      nesa_outcome_code: String(q.nesa_outcome_code ?? meta.nesa),
      served_to:         [],
    }
  })

  const { error: insertErr, data: inserted } = await supabase
    .from('questions')
    .insert(rows)
    .select('id')

  if (insertErr) {
    console.error('[generate-questions] Insert error:', insertErr.message)
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  console.log(`[generate-questions] Inserted ${inserted?.length ?? 0} questions for ${topic}`)
  return NextResponse.json({ status: 'ok', inserted: inserted?.length ?? 0 })
}
