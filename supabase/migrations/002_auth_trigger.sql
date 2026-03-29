-- ============================================================
-- 002_auth_trigger.sql
-- Auto-create user profile row when a new auth user is created
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
  ON CONFLICT (id) DO NOTHING;

  -- Also create a streaks row
  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop if exists so this is idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
