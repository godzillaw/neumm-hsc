import { NextResponse }               from 'next/server'
import Stripe                         from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion })

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { priceId: rawId } = await request.json()
    if (!rawId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // If a product ID was passed (prod_xxx) instead of a price ID (price_xxx),
    // look up the first active recurring price for that product.
    let resolvedPriceId: string = rawId
    if (String(rawId).startsWith('prod_')) {
      const prices = await stripe.prices.list({
        product: rawId,
        active: true,
        type: 'recurring',
        limit: 1,
      })
      if (!prices.data.length) {
        return NextResponse.json({ error: 'No active price found for this product' }, { status: 400 })
      }
      resolvedPriceId = prices.data[0].id
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
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    const msg = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
