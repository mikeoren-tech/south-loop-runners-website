-- Add event_preferences column to email_subscribers table
-- This allows subscribers to choose which types of events they want to be notified about
-- Default is NULL which means all event types (backward compatible)

ALTER TABLE email_subscribers ADD COLUMN event_preferences TEXT;

-- event_preferences format: JSON string with array of event types
-- Example: '["weekly_run"]' or '["race"]' or '["weekly_run","race"]'
-- NULL means receive all notifications (default for existing subscribers)
