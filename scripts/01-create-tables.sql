-- Drop existing tables if they exist (optional - remove if you want to keep existing data)
-- DROP TABLE IF EXISTS threads;
-- DROP TABLE IF EXISTS posts;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  video_url TEXT NOT NULL,
  caption TEXT NOT NULL
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Threads are viewable by everyone" ON threads;
DROP POLICY IF EXISTS "Users can insert their own threads" ON threads;
DROP POLICY IF EXISTS "Users can update their own threads" ON threads;
DROP POLICY IF EXISTS "Users can delete their own threads" ON threads;

-- Create policies for posts (read-only for now)
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Create policies for threads
CREATE POLICY "Threads are viewable by everyone" ON threads
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own threads" ON threads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads" ON threads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads" ON threads
  FOR DELETE USING (auth.uid() = user_id);

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
