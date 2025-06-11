-- Add real VeryDarkMan videos to the database
-- Run this script in your Supabase SQL Editor

INSERT INTO vdm_videos (video_id, title, url, caption, published_at) VALUES
  (
    'Lo3ospcBOY0',
    'How Everything Happened In Police Station As Tonto Dikeh & Iyabo Petitioned Me',
    'https://www.youtube.com/watch?v=Lo3ospcBOY0',
    'VDM explains what really happened at the station during the petition saga.',
    '2024-12-15 14:30:00+00'
  ),
  (
    '1vQnXGhxfFs',
    'VeryDarkMan Blasts Tinubu''s Government Over Hunger and Insecurity',
    'https://www.youtube.com/watch?v=1vQnXGhxfFs',
    'A raw critique on the current Nigerian administration and economic hardship.',
    '2024-12-14 16:45:00+00'
  ),
  (
    'f6QqxJQwKSo',
    'NDLEA Arresting People Without Evidence - VDM Reacts',
    'https://www.youtube.com/watch?v=f6QqxJQwKSo',
    'VDM breaks down the injustice in a recent drug arrest.',
    '2024-12-13 12:20:00+00'
  ),
  (
    'KbXgyNViWjY',
    'VDM Reacts To Iyabo Ojo and Instagram Influencers',
    'https://www.youtube.com/watch?v=KbXgyNViWjY',
    'The fight between VDM and some Nollywood celebrities continues.',
    '2024-12-12 18:15:00+00'
  ),
  (
    'eqNFkY1ax9A',
    'VDM Court Update - "I No Go Stop!"',
    'https://www.youtube.com/watch?v=eqNFkY1ax9A',
    'Court didn''t slow him down — he vows to keep exposing corruption.',
    '2024-12-11 10:00:00+00'
  ),
  (
    'JkEHOjAhn1U',
    'Why RATELS Movement Matters More Than Ever',
    'https://www.youtube.com/watch?v=JkEHOjAhn1U',
    'VDM calls on Nigerians to join the RATELS revolution.',
    '2024-12-10 20:30:00+00'
  )
ON CONFLICT (video_id) DO UPDATE SET
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  caption = EXCLUDED.caption,
  published_at = EXCLUDED.published_at;

-- Verify the videos were added
SELECT 
  id, 
  title, 
  video_id, 
  published_at,
  caption
FROM vdm_videos 
WHERE video_id IN ('Lo3ospcBOY0', '1vQnXGhxfFs', 'f6QqxJQwKSo', 'KbXgyNViWjY', 'eqNFkY1ax9A', 'JkEHOjAhn1U')
ORDER BY published_at DESC;

-- Show total count
SELECT COUNT(*) as total_vdm_videos FROM vdm_videos;
