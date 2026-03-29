-- ============================================================
-- 001_initial.sql
-- Initial schema for neumm-hsc
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. USERS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                  TEXT NOT NULL UNIQUE,
  display_name           TEXT,
  avatar_url             TEXT,
  tier                   TEXT NOT NULL DEFAULT 'basic_trial',
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  trial_start_date       TIMESTAMP WITH TIME ZONE,
  trial_end_date         TIMESTAMP WITH TIME ZONE,
  card_on_file           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users: insert own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users: update own" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users: delete own" ON public.users
  FOR DELETE USING (auth.uid() = id);

-- ──────────────────────────────────────────────────────────
-- 2. STUDENT PROFILES
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_profiles (
  user_id                   UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  year_group                TEXT,
  intent                    TEXT,
  course                    TEXT,
  placement_probe_completed BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_profiles: select own" ON public.student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "student_profiles: insert own" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "student_profiles: update own" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "student_profiles: delete own" ON public.student_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────
-- 3. MASTERY MAP
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mastery_map (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  outcome_id        TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'untested',
  confidence_pct    INTEGER NOT NULL DEFAULT 0,
  last_tested_at    TIMESTAMP WITH TIME ZONE,
  next_review_at    TIMESTAMP WITH TIME ZONE,
  difficulty_band   INTEGER NOT NULL DEFAULT 3,
  predicted_hsc_band FLOAT,
  UNIQUE (user_id, outcome_id)
);

ALTER TABLE public.mastery_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mastery_map: select own" ON public.mastery_map
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "mastery_map: insert own" ON public.mastery_map
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mastery_map: update own" ON public.mastery_map
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mastery_map: delete own" ON public.mastery_map
  FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────
-- 4. SESSIONS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  outcome_id          TEXT,
  start_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time            TIMESTAMP WITH TIME ZONE,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  accuracy_pct        FLOAT
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions: select own" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions: insert own" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions: update own" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions: delete own" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────
-- 5. ERROR LOG
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.error_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_id         UUID,
  outcome_id          TEXT,
  error_type          TEXT,
  hint_used           BOOLEAN NOT NULL DEFAULT FALSE,
  time_to_respond_ms  INTEGER,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.error_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "error_log: select own" ON public.error_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "error_log: insert own" ON public.error_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "error_log: update own" ON public.error_log
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "error_log: delete own" ON public.error_log
  FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────
-- 6. QUESTIONS
-- (Content table — no user_id FK, no per-user RLS needed;
--  all authenticated users may read, only service role writes)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.questions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outcome_id        TEXT,
  course            TEXT,
  difficulty_band   INTEGER,
  format            TEXT,
  content_json      JSONB,
  correct_answer    TEXT,
  explanation       TEXT,
  step_by_step      JSONB,
  nesa_outcome_code TEXT,
  served_to         UUID[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Any authenticated user may read questions
CREATE POLICY "questions: select authenticated" ON public.questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role can insert / update / delete (no anon policy = denied)

-- ──────────────────────────────────────────────────────────
-- 7. STREAKS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id          UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  current_streak   INTEGER NOT NULL DEFAULT 0,
  longest_streak   INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  freeze_available BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "streaks: select own" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "streaks: insert own" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "streaks: update own" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "streaks: delete own" ON public.streaks
  FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────
-- 8. INDEXES (performance)
-- ──────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mastery_map_user_id   ON public.mastery_map(user_id);
CREATE INDEX IF NOT EXISTS idx_mastery_map_outcome_id ON public.mastery_map(outcome_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id       ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_error_log_user_id      ON public.error_log(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_outcome_id   ON public.questions(outcome_id);
CREATE INDEX IF NOT EXISTS idx_questions_course       ON public.questions(course);
