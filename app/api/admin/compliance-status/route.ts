import { NextResponse }                from 'next/server'
import { createSupabaseServerClient }  from '@/lib/supabase-server'
import { createClient }                from '@supabase/supabase-js'

/**
 * GET /api/admin/compliance-status
 *
 * Returns a compliance status summary for the system.
 * Only accessible to admin users (by role or COMPLIANCE_ADMIN_EMAIL).
 */
export async function GET() {
  try {
    // ── Auth check ────────────────────────────────────────────────────────────
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const adminEmail = process.env.COMPLIANCE_ADMIN_EMAIL ?? 'privacy@neumm.com.au'
    const isAdmin = user.email === adminEmail

    if (!isAdmin) {
      // Also check if user has admin role in users table
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .eq('role', 'admin')
        .single()

      if (!userData) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // ── Fetch compliance metrics ──────────────────────────────────────────────
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const currentTermsVersion   = process.env.CURRENT_TERMS_VERSION   ?? '1.0'
    const currentPrivacyVersion = process.env.CURRENT_PRIVACY_VERSION ?? '1.0'

    // Parallel queries
    const [
      totalUsersResult,
      consentedUsersResult,
      minorUsersResult,
      pendingDeletionResult,
      outdatedTermsResult,
      outdatedPrivacyResult,
      ageGateBlocksResult,
      deletionAuditResult,
      retentionAuditResult,
      legalVersionsResult,
    ] = await Promise.all([
      admin.from('users').select('id', { count: 'exact', head: true }),
      admin.from('users').select('id', { count: 'exact', head: true }).not('terms_accepted_at', 'is', null),
      admin.from('users').select('id', { count: 'exact', head: true }).eq('is_minor', true),
      admin.from('users').select('id', { count: 'exact', head: true }).eq('deletion_requested', true),
      admin.from('users').select('id', { count: 'exact', head: true }).neq('terms_version', currentTermsVersion),
      admin.from('users').select('id', { count: 'exact', head: true }).neq('privacy_version', currentPrivacyVersion),
      admin.from('age_gate_blocks').select('id', { count: 'exact', head: true }),
      admin.from('deletion_audit_log').select('id', { count: 'exact', head: true }),
      admin.from('retention_audit_log')
        .select('job_name, ran_at, records_affected, status')
        .order('ran_at', { ascending: false })
        .limit(10),
      admin.from('legal_versions')
        .select('document_type, version, effective_date, change_summary')
        .order('created_at', { ascending: false }),
    ])

    // DPA outstanding items
    const dpaRegisterOutstanding = [
      { provider: 'Supabase', action: 'Countersign formal DPA document' },
      { provider: 'Stripe',   action: 'Confirm DPA is current version on file' },
      { provider: 'SendGrid', action: 'Countersign DPA for Australian jurisdiction' },
      { provider: 'Vercel',   action: 'Countersign Vercel DPA for GDPR/APP 8 record' },
    ]

    // Pending legal actions
    const pendingLegalActions = []
    if ((outdatedTermsResult.count ?? 0) > 0) {
      pendingLegalActions.push({
        type:        'terms_outdated',
        description: `${outdatedTermsResult.count} user(s) have not accepted the current Terms version (${currentTermsVersion})`,
        severity:    'medium',
      })
    }
    if ((outdatedPrivacyResult.count ?? 0) > 0) {
      pendingLegalActions.push({
        type:        'privacy_outdated',
        description: `${outdatedPrivacyResult.count} user(s) have not accepted the current Privacy Policy version (${currentPrivacyVersion})`,
        severity:    'medium',
      })
    }
    if ((pendingDeletionResult.count ?? 0) > 0) {
      pendingLegalActions.push({
        type:        'deletion_pending',
        description: `${pendingDeletionResult.count} account deletion request(s) pending processing`,
        severity:    'high',
      })
    }

    const status = {
      generated_at:   new Date().toISOString(),
      current_versions: {
        terms:   currentTermsVersion,
        privacy: currentPrivacyVersion,
      },
      user_statistics: {
        total_users:            totalUsersResult.count ?? 0,
        users_with_consent:     consentedUsersResult.count ?? 0,
        minor_users:            minorUsersResult.count ?? 0,
        pending_deletion:       pendingDeletionResult.count ?? 0,
        outdated_terms:         outdatedTermsResult.count ?? 0,
        outdated_privacy:       outdatedPrivacyResult.count ?? 0,
        age_gate_blocks_total:  ageGateBlocksResult.count ?? 0,
        deletions_completed:    deletionAuditResult.count ?? 0,
      },
      legal_documents: legalVersionsResult.data ?? [],
      recent_retention_jobs:  retentionAuditResult.data ?? [],
      dpa_register_outstanding: dpaRegisterOutstanding,
      pending_legal_actions:   pendingLegalActions,
      compliance_links: {
        terms:          '/legal/terms',
        privacy:        '/legal/privacy',
        children_data:  '/legal/children-data',
        acceptable_use: '/legal/acceptable-use',
        cookies:        '/legal/cookies',
        dpa_register:   '/docs/dpa-register.md',
        breach_runbook: '/docs/breach-response-runbook.md',
      },
    }

    return NextResponse.json(status)
  } catch (err) {
    console.error('[compliance-status]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
