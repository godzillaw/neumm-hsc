import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Neumm',
  description: 'Privacy Policy for Neumm HSC Mathematics, operated by Caplix Pty Ltd. Explains how we collect, use, and protect your personal information under the Australian Privacy Act.',
}

const VERSION = '1.0'
const LAST_UPDATED = '1 June 2026'

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Sticky version banner */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#006D77', color: 'white',
        padding: '10px 20px', borderRadius: 12,
        marginBottom: 32, fontSize: 13, fontWeight: 700,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span>Privacy Policy — Version {VERSION}</span>
        <span style={{ opacity: 0.8 }}>Last updated: {LAST_UPDATED}</span>
      </div>

      <h1 style={{ color: '#006D77', fontSize: 30, fontWeight: 900, marginBottom: 8, marginTop: 0 }}>
        Privacy Policy
      </h1>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
        Caplix Pty Ltd is committed to protecting your privacy in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
      </p>

      <Section id="section-1" title="1. Who We Are">
        <p><strong>Caplix Pty Ltd</strong> (ABN 55 628 774 701) operates the Neumm platform (&ldquo;Neumm&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Neumm is an adaptive learning platform for HSC Mathematics students in New South Wales, Australia.</p>
        <p>Our privacy contact is: <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a></p>
        <p>This Privacy Policy explains how we collect, use, store, and disclose your personal information. By using Neumm, you consent to the practices described in this policy.</p>
      </Section>

      <Section id="section-2" title="2. What Data We Collect">
        <p>We collect the following categories of personal information:</p>
        <SubHeading>2.1 Account Information</SubHeading>
        <ul>
          <li>Name (first and last)</li>
          <li>Email address</li>
          <li>Password (hashed — never stored in plain text)</li>
          <li>Birth year (to determine age eligibility and minor status)</li>
          <li>Profile photo (if provided via Google OAuth)</li>
        </ul>
        <SubHeading>2.2 Learning Data</SubHeading>
        <ul>
          <li>Questions answered, selected answers, and correctness</li>
          <li>Working/solution images submitted (stored temporarily for AI marking)</li>
          <li>XP points, streak data, and band predictions</li>
          <li>Topics studied, mastery levels, and progress milestones</li>
          <li>AI tutor chat messages and hints received</li>
          <li>Time spent on questions and sessions</li>
        </ul>
        <SubHeading>2.3 Technical Data</SubHeading>
        <ul>
          <li>IP address (collected at signup for consent logging; not stored persistently for tracking)</li>
          <li>Browser/device type and operating system</li>
          <li>Cookies and session tokens (see our <Link href="/legal/cookies" style={{ color: '#185FA5' }}>Cookie Policy</Link>)</li>
          <li>Feature usage analytics (with your consent)</li>
        </ul>
        <SubHeading>2.4 Payment Information</SubHeading>
        <p>Payment is processed by Stripe. Caplix does not store your full credit card number. We may receive a tokenised reference and billing status from Stripe.</p>
        <SubHeading>2.5 Communications</SubHeading>
        <p>If you contact us by email, we retain that correspondence for support and compliance purposes.</p>
      </Section>

      <Section id="section-3" title="3. How We Use Your Data">
        <p>We use your personal information to:</p>
        <ul>
          <li>Create and manage your account</li>
          <li>Provide the adaptive learning service, including personalised question selection and AI-powered tutoring</li>
          <li>Process payments and manage subscription billing</li>
          <li>Send transactional emails (account creation, password reset, billing notifications)</li>
          <li>Send marketing emails about Neumm features and offers (with your consent, and subject to your opt-out rights)</li>
          <li>Improve our product through aggregated and anonymised usage analytics</li>
          <li>Comply with our legal obligations, including under the Privacy Act 1988 and Australian Consumer Law</li>
          <li>Detect and prevent fraud and abuse</li>
          <li>Respond to your enquiries and support requests</li>
        </ul>
        <p>We will not use your personal information for purposes incompatible with those described above without your consent.</p>
      </Section>

      <Section id="section-3a" title="3a. Cross-Border Data Transfers (APP 8)">
        <p>Neumm stores and processes data using cloud service providers that may be located outside Australia. The following third parties may process your data overseas:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#F3F4F6' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Provider</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Purpose</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Supabase</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Database and authentication</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Australia (ap-southeast-2)</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Anthropic</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>AI tutoring (Claude API)</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>United States</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Stripe</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Payment processing</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>United States / EU</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>SendGrid</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Transactional email</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>United States</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Vercel</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Application hosting</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>United States / Global edge network</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Google</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>OAuth authentication, Analytics</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>United States / Global</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 16 }}>Where we transfer personal information overseas, we take reasonable steps to ensure that the overseas recipient handles your personal information in a manner consistent with the Australian Privacy Principles. These steps include:</p>
        <ul>
          <li><strong>Contractual protections:</strong> We rely on each provider&apos;s Data Processing Agreement (DPA) or equivalent contractual commitments that bind them to handle data in accordance with applicable privacy laws.</li>
          <li><strong>Adequacy assessments:</strong> We assess each provider&apos;s privacy and security posture before onboarding them as a data processor.</li>
          <li><strong>Anthropic (AI processing):</strong> When your learning interactions (questions, hints, tutor chat) are sent to Anthropic&apos;s Claude API for AI processing, only the minimum data necessary is transmitted. We do not send full name or email to Anthropic. Anthropic processes data under their Enterprise Privacy Policy and does not train on API data by default.</li>
          <li><strong>Stripe (payments):</strong> Stripe is PCI DSS Level 1 certified. We transmit only the minimum payment data required. Stripe&apos;s Privacy Policy governs their data handling.</li>
        </ul>
        <p>By using Neumm, you consent to your personal information being transferred overseas as described in this section. If you have concerns about overseas transfers, contact us at <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>.</p>
      </Section>

      <Section id="section-4" title="4. Data Storage and Security">
        <p>We take reasonable steps to protect your personal information from misuse, interference, loss, and unauthorised access, modification, or disclosure. Our security measures include:</p>
        <ul>
          <li>All data is stored in Supabase (PostgreSQL) in the <strong>ap-southeast-2 (Sydney) region</strong>.</li>
          <li>All data in transit is encrypted using TLS 1.2 or higher.</li>
          <li>Data at rest is encrypted using AES-256.</li>
          <li>Access to the production database is restricted to authorised personnel via role-based access controls.</li>
          <li>Passwords are hashed using bcrypt and never stored in plain text.</li>
          <li>Session tokens are managed via Supabase Auth with short expiry windows.</li>
          <li>We conduct periodic reviews of our security practices.</li>
        </ul>

        <SubHeading>Notifiable Data Breaches (NDB Scheme)</SubHeading>
        <p>In the event of an eligible data breach as defined under the <em>Privacy Act 1988</em> (Cth) — Part IIIC — that is likely to result in serious harm to affected individuals, Caplix Pty Ltd will:</p>
        <ul>
          <li>Assess the breach within <strong>30 days</strong> of becoming aware of it to determine whether it is eligible for notification under the NDB Scheme.</li>
          <li>Notify the Office of the Australian Information Commissioner (OAIC) as soon as practicable after forming the view that the breach is eligible.</li>
          <li>Notify all individuals whose personal information was involved in the breach, or if that is not reasonably practicable, publish a notification on our website at neumm.com.au.</li>
          <li>Take immediate steps to contain the breach and prevent further exposure.</li>
        </ul>
        <p>If you believe your personal information may have been compromised, please contact us immediately at <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>.</p>
      </Section>

      <Section id="section-5" title="5. Third-Party Services">
        <p>We share your personal information with third-party service providers solely for the purpose of operating and improving Neumm. Our key providers are:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#F3F4F6' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Provider</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Service</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Data Shared</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #E5E7EB', color: '#0D3349' }}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Supabase Inc.</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Database &amp; Auth</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>All account &amp; learning data</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Data storage, authentication</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Anthropic PBC</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>AI (Claude API)</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Question text, working images, chat messages</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>AI tutoring, marking, hints</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Stripe Inc.</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Payments</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Email, payment details</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Subscription billing</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Twilio SendGrid</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Email delivery</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Email address, name</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Transactional &amp; marketing emails</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Vercel Inc.</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>App hosting</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>IP address, HTTP request data</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Infrastructure &amp; CDN</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Google LLC</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>OAuth &amp; Analytics</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Email, name (OAuth); usage events (Analytics)</td>
              <td style={{ padding: '10px 12px', border: '1px solid #E5E7EB' }}>Sign-in, usage analytics</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>We do not sell, rent, or trade your personal information to third parties for their own marketing purposes. We only disclose personal information to third parties to the extent necessary to provide the Service.</p>
      </Section>

      <Section id="section-6" title="6. Your Rights (APP 12 &amp; APP 13)">
        <p>Under the Australian Privacy Principles (APP 12 and APP 13), you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
          <li><strong>Correction:</strong> Request that we correct personal information that is inaccurate, out-of-date, incomplete, or misleading.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal retention obligations. We will respond to deletion requests within 30 days.</li>
          <li><strong>Opt-out of marketing:</strong> Unsubscribe from marketing emails at any time using the unsubscribe link in any marketing email, or by contacting us directly.</li>
          <li><strong>Complaint:</strong> Lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5' }}>www.oaic.gov.au</a> if you believe we have breached the Privacy Act.</li>
        </ul>
        <p>We will respond to access and correction requests within <strong>30 days</strong>. In exceptional circumstances, we may extend this to 60 days with notice.</p>
        <p>To exercise your rights, contact us at <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>. We may need to verify your identity before processing certain requests.</p>
        <p>You can also manage your privacy preferences directly in the app at <Link href="/dashboard/settings/privacy" style={{ color: '#185FA5' }}>Privacy Settings</Link>.</p>
      </Section>

      <Section id="section-7" title="7. Children's Privacy">
        <p>Neumm is not available to users under 13. We implement an age gate at signup that prevents registration by users born fewer than 13 years ago. We do not knowingly collect personal information from children under 13.</p>
        <p>For users aged 13–17 (&ldquo;Minors&rdquo;), we:</p>
        <ul>
          <li>Record birth year (not full date of birth) to track minor status.</li>
          <li>Require confirmation that a parent or guardian has agreed to our Terms and this Privacy Policy.</li>
          <li>Do not use Minor data for marketing purposes.</li>
          <li>Do not share Minor learning data with third parties for commercial purposes.</li>
          <li>Allow parents or guardians to request access to or deletion of a Minor&apos;s data by contacting <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>.</li>
        </ul>
        <p>See our <Link href="/legal/children-data" style={{ color: '#185FA5' }}>Children&apos;s Data Notice</Link> for full details.</p>
      </Section>

      <Section id="section-8" title="8. Cookies">
        <p>We use cookies and similar technologies to maintain your login session, remember your preferences, and (with your consent) track feature usage to improve the product.</p>
        <p>See our <Link href="/legal/cookies" style={{ color: '#185FA5' }}>Cookie Policy</Link> for full details about the cookies we use and how to manage them.</p>
      </Section>

      <Section id="section-9" title="9. Contact and Complaints">
        <p>For privacy enquiries, access and correction requests, or complaints, contact our Privacy Officer:</p>
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px 20px', border: '1.5px solid #E5E7EB', marginTop: 12 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0D3349' }}>Caplix Pty Ltd — Privacy Officer</p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Email: <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>
          </p>
        </div>
        <p style={{ marginTop: 12 }}>We will acknowledge your request within 5 business days and respond within 30 days.</p>
        <p>If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC): <a href="https://www.oaic.gov.au/privacy/privacy-complaints" target="_blank" rel="noopener noreferrer" style={{ color: '#185FA5' }}>www.oaic.gov.au/privacy/privacy-complaints</a></p>
      </Section>

      <Section id="section-10" title="10. Automated Decision-Making">
        <SubHeading>10.1 How Automated Decisions Are Made</SubHeading>
        <p>Neumm uses automated systems to personalise your learning experience. These systems analyse your question responses, correctness rates, time on questions, and topic performance to:</p>
        <ul>
          <li>Select the next question presented to you (adaptive difficulty engine)</li>
          <li>Estimate your current band/mastery level per topic (predictive model)</li>
          <li>Determine which stage or mission to recommend next</li>
          <li>Adjust the frequency of AI hints offered based on struggle detection</li>
        </ul>

        <SubHeading>10.2 Data Used</SubHeading>
        <p>The automated systems use the following data categories: question answer history, response times, working image assessments (scored by AI), XP and streak data, and topic mastery scores. No sensitive personal information (as defined under the Privacy Act) is used in these automated decisions.</p>

        <SubHeading>10.3 Human Oversight</SubHeading>
        <p>Automated decisions about your learning path are not binding and carry no legal or similarly significant consequences. All AI-generated content and adaptive recommendations are for educational guidance only. You are free to ignore recommendations. Caplix personnel review automated decision outputs periodically to check for systematic bias or errors.</p>

        <SubHeading>10.4 Your Rights Regarding Automated Decisions</SubHeading>
        <p>You have the right to:</p>
        <ul>
          <li>Request information about how a particular automated decision was made regarding your account.</li>
          <li>Request human review of any automated decision you believe was incorrect or unfair.</li>
          <li>Opt out of having your data used for automated learning personalisation (note: this will significantly reduce the quality of the adaptive learning experience).</li>
        </ul>
        <p>To exercise these rights, contact <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>.</p>
      </Section>

      {/* Related links */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontWeight: 700, color: '#0D3349', marginBottom: 12 }}>Related Documents</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { href: '/legal/terms',          label: 'Terms and Conditions' },
            { href: '/legal/children-data',  label: "Children's Data Notice" },
            { href: '/legal/acceptable-use', label: 'Acceptable Use Policy' },
            { href: '/legal/cookies',        label: 'Cookie Policy' },
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ color: '#0D3349', fontSize: 15, fontWeight: 900, marginBottom: 6, marginTop: 16 }}>
      {children}
    </h3>
  )
}
