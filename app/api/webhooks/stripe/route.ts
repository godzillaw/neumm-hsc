/**
 * POST /api/webhooks/stripe
 *
 * Handles four Stripe webhook events:
 *   checkout.session.completed          → upgrade tier, store customer/subscription IDs
 *   customer.subscription.trial_will_end → 3-day trial warning email
 *   customer.subscription.deleted       → downgrade to basic_trial_expired
 *   invoice.payment_failed              → set payment_failed tier + email
 *
 * Requirements:
 *   STRIPE_SECRET_KEY          — Stripe secret key
 *   STRIPE_WEBHOOK_SECRET      — whsec_... from Stripe dashboard / CLI
 *   STRIPE_BASIC_PRICE_ID      — price ID for Basic plan
 *   STRIPE_PRO_PRICE_ID        — price ID for Pro plan
 *   NEXT_PUBLIC_SUPABASE_URL   — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY  — service-role key (bypasses RLS)
 *   NEXT_PUBLIC_APP_URL        — production URL, e.g. https://app.neumm.com.au
 *
 * Local testing:
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *
 * When creating a Stripe Checkout Session, set client_reference_id to the
 * Supabase user UUID so checkout.session.completed can map back to the user:
 *   client_reference_id: supabaseUserId
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe                        from 'stripe'
import { createClient }              from '@supabase/supabase-js'

// ─── Stripe + Supabase clients (module-level, not per-request) ─────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
})

// Service-role client bypasses Row Level Security for server-side writes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

// ─── Tier helpers ───────────────────────────────────────────────────────────────

type Tier = 'basic_trial' | 'basic' | 'pro' | 'basic_trial_expired' | 'payment_failed'

function tierFromPriceId(priceId: string | null | undefined): 'basic' | 'pro' {
  if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'basic'
}

// ─── User lookup helpers ────────────────────────────────────────────────────────

interface UserRow {
  id:           string
  email:        string
  display_name: string | null
  tier:         Tier
}

async function getUserByCustomerId(customerId: string): Promise<UserRow | null> {
  const { data } = await supabase
    .from('users')
    .select('id, email, display_name, tier')
    .eq('stripe_customer_id', customerId)
    .single()
  return data as UserRow | null
}

async function getUserByEmail(email: string): Promise<UserRow | null> {
  const { data } = await supabase
    .from('users')
    .select('id, email, display_name, tier')
    .eq('email', email)
    .single()
  return data as UserRow | null
}

async function getUserById(id: string): Promise<UserRow | null> {
  const { data } = await supabase
    .from('users')
    .select('id, email, display_name, tier')
    .eq('id', id)
    .single()
  return data as UserRow | null
}

// ─── Email helper (delegates to Supabase Edge Function) ────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: { to, subject, html },
    })
    if (error) throw error
  } catch (err) {
    // Non-fatal: log and continue — a failed email must not roll back DB writes
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[stripe-webhook] ⚠️  Email to <${to}> failed: ${msg}`)
  }
}

// ─── Email templates ────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function emailWrapper(title: string, body: string): string {
  return `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
         background:#F4F6FA; margin:0; padding:20px; }
  .card { background:#fff; border-radius:16px; max-width:520px; margin:0 auto;
          padding:36px; box-shadow:0 2px 8px rgba(0,0,0,.06); }
  h2   { color:#111827; margin-top:0; }
  p    { color:#4B5563; line-height:1.6; }
  .cta { display:inline-block; padding:12px 24px; border-radius:10px;
         text-decoration:none; font-weight:700; font-size:14px; margin-top:8px; }
  .small { color:#9CA3AF; font-size:12px; }
</style></head><body>
<div class="card">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
    <div style="width:36px;height:36px;background:#185FA5;border-radius:10px;
                display:flex;align-items:center;justify-content:center;
                color:#fff;font-weight:900;font-size:18px;">N</div>
    <span style="font-weight:700;font-size:18px;color:#111827;">Neumm</span>
  </div>
  <h2>${title}</h2>
  ${body}
  <p class="small" style="margin-top:32px;border-top:1px solid #F3F4F6;padding-top:16px;">
    You received this because you have a Neumm account.
    Questions? Reply to this email — we read every one.
  </p>
</div></body></html>`
}

// ─── Event handlers ─────────────────────────────────────────────────────────────

// ── 1. checkout.session.completed ──────────────────────────────────────────────
//
// Fired when a student completes the Stripe Checkout flow.
// Sets tier, stores Stripe IDs and trial_end_date.
//
// IMPORTANT: when creating the Checkout Session server-side, set:
//   client_reference_id: supabaseUserId   ← maps back to the user
//   customer_email:      user.email        ← fallback lookup

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId     = session.customer    as string
  const subscriptionId = session.subscription as string

  if (!subscriptionId) {
    console.warn('[stripe-webhook] checkout.session.completed: no subscription ID — skipping')
    return
  }

  // Retrieve the subscription to get price info and trial period
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  })

  const priceId  = subscription.items.data[0]?.price?.id ?? null
  const tier     = tierFromPriceId(priceId)
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null

  // ── Locate user ──────────────────────────────────────────────────────────────
  // Prefer client_reference_id (user UUID stored at checkout creation time)
  let user: UserRow | null = null

  if (session.client_reference_id) {
    user = await getUserById(session.client_reference_id)
  }
  if (!user && session.customer_email) {
    user = await getUserByEmail(session.customer_email)
  }
  if (!user && customerId) {
    user = await getUserByCustomerId(customerId)
  }

  if (!user) {
    console.error(
      '[stripe-webhook] checkout.session.completed: cannot find user for session',
      session.id,
      '— customer:', customerId,
      '— ref:', session.client_reference_id,
    )
    return
  }

  // ── Write to users table ─────────────────────────────────────────────────────
  const { error } = await supabase.from('users').update({
    tier,
    stripe_customer_id:     customerId,
    stripe_subscription_id: subscriptionId,
    trial_end_date:         trialEnd,
    card_on_file:           true,  // card was added at checkout
  }).eq('id', user.id)

  if (error) {
    console.error('[stripe-webhook] checkout.session.completed DB error:', error.message)
    throw error
  }

  console.log(
    `[stripe-webhook] ✅ checkout.session.completed: user ${user.id} → tier="${tier}"` +
    (trialEnd ? ` trial_end=${trialEnd}` : ''),
  )
}

// ── 2. customer.subscription.trial_will_end ────────────────────────────────────
//
// Fires ~3 days before trial ends. Send a heads-up email.

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const user       = await getUserByCustomerId(customerId)

  if (!user) {
    console.warn('[stripe-webhook] trial_will_end: no user for customer', customerId)
    return
  }

  const trialEndDate = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toLocaleDateString('en-AU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'soon'

  const name = user.display_name?.split(' ')[0] ?? 'there'

  const html = emailWrapper('Your Neumm trial ends in 3 days', `
    <p>Hi ${name},</p>
    <p>Just a heads-up — your 7-day free trial expires on <strong>${trialEndDate}</strong>.</p>
    <p>
      Everything you've built so far — your streak, mastery map, and session history —
      is saved and waiting for you. Subscribe to keep your momentum going.
    </p>
    <p>
      After your trial ends you'll still be able to log in, but practice sessions and
      your personalised question bank will be paused.
    </p>
    <a class="cta" href="${APP_URL}/dashboard/account"
       style="background:#185FA5;color:#fff;">
      Keep my subscription →
    </a>
    <p style="margin-top:20px;">See you on the other side 🔥</p>
    <p>— The Neumm team</p>
  `)

  await sendEmail(user.email, 'Your Neumm trial ends in 3 days ⏰', html)
  console.log(`[stripe-webhook] ✅ trial_will_end email → ${user.email}`)
}

// ── 3. customer.subscription.deleted ──────────────────────────────────────────
//
// Subscription was cancelled or expired. Downgrade tier.
// An upgrade prompt is shown on the dashboard when tier === 'basic_trial_expired'.

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const user       = await getUserByCustomerId(customerId)

  if (!user) {
    console.warn('[stripe-webhook] subscription.deleted: no user for customer', customerId)
    return
  }

  const { error } = await supabase.from('users').update({
    tier:                   'basic_trial_expired',
    stripe_subscription_id: null,
  }).eq('id', user.id)

  if (error) {
    console.error('[stripe-webhook] subscription.deleted DB error:', error.message)
    throw error
  }

  const name = user.display_name?.split(' ')[0] ?? 'there'

  const html = emailWrapper('Your Neumm subscription has ended', `
    <p>Hi ${name},</p>
    <p>Your Neumm subscription has ended and your account has been downgraded.</p>
    <p>
      Your mastery map, streak history, and progress are all saved.
      Resubscribe any time to pick up exactly where you left off.
    </p>
    <a class="cta" href="${APP_URL}/dashboard/account"
       style="background:#185FA5;color:#fff;">
      Resubscribe now →
    </a>
    <p>— The Neumm team</p>
  `)

  await sendEmail(user.email, 'Your Neumm subscription has ended', html)
  console.log(`[stripe-webhook] ✅ subscription.deleted: user ${user.id} → tier="basic_trial_expired"`)
}

// ── 4. invoice.payment_failed ──────────────────────────────────────────────────
//
// Payment attempt failed. Set tier to 'payment_failed' and email the student.

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const user       = await getUserByCustomerId(customerId)

  if (!user) {
    console.warn('[stripe-webhook] payment_failed: no user for customer', customerId)
    return
  }

  const { error } = await supabase.from('users').update({
    tier: 'payment_failed',
  }).eq('id', user.id)

  if (error) {
    console.error('[stripe-webhook] payment_failed DB error:', error.message)
    throw error
  }

  const amountStr = invoice.amount_due
    ? `$${(invoice.amount_due / 100).toFixed(2)} AUD`
    : 'your subscription payment'

  const attemptCount  = invoice.attempt_count ?? 1
  const nextAttempt   = invoice.next_payment_attempt
    ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long',
      })
    : null

  const name = user.display_name?.split(' ')[0] ?? 'there'

  const html = emailWrapper('Payment failed — action required', `
    <p>Hi ${name},</p>
    <p>
      We were unable to process ${amountStr} for your Neumm subscription
      (attempt ${attemptCount}).
    </p>
    ${nextAttempt ? `<p>We'll automatically retry on <strong>${nextAttempt}</strong>.</p>` : ''}
    <p>
      To avoid losing access to your practice sessions, please update your
      payment details now.
    </p>
    <a class="cta" href="${APP_URL}/dashboard/account"
       style="background:#EF4444;color:#fff;">
      Update payment details →
    </a>
    ${invoice.hosted_invoice_url
      ? `<p><a href="${invoice.hosted_invoice_url}" style="color:#185FA5;">View invoice</a></p>`
      : ''}
    <p>— The Neumm team</p>
  `)

  await sendEmail(user.email, '⚠️ Payment failed — update your Neumm payment details', html)
  console.log(`[stripe-webhook] ✅ payment_failed: user ${user.id} → tier="payment_failed", email sent`)
}

// ─── Route handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 1. Read raw body (MUST be read as text — do NOT call .json()) ─────────────
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[stripe-webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  // ── 2. Verify webhook signature ───────────────────────────────────────────────
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] ❌ Signature verification failed:', msg)
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 })
  }

  console.log(`[stripe-webhook] Received: ${event.type}  id=${event.id}`)

  // ── 3. Dispatch to handler ────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        // Acknowledge all other events so Stripe doesn't retry them
        console.log('[stripe-webhook] Unhandled event type (acknowledged):', event.type)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] ❌ Handler threw for', event.type, ':', msg)
    // Return 500 so Stripe retries this event
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Stripe requires 2xx to acknowledge receipt
  return NextResponse.json({ received: true, type: event.type })
}
