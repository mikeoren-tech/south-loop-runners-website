-- Add collect_rsvp_names toggle to events table
ALTER TABLE events ADD COLUMN collect_rsvp_names INTEGER DEFAULT 0;

-- Create run_rsvps table for name-based RSVPs on weekly runs
CREATE TABLE IF NOT EXISTS run_rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  pace TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_rsvps_event_id ON run_rsvps(event_id);
