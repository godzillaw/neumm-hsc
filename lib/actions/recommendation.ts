'use server'

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ─── HSC mark-weight estimates per topic ───────────────────────────────────────
// Based on analysis of HSC Advanced Mathematics past papers (100 marks total).
const TOPIC_MARKS: Record<string, number> = {
  // Calculus — Differentiation (~30 marks combined across all)
  'MA-CALC-D01': 3,
  'MA-CALC-D02': 3,
  'MA-CALC-D03': 3,
  'MA-CALC-D04': 3,
  'MA-CALC-D05': 3,
  'MA-CALC-D06': 3,
  'MA-CALC-D07': 3,
  'MA-CALC-D08': 4,
  'MA-CALC-D09': 4,
  'MA-CALC-D10': 3,
  'MA-CALC-D11': 3,
  'MA-CALC-D12': 2,
  // Calculus — Integration (~30 marks combined)
  'MA-CALC-I01': 2,
  'MA-CALC-I02': 3,
  'MA-CALC-I03': 3,
  'MA-CALC-I04': 3,
  'MA-CALC-I05': 3,
  'MA-CALC-I06': 4,
  'MA-CALC-I07': 5,
  'MA-CALC-I08': 4,
  'MA-CALC-I09': 3,
  'MA-CALC-I10': 4,
  'MA-CALC-I11': 2,
  'MA-CALC-I12': 4,
  // Trigonometry
  'MA-TRIG-01': 2,
  'MA-TRIG-02': 2,
  'MA-TRIG-03': 3,
  'MA-TRIG-04': 3,
  'MA-TRIG-05': 2,
  'MA-TRIG-06': 3,
  'MA-TRIG-07': 3,
  'MA-TRIG-08': 2,
  'MA-TRIG-09': 2,
  // Exponential & Logarithms
  'MA-EXP-01': 2,
  'MA-EXP-02': 3,
  'MA-EXP-03': 3,
  'MA-EXP-04': 3,
  'MA-EXP-05': 3,
  'MA-EXP-06': 3,
  // Functions
  'MA-FUNC-01': 2,
  'MA-FUNC-02': 2,
  'MA-FUNC-03': 2,
  'MA-FUNC-04': 3,
  'MA-FUNC-05': 3,
  'MA-FUNC-06': 2,
  'MA-FUNC-07': 3,
  'MA-FUNC-08': 2,
  'MA-FUNC-09': 2,
  // Algebra
  'MA-ALG-01': 3,
  'MA-ALG-02': 3,
  'MA-ALG-03': 2,
  'MA-ALG-04': 3,
  'MA-ALG-05': 2,
  'MA-ALG-06': 3,
  'MA-ALG-07': 3,
  'MA-ALG-08': 2,
  // Statistics & Probability
  'MA-STAT-01': 2,
  'MA-STAT-02': 2,
  'MA-STAT-03': 2,
  'MA-STAT-04': 3,
  'MA-STAT-05': 4,
  'MA-STAT-06': 3,
  'MA-PROB-01': 3,
  'MA-PROB-02': 3,
  'MA-PROB-03': 3,
  'MA-PROB-04': 4,
  'MA-PROB-05': 3,
  // Financial
  'MA-FIN-01': 2,
  'MA-FIN-02': 3,
  'MA-FIN-03': 4,
  'MA-FIN-04': 3,
  'MA-FIN-05': 3,
  // Coordinate Geometry
  'MA-COORD-01': 2,
  'MA-COORD-02': 2,
  'MA-COORD-03': 3,
  'MA-COORD-04': 3,
  'MA-COORD-05': 2,
  // Extension
  'MA-EXT-01': 4,
  'MA-EXT-02': 3,
  'MA-EXT-03': 4,
  'MA-EXT-04': 4,
  'MA-EXT-05': 3,
  'MA-EXT-06': 4,
  'MA-EXT-07': 5,
  'MA-EXT-08': 3,
}

export interface WeakTopic {
  prefix: string
  name:   string
  avg:    number
}

// ─── getRecommendation ─────────────────────────────────────────────────────────
//
// Reads the student's three lowest-confidence topics and returns an AI-generated
// one-sentence focus recommendation.

export async function getRecommendation(
  weakTopics: WeakTopic[],
): Promise<string> {
  if (weakTopics.length === 0) {
    return 'Keep going — continue practising to reveal personalised recommendations.'
  }

  const top   = weakTopics[0]
  const marks = TOPIC_MARKS[top.prefix] ?? 3

  // List context for the AI
  const topicList = weakTopics
    .map((t, i) => `${i + 1}. ${t.name} — ${t.avg}% mastery`)
    .join('\n')

  const prompt = `You are an NSW HSC Mathematics coach giving personalised study advice.

A student's three lowest-mastery topics are:
${topicList}

Their weakest is "${top.name}" at ${top.avg}% mastery (NESA code prefix: ${top.prefix}).
This topic is worth approximately ${marks} marks in every HSC Mathematics exam.

Write EXACTLY ONE sentence following this template precisely:
"Practise [topic name] today — your weakest topic, worth approximately [N] marks in every exam."

Rules:
- Use the exact topic name: "${top.name}"
- Use exactly ${marks} for the marks number
- No additional sentences, no preamble, no quotation marks in your output
- The sentence should feel motivating and direct`

  try {
    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5',
      max_tokens: 80,
      messages:   [{ role: 'user', content: prompt }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return text.trim().replace(/^["']|["']$/g, '')  // strip any wrapping quotes
  } catch {
    // Reliable fallback if API fails
    return `Practise ${top.name} today — your weakest topic, worth approximately ${marks} marks in every exam.`
  }
}
