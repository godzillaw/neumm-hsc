/**
 * seed-questions.ts — Neumm HSC question seeder
 * Generates HSC Advanced Mathematics questions via Claude AI
 * and inserts them into the Supabase questions table.
 *
 * Run: npm run seed:questions
 * Resume: npm run seed:questions:resume
 */

// ─── Load .env.local before anything else ─────────────────────────────────────
import fs from 'fs'
import path from 'path'

const ENV_PATH = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
}

// ─── Now it's safe to import API clients ──────────────────────────────────────
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!ANTHROPIC_KEY) { console.error('❌ ANTHROPIC_API_KEY missing'); process.exit(1) }
if (!SUPABASE_URL)  { console.error('❌ NEXT_PUBLIC_SUPABASE_URL missing'); process.exit(1) }
if (!SUPABASE_KEY)  { console.error('❌ SUPABASE_SERVICE_ROLE_KEY missing'); process.exit(1) }

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })
const supabase  = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Progress tracking ────────────────────────────────────────────────────────
const PROGRESS_FILE = path.join(path.dirname(new URL(import.meta.url).pathname), '.seed-progress.json')

function loadProgress(): Set<string> {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'))
      return new Set(data.completed ?? [])
    }
  } catch {}
  return new Set()
}

function saveProgress(done: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed: Array.from(done) }, null, 2))
}

// ─── Topic definitions ────────────────────────────────────────────────────────
interface Topic { name: string; prefix: string; nesa: string; course: string }

const TOPICS: Topic[] = [
  // Differentiation
  { name: 'Differentiation basics — power rule, sum rule, constant rule', prefix: 'MA-CALC-D01', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Differentiation — product rule and quotient rule', prefix: 'MA-CALC-D02', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Differentiation — chain rule and composite functions', prefix: 'MA-CALC-D03', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Differentiation of trigonometric functions sin, cos, tan', prefix: 'MA-CALC-D04', nesa: 'MA-C3', course: 'Advanced Mathematics' },
  { name: 'Differentiation of exponential functions', prefix: 'MA-CALC-D05', nesa: 'MA-C2', course: 'Advanced Mathematics' },
  { name: 'Differentiation of logarithmic functions', prefix: 'MA-CALC-D06', nesa: 'MA-C2', course: 'Advanced Mathematics' },
  { name: 'Differentiation applications — tangents and normals', prefix: 'MA-CALC-D07', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Differentiation applications — stationary points and curve sketching', prefix: 'MA-CALC-D08', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Differentiation applications — optimisation problems', prefix: 'MA-CALC-D09', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Differentiation applications — rates of change', prefix: 'MA-CALC-D10', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Second derivative — concavity and points of inflection', prefix: 'MA-CALC-D11', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  { name: 'Implicit differentiation and parametric differentiation', prefix: 'MA-CALC-D12', nesa: 'MA-C1', course: 'Advanced Mathematics' },
  // Integration
  { name: 'Integration basics — antiderivatives and indefinite integrals', prefix: 'MA-CALC-I01', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Integration of polynomial functions', prefix: 'MA-CALC-I02', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Integration of trigonometric functions', prefix: 'MA-CALC-I03', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Integration of exponential and logarithmic functions', prefix: 'MA-CALC-I04', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Integration by substitution', prefix: 'MA-CALC-I05', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Definite integrals and the Fundamental Theorem of Calculus', prefix: 'MA-CALC-I06', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Area under a curve using definite integrals', prefix: 'MA-CALC-I07', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Area between two curves', prefix: 'MA-CALC-I08', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Volumes of solids of revolution', prefix: 'MA-CALC-I09', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Integration applications — kinematics', prefix: 'MA-CALC-I10', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Trapezoidal rule and numerical integration', prefix: 'MA-CALC-I11', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  { name: 'Exponential growth and decay', prefix: 'MA-CALC-I12', nesa: 'MA-C4', course: 'Advanced Mathematics' },
  // Trigonometry
  { name: 'Trigonometric ratios — exact values 30, 45, 60 degrees', prefix: 'MA-TRIG-01', nesa: 'MA-T1', course: 'Advanced Mathematics' },
  { name: 'Trigonometric graphs — sine cosine tangent and transformations', prefix: 'MA-TRIG-02', nesa: 'MA-T1', course: 'Advanced Mathematics' },
  { name: 'Trigonometric identities — Pythagorean and reciprocal', prefix: 'MA-TRIG-03', nesa: 'MA-T2', course: 'Advanced Mathematics' },
  { name: 'Trigonometric equations — solving in given domains', prefix: 'MA-TRIG-04', nesa: 'MA-T2', course: 'Advanced Mathematics' },
  { name: 'Inverse trigonometric functions arcsin arccos arctan', prefix: 'MA-TRIG-05', nesa: 'MA-T2', course: 'Advanced Mathematics' },
  { name: 'Compound angle and double angle formulas', prefix: 'MA-TRIG-06', nesa: 'MA-T3', course: 'Advanced Mathematics' },
  { name: 'Sine rule cosine rule and area formula', prefix: 'MA-TRIG-07', nesa: 'MA-T1', course: 'Advanced Mathematics' },
  { name: 'Bearings and 3D trigonometry problems', prefix: 'MA-TRIG-08', nesa: 'MA-T1', course: 'Advanced Mathematics' },
  { name: 'Radians — conversion arc length sector area', prefix: 'MA-TRIG-09', nesa: 'MA-T2', course: 'Advanced Mathematics' },
  // Exponential & Logs
  { name: 'Exponential functions — graphs properties transformations', prefix: 'MA-EXP-01', nesa: 'MA-E1', course: 'Advanced Mathematics' },
  { name: 'Solving exponential equations', prefix: 'MA-EXP-02', nesa: 'MA-E1', course: 'Advanced Mathematics' },
  { name: 'Logarithm laws — product quotient power rules', prefix: 'MA-EXP-03', nesa: 'MA-E1', course: 'Advanced Mathematics' },
  { name: 'Solving logarithmic equations', prefix: 'MA-EXP-04', nesa: 'MA-E1', course: 'Advanced Mathematics' },
  { name: 'Natural logarithm — properties and equations with e', prefix: 'MA-EXP-05', nesa: 'MA-E1', course: 'Advanced Mathematics' },
  { name: 'Applications of exponential functions — population and finance', prefix: 'MA-EXP-06', nesa: 'MA-E2', course: 'Advanced Mathematics' },
  // Functions
  { name: 'Functions — domain range function notation', prefix: 'MA-FUNC-01', nesa: 'MA-F1', course: 'Advanced Mathematics' },
  { name: 'Types of functions — one-to-one many-to-one odd even', prefix: 'MA-FUNC-02', nesa: 'MA-F1', course: 'Advanced Mathematics' },
  { name: 'Composite functions and function of a function', prefix: 'MA-FUNC-03', nesa: 'MA-F1', course: 'Advanced Mathematics' },
  { name: 'Inverse functions — finding and graphing inverses', prefix: 'MA-FUNC-04', nesa: 'MA-F1', course: 'Advanced Mathematics' },
  { name: 'Graph transformations — translations reflections dilations', prefix: 'MA-FUNC-05', nesa: 'MA-F1', course: 'Advanced Mathematics' },
  { name: 'Absolute value functions and equations', prefix: 'MA-FUNC-06', nesa: 'MA-F1', course: 'Advanced Mathematics' },
  { name: 'Polynomial functions — sketching and end behaviour', prefix: 'MA-FUNC-07', nesa: 'MA-F2', course: 'Advanced Mathematics' },
  { name: 'Rational functions and asymptotes', prefix: 'MA-FUNC-08', nesa: 'MA-F2', course: 'Advanced Mathematics' },
  { name: 'Limits and continuity of functions', prefix: 'MA-FUNC-09', nesa: 'MA-F2', course: 'Advanced Mathematics' },
  // Algebra
  { name: 'Quadratic equations — factoring completing the square formula', prefix: 'MA-ALG-01', nesa: 'MA-A1', course: 'Advanced Mathematics' },
  { name: 'Quadratic functions — graphs vertex discriminant', prefix: 'MA-ALG-02', nesa: 'MA-A1', course: 'Advanced Mathematics' },
  { name: 'Simultaneous equations — linear and non-linear', prefix: 'MA-ALG-03', nesa: 'MA-A1', course: 'Advanced Mathematics' },
  { name: 'Polynomial equations — factor theorem remainder theorem', prefix: 'MA-ALG-04', nesa: 'MA-A1', course: 'Advanced Mathematics' },
  { name: 'Inequalities — linear and quadratic', prefix: 'MA-ALG-05', nesa: 'MA-A1', course: 'Advanced Mathematics' },
  { name: 'Arithmetic sequences and series', prefix: 'MA-ALG-06', nesa: 'MA-A2', course: 'Advanced Mathematics' },
  { name: 'Geometric sequences and series', prefix: 'MA-ALG-07', nesa: 'MA-A2', course: 'Advanced Mathematics' },
  { name: 'Surds — simplifying and rationalising denominators', prefix: 'MA-ALG-08', nesa: 'MA-A1', course: 'Advanced Mathematics' },
  // Statistics
  { name: 'Data representation — histograms box plots dot plots', prefix: 'MA-STAT-01', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Measures of central tendency — mean median mode', prefix: 'MA-STAT-02', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Measures of spread — range IQR standard deviation variance', prefix: 'MA-STAT-03', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Correlation and regression — scatterplots line of best fit', prefix: 'MA-STAT-04', nesa: 'MA-S2', course: 'Advanced Mathematics' },
  { name: 'Normal distribution — z-scores and empirical rule', prefix: 'MA-STAT-05', nesa: 'MA-S3', course: 'Advanced Mathematics' },
  { name: 'Sampling and statistical inference', prefix: 'MA-STAT-06', nesa: 'MA-S4', course: 'Advanced Mathematics' },
  // Probability
  { name: 'Basic probability — sample spaces events', prefix: 'MA-PROB-01', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Conditional probability and independence', prefix: 'MA-PROB-02', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Discrete probability distributions', prefix: 'MA-PROB-03', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Binomial distribution — probability mean variance', prefix: 'MA-PROB-04', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  { name: 'Counting techniques — permutations and combinations', prefix: 'MA-PROB-05', nesa: 'MA-S1', course: 'Advanced Mathematics' },
  // Financial Maths
  { name: 'Simple interest calculations', prefix: 'MA-FIN-01', nesa: 'MA-M1', course: 'Advanced Mathematics' },
  { name: 'Compound interest — future value and present value', prefix: 'MA-FIN-02', nesa: 'MA-M1', course: 'Advanced Mathematics' },
  { name: 'Annuities — future value and present value', prefix: 'MA-FIN-03', nesa: 'MA-M1', course: 'Advanced Mathematics' },
  { name: 'Loans and reducible interest — repayment schedules', prefix: 'MA-FIN-04', nesa: 'MA-M1', course: 'Advanced Mathematics' },
  // Coordinate Geometry
  { name: 'Coordinate geometry — distance midpoint gradient', prefix: 'MA-COORD-01', nesa: 'MA-G2', course: 'Advanced Mathematics' },
  { name: 'Equations of lines — various forms parallel perpendicular', prefix: 'MA-COORD-02', nesa: 'MA-G2', course: 'Advanced Mathematics' },
  { name: 'Circles — equations tangents chords', prefix: 'MA-COORD-03', nesa: 'MA-G2', course: 'Advanced Mathematics' },
  { name: 'Parabolas — focus directrix tangents', prefix: 'MA-COORD-04', nesa: 'MA-G2', course: 'Advanced Mathematics' },
  { name: 'Locus problems and parametric equations', prefix: 'MA-COORD-05', nesa: 'MA-G2', course: 'Advanced Mathematics' },
  // Extension topics
  { name: 'Mathematical induction — divisibility and inequalities', prefix: 'MA-EXT-01', nesa: 'MA-P1', course: 'Advanced Mathematics' },
  { name: 'Binomial theorem — expansion and coefficients', prefix: 'MA-EXT-02', nesa: 'MA-A3', course: 'Advanced Mathematics' },
  { name: 'Further integration by parts', prefix: 'MA-EXT-03', nesa: 'MA-C5', course: 'Advanced Mathematics' },
  { name: 'Differential equations — formation and solution', prefix: 'MA-EXT-04', nesa: 'MA-C5', course: 'Advanced Mathematics' },
  { name: 'Mechanics — projectile motion', prefix: 'MA-EXT-05', nesa: 'MA-M2', course: 'Advanced Mathematics' },
  { name: 'Vectors — operations dot product projections', prefix: 'MA-EXT-06', nesa: 'MA-V1', course: 'Advanced Mathematics' },
  { name: 'Complex numbers — operations modulus argument polar form', prefix: 'MA-EXT-07', nesa: 'MA-N1', course: 'Advanced Mathematics' },
  { name: 'Further trigonometry — t-formula and auxiliary angle method', prefix: 'MA-EXT-08', nesa: 'MA-T4', course: 'Advanced Mathematics' },
]

const QUESTIONS_PER_BATCH = 12  // kept small so response stays under 8k tokens

// ─── Prompt ───────────────────────────────────────────────────────────────────
function buildPrompt(t: Topic, band: number): string {
  const desc = band <= 2 ? 'easy — single-step, direct application'
    : band <= 4 ? 'medium — multi-step, requires understanding'
    : 'hard — complex HSC-style, often combines multiple concepts'
  return `Generate exactly ${QUESTIONS_PER_BATCH} HSC Advanced Mathematics multiple choice questions on: "${t.name}"
Difficulty band: ${band} (${desc})

Return ONLY a valid JSON array — no markdown fences, no text outside the array.
Each object must have exactly these fields:
{
  "outcome_id": "${t.prefix}-B${band}",
  "nesa_outcome_code": "${t.nesa}",
  "difficulty_band": ${band},
  "question_text": "complete self-contained question",
  "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...",
  "correct_option": "a"|"b"|"c"|"d",
  "explanation": "2-3 sentences explaining why correct and why others wrong",
  "step_by_step": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
}
Rules: ${QUESTIONS_PER_BATCH} unique questions, plausible distractors, keep responses concise. Start with [ immediately.`
}

// ─── Parse response ───────────────────────────────────────────────────────────
interface RawQ {
  outcome_id: string; nesa_outcome_code: string; difficulty_band: number
  question_text: string; option_a: string; option_b: string; option_c: string; option_d: string
  correct_option: string; explanation: string; step_by_step: string[]
}

function parseQuestions(text: string): RawQ[] {
  let s = text.trim().replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
  const a = s.indexOf('[')
  if (a === -1) throw new Error('No JSON array found')
  s = s.slice(a)

  // Try full parse first
  try {
    const b = s.lastIndexOf(']')
    if (b !== -1) return JSON.parse(s.slice(0, b + 1))
  } catch {}

  // Truncated response — extract complete objects one by one
  const results: RawQ[] = []
  let depth = 0, inStr = false, escape = false, objStart = -1
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (escape) { escape = false; continue }
    if (ch === '\\' && inStr) { escape = true; continue }
    if (ch === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (ch === '{') { if (depth === 0) objStart = i; depth++ }
    else if (ch === '}') {
      depth--
      if (depth === 0 && objStart !== -1) {
        try { results.push(JSON.parse(s.slice(objStart, i + 1))) } catch {}
        objStart = -1
      }
    }
  }
  if (results.length === 0) throw new Error('Could not extract any questions from response')
  return results
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Generate one batch ───────────────────────────────────────────────────────
async function generateBatch(t: Topic, band: number, retries = 3): Promise<RawQ[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 8192,
        messages: [{ role: 'user', content: buildPrompt(t, band) }],
      })
      const text = res.content.filter(b => b.type === 'text').map(b => (b as {type:'text';text:string}).text).join('')
      const qs = parseQuestions(text)
      console.log(`    ✓ ${qs.length} questions received`)
      return qs
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`    Attempt ${attempt} failed: ${msg.slice(0, 100)}`)
      if (attempt < retries) { await sleep(attempt * 6000); continue }
      console.error(`    ❌ All attempts failed`)
      return []
    }
  }
  return []
}

// ─── Insert into Supabase ─────────────────────────────────────────────────────
async function insertBatch(qs: RawQ[], course: string): Promise<number> {
  if (!qs.length) return 0
  const rows = qs.map(q => ({
    outcome_id: q.outcome_id,
    course,
    difficulty_band: Number(q.difficulty_band),
    format: 'multiple_choice',
    content_json: { question_text: q.question_text, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d },
    correct_answer: q.correct_option,
    explanation: q.explanation,
    step_by_step: Array.isArray(q.step_by_step) ? q.step_by_step : [q.step_by_step],
    nesa_outcome_code: q.nesa_outcome_code,
    served_to: [],
  }))
  const { error, data } = await supabase.from('questions').insert(rows).select('id')
  if (error) { console.error('    DB error:', error.message); return 0 }
  return data?.length ?? rows.length
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const resume = args.includes('--resume')
  const topicFilter = args.includes('--topic') ? args[args.indexOf('--topic') + 1] : null
  const maxIdx = args.indexOf('--max')
  const MAX_QUESTIONS = maxIdx !== -1 ? parseInt(args[maxIdx + 1], 10) : Infinity
  const BANDS = [1, 2, 3, 4, 5, 6]

  const done = resume ? loadProgress() : new Set<string>()
  const topics = topicFilter ? TOPICS.filter(t => t.name.toLowerCase().includes(topicFilter.toLowerCase())) : TOPICS

  let totalInserted = 0, totalBatches = 0, failed = 0

  console.log(`\n🎓 Neumm HSC Question Seeder`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Topics: ${topics.length} | Bands: ${BANDS.join(',')} | Target: ~${topics.length * BANDS.length * QUESTIONS_PER_BATCH} questions`)
  console.log(`Resume: ${resume} | API key: ${ANTHROPIC_KEY!.slice(0, 20)}...`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  // Get current DB count for --max tracking
  const { count: startCount } = await supabase.from('questions').select('*', { count: 'exact', head: true })
  let dbCount = startCount ?? 0

  for (const topic of topics) {
    for (const band of BANDS) {
      if (dbCount >= MAX_QUESTIONS) {
        console.log(`\n🎯 Reached target of ${MAX_QUESTIONS} questions in DB. Stopping.`)
        break
      }
      const key = `${topic.prefix}-B${band}`
      if (done.has(key)) { process.stdout.write(`  ⏭  ${key}\n`); continue }

      console.log(`\n📝 [${key}] ${topic.name}`)
      const qs = await generateBatch(topic, band)
      const inserted = await insertBatch(qs, topic.course)
      totalInserted += inserted
      totalBatches++

      if (inserted > 0) {
        done.add(key)
        saveProgress(done)
        dbCount += inserted
        console.log(`   ✅ +${inserted} | Running total: ${totalInserted} | DB total: ~${dbCount}`)
      } else {
        failed++
      }

      await sleep(1000) // stay under rate limits
    }
    if (dbCount >= MAX_QUESTIONS) break
  }

  // Final count
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true })

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Done! Batches: ${totalBatches} | Failed: ${failed} | Inserted this run: ${totalInserted}`)
  console.log(`📊 Total questions in Supabase: ${count}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
