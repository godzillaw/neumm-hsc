-- ══════════════════════════════════════════════════════════════════
-- 009_add_exam_modes.sql
-- Run in Supabase Dashboard → SQL Editor
-- Adds naplan_y9 and prelim_y11 to mock_tests.mode constraint
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE mock_tests
  DROP CONSTRAINT IF EXISTS mock_tests_mode_check;

ALTER TABLE mock_tests
  ADD CONSTRAINT mock_tests_mode_check
  CHECK (mode IN ('school_test','hsc_trial','hsc','naplan_y9','prelim_y11'));
