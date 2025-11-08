-- Add post-run social tracking to events table
ALTER TABLE events ADD COLUMN has_post_run_social INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN post_run_social_count INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN social_last_reset TEXT;
