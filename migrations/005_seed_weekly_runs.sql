-- Seed weekly runs with current event data
-- Run this after creating the events table (001_create_events_table.sql)

-- Updated to match actual weekly runs data from upcoming-runs.tsx
-- Thursday: Light Up the Lakefront
INSERT INTO events (id, title, type, day_of_week, time, location, distance, pace, description, facebook_link, strava_link, is_recurring, is_featured_homepage, display_order)
VALUES ('thursday-light-up', 'Light Up the Lakefront', 'weekly-run', 4, '6:15 PM', 'Agora Statues (Michigan Ave & Roosevelt)', '30 minutes', 'Party Pace', 'Thursday evening run along the lakefront. All paces welcome!', 'https://www.facebook.com/groups/665701690539939', 'https://www.strava.com/clubs/943959', 1, 1, 1);

-- Saturday: Anchor Run
INSERT INTO events (id, title, type, day_of_week, time, location, distance, pace, description, facebook_link, strava_link, is_recurring, is_featured_homepage, display_order)
VALUES ('saturday-anchor', 'Anchor Run', 'weekly-run', 6, '9:00 AM', 'Agora Statues (Michigan Ave & Roosevelt)', '6.5 miles', 'Pace Groups', 'Saturday morning long run. Join us for our signature Anchor Run!', 'https://www.facebook.com/groups/665701690539939', 'https://www.strava.com/clubs/943959', 1, 1, 2);

-- Sunday: Sunday Social Run
INSERT INTO events (id, title, type, day_of_week, time, location, distance, pace, description, facebook_link, strava_link, is_recurring, is_featured_homepage, display_order)
VALUES ('sunday-social', 'Sunday Social Run', 'weekly-run', 0, '9:00 AM', 'Agora Statues (Michigan Ave & Roosevelt)', '30 minutes', '11-12 min/mile', '30-minute 11-12/mile run followed by coffee in a South Loop cafe. Perfect way to start your Sunday!', 'https://fb.me/e/6SQ3Vaigo', 'https://www.strava.com/clubs/943959/group_events/3421718402079309428', 1, 1, 3);

-- Updated pace groups to match PACE_GROUPS array in upcoming-runs.tsx (Under 7:00 to 15:00+)
-- Initialize pace interests for Thursday run
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', 'Under 7:00 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '7:00 - 7:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '8:00 - 8:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '9:00 - 9:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '10:00 - 10:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '11:00 - 11:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '12:00 - 12:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '13:00 - 13:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '14:00 - 14:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('thursday-light-up', '15:00+ min/mile', 0);

-- Initialize pace interests for Saturday run
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', 'Under 7:00 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '7:00 - 7:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '8:00 - 8:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '9:00 - 9:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '10:00 - 10:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '11:00 - 11:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '12:00 - 12:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '13:00 - 13:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '14:00 - 14:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('saturday-anchor', '15:00+ min/mile', 0);

-- Initialize pace interests for Sunday run
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', 'Under 7:00 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '7:00 - 7:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '8:00 - 8:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '9:00 - 9:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '10:00 - 10:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '11:00 - 11:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '12:00 - 12:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '13:00 - 13:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '14:00 - 14:59 min/mile', 0);
INSERT INTO pace_interests (event_id, pace_group, count) VALUES ('sunday-social', '15:00+ min/mile', 0);
