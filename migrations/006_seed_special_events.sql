-- Seed special event: Field Trip to Waterfall Glen
-- Changed FALSE to 0 for SQLite boolean compatibility
INSERT INTO events (
  id, 
  title, 
  type, 
  date, 
  time, 
  location, 
  depart_from,
  distance, 
  pace,
  description, 
  facebook_link, 
  strava_link, 
  is_recurring, 
  is_featured_homepage,
  display_order
)
VALUES (
  'waterfall-glen-field-trip',
  'Field Trip: Waterfall Glen Forest Preserve',
  'special-event',
  '2025-11-15',
  '8:00 AM',
  'Waterfall Glen Forest Preserve',
  'South Loop',
  '9.5 miles',
  'Varied Pace',
  'Join us for an exciting field trip to Waterfall Glen Forest Preserve! We''ll depart from South Loop at 8:00 AM sharp for this scenic 9.5-mile trail run through one of the Chicago area''s most beautiful forest preserves. This is a perfect opportunity to escape the city and experience trail running on well-maintained paths surrounded by nature. All paces welcome - we''ll have multiple groups to accommodate different speeds. Transportation will be coordinated via carpool.',
  'https://www.facebook.com/groups/southlooprunners',
  'https://www.strava.com/clubs/southlooprunners',
  0,
  0,
  99
);
