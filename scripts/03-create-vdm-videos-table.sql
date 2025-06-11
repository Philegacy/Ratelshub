-- Create vdm_videos table
CREATE TABLE IF NOT EXISTS vdm_videos (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  video_id TEXT NOT NULL UNIQUE,
  caption TEXT NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vdm_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "VDM videos are viewable by everyone" ON vdm_videos;

-- Create policy for vdm_videos (read-only for now)
CREATE POLICY "VDM videos are viewable by everyone" ON vdm_videos
  FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vdm_videos_published_date ON vdm_videos(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_vdm_videos_video_id ON vdm_videos(video_id);

-- Verify table was created
SELECT 'VDM Videos table created successfully!' as status;
