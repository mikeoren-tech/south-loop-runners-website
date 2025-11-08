-- Race RSVPs
CREATE TABLE IF NOT EXISTS race_rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  rsvp_type TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_race_rsvps_event ON race_rsvps(event_id);
