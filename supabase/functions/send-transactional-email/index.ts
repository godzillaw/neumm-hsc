/**
 * Supabase Edge Function: send-transactional-email
 *
 * Accepts { to, subject, html, text? } and dispatches via Resend.
 * Requires RESEND_API_KEY in Supabase Edge Function secrets:
 *   supabase secrets set RESEND_API_KEY=re_xxx
 *
 * In development (no key set), requests are logged and return { dev: true }.
 *
 * Deploy:
 *   supabase functions deploy send-transactional-email
 *
 * Test locally:
 *   supabase functions serve send-transactional-email --env-file .env.local
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

interface EmailPayload {
  to:       string
  subject:  string
  html:     string
  text?:    string
  replyTo?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  // Parse body
  let payload: EmailPayload
  try {
    payload = await req.json() as EmailPayload
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { to, subject, html, text, replyTo } = payload

  if (!to || !subject || !html) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  const FROM_ADDRESS   = Deno.env.get('EMAIL_FROM') ?? 'Neumm <noreply@neumm.com.au>'

  // ── Dev mode: no API key configured ────────────────────────────────────────
  if (!RESEND_API_KEY) {
    console.log('[send-transactional-email] DEV MODE — email not sent')
    console.log('  To:     ', to)
    console.log('  Subject:', subject)
    console.log('  HTML:   ', html.slice(0, 200), '...')
    return new Response(
      JSON.stringify({ sent: true, dev: true }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  // ── Send via Resend ─────────────────────────────────────────────────────────
  const body: Record<string, unknown> = { from: FROM_ADDRESS, to: [to], subject, html }
  if (text)    body.text     = text
  if (replyTo) body.reply_to = replyTo

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[send-transactional-email] Resend error:', err)
    return new Response(
      JSON.stringify({ error: 'Email provider error', detail: err }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  const data = await res.json() as { id: string }
  console.log('[send-transactional-email] Sent to', to, '— Resend ID:', data.id)

  return new Response(
    JSON.stringify({ sent: true, id: data.id }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  )
})
