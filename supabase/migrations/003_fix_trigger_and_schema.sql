-- ============================================================
-- 003_fix_trigger_and_schema.sql
-- 1. Fix handle_new_user trigger to gracefully handle all
--    unique conflicts (email AND id) and explicitly bypass RLS.
-- 2. Add display_name column to student_profiles so the
--    dashboard query (.select('course, year_group, display_name'))
--    doesn't throw a PostgREST error.
-- ============================================================

-- ── 1. Fix the auth trigger ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Explicitly bypass RLS so the insert always succeeds regardless of
  -- auth.uid() context (which is NULL during the trigger execution).
  SET LOCAL row_security = off;

  INSERT INTO public.users (
    id,
    email,
    display_name,
    avatar_url,
    tier,
    trial_start_date,
    trial_end_date,
    card_on_file,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'basic_trial',
    NOW(),
    NOW() + INTERVAL '7 days',
    FALSE,
    NOW()
  )
  -- Use DO NOTHING without specifying a constraint so that BOTH the id primary
  -- key AND the email unique constraint are handled gracefully.
  ON CONFLICT DO NOTHING;

  -- Create a streaks row (idempotent)
  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Re-create the trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 2. Add display_name to student_profiles ───────────────────────────────────
-- The dashboard query does:
--   .from('student_profiles').select('course, year_group, display_name')
-- Without this column PostgREST returns a 400 error on every dashboard load.
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT;

-- ── 3. Clean up orphaned public.users rows ────────────────────────────────────
-- If a user was deleted from auth.users directly (e.g. via the Supabase
-- dashboard) without a cascade, their public.users row stays behind and blocks
-- future sign-ups with the same email.  This statement safely removes them.
DELETE FROM public.users
WHERE id NOT IN (
  SELECT id FROM auth.users
);
