import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Children's Data Notice — Neumm",
  description: "How Neumm handles data for users under 18, operated by Caplix Pty Ltd.",
}

const VERSION = '1.0'
const LAST_UPDATED = '1 June 2026'

export default function ChildrenDataPage() {
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
        <span>Children&apos;s Data Notice — Version {VERSION}</span>
        <span style={{ opacity: 0.8 }}>Last updated: {LAST_UPDATED}</span>
      </div>

      <h1 style={{ color: '#006D77', fontSize: 30, fontWeight: 900, marginBottom: 8, marginTop: 0 }}>
        Children&apos;s Data Notice
      </h1>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
        This notice explains how Caplix Pty Ltd handles personal information for Neumm users under 18 years of age.
      </p>

      <Section id="section-1" title="1. Who This Applies To">
        <p>This notice applies to all users of Neumm who are under 18 years of age (&ldquo;Minors&rdquo;). It supplements our full <Link href="/legal/privacy" style={{ color: '#185FA5' }}>Privacy Policy</Link> and our <Link href="/legal/terms" style={{ color: '#185FA5' }}>Terms and Conditions</Link>.</p>
        <p>If you are a parent or guardian of a Minor using Neumm, this notice explains the specific protections we apply and the rights available to you and your child.</p>
        <p>This notice is written to be readable by both teenagers and their parents or guardians.</p>
      </Section>

      <Section id="section-2" title="2. Age Restriction — Under 13 Hard Stop">
        <p>Neumm is <strong>not available to users under 13 years of age</strong>. We do not offer a parental consent pathway for under-13 users. This is a firm restriction.</p>
        <p>At signup, we implement an age gate that prevents anyone born fewer than 13 years ago from creating an account. If a user attempts to sign up and is identified as under 13, their registration is blocked and we log only the timestamp, IP address, and browser information — we do not collect any other personal information from the blocked user.</p>
        <p>If we become aware that a user account belongs to someone under 13 — whether through a report, our own review, or an error in the age gate — we will <strong>delete the account and all associated data immediately</strong>.</p>
        <p>If you believe your child under 13 has created an account on Neumm, please contact us immediately at <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>. We will investigate and delete the account as quickly as possible, and in any event within 5 business days.</p>
      </Section>

      <Section id="section-3" title="3. Data We Collect from Minors">
        <p>We apply a data minimisation principle to Minor users. Specifically:</p>
        <ul>
          <li><strong>Birth year only</strong> (not full date of birth) is collected to verify that the user is between 13 and 17 and to maintain minor status in their account.</li>
          <li>The same account information collected from adult users (name, email, learning data) is collected from Minors, as it is necessary to provide the Service.</li>
          <li>We do <strong>not</strong> collect device location data from any user, including Minors.</li>
          <li>We do <strong>not</strong> collect any sensitive information (as defined by the Privacy Act) from Minors beyond what is strictly necessary to provide the educational service.</li>
        </ul>
        <p>Minor learning data — including questions answered, hints received, and tutor chat messages — is used <strong>solely for the purpose of personalising and improving the learning experience</strong>. It is not used for advertising profiling or shared with advertisers.</p>
      </Section>

      <Section id="section-4" title="4. How We Use Minor Data">
        <p>We use personal information from Minor users only to:</p>
        <ul>
          <li>Provide the adaptive learning service and personalise the educational experience.</li>
          <li>Send transactional emails (account creation confirmation, password reset).</li>
          <li>Maintain account security and detect fraud.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p><strong>We do not use Minor data for:</strong></p>
        <ul>
          <li>Marketing or advertising to Minors or their parents/guardians.</li>
          <li>Selling or licensing Minor data to any third party.</li>
          <li>Behavioural advertising or third-party tracking.</li>
          <li>Any purpose incompatible with providing the educational Service.</li>
        </ul>
        <p>When learning data is sent to our AI provider (Anthropic) for tutoring purposes, it includes the question content and the student&apos;s working — but not the student&apos;s name, email address, or any directly identifying information. Anthropic does not train on API data submitted through their standard API by default.</p>
      </Section>

      <Section id="section-5" title="5. Rights for Minors and Guardians">
        <p>If you are a Minor using Neumm, or a parent or guardian of a Minor user, you have the following rights:</p>
        <SubHeading>Right to Access</SubHeading>
        <p>You may request a copy of all personal information we hold about the Minor user. We will provide this within 30 days of your verified request.</p>
        <SubHeading>Right to Correction</SubHeading>
        <p>You may request that we correct any inaccurate or incomplete information about the Minor user.</p>
        <SubHeading>Right to Deletion (&ldquo;Right to be Forgotten&rdquo;)</SubHeading>
        <p>You may request the <strong>complete deletion</strong> of a Minor user&apos;s account and all associated personal information. We will process deletion requests within 30 days. Deletion includes:</p>
        <ul>
          <li>The user account and profile information</li>
          <li>All learning data, question history, and progress records</li>
          <li>AI tutor chat messages</li>
          <li>Working images</li>
          <li>XP, streak, and gamification data</li>
        </ul>
        <p>Note: Some aggregated and anonymised data (which cannot be linked back to any individual) may be retained for product improvement purposes.</p>
        <SubHeading>How to Exercise These Rights</SubHeading>
        <p>Contact us at <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a> with the subject line &ldquo;Minor Data Request&rdquo;. Please include:</p>
        <ul>
          <li>The Minor&apos;s account email address.</li>
          <li>Your relationship to the Minor (parent or guardian).</li>
          <li>Your contact details for verification.</li>
          <li>The specific request (access, correction, or deletion).</li>
        </ul>
        <p>We may ask for verification of your relationship to the Minor before processing the request.</p>
      </Section>

      <Section id="section-6" title="6. Contact">
        <p>For all questions about how we handle Minor user data, please contact:</p>
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px 20px', border: '1.5px solid #E5E7EB', marginTop: 12 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0D3349' }}>Caplix Pty Ltd — Privacy Officer</p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Email: <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>
          </p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Support: <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a>
          </p>
        </div>
      </Section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontWeight: 700, color: '#0D3349', marginBottom: 12 }}>Related Documents</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { href: '/legal/terms',          label: 'Terms and Conditions' },
            { href: '/legal/privacy',        label: 'Privacy Policy' },
            { href: '/legal/acceptable-use', label: 'Acceptable Use Policy' },
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
