import { NextResponse }               from 'next/server'
import Stripe                         from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// ─── Plan copy synced to Stripe on every checkout ─────────────────────────────
//
// • description   – short tagline shown under the price (1–2 sentences)
// • features      – rendered as a proper bulleted list via marketing_features
// • submitMessage – text shown above the Subscribe button
//
// Accurate feature matrix (mirrors PracticeSession.tsx PRO_AI_TIERS logic):
//   Basic  → 30q/day · AI hints only (no full tutor chat / concept explanations)
//   Pro    → unlimited · full AI tutor (hints + explanations + chat)

const PLAN_COPY: Record<string, {
  name:          string
  description:   string
  features:      string[]
  submitMessage: string
}> = {
  basic: {
    name:        'Neumm Basic',
    description: 'Everything you need to master HSC Maths — 30 questions a day with full AI support, adaptive difficulty, and step-by-step marking.',
    features: [
      '30 questions per day (resets midnight UTC)',
      'AI hints — guided nudges without giving away the answer',
      'AI concept explainer — deep-dive any topic instantly',
      'AI tutor chat — ask anything about the question or concept',
      'Draw or photo your working — AI marks every step',
      'Adaptive difficulty — challenges grow harder as you improve',
      'Mission roadmap — unlock stages and earn XP',
      'Streak tracking & full progress dashboard',
    ],
    submitMessage: 'Cancel anytime — no lock-in contracts. Your XP, streak and progress are saved forever.',
  },
  pro: {
    name:        'Neumm Pro',
    description: 'The complete HSC Maths preparation platform. Unlimited daily practice plus a full AI tutor that explains every concept and answers every question.',
    features: [
      'Unlimited questions — no daily cap, ever',
      'Full AI tutor — ask questions, get explanations, chat about any topic',
      'AI concept explainer — deep-dive any idea instantly',
      'Adaptive difficulty & mission roadmap with XP',
      'Draw or photo your working — AI marks each step',
      'Streak tracking & leaderboard — compete with classmates',
      'Full progress dashboard across all topics',
      'Priority support — response within 24 hours',
    ],
    submitMessage: 'The most complete HSC Maths platform. Unlimited practice, a full AI tutor, and no daily caps. Cancel anytime.',
  },
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.error('[stripe/checkout] STRIPE_SECRET_KEY is not set')
    return NextResponse.json({ error: 'Payment system is not configured. Please contact support.' }, { status: 503 })
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion })

    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const body    = await request.json().catch(() => ({})) as Record<string, unknown>
    const planName = (body.plan as string | undefined) ?? null

    // Accept plan name ('basic' | 'pro') or a direct priceId / productId
    let rawId = body.priceId as string | undefined
    if (!rawId && planName) {
      const planMap: Record<string, string | undefined> = {
        basic: process.env.STRIPE_BASIC_PRICE_ID,
        pro:   process.env.STRIPE_PRO_PRICE_ID,
      }
      rawId = planMap[planName]
    }
    if (!rawId) return NextResponse.json({ error: 'Missing priceId or plan' }, { status: 400 })

    // Resolve to a price ID and find the product ID
    let resolvedPriceId   = rawId
    let resolvedProductId: string | null = null

    if (rawId.startsWith('prod_')) {
      resolvedProductId = rawId
      const prices = await stripe.prices.list({ product: rawId, active: true, type: 'recurring', limit: 1 })
      if (!prices.data.length) return NextResponse.json({ error: 'No active price found for this product' }, { status: 400 })
      resolvedPriceId = prices.data[0].id
    } else {
      const price   = await stripe.prices.retrieve(rawId, { expand: ['product'] })
      const product = price.product
      if (product && typeof product !== 'string') resolvedProductId = product.id
    }

    // ── Sync product copy to Stripe (awaited — so the checkout session picks it up) ──
    if (resolvedProductId && planName && PLAN_COPY[planName]) {
      const copy = PLAN_COPY[planName]
      try {
        await stripe.products.update(resolvedProductId, {
          name:               copy.name,
          description:        copy.description,
          marketing_features: copy.features.map(name => ({ name })),
        })
      } catch (e) {
        // Non-fatal — checkout still proceeds with whatever Stripe has stored
        console.warn('[stripe/checkout] product update failed:', e)
      }
    }

    const origin   = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? ''
    const basePath = '/math-nsw/app'

    const session = await stripe.checkout.sessions.create({
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items:           [{ price: resolvedPriceId, quantity: 1 }],
      customer_email:       user.email,
      client_reference_id:  user.id,
      success_url:          `${origin}${basePath}/dashboard?upgraded=1`,
      cancel_url:           `${origin}${basePath}/account/upgrade?cancelled=1`,
      metadata:             { user_id: user.id },
      automatic_tax:        { enabled: true },
      custom_text: {
        submit: {
          message: planName && PLAN_COPY[planName]
            ? PLAN_COPY[planName].submitMessage
            : 'Cancel anytime · No lock-in contracts',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    const msg = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
