# Data Breach Response Runbook (NDB Scheme)

**Owner:** Caplix Pty Ltd — Privacy Officer  
**Contact:** privacy@neumm.com.au  
**Last updated:** 1 June 2026  
**Regulatory framework:** Privacy Act 1988 (Cth), Part IIIC — Notifiable Data Breaches Scheme

---

## Overview

Under the Notifiable Data Breaches (NDB) scheme, Caplix Pty Ltd is required to notify affected individuals and the Office of the Australian Information Commissioner (OAIC) as soon as practicable after becoming aware of an eligible data breach.

An **eligible data breach** occurs when:
1. There is unauthorised access to, or disclosure of, personal information held by Caplix, OR personal information is lost in circumstances where unauthorised access or disclosure is likely; AND
2. A reasonable person would conclude the breach is likely to result in **serious harm** to one or more individuals; AND
3. Caplix has been unable to prevent the likely risk of serious harm through remedial action.

---

## Step 1: Detection and Initial Assessment (0–24 hours)

**Trigger:** Any report of suspected unauthorised access, data exposure, or system compromise.

**Actions:**
1. **Isolate the incident.** If a system is actively compromised, engage Vercel/Supabase support to isolate affected services. Do not attempt to continue operating on a known-compromised system.
2. **Document the discovery.** Record the date and time of discovery, the nature of the suspected breach, who reported it, and what systems or data may be affected.
3. **Notify the founding team.** Privacy Officer must be notified immediately.
4. **Preserve evidence.** Do not delete logs, database records, or other evidence. Enable enhanced logging if possible.
5. **Initial scope assessment.** Identify:
   - What personal information may have been accessed or disclosed?
   - How many individuals may be affected?
   - What is the nature of the personal information (e.g., email addresses only vs. full account data including learning history)?
   - Is the breach ongoing or contained?

**Assessment decision:** Does the breach involve personal information that could likely result in serious harm (identity theft, financial loss, discrimination, significant embarrassment)?

---

## Step 2: Containment and Remediation (0–72 hours)

**Actions:**
1. **Contain the breach.** Examples:
   - Reset compromised API keys and access tokens immediately.
   - Revoke all active sessions for affected users via Supabase dashboard (Admin > Auth > Users > Sign out all sessions).
   - Rotate `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` and redeploy.
   - Block compromised IP addresses at the Vercel firewall level.
2. **Fix the vulnerability.** Identify the root cause (e.g., exposed API key in public repository, SQL injection, misconfigured Supabase Row Level Security policy) and deploy a fix.
3. **Verify remediation.** Confirm the breach is fully contained and the vulnerability has been patched before re-enabling affected services.
4. **Change affected user passwords** if there is any indication account credentials were exposed. Force password resets for affected users.

---

## Step 3: Eligible Breach Assessment (0–30 days from awareness)

**Deadline:** Caplix must complete its assessment within **30 days** of becoming aware of a suspected eligible data breach (Privacy Act 1988, s 26WH).

**Assessment checklist:**
- [ ] Has personal information been accessed without authorisation, disclosed to an unauthorised party, or lost?
- [ ] Would a reasonable person conclude that the breach is likely to result in serious harm to at least one individual?
- [ ] Has Caplix been unable to prevent the likely risk of serious harm through remedial action already taken?
- [ ] If all three criteria are met → **eligible data breach** requiring notification.

**Serious harm factors include:**
- Financial fraud or identity theft risk
- Physical harm or threat to safety
- Serious reputational damage
- Discrimination, harassment, or workplace impacts
- Sensitive information (health, financial, sexual orientation) exposed

**Document the assessment outcome** with supporting reasoning, regardless of whether notification is required.

---

## Step 4: Notification (as soon as practicable after eligible breach determination)

### 4a. Notify the OAIC

File an NDB notification at: https://www.oaic.gov.au/privacy/notifiable-data-breaches/report-a-data-breach

The notification must include:
- Caplix Pty Ltd contact details (privacy@neumm.com.au)
- Description of the breach (what happened, how, when discovered)
- Categories and approximate number of individuals affected
- Categories of personal information involved
- Recommended steps individuals should take to protect themselves

### 4b. Notify Affected Individuals

Notify each affected individual whose personal information was involved **directly** (email if available). If direct notification is not reasonably practicable, publish a prominent notice on the Neumm website (neumm.com.au).

Individual notification must include:
- Caplix Pty Ltd identity and contact details
- A description of the data breach
- The kinds of information involved
- What steps Caplix has taken in response
- Recommended steps the individual should take (e.g., change password, monitor accounts)
- How the individual can access further information or assistance (privacy@neumm.com.au)

### Notification timeline
Notifications to both the OAIC and affected individuals must be sent **as soon as practicable** after concluding that an eligible data breach has occurred. There is no defined statutory timeframe for the notification itself, but it must not be unreasonably delayed after the 30-day assessment window.

---

## Step 5: Post-Incident Review (within 2 weeks of resolution)

**Actions:**
1. **Root cause analysis.** Document a full post-mortem: timeline, cause, affected systems, data exposed.
2. **Process improvement.** Identify and implement controls to prevent recurrence (e.g., additional RLS policies, key rotation procedures, security scanning in CI/CD).
3. **Update this runbook** if any steps proved inadequate or unclear during the incident.
4. **Preserve records.** Retain all breach documentation for at least 5 years (recommended best practice under the Privacy Act).
5. **Review DPA register.** If the breach involved a third-party processor, assess whether the DPA and vendor's security controls need to be reviewed or renegotiated.
6. **Consider voluntary notification** to affected users even if the breach is not technically eligible, as best practice for maintaining trust.

---

## Key Contacts

| Role | Contact |
|------|---------|
| Privacy Officer | privacy@neumm.com.au |
| Legal / Compliance | legal@neumm.com.au |
| Support | support@neumm.com.au |
| OAIC (Australian regulator) | https://www.oaic.gov.au / 1300 363 992 |
| Supabase Support | support@supabase.io |
| Vercel Support | https://vercel.com/support |

---

*This document should be tested against a simulated breach scenario annually.*
