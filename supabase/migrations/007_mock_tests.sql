-- ══════════════════════════════════════════════════════════════════
-- 007_mock_tests.sql  —  Mock Test feature tables
-- Run in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- Mock test configuration saved by student
CREATE TABLE IF NOT EXISTS mock_tests (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL DEFAULT 'Mock Test',
  mode            TEXT        NOT NULL CHECK (mode IN ('school_test','hsc_trial','hsc')),
  course          TEXT,
  topic_prefixes  TEXT[]      NOT NULL DEFAULT '{}',
  test_date       DATE,
  question_count  INT         NOT NULL DEFAULT 15,
  time_limit_mins INT         NOT NULL DEFAULT 30,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Each attempt / sitting of a mock test
CREATE TABLE IF NOT EXISTS mock_test_attempts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_test_id    UUID        NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_number  INT         NOT NULL DEFAULT 1,
  status          TEXT        NOT NULL DEFAULT 'in_progress'
                              CHECK (status IN ('in_progress','completed','timed_out')),
  started_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  time_taken_secs INT,
  score_pct       NUMERIC(5,2),
  predicted_band  INT,
  readiness       JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Per-question answers within an attempt
CREATE TABLE IF NOT EXISTS mock_test_answers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID        NOT NULL REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
  question_id     UUID        NOT NULL,
  position        INT         NOT NULL,
  topic_prefix    TEXT        NOT NULL,
  difficulty_band INT         NOT NULL DEFAULT 3,
  student_answer  TEXT,
  correct_answer  TEXT        NOT NULL DEFAULT '',
  is_correct      BOOLEAN     NOT NULL DEFAULT false,
  is_skipped      BOOLEAN     NOT NULL DEFAULT false,
  time_secs       INT         DEFAULT 0,
  explanation     TEXT        DEFAULT '',
  question_text   TEXT        DEFAULT '',
  option_a        TEXT        DEFAULT '',
  option_b        TEXT        DEFAULT '',
  option_c        TEXT        DEFAULT '',
  option_d        TEXT        DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS mock_tests_user_id_idx         ON mock_tests(user_id);
CREATE INDEX IF NOT EXISTS mock_test_attempts_test_idx    ON mock_test_attempts(mock_test_id);
CREATE INDEX IF NOT EXISTS mock_test_attempts_user_idx    ON mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS mock_test_answers_attempt_idx  ON mock_test_answers(attempt_id);

-- Row Level Security
ALTER TABLE mock_tests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_answers  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own mock_tests"         ON mock_tests;
DROP POLICY IF EXISTS "Users manage own mock_test_attempts" ON mock_test_attempts;
DROP POLICY IF EXISTS "Users manage own mock_test_answers"  ON mock_test_answers;

CREATE POLICY "Users manage own mock_tests"
  ON mock_tests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own mock_test_attempts"
  ON mock_test_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own mock_test_answers"
  ON mock_test_answers FOR ALL USING (
    auth.uid() = (SELECT user_id FROM mock_test_attempts WHERE id = attempt_id)
  );
