import { createClient } from '@supabase/supabase-js'

type EmailType = 'transactional' | 'marketing'

interface SendEmailOptions {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
  type: EmailType
  userId?: string
}

/**
 * Signs a payload using Web Crypto HMAC-SHA256.
 * Returns a base64url-encoded signature.
 */
async function hmacSign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return Buffer.from(sig).toString('base64url')
}

/**
 * Creates a simple signed token: base64url(payload).signature
 * where payload = base64url(JSON.stringify({...}))
 */
async function createUnsubscribeToken(userId: string, email: string): Promise<string> {
  const secret = process.env.UNSUBSCRIBE_SECRET ?? 'fallback-secret-change-me'
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days
  const payload = JSON.stringify({ userId, email, exp })
  const encodedPayload = Buffer.from(payload).toString('base64url')
  const signature = await hmacSign(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

/**
 * Verifies an unsubscribe token.
 * Returns the decoded payload if valid, null if invalid or expired.
 */
export async function verifyUnsubscribeToken(
  token: string,
): Promise<{ userId: string; email: string } | null> {
  try {
    const secret = process.env.UNSUBSCRIBE_SECRET ?? 'fallback-secret-change-me'
    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return null

    const expectedSig = await hmacSign(encodedPayload, secret)
    if (expectedSig !== signature) return null

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
      userId: string
      email: string
      exp: number
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return { userId: payload.userId, email: payload.email }
  } catch {
    return null
  }
}

/**
 * Checks if a user has opted out of marketing emails.
 */
async function isMarketingOptedOut(userId: string): Promise<boolean> {
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    const { data } = await admin
      .from('users')
      .select('marketing_emails_opted_out')
      .eq('id', userId)
      .single()
    return (data as { marketing_emails_opted_out?: boolean } | null)?.marketing_emails_opted_out ?? false
  } catch {
    return false
  }
}

/**
 * Logs a suppressed email to the email_suppression_log table.
 */
async function logSuppression(userId: string, email: string, reason: string): Promise<void> {
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    await admin.from('email_suppression_log').insert({ user_id: userId, email, reason })
  } catch (err) {
    console.error('[logSuppression]', err)
  }
}

/**
 * Main email sending function.
 *
 * For marketing emails:
 * - Checks marketing_emails_opted_out — logs to suppression table if opted out.
 * - Appends unsubscribe footer with signed token.
 *
 * For transactional emails:
 * - Bypasses opt-out check.
 * - Always includes Caplix Pty Ltd sender ID.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, htmlBody, textBody, type, userId } = options

  // ── Marketing opt-out check ────────────────────────────────────────────────
  if (type === 'marketing' && userId) {
    const optedOut = await isMarketingOptedOut(userId)
    if (optedOut) {
      console.log(`[sendEmail] SUPPRESSED marketing email to ${to} (opted out)`)
      await logSuppression(userId, to, 'marketing_opt_out')
      return
    }
  }

  // ── Build unsubscribe footer for marketing emails ──────────────────────────
  let finalHtmlBody = htmlBody
  let finalTextBody = textBody ?? ''

  const senderFooter = `
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #E5E7EB;font-size:11px;color:#9CA3AF;font-family:sans-serif;">
      <p style="margin:0">Sent by <strong>Caplix Pty Ltd</strong>, operating as Neumm.</p>
      <p style="margin:4px 0 0">ABN: [to be confirmed] | neumm.com.au</p>
    </div>
  `

  if (type === 'marketing' && userId) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.neumm.com.au/math-nsw/app'
    const token = await createUnsubscribeToken(userId, to)
    const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${token}`

    finalHtmlBody += `
      ${senderFooter}
      <div style="margin-top:8px;font-size:11px;color:#9CA3AF;font-family:sans-serif;">
        <a href="${unsubscribeUrl}" style="color:#9CA3AF;">Unsubscribe from marketing emails</a>
      </div>
    `
    finalTextBody += `\n\n---\nSent by Caplix Pty Ltd, operating as Neumm.\nUnsubscribe: ${unsubscribeUrl}`
  } else {
    finalHtmlBody += senderFooter
    finalTextBody += '\n\n---\nSent by Caplix Pty Ltd, operating as Neumm.'
  }

  // ── Send via SendGrid or log to console ────────────────────────────────────
  const apiKey = process.env.SENDGRID_API_KEY

  if (!apiKey) {
    console.log('[sendEmail] SENDGRID_API_KEY not configured — logging email to console:')
    console.log(`  To:      ${to}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Type:    ${type}`)
    console.log(`  Body:    ${finalTextBody.substring(0, 200)}…`)
    return
  }

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: {
      email: process.env.SUPPORT_EMAIL ?? 'support@neumm.com.au',
      name:  'Neumm by Caplix Pty Ltd',
    },
    subject,
    content: [
      { type: 'text/plain', value: finalTextBody || subject },
      { type: 'text/html',  value: finalHtmlBody },
    ],
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`[sendEmail] SendGrid error ${res.status}:`, body)
    throw new Error(`Email send failed: ${res.status}`)
  }

  console.log(`[sendEmail] Sent ${type} email to ${to}: "${subject}"`)
}
