import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy — Neumm',
  description: 'Cookie Policy for Neumm HSC Mathematics. What cookies we use, why, and how to manage them.',
}

const VERSION = '1.0'
const LAST_UPDATED = '1 June 2026'

const COOKIES = [
  {
    name:     'sb-hlytckxvelqizlgtfiya-auth-token',
    type:     'Essential',
    purpose:  'Maintains your login session via Supabase Auth',
    duration: 'Session / 1 hour (auto-refreshed)',
  },
  {
    name:     'sb-hlytckxvelqizlgtfiya-auth-token-code-verifier',
    type:     'Essential',
    purpose:  'PKCE code verifier for OAuth login — prevents CSRF attacks during sign-in',
    duration: 'Session',
  },
  {
    name:     'neumm_tier',
    type:     'Essential',
    purpose:  'Stores your subscription tier for access control decisions',
    duration: '30 days',
  },
  {
    name:     'neumm_analytics',
    type:     'Analytics',
    purpose:  'Tracks feature usage to help us improve the product (only set with your consent)',
    duration: '1 year',
  },
  {
    name:     '__stripe_mid',
    type:     'Essential',
    purpose:  'Stripe fraud prevention and checkout integrity',
    duration: '1 year',
  },
]

export default function CookiePolicyPage() {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#006D77', color: 'white',
        padding: '10px 20px', borderRadius: 12,
        marginBottom: 32, fontSize: 13, fontWeight: 700,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span>Cookie Policy — Version {VERSION}</span>
        <span style={{ opacity: 0.8 }}>Last updated: {LAST_UPDATED}</span>
      </div>

      <h1 style={{ color: '#006D77', fontSize: 30, fontWeight: 900, marginBottom: 8, marginTop: 0 }}>
        Cookie Policy
      </h1>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
        This Cookie Policy explains how Caplix Pty Ltd uses cookies and similar technologies on Neumm.
      </p>

      <Section id="section-1" title="1. What Are Cookies?">
        <p>Cookies are small text files placed on your device (computer, phone, or tablet) when you visit a website. They allow the website to recognise your device and remember certain information about your visit, such as whether you are logged in.</p>
        <p>Similar technologies include local storage and session storage — browser-based storage mechanisms that work similarly to cookies but are stored differently. Where this policy refers to &ldquo;cookies&rdquo; it includes these similar technologies.</p>
        <p>Cookies are widely used to make websites work, or work more efficiently, and to provide information to website owners.</p>
      </Section>

      <Section id="section-2" title="2. Cookies We Use">
        <p>Neumm uses the following cookies:</p>
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#F3F4F6' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349', whiteSpace: 'nowrap' }}>Cookie Name</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Purpose</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349', whiteSpace: 'nowrap' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((cookie, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                  <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>
                    {cookie.name}
                  </td>
                  <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      background: cookie.type === 'Essential' ? '#EFF6FF' : '#F0FDF4',
                      color: cookie.type === 'Essential' ? '#1D4ED8' : '#15803D',
                    }}>
                      {cookie.type}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB', color: '#374151' }}>{cookie.purpose}</td>
                  <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB', color: '#374151', whiteSpace: 'nowrap' }}>{cookie.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="section-3" title="3. Essential vs Non-Essential Cookies">
        <p><strong>Essential cookies</strong> are strictly necessary to provide the Service. Without them, Neumm cannot function — for example, you cannot stay logged in or use the checkout. Essential cookies do not require your consent to be set, as they are necessary for the legitimate operation of the site.</p>
        <p><strong>Analytics cookies</strong> (non-essential) are set only with your consent. We use analytics data to understand which features are used most, identify areas for improvement, and make data-driven product decisions. This data is collected and analysed in aggregated form.</p>
        <p>If you choose &ldquo;Essential Only&rdquo; in our cookie consent banner, only essential cookies will be set. Analytics cookies will not be placed and no feature usage events will be tracked.</p>
      </Section>

      <Section id="section-4" title="4. How to Manage Cookies">
        <p>You can control and manage cookies in your browser settings. Instructions for common browsers:</p>
        <ul>
          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li><strong>Firefox:</strong> Options → Privacy &amp; Security → Cookies and Site Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
        </ul>
        <p>Note: If you delete or block essential cookies, you may not be able to stay logged in to Neumm or use all features of the Service.</p>
        <p>You can also opt out of Google Analytics across all websites by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5' }}>Google Analytics Opt-out Browser Add-on</a>.</p>
      </Section>

      <Section id="section-5" title="5. Cookie Consent">
        <p>When you first visit Neumm (or after clearing your browser data), you will see our cookie consent banner. You can choose:</p>
        <ul>
          <li><strong>Accept All:</strong> Sets both essential and analytics cookies. Allows us to track feature usage to improve the product.</li>
          <li><strong>Essential Only:</strong> Sets only the cookies necessary to run Neumm. No analytics tracking.</li>
        </ul>
        <p>Your consent is stored in your browser&apos;s local storage under the key <code style={{ background: '#F3F4F6', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>neumm_cookie_consent</code> and includes a timestamp and the version of this policy in effect at the time of consent.</p>
        <p>You can change your consent preferences at any time by clearing your browser&apos;s local storage for neumm.com.au, which will cause the consent banner to reappear.</p>
        <p>For users under 16, we automatically apply Essential Only mode regardless of banner interaction, to comply with children&apos;s data protection best practices.</p>
      </Section>

      <Section id="section-6" title="6. Contact">
        <p>If you have questions about our use of cookies, contact:</p>
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px 20px', border: '1.5px solid #E5E7EB', marginTop: 12 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0D3349' }}>Caplix Pty Ltd — Privacy Officer</p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Email: <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>
          </p>
        </div>
      </Section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontWeight: 700, color: '#0D3349', marginBottom: 12 }}>Related Documents</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { href: '/legal/terms',   label: 'Terms and Conditions' },
            { href: '/legal/privacy', label: 'Privacy Policy' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: '#185FA5', fontWeight: 700, fontSize: 14 }}>
              {l.label} →
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <a href="#" style={{ color: '#006D77', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          ↑ Back to top
        </a>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 40 }}>
      <h2 style={{ color: '#006D77', fontSize: 20, fontWeight: 900, marginBottom: 12, marginTop: 0 }}>
        {title}
      </h2>
      <div style={{ color: '#374151', lineHeight: 1.75, fontSize: 15 }}>
        {children}
      </div>
    </section>
  )
}
