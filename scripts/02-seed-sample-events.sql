-- Seed some sample events for testing
INSERT OR IGNORE INTO events (
  id, title, description, event_type, start_datetime, location, 
  distance, pace, meeting_point, is_featured, display_order
) VALUES 
(
  'weekly-run-1',
  'Wednesday Morning Run',
  'Join us for our regular Wednesday morning run along the Lakefront Trail. All paces welcome!',
  'weekly_run',
  datetime('now', '+2 days', 'start of day', '+6 hours'),
  'Lakefront Trail',
  '3-6 miles',
  'All paces',
  'Buckingham Fountain',
  1,
  1
),
(
  'weekly-run-2',
  'Saturday Long Run',
  'Weekend long run with multiple pace groups. Perfect for marathon training!',
  'weekly_run',
  datetime('now', '+5 days', 'start of day', '+7 hours'),
  'Lakefront Trail',
  '8-12 miles',
  'Multiple pace groups',
  'Museum Campus',
  1,
  2
),
(
  'weekly-run-3',
  'Tuesday Evening Track Workout',
  'Speed work session at the track. Bring your running shoes and competitive spirit!',
  'weekly_run',
  datetime('now', '+1 day', 'start of day', '+18 hours'),
  'Gately Park Track',
  '4 miles + intervals',
  'Varied paces',
  'Gately Park Entrance',
  1,
  3
),
(
  'race-1',
  'Chicago Spring Half Marathon',
  'Annual spring half marathon through Chicago''s beautiful neighborhoods.',
  'race',
  datetime('now', '+30 days', 'start of day', '+7 hours'),
  'Grant Park',
  'Half Marathon',
  NULL,
  'Grant Park Start Line',
  1,
  1
),
(
  'race-2',
  'Soldier Field 10 Mile',
  'Run through Soldier Field and along the lakefront.',
  'race',
  datetime('now', '+45 days', 'start of day', '+8 hours'),
  'Soldier Field',
  '10 miles',
  NULL,
  'Soldier Field',
  1,
  2
);

-- Seed a test subscriber
INSERT OR IGNORE INTO email_subscribers (id, email) 
VALUES ('test-subscriber-1', 'test@example.com');
