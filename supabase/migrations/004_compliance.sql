-- Compliance columns on users table (document says 'profiles' but this app uses 'users')
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_year INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_minor BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_version TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_version TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_ip TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS minor_guardian_confirmed BOOLEAN;
ALTER TABLE users ADD COLUMN IF NOT EXISTS leaderboard_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_disclosure_dismissed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_emails_opted_out BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_requested BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS age_gate_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS deletion_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  records_deleted INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS email_suppression_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT DEFAULT 'marketing_opt_out'
);

CREATE TABLE IF NOT EXISTS retention_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  ran_at TIMESTAMPTZ DEFAULT NOW(),
  records_affected INTEGER,
  status TEXT DEFAULT 'success',
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS legal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date DATE NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO legal_versions (document_type, version, effective_date, change_summary)
VALUES
  ('terms', '1.0', '2026-06-01', 'Initial version'),
  ('privacy', '1.0', '2026-06-01', 'Initial version')
ON CONFLICT DO NOTHING;
