/**
 * Fire a custom GA4 event via gtag.
 * Safe to call on server — no-ops if window.gtag is unavailable.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
