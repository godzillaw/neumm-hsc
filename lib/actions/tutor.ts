'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ─── Tier guard ────────────────────────────────────────────────────────────────
//
// Returns true when the current user has access to full AI features
// (hints, concept explainer, tutor chat, step marking).
//
// Tiers with full AI access: basic (paid), basic_trial, pro_trial, pro
// Tiers WITHOUT AI access:   free, basic_trial_expired, trial_expired, payment_failed

const TRIAL_TIERS    = new Set(['basic_trial', 'pro_trial'])
const AI_ACCESS_TIERS = new Set(['basic', 'basic_trial', 'pro_trial', 'pro'])

async function hasProAIAccess(): Promise<boolean> {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data } = await supabase
      .from('users')
      .select('tier, trial_end_date')
      .eq('id', user.id)
      .single()

    const raw           = data as { tier?: string; trial_end_date?: string | null } | null
    const rawTier       = raw?.tier           ?? 'basic_trial'
    const trialEndDate  = raw?.trial_end_date ?? null
    const trialExpired  = trialEndDate ? new Date(trialEndDate) < new Date() : false
    const effectiveTier = TRIAL_TIERS.has(rawTier) && trialExpired ? 'basic_trial_expired' : rawTier

    return AI_ACCESS_TIERS.has(effectiveTier)
  } catch {
    return true   // fail-open so a DB hiccup doesn't break the app
  }
}

const SYSTEM_PROMPT = `You are an expert NSW HSC Mathematics tutor operating in Socratic mode.
You help students studying for the Higher School Certificate (HSC) in Australia.
Your teaching philosophy: never give away the answer directly — guide students to discover it themselves.

For HINTS:
- Ask ONE guiding question that points the student toward the right approach
- Reference the specific NSW HSC syllabus concept or technique relevant to this question
- Include the key formula or identity relevant to this question, formatted clearly like: formula: ax² + bx + c = 0 → x = (-b ± √(b²-4ac)) / 2a
- Be encouraging and concise (2-4 sentences max)
- If it's a later attempt, give a slightly more direct nudge (but still no answer)
- Always include a relevant formula, diagram description, or worked example fragment as a visual aid

For EXPLANATIONS (post-submission):
- Provide a numbered step-by-step solution (3-6 steps)
- Each step must name the specific rule, theorem, or technique used
- Reference NSW HSC syllabus outcomes where relevant
- Explain WHY each step works, not just what to do
- Keep each step to 1-2 sentences
- Include relevant formulas inline, e.g. "Using the chain rule: d/dx[f(g(x))] = f'(g(x)) · g'(x)"

Always be warm, encouraging, and precise. Use proper Unicode math symbols — no LaTeX. Examples: x² not x^2, √x not sqrt(x), × not *, ÷ not /, π not pi, θ not theta, ° for degrees, ≠ not !=, ≤ ≥ not <= >=, ± √ ∫ Σ → ∞.`

// ─── getHint ───────────────────────────────────────────────────────────────────
//
// Returns a Socratic guiding question to help the student without revealing the answer.

export async function getHint(
  questionId:    string,
  studentInput:  string,   // selected option letter, or empty string
  attemptNumber: number,   // 1 = first hint, 2 = second hint, etc.
): Promise<{ hint: string }> {
  const supabase = createSupabaseServerClient()

  // Fetch question from DB
  const { data: q } = await supabase
    .from('questions')
    .select('content_json, correct_answer, explanation, nesa_outcome_code, outcome_id, difficulty_band')
    .eq('id', questionId)
    .single()

  if (!q) return { hint: 'Try re-reading the question carefully and identify what it is asking you to find.' }

  const content = (q.content_json ?? {}) as Record<string, string>
  const questionText = content.question_text ?? ''
  const options = [
    `A. ${content.option_a ?? ''}`,
    `B. ${content.option_b ?? ''}`,
    `C. ${content.option_c ?? ''}`,
    `D. ${content.option_d ?? ''}`,
  ].join('\n')

  const studentContext = studentInput
    ? `The student has selected option ${studentInput.toUpperCase()} but has not submitted yet.`
    : 'The student has not selected an option yet.'

  const nudgeLevel = attemptNumber === 1
    ? 'Give a broad hint about the relevant concept or approach.'
    : 'Give a slightly more specific nudge, mentioning the relevant formula or technique by name (but not the answer).'

  const userMessage = `
HSC Mathematics question (NESA outcome: ${q.nesa_outcome_code ?? q.outcome_id}, Band ${q.difficulty_band}):

${questionText}

Options:
${options}

${studentContext}
Hint attempt #${attemptNumber}.
${nudgeLevel}

Respond with ONLY the Socratic guiding question/hint. No preamble.`.trim()

  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 200,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return { hint: text.trim() }
  } catch (err) {
    console.error('[getHint] Anthropic error:', err)
    return { hint: 'Think about which mathematical technique applies here. What does the question ask you to find, and which formula connects those quantities?' }
  }
}

// ─── getExplanation ────────────────────────────────────────────────────────────
//
// Returns a full AI-generated step-by-step solution, shown after submission.

export async function getExplanation(questionId: string): Promise<{ explanation: string }> {
  const supabase = createSupabaseServerClient()

  const { data: q } = await supabase
    .from('questions')
    .select('content_json, correct_answer, explanation, step_by_step, nesa_outcome_code, outcome_id, difficulty_band')
    .eq('id', questionId)
    .single()

  if (!q) return { explanation: 'Unable to load explanation. Please try again.' }

  const content     = (q.content_json ?? {}) as Record<string, string>
  const storedSteps = Array.isArray(q.step_by_step) ? (q.step_by_step as string[]).join('\n') : ''
  const stored      = q.explanation ?? ''

  // Build the correct option text for context
  const correctLetter = (q.correct_answer ?? 'a').toUpperCase()
  const correctText   = content[`option_${(q.correct_answer ?? 'a').toLowerCase()}`] ?? ''

  const userMessage = `
HSC Mathematics question (NESA outcome: ${q.nesa_outcome_code ?? q.outcome_id}, Band ${q.difficulty_band}):

${content.question_text ?? ''}

Options:
A. ${content.option_a ?? ''}
B. ${content.option_b ?? ''}
C. ${content.option_c ?? ''}
D. ${content.option_d ?? ''}

Correct answer: ${correctLetter}. ${correctText}

${storedSteps ? `Reference solution steps:\n${storedSteps}\n` : ''}
${stored ? `Reference explanation:\n${stored}\n` : ''}

Provide a clear numbered step-by-step explanation of how to arrive at option ${correctLetter}.
Name the specific HSC syllabus technique used in each step.
Format: each step on its own line, starting with "1. ", "2. ", etc.
End with a one-sentence summary of the key concept tested.
Respond with the explanation only — no preamble.`.trim()

  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 500,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return { explanation: text.trim() }
  } catch (err) {
    console.error('[getExplanation] Anthropic error:', err)
    // Fallback to stored explanation
    if (storedSteps) return { explanation: storedSteps }
    if (stored)      return { explanation: stored }
    return { explanation: 'Unable to load explanation. The correct answer was ' + correctLetter + '.' }
  }
}

// ─── getConceptVideo ──────────────────────────────────────────────────────────
//
// Searches YouTube (prioritising Eddie Woo) for a video that explains the
// concept being tested.  Falls back gracefully when no API key is configured.

export interface ConceptVideo {
  videoId:      string
  title:        string
  channelTitle: string
  thumbnailUrl: string
}

// Warm-instance cache — survives repeated requests within the same Lambda
const _videoCache = new Map<string, ConceptVideo | null>()

interface YTItem {
  id:      { videoId: string }
  snippet: {
    title:        string
    channelTitle: string
    thumbnails:   { medium?: { url: string }; default?: { url: string } }
  }
}

export async function getConceptVideo(
  topicName: string,
): Promise<{ video: ConceptVideo | null; searchQuery: string }> {
  // Pro-only feature
  const isPro = await hasProAIAccess()
  if (!isPro) return { video: null, searchQuery: '' }

  const apiKey      = process.env.YOUTUBE_API_KEY
  const searchQuery = `eddie woo ${topicName} HSC maths`
  const cacheKey    = topicName.toLowerCase().replace(/\W+/g, '_')

  if (_videoCache.has(cacheKey)) {
    return { video: _videoCache.get(cacheKey) ?? null, searchQuery }
  }

  if (!apiKey) return { video: null, searchQuery }

  try {
    const params = new URLSearchParams({
      part:              'snippet',
      q:                 searchQuery,
      type:              'video',
      maxResults:        '3',
      relevanceLanguage: 'en',
      key:               apiKey,
    })
    const res  = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
    if (!res.ok) throw new Error(`YouTube API returned ${res.status}`)
    const data = (await res.json()) as { items?: YTItem[] }
    const item = data.items?.[0]
    const video: ConceptVideo | null = item
      ? {
          videoId:      item.id.videoId,
          title:        item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails.medium?.url
                        ?? item.snippet.thumbnails.default?.url
                        ?? '',
        }
      : null
    _videoCache.set(cacheKey, video)
    return { video, searchQuery }
  } catch (err) {
    console.error('[getConceptVideo] error:', err)
    _videoCache.set(cacheKey, null)
    return { video: null, searchQuery }
  }
}

// ─── getConceptExplanation ────────────────────────────────────────────────────
//
// Returns a clear, example-rich explanation of the concept being tested.
// Shown BEFORE answering — teaches the concept without revealing the answer.

export async function getConceptExplanation(
  questionId: string,
): Promise<{ concept: string }> {
  // Pro-only feature
  const isPro = await hasProAIAccess()
  if (!isPro) {
    return { concept: '__UPGRADE_REQUIRED__' }
  }

  const supabase = createSupabaseServerClient()

  const { data: q } = await supabase
    .from('questions')
    .select('content_json, nesa_outcome_code, outcome_id, difficulty_band')
    .eq('id', questionId)
    .single()

  if (!q) return { concept: 'Unable to load concept explanation. Please try again.' }

  const content      = (q.content_json ?? {}) as Record<string, string>
  const questionText = content.question_text ?? ''
  const nesaCode     = q.nesa_outcome_code ?? q.outcome_id ?? ''

  const userMessage = `
A student is about to answer this HSC Mathematics question (NESA: ${nesaCode}, Band ${q.difficulty_band}):

"${questionText}"

Before they answer, explain the underlying mathematical CONCEPT being tested. Do NOT reveal or hint at the correct answer option.

Structure your response exactly like this:

📖 Concept: [Name the specific mathematical concept in 1 line]

🔑 Key Idea: [Explain the concept clearly in 2–3 sentences. Include the key formula, rule, or definition.]

✏️ Worked Example:
[Write a short, self-contained worked example of this concept — use DIFFERENT numbers/values from the question above. Show each step clearly.]

💡 Remember: [One sentence tip students often forget about this concept.]

Use proper Unicode math symbols (e.g. x², √3/2, sin(θ), π, °, ≠, ≤, ≥, ×, ±, ∫). Be clear, concise, and friendly.`.trim()

  try {
    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5',
      max_tokens: 500,
      system:     'You are an expert NSW HSC Mathematics teacher. Your job is to explain mathematical concepts clearly and concisely to Year 11–12 students. You teach directly and confidently, using worked examples. You never use LaTeX. Always use proper Unicode math symbols: ² ³ ⁴ ⁿ for powers, √ for roots, × for multiply, ÷ for divide, π θ α β for Greek letters, ° for degrees, ≠ ≤ ≥ ± ∫ Σ → ∞ as needed.',
      messages:   [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return { concept: text.trim() }
  } catch (err) {
    console.error('[getConceptExplanation] Anthropic error:', err)
    return { concept: 'Unable to load concept explanation right now. Try the Hint button for a nudge!' }
  }
}

// ─── chatWithTutor ─────────────────────────────────────────────────────────────
//
// Free-form chat: student can ask follow-up questions about the current problem.

export interface ChatMessage {
  role:    'user' | 'assistant'
  content: string
}

export async function chatWithTutor(
  questionId: string,
  messages:   ChatMessage[],
): Promise<{ reply: string }> {
  // Pro-only feature
  const isPro = await hasProAIAccess()
  if (!isPro) {
    return { reply: '__UPGRADE_REQUIRED__' }
  }

  const supabase = createSupabaseServerClient()

  const { data: q } = await supabase
    .from('questions')
    .select('content_json, correct_answer, explanation, nesa_outcome_code, outcome_id, difficulty_band')
    .eq('id', questionId)
    .single()

  const content     = (q?.content_json ?? {}) as Record<string, string>
  const questionCtx = q
    ? `Current HSC question (${q.nesa_outcome_code ?? q.outcome_id}, Band ${q.difficulty_band}):\n${content.question_text ?? ''}\nA. ${content.option_a ?? ''}\nB. ${content.option_b ?? ''}\nC. ${content.option_c ?? ''}\nD. ${content.option_d ?? ''}`
    : 'An HSC Mathematics question.'

  const systemWithCtx = `${SYSTEM_PROMPT}

Context for this conversation:
${questionCtx}

The student is asking follow-up questions. Continue in Socratic mode — guide them, don't just give the answer. Be warm, concise, and encouraging. Use emojis sparingly to keep it friendly.`

  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 300,
      system:     systemWithCtx,
      messages:   messages.map(m => ({ role: m.role, content: m.content })),
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return { reply: text.trim() }
  } catch (err) {
    console.error('[chatWithTutor] error:', err)
    return { reply: "I'm having trouble connecting right now. Try rephrasing your question!" }
  }
}

// ─── assessOpenAnswer ──────────────────────────────────────────────────────────
//
// Uses Claude vision to assess a student's handwritten working image against
// the model answer and marking criteria. Returns a structured assessment.

export interface StepResult {
  criterion: string   // the marking criterion text
  passed:    boolean  // did the student achieve this?
  comment:   string   // brief specific comment on this step
}

export interface AssessOpenAnswerResult {
  score:           number        // marks awarded
  totalMarks:      number        // total possible marks
  isCorrect:       boolean       // true if score >= 50% of totalMarks
  feedback:        string        // 1-2 sentence overall assessment
  whatWasRight:    string[]      // up to 3 correct aspects
  whatWasMissing:  string[]      // up to 3 missing/incorrect aspects
  tip:             string        // one specific improvement tip
  stepResults:     StepResult[]  // per-criterion step checking
}

export async function assessOpenAnswer(params: {
  questionText:    string
  modelAnswer:     string
  solutionSteps:   string[]
  marks:           number
  markingCriteria: string[]
  workingImageBase64: string  // raw base64, no "data:" prefix
}): Promise<AssessOpenAnswerResult> {
  const {
    questionText, modelAnswer, solutionSteps, marks,
    markingCriteria, workingImageBase64,
  } = params

  // Build marking criteria list — one entry per mark
  const criteriaList: string[] = markingCriteria.length > 0
    ? markingCriteria
    : Array.from({ length: marks }, (_, i) => `Mark ${i + 1}: correct working step ${i + 1}`)

  const criteriaText = criteriaList.map((c, i) => `${i + 1}. ${c}`).join('\n')

  // Build step results template so Claude knows the exact array format required
  const stepTemplate = criteriaList
    .map((c) => `{"criterion":"${c.replace(/"/g, "'")}","passed":<true|false>,"comment":"<specific 1-sentence comment>"}`)
    .join(',\n  ')

  // Concise prompt — fewer input tokens = faster response
  const prompt = `NSW HSC Mathematics marker. Mark the student's handwritten working in the image.

Q: ${questionText}
Marks available: ${marks}
Marking criteria (check EACH one individually):
${criteriaText}
Model answer: ${modelAnswer || solutionSteps.slice(0, 4).join(' | ')}

Return ONLY valid JSON (no markdown, no commentary):
{
  "score": <int 0-${marks}>,
  "feedback": "<2 encouraging sentences>",
  "whatWasRight": ["<up to 3 items>"],
  "whatWasMissing": ["<up to 3 items>"],
  "tip": "<1 actionable sentence>",
  "stepResults": [
  ${stepTemplate}
  ]
}

If image is blank/unreadable set score to 0 and all stepResults passed to false. Use Unicode math symbols, not LaTeX.`

  // Detect image format from base64 magic bytes:
  //   PNG  → starts with "iVBOR"  (\x89PNG)
  //   JPEG → starts with "/9j/"   (\xFF\xD8\xFF)
  //   default to jpeg (we always compress to JPEG client-side before sending)
  const mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' =
    workingImageBase64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg'

  try {
    const response = await anthropic.messages.create({
      // Haiku is 3-5× faster than Sonnet and fully capable of reading handwritten maths
      model:      'claude-haiku-4-5',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type:       'base64',
              media_type: mediaType,
              data:       workingImageBase64,
            },
          },
          { type: 'text', text: prompt },
        ],
      }],
    })

    const raw = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')

    // Parse JSON from response
    const jsonStart = raw.indexOf('{')
    const jsonEnd   = raw.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd <= jsonStart) throw new Error('No JSON in response')

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>
    const score  = Math.max(0, Math.min(marks, Number(parsed.score ?? 0)))

    // Parse per-step results
    const rawSteps = Array.isArray(parsed.stepResults) ? parsed.stepResults as Record<string, unknown>[] : []
    const stepResults: StepResult[] = criteriaList.map((criterion, i) => {
      const s = rawSteps[i]
      return {
        criterion,
        passed:  s ? Boolean(s.passed) : false,
        comment: s ? String(s.comment ?? '') : '',
      }
    })

    return {
      score,
      totalMarks:     marks,
      isCorrect:      score >= Math.ceil(marks * 0.5),
      feedback:       String(parsed.feedback      ?? 'Assessment complete.'),
      whatWasRight:   Array.isArray(parsed.whatWasRight)   ? (parsed.whatWasRight   as string[]) : [],
      whatWasMissing: Array.isArray(parsed.whatWasMissing) ? (parsed.whatWasMissing as string[]) : [],
      tip:            String(parsed.tip ?? 'Keep practising — you are improving!'),
      stepResults,
    }
  } catch (err) {
    console.error('[assessOpenAnswer] error:', err)
    // Graceful fallback — partial credit, encourage retry
    return {
      score:          0,
      totalMarks:     marks,
      isCorrect:      false,
      feedback:       "I couldn't fully read your working. Try resubmitting with clearer writing or better lighting.",
      whatWasRight:   [],
      whatWasMissing: ['Could not assess — please resubmit'],
      tip:            'Write larger and ensure the photo is well-lit.',
      stepResults:    criteriaList.map(criterion => ({ criterion, passed: false, comment: 'Could not assess' })),
    }
  }
}

// ─── chatWithTutorReview ───────────────────────────────────────────────────────
// Used post-test in MockTestReview. Takes freeform context string instead of
// a question ID — allows the tutor to discuss any question from the test results.

// ─── generateTopicFeedback ────────────────────────────────────────────────────

export interface TopicFeedback {
  strengths:   string   // What the student did well
  gaps:        string   // Specific concept gaps identified
  improvement: string   // What needs improvement and why
  nextSteps:   string   // Concrete actions to take
}

export async function generateTopicFeedback(params: {
  topicName:    string
  correct:      number
  total:        number
  questions:    { text: string; isCorrect: boolean; isSkipped: boolean; band: number; studentAnswer: string | null; correctAnswer: string }[]
}): Promise<TopicFeedback> {
  const { topicName, correct, total, questions } = params
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  const qSummary = questions.map((q, i) =>
    `Q${i+1} (Band ${q.band}): "${q.text.slice(0, 100)}…" — ${q.isSkipped ? 'Skipped' : q.isCorrect ? 'Correct' : `Wrong (chose ${q.studentAnswer?.toUpperCase() ?? '?'}, correct was ${q.correctAnswer.toUpperCase()})`}`
  ).join('\n')

  const prompt = `You are an expert NSW HSC Mathematics tutor analysing a student's mock test performance on the topic: "${topicName}".

Results: ${correct}/${total} correct (${pct}%).

Question breakdown:
${qSummary}

Provide specific, actionable feedback in exactly this JSON format (no markdown, raw JSON only):
{
  "strengths": "1-2 sentences on what the student demonstrated well. Be specific about which concepts or question types they handled correctly. If all wrong, note any partial understanding shown.",
  "gaps": "1-2 sentences identifying the specific concept gaps — what subtopics or skills are clearly missing based on which questions they got wrong.",
  "improvement": "2-3 sentences explaining what needs improvement, why those errors likely happened (common misconceptions for this topic), and what the pattern of mistakes suggests.",
  "nextSteps": "2-3 concrete, specific action steps the student should take — e.g. which specific subtopics to revisit, what types of practice to do, what to focus on in Neumm."
}`

  try {
    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages:   [{ role: 'user', content: prompt }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}'
    const parsed = JSON.parse(text) as TopicFeedback
    return parsed
  } catch {
    return {
      strengths:   `You answered ${correct} out of ${total} questions correctly on ${topicName}.`,
      gaps:        correct < total ? 'Some concept gaps were identified in this topic.' : 'No major gaps detected.',
      improvement: correct < total ? 'Review the incorrect questions and their step-by-step solutions.' : 'Keep practising to maintain this level.',
      nextSteps:   'Revisit this topic in Neumm Practice and work through the concept intro before attempting more questions.',
    }
  }
}

export async function chatWithTutorReview(
  context:  string,
  messages: ChatMessage[],
): Promise<string> {
  const isPro = await hasProAIAccess()
  if (!isPro) return '__UPGRADE_REQUIRED__'

  const system = `${SYSTEM_PROMPT}

Context for this post-test review session:
${context}

The student has just completed a mock test and is reviewing their results. Help them understand what went wrong and how to improve. Be warm, specific, and Socratic.`

  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 400,
      system,
      messages:   messages.map(m => ({ role: m.role, content: m.content })),
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return text.trim()
  } catch {
    return "I'm having trouble connecting right now. Try again in a moment!"
  }
}
