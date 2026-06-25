import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms and Conditions — Neumm',
  description: 'Terms and Conditions for Neumm HSC Mathematics, operated by Caplix Pty Ltd.',
}

const VERSION = '1.0'
const LAST_UPDATED = '1 June 2026'

export default function TermsPage() {
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
        <span>Terms and Conditions — Version {VERSION}</span>
        <span style={{ opacity: 0.8 }}>Last updated: {LAST_UPDATED}</span>
      </div>

      <h1 style={{ color: '#006D77', fontSize: 30, fontWeight: 900, marginBottom: 8, marginTop: 0 }}>
        Terms and Conditions
      </h1>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
        These Terms and Conditions govern your use of Neumm. By creating an account or using Neumm, you agree to these terms.
      </p>

      <Section id="section-1" title="1. Introduction">
        <p>Neumm is an adaptive learning platform for HSC Mathematics operated by <strong>Caplix Pty Ltd</strong> (ABN 55 628 774 701), a company incorporated in Australia (&ldquo;Caplix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).</p>
        <p>By accessing or using the Neumm platform at neumm.com.au or any related mobile or web application (&ldquo;the Service&rdquo;), you agree to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service.</p>
        <p>These Terms constitute a legally binding agreement between you and Caplix Pty Ltd. References to &ldquo;Neumm&rdquo; refer to the Service and the brand operated by Caplix Pty Ltd.</p>
      </Section>

      <Section id="section-2" title="2. Eligibility">
        <p><strong>2.1</strong> You must be at least 13 years old to use Neumm. If you are under 13, you are not permitted to create an account or use the Service. We do not offer a parental consent pathway for users under 13.</p>
        <p><strong>2.2</strong> If you are between 13 and 17 years old (inclusive), you are a &ldquo;Minor&rdquo; for the purposes of these Terms. By creating an account, you confirm that a parent or guardian has reviewed these Terms and the <Link href="/legal/privacy" style={{ color: '#185FA5' }}>Privacy Policy</Link> and agreed on your behalf.</p>
        <p><strong>2.3</strong> If you are a parent or guardian agreeing on behalf of a Minor, you accept full responsibility for the Minor&apos;s compliance with these Terms.</p>
        <p><strong>2.4</strong> By creating an account, you represent and warrant that: (a) you are at least 13 years old; (b) all information you provide is accurate and complete; and (c) your use of the Service will not violate any applicable law or regulation.</p>
        <p>See our <Link href="/legal/children-data" style={{ color: '#185FA5' }}>Children&apos;s Data Notice</Link> for more information about how we handle data for users under 18.</p>
      </Section>

      <Section id="section-3" title="3. Subscription and Payment">
        <SubHeading>3.1 Plans</SubHeading>
        <p>Neumm offers the following subscription plans:</p>
        <ul>
          <li><strong>Free:</strong> 5 questions per day with limited features.</li>
          <li><strong>Basic (paid):</strong> 30 questions per day with AI hints, concept explainer, AI tutor chat, and AI step-by-step marking.</li>
          <li><strong>Pro (paid):</strong> Unlimited questions with full AI tutor features and priority support.</li>
        </ul>
        <p>Pricing is displayed in Australian Dollars (AUD) and includes GST where applicable. Current prices are shown at the time of purchase.</p>

        <SubHeading>3.2 Free Trial</SubHeading>
        <p>New users may receive a free trial period as offered at the time of signup. During the trial, you have access to features as specified in the trial offer. At the end of the trial period, your account converts to the free tier unless you subscribe to a paid plan. No credit card is required to start a free trial.</p>

        <SubHeading>3.3 Billing</SubHeading>
        <p>Paid subscriptions are billed on a monthly recurring basis. By subscribing, you authorise Caplix to charge your payment method on a recurring monthly basis until you cancel. All payments are processed securely by Stripe. Caplix does not store your full credit card details.</p>
        <p>Your subscription renews automatically at the end of each billing period unless cancelled before the renewal date.</p>

        <SubHeading>3.4 Cancellation</SubHeading>
        <p>You may cancel your subscription at any time through your account settings or by contacting <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a>. Cancellation takes effect at the end of your current billing period, and you retain access to paid features until that date. You will not be charged for subsequent billing periods.</p>

        <SubHeading>3.5 Price Changes</SubHeading>
        <p>We may change subscription prices from time to time. We will provide at least 30 days&apos; notice of any price change by email and/or in-app notification. If you do not cancel before the price change takes effect, you agree to the new price. If you do not agree to a price change, you may cancel your subscription before it takes effect without penalty.</p>

        <SubHeading id="section-3-6">3.6 No Refund Policy</SubHeading>
        <p><strong>All subscription fees are non-refundable.</strong> Neumm does not offer refunds or credits for any reason, including change of mind, partial use of a billing period, forgetting to cancel, or dissatisfaction with the Service.</p>
        <p>No partial refunds are provided for the unused portion of a billing cycle following cancellation. Your access continues until the end of the current paid period, after which no further charges are made.</p>
        <p>However, nothing in these Terms limits or excludes any rights you may have under the Australian Consumer Law (ACL), including your right to a remedy if the Service is not provided with due care and skill or is not fit for the described purpose. If you believe the Service has failed to meet ACL statutory guarantees, contact <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a>. We will assess your claim and provide a remedy in accordance with our obligations under the ACL. Where the ACL permits us to limit our liability for breach of a statutory guarantee in relation to services, we limit our liability to re-supplying the service or paying the cost of having the service re-supplied.</p>
      </Section>

      <Section id="section-4" title="4. Acceptable Use">
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms and our <Link href="/legal/acceptable-use" style={{ color: '#185FA5' }}>Acceptable Use Policy</Link>.</p>
        <p>You agree not to:</p>
        <ul>
          <li>Share your account credentials with any other person or allow others to access your account.</li>
          <li>Use the Service in any way that violates applicable Australian or international laws.</li>
          <li>Attempt to probe, scan, or test the vulnerability of any part of the Service.</li>
          <li>Circumvent, disable, or otherwise interfere with security-related features of the Service.</li>
          <li>Scrape, copy, or systematically download content from the Service without our written permission.</li>
          <li>Use the Service to transmit any unsolicited or unauthorised advertising or promotional material.</li>
          <li>Attempt to reverse-engineer, decompile, or extract the source code of any part of the Service.</li>
          <li>Attempt to extract, replicate, or reveal AI system prompts used within the Service.</li>
        </ul>
        <p>Breach of these obligations may result in suspension or termination of your account in accordance with Section 10.</p>
      </Section>

      <Section id="section-5" title="5. Intellectual Property">
        <p><strong>5.1</strong> All content on Neumm — including but not limited to questions, explanations, hints, software, design, text, graphics, and AI-generated content — is owned by or licensed to Caplix Pty Ltd and is protected by Australian and international intellectual property laws.</p>
        <p><strong>5.2</strong> You are granted a limited, non-exclusive, non-transferable, revocable licence to use the Service for your personal, non-commercial educational purposes only.</p>
        <p><strong>5.3</strong> You must not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any material from Neumm, except as permitted by these Terms or with our prior written consent.</p>
        <p><strong>5.4</strong> Any feedback, suggestions, or ideas you provide regarding the Service may be used by Caplix without restriction and without compensation to you.</p>
      </Section>

      <Section id="section-6" title="6. AI-Generated Content">
        <p><strong>6.1</strong> Neumm uses artificial intelligence to generate hints, step-by-step explanations, tutor responses, and other educational content. While we strive for accuracy, AI-generated content may occasionally contain errors, inaccuracies, or outdated information.</p>
        <p><strong>6.2</strong> AI-generated content is provided for educational support purposes only. It should not be treated as a definitive or authoritative source. You should always verify important information against official NESA (NSW Education Standards Authority) resources and consult your school teacher for confirmation.</p>
        <p><strong>6.3</strong> Caplix does not warrant the accuracy, completeness, or fitness for purpose of any AI-generated content. Your use of AI-generated content is at your own risk.</p>
        <p>See also Section 10 of our <Link href="/legal/privacy#section-10" style={{ color: '#185FA5' }}>Privacy Policy</Link> for more about automated decision-making.</p>
      </Section>

      <Section id="section-7" title="7. Student Data and Privacy">
        <p>We take the privacy of student data seriously. Our collection, use, storage, and disclosure of your personal information is governed by our <Link href="/legal/privacy" style={{ color: '#185FA5' }}>Privacy Policy</Link>, which forms part of these Terms.</p>
        <p>By using the Service, you consent to the collection and use of your data as described in the Privacy Policy, including the use of your learning data to personalise your experience and improve the Service.</p>
        <p>For users under 18, special protections apply as described in the <Link href="/legal/children-data" style={{ color: '#185FA5' }}>Children&apos;s Data Notice</Link>.</p>
      </Section>

      <Section id="section-8" title="8. Limitation of Liability">
        <p><strong>8.1</strong> To the maximum extent permitted by law, Caplix Pty Ltd and its officers, directors, employees, agents, and suppliers are not liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use of the Service.</p>
        <p><strong>8.2</strong> Our total liability to you for any claims arising under these Terms shall not exceed the total fees paid by you to Caplix in the 12 months preceding the claim.</p>
        <p><strong>8.3</strong> <strong>Australian Consumer Law Carve-Out:</strong> Nothing in these Terms excludes, restricts, or modifies any right or remedy, or any guarantee, warranty, or other term or condition implied or imposed by the Australian Consumer Law that cannot be excluded or limited by law. If you are a &ldquo;consumer&rdquo; as defined by the Australian Consumer Law, your statutory rights and guarantees are preserved. See Section 3.6 for our ACL-compliant refund policy.</p>
      </Section>

      <Section id="section-9" title="9. Dispute Resolution">
        <p><strong>9.1</strong> These Terms are governed by the laws of New South Wales, Australia. You submit to the non-exclusive jurisdiction of the courts of New South Wales.</p>
        <p><strong>9.2</strong> Before commencing any legal proceedings, you agree to contact Caplix at <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a> and attempt to resolve the dispute in good faith within 30 days.</p>
        <p><strong>9.3</strong> If the dispute is not resolved within 30 days, either party may refer the dispute to mediation administered by the Australian Disputes Centre (or equivalent body) before commencing court proceedings, unless urgent injunctive relief is required.</p>
      </Section>

      <Section id="section-10" title="10. Termination">
        <p><strong>10.1</strong> You may terminate your account at any time by contacting us at <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a> or through account settings. Upon termination, your right to use the Service ceases immediately.</p>
        <p><strong>10.2</strong> Caplix may suspend or terminate your account immediately, without prior notice or liability, if you breach any provision of these Terms or our <Link href="/legal/acceptable-use" style={{ color: '#185FA5' }}>Acceptable Use Policy</Link>.</p>
        <p><strong>10.3</strong> Upon termination, your data will be handled in accordance with our <Link href="/legal/privacy" style={{ color: '#185FA5' }}>Privacy Policy</Link> and applicable data retention obligations.</p>
        <p><strong>10.4</strong> Sections 5 (Intellectual Property), 8 (Limitation of Liability), 9 (Dispute Resolution), and 13 (Contact) survive termination of these Terms.</p>
      </Section>

      <Section id="section-11" title="11. Changes to Terms">
        <p><strong>11.1</strong> We may update these Terms from time to time. When we make material changes, we will update the version number and effective date shown at the top of this page, and notify you by email and/or in-app notification at least 14 days before the changes take effect.</p>
        <p><strong>11.2</strong> Material changes to these Terms require your re-acceptance. You will be prompted to review and accept the updated Terms when you next log in after a material change. If you do not accept the updated Terms, you may cancel your subscription and cease using the Service.</p>
        <p><strong>11.3</strong> Continued use of the Service after the effective date of updated Terms (where you have been given the opportunity to accept or decline) constitutes acceptance of the new Terms.</p>
        <p><strong>11.4</strong> The current version of these Terms is always available at <Link href="/legal/terms" style={{ color: '#185FA5' }}>neumm.com.au/legal/terms</Link>.</p>
      </Section>

      <Section id="section-12" title="12. Children and Minors">
        <p><strong>12.1</strong> Neumm is not available to users under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected information from a child under 13, we will take steps to delete that information as soon as practicable.</p>
        <p><strong>12.2</strong> Users aged 13–17 (&ldquo;Minors&rdquo;) may use Neumm with the agreement of a parent or guardian. By accepting these Terms on behalf of a Minor, the parent or guardian agrees to supervise the Minor&apos;s use of the Service and takes responsibility for compliance with these Terms.</p>
        <p><strong>12.3</strong> We collect only minimal data from Minors — specifically birth year (not full date of birth) to verify age eligibility. We do not use Minor data for marketing purposes.</p>
        <p>Please see our <Link href="/legal/children-data" style={{ color: '#185FA5' }}>Children&apos;s Data Notice</Link> for full details.</p>
      </Section>

      <Section id="section-13" title="13. Contact">
        <p>For questions about these Terms, please contact:</p>
        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px 20px', border: '1.5px solid #E5E7EB', marginTop: 12 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0D3349' }}>Caplix Pty Ltd</p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>Operating as: Neumm</p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Email: <a href="mailto:support@neumm.com.au" style={{ color: '#185FA5' }}>support@neumm.com.au</a>
          </p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Privacy enquiries: <a href="mailto:privacy@neumm.com.au" style={{ color: '#185FA5' }}>privacy@neumm.com.au</a>
          </p>
          <p style={{ margin: '0 0 4px', color: '#374151' }}>
            Legal matters: <a href="mailto:legal@neumm.com.au" style={{ color: '#185FA5' }}>legal@neumm.com.au</a>
          </p>
        </div>
      </Section>

      {/* Other legal links */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontWeight: 700, color: '#0D3349', marginBottom: 12 }}>Related Documents</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { href: '/legal/privacy',        label: 'Privacy Policy' },
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

      {/* Back to top */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <a href="#" style={{ color: '#006D77', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          ↑ Back to top
        </a>
      </div>
    </div>
  )
}

// ── Shared layout helpers ──────────────────────────────────────────────────────

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

function SubHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} style={{ color: '#0D3349', fontSize: 15, fontWeight: 900, marginBottom: 6, marginTop: 16 }}>
      {children}
    </h3>
  )
}
