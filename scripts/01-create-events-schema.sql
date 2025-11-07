-- Create events table for storing all running events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK(event_type IN ('weekly_run', 'race')),
  start_datetime TEXT NOT NULL, -- ISO 8601 format in Chicago timezone
  end_datetime TEXT, -- Optional end time for events
  location TEXT NOT NULL,
  distance TEXT, -- e.g., "5K", "10K", "Half Marathon"
  pace TEXT, -- e.g., "All paces", "8-10 min/mile"
  meeting_point TEXT,
  registration_url TEXT,
  image_url TEXT,
  is_featured INTEGER DEFAULT 0, -- 1 for featured on homepage, 0 otherwise
  display_order INTEGER DEFAULT 0, -- Order for featured events on homepage
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index for efficient querying by event type and date
CREATE INDEX IF NOT EXISTS idx_events_type_date ON events(event_type, start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured, display_order);

-- Create email subscribers table for notification system
CREATE TABLE IF NOT EXISTS email_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active INTEGER DEFAULT 1,
  subscribed_at TEXT NOT NULL DEFAULT (datetime('now')),
  unsubscribed_at TEXT
);

-- Create event notifications log to track what has been sent
CREATE TABLE IF NOT EXISTS event_notifications (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK(notification_type IN ('created', 'updated', 'deleted', 'reminder')),
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  recipient_count INTEGER DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_event ON event_notifications(event_id);
