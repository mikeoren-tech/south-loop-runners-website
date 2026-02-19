-- Add max_rsvp_limit column to events table
-- NULL means no limit, a number enforces that cap
ALTER TABLE events ADD COLUMN max_rsvp_limit INTEGER DEFAULT NULL;
