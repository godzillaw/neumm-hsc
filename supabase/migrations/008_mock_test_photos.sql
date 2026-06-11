-- ══════════════════════════════════════════════════════════════════
-- 008_mock_test_photos.sql
-- Run in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- Photos uploaded after a mock test (student's handwritten working)
CREATE TABLE IF NOT EXISTS mock_test_photos (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID        NOT NULL REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url       TEXT        NOT NULL,
  storage_path    TEXT        NOT NULL,
  question_refs   INT[]       NOT NULL DEFAULT '{}',  -- question positions (1-based)
  caption         TEXT        DEFAULT '',
  uploaded_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mock_test_photos_attempt_idx ON mock_test_photos(attempt_id);

ALTER TABLE mock_test_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own mock_test_photos" ON mock_test_photos;
CREATE POLICY "Users manage own mock_test_photos"
  ON mock_test_photos FOR ALL USING (auth.uid() = user_id);

-- Storage bucket for mock test working photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mock-test-photos',
  'mock-test-photos',
  false,
  10485760,  -- 10 MB limit per file
  ARRAY['image/jpeg','image/jpg','image/png','image/heic','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can only access their own folder
DROP POLICY IF EXISTS "Users upload own photos"  ON storage.objects;
DROP POLICY IF EXISTS "Users read own photos"    ON storage.objects;
DROP POLICY IF EXISTS "Users delete own photos"  ON storage.objects;

CREATE POLICY "Users upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'mock-test-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'mock-test-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'mock-test-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
