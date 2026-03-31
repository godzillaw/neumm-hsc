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
   * Recommended: prevents the app from being embedded as an iframe on other domains.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
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
