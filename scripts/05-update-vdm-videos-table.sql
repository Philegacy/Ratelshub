-- Update vdm_videos table to include title and url columns if they don't exist
ALTER TABLE vdm_videos 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS url TEXT;

-- Update existing records to have URLs based on video_id
UPDATE vdm_videos 
SET url = 'https://www.youtube.com/watch?v=' || video_id 
WHERE url IS NULL AND video_id IS NOT NULL;

-- Update titles to match captions if title is empty
UPDATE vdm_videos 
SET title = caption 
WHERE title IS NULL OR title = '';

-- Verify the updates
SELECT id, title, video_id, url, caption, published_date FROM vdm_videos LIMIT 5;
