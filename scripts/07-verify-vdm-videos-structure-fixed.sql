-- Verify current table structure first
SELECT 'Current table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vdm_videos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Only add columns if they don't exist (safer approach)
DO $$ 
BEGIN
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vdm_videos' AND column_name = 'title') THEN
        ALTER TABLE vdm_videos ADD COLUMN title TEXT;
    END IF;
    
    -- Add url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vdm_videos' AND column_name = 'url') THEN
        ALTER TABLE vdm_videos ADD COLUMN url TEXT;
    END IF;
    
    -- Check if published_at exists, if not check for published_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vdm_videos' AND column_name = 'published_at') THEN
        -- If published_date exists, rename it
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vdm_videos' AND column_name = 'published_date') THEN
            ALTER TABLE vdm_videos RENAME COLUMN published_date TO published_at;
        ELSE
            -- Add published_at if neither exists
            ALTER TABLE vdm_videos ADD COLUMN published_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- Update missing URLs based on video_id
UPDATE vdm_videos 
SET url = 'https://www.youtube.com/watch?v=' || video_id 
WHERE (url IS NULL OR url = '') AND video_id IS NOT NULL AND video_id != '';

-- Update missing titles from captions
UPDATE vdm_videos 
SET title = caption 
WHERE (title IS NULL OR title = '') AND caption IS NOT NULL AND caption != '';

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_vdm_videos_published_at ON vdm_videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_vdm_videos_video_id ON vdm_videos(video_id);

-- Enable Row Level Security
ALTER TABLE vdm_videos ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the policy to ensure it's correct
DROP POLICY IF EXISTS "VDM videos are viewable by everyone" ON vdm_videos;
CREATE POLICY "VDM videos are viewable by everyone" ON vdm_videos
  FOR SELECT USING (true);

-- Final verification
SELECT 'Database setup completed successfully!' as status;
SELECT 
    COUNT(*) as total_videos,
    COUNT(CASE WHEN title IS NOT NULL AND title != '' THEN 1 END) as videos_with_titles,
    COUNT(CASE WHEN url IS NOT NULL AND url != '' THEN 1 END) as videos_with_urls,
    COUNT(CASE WHEN video_id IS NOT NULL AND video_id != '' THEN 1 END) as videos_with_video_ids
FROM vdm_videos;

-- Show sample data
SELECT id, title, video_id, url, published_at 
FROM vdm_videos 
ORDER BY published_at DESC 
LIMIT 3;
