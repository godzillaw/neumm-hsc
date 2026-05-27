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
    // Next.js basePath ('/math-nsw/app') is NOT automatically prepended to
    // raw fetch() calls — only next/link and router.push get it for free.
    const apiPath = `${process.env.NEXT_PUBLIC_APP_URL ?? '/math-nsw/app'}/api/stripe/checkout`
      .replace(/^https?:\/\/[^/]+/, '')   // keep path-only for same-origin POST
    const res  = await fetch(apiPath, {
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
