'use client'

/**
 * Calls the Stripe checkout API and redirects the browser to the hosted
 * checkout page. Pass the plan name ('basic' or 'pro') and an optional
 * setter to show a loading state.
 */
export async function goToCheckout(
  plan: 'basic' | 'pro',
  setLoading?: (v: boolean) => void,
): Promise<void> {
  setLoading?.(true)
  try {
    const res  = await fetch('/api/stripe/checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ plan }),
    })
    const data = await res.json() as { url?: string; error?: string }
    if (data.url) {
      window.location.href = data.url
    } else {
      console.error('[goToCheckout]', data.error)
      setLoading?.(false)
    }
  } catch (err) {
    console.error('[goToCheckout]', err)
    setLoading?.(false)
  }
}
