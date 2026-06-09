-- ============================================================
-- 005_cascade_delete_users.sql
-- Add ON DELETE CASCADE from public.users to auth.users
-- ============================================================

-- 1. Remove orphaned rows (auth user deleted but public row remains)
DELETE FROM public.users
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Drop constraint if it already exists, then re-add with CASCADE
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_id_fkey;

ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
