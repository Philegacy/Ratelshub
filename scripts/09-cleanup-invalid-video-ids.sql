-- Clean up invalid video IDs from the database
-- This will help prevent thumbnail loading issues

-- First, let's see what we have
SELECT 
  id, 
  video_id, 
  title,
  CASE 
    WHEN video_id IS NULL THEN 'NULL'
    WHEN video_id = '' THEN 'EMPTY'
    WHEN LENGTH(video_id) < 10 THEN 'TOO_SHORT'
    WHEN video_id ~ '^[a-zA-Z0-9_-]+$' THEN 'VALID'
    ELSE 'INVALID_CHARS'
  END as status
FROM vdm_videos
ORDER BY id;

-- Delete videos with invalid video_ids
DELETE FROM vdm_videos 
WHERE 
  video_id IS NULL 
  OR video_id = '' 
  OR LENGTH(video_id) < 10 
  OR NOT (video_id ~ '^[a-zA-Z0-9_-]+$');

-- Update any remaining videos with placeholder IDs to have proper ones
-- (This is for any test data that might have fake IDs)
UPDATE vdm_videos 
SET video_id = 'dQw4w9WgXcQ' -- Rick Roll as safe fallback
WHERE video_id IN ('abc123DEF4', 'xyz789GHI5', 'mnol456JKL', 'test123', 'sample456');

-- Show final clean results
SELECT 
  COUNT(*) as total_videos,
  COUNT(CASE WHEN video_id IS NOT NULL AND video_id != '' THEN 1 END) as valid_video_ids
FROM vdm_videos;

-- Show all remaining videos
SELECT id, video_id, title, published_at 
FROM vdm_videos 
ORDER BY published_at DESC;
