-- Rename published_date column to published_at in vdm_videos table
ALTER TABLE vdm_videos 
RENAME COLUMN published_date TO published_at;

-- Update the index to use the new column name
DROP INDEX IF EXISTS idx_vdm_videos_published_date;
CREATE INDEX IF NOT EXISTS idx_vdm_videos_published_at ON vdm_videos(published_at DESC);

-- Verify the column was renamed
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vdm_videos' 
AND table_schema = 'public';

-- Show sample data with new column name
SELECT id, title, video_id, published_at, caption 
FROM vdm_videos 
ORDER BY published_at DESC 
LIMIT 3;
