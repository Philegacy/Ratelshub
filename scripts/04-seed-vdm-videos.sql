-- Insert sample VDM videos
INSERT INTO vdm_videos (video_id, caption, published_date) VALUES
  ('dQw4w9WgXcQ', 'VDM exposes fake miracle worker in Lagos - The truth revealed!', '2024-01-15 10:30:00'),
  ('IqTnD8zntKc', 'Breaking: Celebrity caught in major scandal - Full investigation', '2024-01-14 14:20:00'),
  ('9bZkp7q19f0', 'VDM calls out fraudulent business practices - Must watch!', '2024-01-13 16:45:00'),
  ('jNQXAC9IVRw', 'The untold story behind the viral controversy', '2024-01-12 12:15:00'),
  ('L_jWHffIx5E', 'VDM responds to critics with shocking evidence', '2024-01-11 09:30:00');

-- Verify data was inserted
SELECT COUNT(*) as total_videos FROM vdm_videos;
