# South Loop Runners - Database Setup Guide

## Prerequisites

1. **Cloudflare Account** with Pages/Workers access
2. **Wrangler CLI** installed: `npm install -g wrangler`
3. **D1 Database** already created: `slr-events` (ID: `7ba37c21-1ce2-4801-938d-4beb617b0964`)

## Database Configuration

Your `wrangler.toml` or Cloudflare Pages settings should include:

\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "slr-events"
database_id = "7ba37c21-1ce2-4801-938d-4beb617b0964"
\`\`\`

## Running Migrations

### Local Development

Execute migrations against your local D1 database:

\`\`\`bash
# Run all migrations in order
wrangler d1 execute slr-events --local --file=./migrations/001_create_events_table.sql
wrangler d1 execute slr-events --local --file=./migrations/002_create_pace_interests_table.sql
wrangler d1 execute slr-events --local --file=./migrations/003_create_race_rsvps_table.sql
wrangler d1 execute slr-events --local --file=./migrations/004_create_email_subscribers_table.sql
wrangler d1 execute slr-events --local --file=./migrations/005_seed_weekly_runs.sql
wrangler d1 execute slr-events --local --file=./migrations/006_seed_special_events.sql
wrangler d1 execute slr-events --local --file=./migrations/007_seed_races.sql
\`\`\`

### Production

Execute migrations against your production D1 database:

\`\`\`bash
# Run all migrations in order (remove --local flag)
wrangler d1 execute slr-events --file=./migrations/001_create_events_table.sql
wrangler d1 execute slr-events --file=./migrations/002_create_pace_interests_table.sql
wrangler d1 execute slr-events --file=./migrations/003_create_race_rsvps_table.sql
wrangler d1 execute slr-events --file=./migrations/004_create_email_subscribers_table.sql
wrangler d1 execute slr-events --file=./migrations/005_seed_weekly_runs.sql
wrangler d1 execute slr-events --file=./migrations/006_seed_special_events.sql
wrangler d1 execute slr-events --file=./migrations/007_seed_races.sql
\`\`\`

## Verify Setup

Check that your data was seeded correctly:

\`\`\`bash
# Local
wrangler d1 execute slr-events --local --command="SELECT id, title, type FROM events;"

# Production
wrangler d1 execute slr-events --command="SELECT id, title, type FROM events;"
\`\`\`

Expected output should show:
- 3 weekly runs (Thursday, Saturday, Sunday)
- 1 special event (Waterfall Glen Field Trip)
- 2 races (F³ Lake Half, Miles Per Hour)

## Schema Overview

### Events Table
Stores all events (weekly runs, races, special events) with:
- Basic info: title, type, description
- Timing: date/day_of_week, time
- Location: location, depart_from
- Run details: distance, pace
- Race details: distances, highlights, key_features (JSON)
- Links: facebook_link, strava_link, registration_url
- Metadata: is_recurring, is_featured_homepage, display_order

### Pace Interests Table
Tracks pace group selections for weekly runs with automatic reset logic.

### Race RSVPs Table
Stores RSVPs for races (running, cheering, volunteering).

### Email Subscribers Table
Manages email notification subscriptions.

## Environment Variables

Ensure these are set in Cloudflare Pages settings:

\`\`\`
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_audience_id (optional if using D1 for subscribers)
ADMIN_PASSWORD=your_secure_admin_password
\`\`\`

## Next Steps

1. Run the migrations (local and production)
2. Verify data with SELECT queries
3. Test the API endpoints at `/api/events`
4. Access admin dashboard at `/admin/dashboard`
5. Update homepage and calendar components to fetch from database

## Troubleshooting

**Migration fails**: Ensure wrangler is logged in (`wrangler login`) and you have access to the D1 database.

**Data not showing**: Check that bindings are correct in wrangler.toml and that you're running migrations against the correct environment.

**Permission errors**: Verify your Cloudflare account has D1 access and proper permissions.
