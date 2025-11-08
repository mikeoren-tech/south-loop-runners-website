-- Pace interests for weekly runs
CREATE TABLE IF NOT EXISTS pace_interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  pace_group TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  last_reset TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pace_interests_event ON pace_interests(event_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pace_interests_unique ON pace_interests(event_id, pace_group);
