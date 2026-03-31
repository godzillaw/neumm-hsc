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

    const { priceId } = await request.json()
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? ''
    const basePath = '/math-nsw/app'

    const session = await stripe.checkout.sessions.create({
      mode:               'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${origin}${basePath}/dashboard?upgraded=1`,
      cancel_url:  `${origin}${basePath}/account/upgrade?cancelled=1`,
      metadata:    { user_id: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
