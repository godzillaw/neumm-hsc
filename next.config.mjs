import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * basePath — serves the entire app under /math-nsw/app on the custom domain.
   *
   * Effect:
   *   - All Next.js routes are prefixed:  /dashboard → /math-nsw/app/dashboard
   *   - All API routes are prefixed:       /api/...   → /math-nsw/app/api/...
   *   - next/link and router.push() work WITHOUT the prefix (Next.js adds it automatically)
   *   - The middleware receives paths WITHOUT the basePath prefix
   *   - Static assets and _next/* are served correctly under the prefix
   *
   * Required env var in Vercel production:
   *   NEXT_PUBLIC_APP_URL=https://www.neumm.com.au/math-nsw/app
   */
  basePath: '/math-nsw/app',

  /**
   * Redirect bare domain root → /math-nsw (the marketing landing page).
   * Runs before filesystem and rewrite checks.
   */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/math-nsw',
        permanent: true,
      },
    ]
  },

  /**
   * Reverse-proxy /math-nsw and /math-nsw/* to the marketing site hosted on
   * hsc-math-marketing.vercel.app. Because we use afterFiles, Next.js checks
   * its own filesystem (basePath /math-nsw/app) first — so /math-nsw/app/**
   * routes are always served by this app and never proxied.
   *
   * The marketing site has basePath '/math-nsw', so its _next assets are at
   * /math-nsw/_next/... which also get transparently proxied here.
   */
  async rewrites() {
    return {
      // fallback runs after ALL routes (static + dynamic) so dynamic app routes
      // like /exam/[attemptId]/sit are matched first, then unmatched /math-nsw/*
      // paths fall through to the marketing site proxy.
      fallback: [
        {
          source: '/math-nsw',
          destination: 'https://hsc-math-marketing.vercel.app/math-nsw',
        },
        {
          source: '/math-nsw/:path*',
          destination: 'https://hsc-math-marketing.vercel.app/math-nsw/:path*',
        },
      ],
    }
  },

  /**
   * Recommended: prevents the app from being embedded as an iframe on other domains.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          {
            key:   'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key:   'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key:   'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.stripe.com https://www.google-analytics.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
