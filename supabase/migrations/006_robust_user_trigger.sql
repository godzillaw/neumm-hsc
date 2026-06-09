-- ============================================================
-- 006_robust_user_trigger.sql
-- Make handle_new_user upsert instead of silently skipping
--
-- The previous version used ON CONFLICT DO NOTHING.  If a
-- public.users row existed with the same email (e.g. from a
-- prior auth user), the insert was silently skipped, leaving
-- the new auth user with no public.users row.  That caused
-- random 400/500 errors on every downstream query.
--
-- This version upserts by id (the PK) and also clears any
-- stale row that has the same email but a different id, so
-- the new auth user always has a clean, correctly-linked row.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trial_start TIMESTAMP WITH TIME ZONE := NOW();
  trial_end   TIMESTAMP WITH TIME ZONE := NOW() + INTERVAL '7 days';
BEGIN
  SET LOCAL row_security = off;

  -- Remove any stale row that claims this email but has a different id.
  -- This can exist when an auth user was deleted without CASCADE (before
  -- migration 005).  With 005 in place this should never fire, but it's
  -- a cheap safety net.
  DELETE FROM public.users
  WHERE email = NEW.email AND id <> NEW.id;

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
    trial_start,
    trial_end,
    FALSE,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email        = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url   = EXCLUDED.avatar_url;

  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
