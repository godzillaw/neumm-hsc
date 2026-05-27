import { NextResponse }               from 'next/server'
import Stripe                         from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// ─── Compelling plan copy shown on the Stripe checkout page ───────────────────
//
// These are synced to the Stripe product description on every checkout so the
// left-hand panel always shows up-to-date marketing copy.

const PLAN_COPY: Record<string, { name: string; description: string; submitMessage: string }> = {
  basic: {
    name: 'Basic',
    description:
      '30 questions per day, every day\n' +
      '✓ Adaptive difficulty — questions get harder as you improve\n' +
      '✓ Mission roadmap — unlock stages, earn XP, track mastery\n' +
      '✓ AI hint system — get guided nudges without giving away the answer\n' +
      '✓ Step-by-step working input — draw or photo your working for marking\n' +
      '✓ Streak tracking — build a daily habit and stay on top of HSC prep\n' +
      '✓ Full progress dashboard — see exactly where you stand across all topics',
    submitMessage:
      'Join thousands of HSC students who have improved their marks with Neumm. Cancel anytime — no lock-in.',
  },
  pro: {
    name: 'Pro',
    description:
      'Unlimited questions — practise as much as you want, every day\n' +
      '✓ Full AI tutor — ask anything, get detailed explanations, chat about any question\n' +
      '✓ Adaptive difficulty — always challenged at the right level\n' +
      '✓ Mission roadmap — unlock stages, earn XP, track mastery\n' +
      '✓ Step-by-step working input — draw or photo your working for marking\n' +
      '✓ Streak tracking + leaderboard — compete with classmates\n' +
      '✓ Full progress dashboard across all HSC topics\n' +
      '✓ Priority support — questions answered within 24 hours',
    submitMessage:
      'The most complete HSC Maths preparation platform. Unlimited practice, full AI tutor, no daily caps. Cancel anytime.',
  },
}

export async function POST(request: Request) {
  // Guard: Stripe key must be present
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.error('[stripe/checkout] STRIPE_SECRET_KEY is not set')
    return NextResponse.json({ error: 'Payment system is not configured. Please contact support.' }, { status: 503 })
  }

  try {
    // Initialise Stripe inside the handler so a bad key doesn't crash module load
    const stripe = new Stripe(secretKey, { apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion })

    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({})) as Record<string, unknown>

    // Accept either a direct priceId/productId OR a plan name ('basic' | 'pro')
    const planName = (body.plan as string | undefined) ?? null
    let rawId = body.priceId as string | undefined
    if (!rawId && planName) {
      const planMap: Record<string, string | undefined> = {
        basic: process.env.STRIPE_BASIC_PRICE_ID,
        pro:   process.env.STRIPE_PRO_PRICE_ID,
      }
      rawId = planMap[planName]
    }
    if (!rawId) {
      return NextResponse.json({ error: 'Missing priceId or plan' }, { status: 400 })
    }

    // If a product ID was passed (prod_xxx) instead of a price ID (price_xxx),
    // look up the first active recurring price for that product and update the
    // product description with compelling marketing copy.
    let resolvedPriceId: string = rawId
    let resolvedProductId: string | null = null

    if (String(rawId).startsWith('prod_')) {
      resolvedProductId = rawId
      const prices = await stripe.prices.list({
        product: rawId,
        active:  true,
        type:    'recurring',
        limit:   1,
      })
      if (!prices.data.length) {
        return NextResponse.json({ error: 'No active price found for this product' }, { status: 400 })
      }
      resolvedPriceId = prices.data[0].id
    } else {
      // price_xxx — look up the product it belongs to
      const price = await stripe.prices.retrieve(rawId, { expand: ['product'] })
      const product = price.product
      if (product && typeof product !== 'string' && product.id) {
        resolvedProductId = product.id
      }
    }

    // Sync compelling description to the Stripe product (fire-and-forget, non-blocking)
    if (resolvedProductId && planName && PLAN_COPY[planName]) {
      const copy = PLAN_COPY[planName]
      stripe.products.update(resolvedProductId, {
        name:        `Neumm ${copy.name}`,
        description: copy.description,
      }).catch(err => console.warn('[stripe/checkout] product update skipped:', err))
    }

    const origin   = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? ''
    const basePath = '/math-nsw/app'

    const submitMessage = planName && PLAN_COPY[planName]
      ? PLAN_COPY[planName].submitMessage
      : 'Cancel anytime · No lock-in contracts'

    const session = await stripe.checkout.sessions.create({
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items:           [{ price: resolvedPriceId, quantity: 1 }],
      customer_email:       user.email,
      client_reference_id:  user.id,
      success_url:          `${origin}${basePath}/dashboard?upgraded=1`,
      cancel_url:           `${origin}${basePath}/account/upgrade?cancelled=1`,
      metadata:             { user_id: user.id },
      custom_text: {
        submit: { message: submitMessage },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    const msg = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
