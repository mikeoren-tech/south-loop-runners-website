-- Events table for South Loop Runners
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT,
  day_of_week INTEGER,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  depart_from TEXT,
  distance TEXT,
  pace TEXT,
  tagline TEXT,
  description TEXT,
  distances TEXT,
  highlights TEXT,
  key_features TEXT,
  unique_feature TEXT,
  registration_url TEXT,
  registration_deadline TEXT,
  accent_color TEXT,
  facebook_link TEXT,
  strava_link TEXT,
  image_url TEXT,
  is_recurring INTEGER DEFAULT 0,
  is_featured_homepage INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_day_of_week ON events(day_of_week);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured_homepage, display_order);
CREATE INDEX IF NOT EXISTS idx_events_deleted ON events(deleted_at);
