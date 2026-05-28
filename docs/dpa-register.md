# Data Processing Agreement Register

**Last updated:** 1 June 2026  
**Maintained by:** Caplix Pty Ltd — Privacy Officer (privacy@neumm.com.au)

This register documents all third-party data processors used by Neumm and the data processing agreements (DPAs) or contractual commitments in place with each provider, in compliance with APP 8 of the Australian Privacy Act 1988.

---

## Provider Register

| Provider | Service | Data Shared | Location | DPA/Commitment | Privacy Contact |
|----------|---------|-------------|----------|----------------|-----------------|
| **Supabase Inc.** | Database hosting and authentication | All user account data, learning data, compliance data | Australia (ap-southeast-2 / Sydney) | Supabase DPA accepted at signup. Data residency confirmed as Sydney region. | privacy@supabase.io |
| **Anthropic PBC** | AI tutoring (Claude API) | Question text, working images, tutor chat messages (no PII like name/email sent) | United States | Anthropic Enterprise Privacy Policy. API usage data not used for model training by default. | privacy@anthropic.com |
| **Stripe Inc.** | Payment processing | Email address, payment details (tokenised), billing metadata | United States / European Union | Stripe Data Processing Agreement. PCI DSS Level 1 certified. | dpa@stripe.com |
| **Twilio SendGrid** | Transactional and marketing email delivery | Email address, name | United States | SendGrid DPA (via Twilio). CASL and CAN-SPAM compliant infrastructure. | privacy@twilio.com |
| **Vercel Inc.** | Application hosting and CDN | IP addresses, HTTP request metadata, application logs | United States / Global edge network | Vercel DPA available at vercel.com/legal/dpa. | privacy@vercel.com |
| **Google LLC** | OAuth authentication, Google Analytics | Email and name (OAuth); anonymised usage events (Analytics, with consent only) | United States / Global | Google API Services User Data Policy. Analytics data is anonymised before storage. | https://support.google.com/policies |

---

## Outstanding DPA Actions

- [ ] **Supabase:** Obtain and countersign formal DPA document (current reliance on ToS DPA acceptance).
- [ ] **Anthropic:** Obtain Enterprise Agreement with explicit data processing terms if usage exceeds standard API terms.
- [ ] **Stripe:** Confirm DPA is current and signed version is on file.
- [ ] **SendGrid/Twilio:** Confirm DPA is countersigned for Australian jurisdiction.
- [ ] **Vercel:** Countersign Vercel DPA for GDPR/APP 8 compliance record.

---

## Cross-Border Transfer Safeguards (APP 8)

Where personal information is transferred to countries that may not have equivalent privacy protections to Australia, we rely on the following safeguards:

1. **Contractual protections:** Data processing agreements with each provider contain privacy obligations.
2. **Data minimisation:** We transmit only the minimum data necessary for each provider's function.
3. **Anthropic (US):** Question content and working images only — no name or email transmitted.
4. **Stripe (US/EU):** PCI DSS Level 1 certification provides an internationally recognised security standard.
5. **Google Analytics:** Analytics events are anonymised and aggregated before export. IP anonymisation is enabled.

---

## Review Schedule

This register should be reviewed:
- Annually (next review: 1 June 2027)
- When a new data processor is onboarded
- When a significant change is made to an existing processor's function
- Following any data breach involving a processor

---

*This document is for internal compliance use. For external privacy enquiries, contact privacy@neumm.com.au.*
