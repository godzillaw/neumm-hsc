import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy — Neumm',
  description: 'Acceptable Use Policy for Neumm HSC Mathematics. What you can and cannot do when using Neumm.',
}

const VERSION = '1.0'
const LAST_UPDATED = '1 June 2026'

export default function AcceptableUsePage() {
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
        <span>Acceptable Use Policy — Version {VERSION}</span>
        <span style={{ opacity: 0.8 }}>Last updated: {LAST_UPDATED}</span>
      </div>

      <h1 style={{ color: '#006D77', fontSize: 30, fontWeight: 900, marginBottom: 8, marginTop: 0 }}>
        Acceptable Use Policy
      </h1>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) sets out the rules for using Neumm. It forms part of our <Link href="/legal/terms" style={{ color: '#185FA5' }}>Terms and Conditions</Link>.
      </p>

      <Section id="section-1" title="1. Permitted Use">
        <p>You may use Neumm solely for personal, non-commercial educational purposes. Specifically, you may:</p>
        <ul>
          <li>Access and use questions, explanations, and AI tutor features to support your HSC Mathematics study.</li>
          <li>Review and learn from AI-generated hints and solutions.</li>
          <li>Upload photos or drawings of your mathematical working for AI assessment.</li>
          <li>Use the progress dashboard and leaderboard features as designed.</li>
          <li>Share your invite code with friends for the purposes of the friends leaderboard feature.</li>
        </ul>
        <p>Your use of the Service must at all times comply with applicable Australian laws and regulations.</p>
      </Section>

      <Section id="section-2" title="2. Prohibited Conduct">
        <p>You must not use Neumm in any of the following ways:</p>

        <SubHeading>2.1 Account and Access Violations</SubHeading>
        <ul>
          <li><strong>Account sharing:</strong> You must not share your account credentials with any other person. Each account is for the sole use of the registered user. Sharing accounts (including for the purpose of circumventing daily question limits) is prohibited.</li>
          <li><strong>Multiple accounts:</strong> You must not create multiple accounts to gain additional free trial periods or to circumvent subscription requirements.</li>
          <li><strong>Circumventing access controls:</strong> You must not attempt to bypass, disable, or circumvent any technical measures that control access to paid features, limit question counts, or restrict functionality to subscribed users.</li>
          <li><strong>Automated access:</strong> You must not use bots, scripts, or automated tools to access the Service, answer questions, accumulate XP, or interact with the AI tutor on your behalf.</li>
        </ul>

        <SubHeading>2.2 AI and System Integrity</SubHeading>
        <ul>
          <li><strong>Prompt extraction:</strong> You must not attempt to extract, replicate, publish, or reverse-engineer Neumm&apos;s AI system prompts, instruction sets, or internal AI configurations.</li>
          <li><strong>Prompt injection:</strong> You must not attempt to manipulate the AI tutor&apos;s behaviour by injecting instructions into your questions or messages designed to override or bypass its intended function.</li>
          <li><strong>Abuse of AI features:</strong> You must not use the AI tutor chat to generate content unrelated to HSC Mathematics, or to attempt to extract sensitive or confidential information.</li>
        </ul>

        <SubHeading>2.3 Data and Content Violations</SubHeading>
        <ul>
          <li><strong>Scraping:</strong> You must not scrape, harvest, systematically download, copy, or cache any content from Neumm — including questions, explanations, or AI responses — without our prior written consent.</li>
          <li><strong>Redistribution:</strong> You must not reproduce, publish, or distribute Neumm content (questions, solutions, AI responses) for commercial purposes or in a manner that competes with Neumm.</li>
          <li><strong>Harmful uploads:</strong> You must not upload images or content that is offensive, unlawful, defamatory, or in violation of any third party&apos;s rights.</li>
        </ul>

        <SubHeading>2.4 Security Violations</SubHeading>
        <ul>
          <li>You must not probe, scan, or test the vulnerability of the Service or any related network or system.</li>
          <li>You must not attempt to gain unauthorised access to any part of the Service, its servers, or any data stored therein.</li>
          <li>You must not introduce viruses, malware, or other harmful code into the Service.</li>
          <li>You must not conduct denial-of-service attacks or any form of attack that disrupts the availability of the Service to others.</li>
        </ul>

        <SubHeading>2.5 General Unlawful or Harmful Conduct</SubHeading>
        <ul>
          <li>You must not use the Service in a way that is unlawful under Australian federal or state law.</li>
          <li>You must not use the Service to harass, threaten, or harm other users.</li>
          <li>You must not impersonate any person or entity.</li>
        </ul>
      </Section>

      <Section id="section-3" title="3. Enforcement">
        <p>Caplix Pty Ltd reserves the right to investigate suspected violations of this AUP. In response to a violation, we may take any of the following actions at our sole discretion:</p>
        <ul>
          <li>Issue a warning to the user.</li>
          <li>Temporarily suspend access to the Service.</li>
          <li>Permanently terminate the user&apos;s account without refund.</li>
          <li>Remove content submitted by the user.</li>
          <li>Report unlawful conduct to the relevant law enforcement or regulatory authorities.</li>
          <li>Seek injunctive relief or other legal remedies.</li>
        </ul>
        <p>We will endeavour to notify you of enforcement actions where it is lawful and appropriate to do so.</p>
        <p>Caplix does not monitor all user activity in real time. However, we reserve the right to review user activity records for the purpose of investigating suspected violations.</p>
      </Section>

      <Section id="section-4" title="4. Contact">
        <p>If you have questions about this AUP, or wish to report a suspected violation, please contact:</p>
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px 20px', border: '1.5px solid #E5E7EB', marginTop: 12 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0D3349' }}>Caplix Pty Ltd</p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Email: <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a>
          </p>
        </div>
      </Section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontWeight: 700, color: '#0D3349', marginBottom: 12 }}>Related Documents</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { href: '/legal/terms',         label: 'Terms and Conditions' },
            { href: '/legal/privacy',       label: 'Privacy Policy' },
            { href: '/legal/children-data', label: "Children's Data Notice" },
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
