'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

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

Always be warm, encouraging, and precise. Use plain text math notation (e.g. x^2, sqrt(x), dy/dx) — no LaTeX.`

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
