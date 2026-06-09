-- ============================================================
-- 005_cascade_delete_users.sql
-- Add ON DELETE CASCADE from public.users to auth.users
--
-- Previously, deleting a user from auth.users left an orphaned
-- row in public.users. Because public.users.email has a UNIQUE
-- constraint, the orphaned row blocked re-creation of the same
-- email address, causing the signup trigger to fail with
-- "Database error creating new user".
--
-- This migration adds a FK so that deleting from auth.users
-- automatically removes the corresponding public.users row.
-- ============================================================

-- 1. Remove any existing orphaned rows (rows whose auth user no longer exists)
DELETE FROM public.users
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Add the FK constraint with CASCADE
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
