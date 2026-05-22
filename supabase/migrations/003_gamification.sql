-- ══════════════════════════════════════════════════════════════════
-- 003_gamification.sql
-- Run this in the Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- 1. Add course field to student_profiles
ALTER TABLE student_profiles
  ADD COLUMN IF NOT EXISTS course        TEXT,   -- 'standard'|'advanced'|'extension1'|'extension2'
  ADD COLUMN IF NOT EXISTS course_set_at TIMESTAMPTZ;

-- 2. Add gamification points to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS total_points  INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invite_code   TEXT UNIQUE;

-- 3. Stage/Level completion tracking
CREATE TABLE IF NOT EXISTS stage_completions (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id   TEXT         NOT NULL,   -- e.g. 'y11-ext1'
  level_id     TEXT         NOT NULL,   -- e.g. 'y11-ext1-l1'
  stage_id     TEXT,                    -- e.g. 'y11-ext1-l1-s1a'  (null = level completion)
  points_earned INTEGER     DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stage_id)             -- one completion record per stage per user
);

CREATE INDEX IF NOT EXISTS idx_stage_completions_user ON stage_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_stage_completions_level ON stage_completions(user_id, level_id);

-- 4. Friendships (friend invite/accept)
CREATE TABLE IF NOT EXISTS friendships (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id  UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status     TEXT         NOT NULL DEFAULT 'accepted',  -- 'pending' | 'accepted'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_user   ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id);

-- 5. Generate invite codes for existing users (optional - app does this lazily)
-- Each user gets a random 6-char invite code
UPDATE users
SET invite_code = UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8))
WHERE invite_code IS NULL;

-- 6. Row-level security for new tables
ALTER TABLE stage_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships        ENABLE ROW LEVEL SECURITY;

-- stage_completions: users see/write their own rows
DROP POLICY IF EXISTS "stage_completions_own" ON stage_completions;
CREATE POLICY "stage_completions_own" ON stage_completions
  USING      (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- friendships: users see rows where they are user_id OR friend_id
DROP POLICY IF EXISTS "friendships_own" ON friendships;
CREATE POLICY "friendships_own" ON friendships
  USING ((user_id = auth.uid()) OR (friend_id = auth.uid()))
  WITH CHECK (user_id = auth.uid());

-- 7. Allow users to read friend points (needed for leaderboard)
-- We grant SELECT on the points column only via a view
CREATE OR REPLACE VIEW friend_leaderboard AS
SELECT
  u.id,
  u.display_name,
  u.total_points,
  u.streak,
  u.invite_code
FROM users u
WHERE u.id = auth.uid()
   OR EXISTS (
     SELECT 1 FROM friendships f
     WHERE (f.user_id = auth.uid() AND f.friend_id = u.id)
        OR (f.friend_id = auth.uid() AND f.user_id = u.id)
   );

GRANT SELECT ON friend_leaderboard TO authenticated;
