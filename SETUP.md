# South Loop Runners Event Management System - Setup Guide

A comprehensive event management system for the South Loop Runners club, featuring calendar management, automated email notifications, and dynamic event displays.

## Features

### 1. Event Management
- Full CRUD operations for weekly runs and races
- Admin interface at `/admin/events`
- Support for featured events on homepage
- Event metadata: title, description, location, distance, pace, registration URLs, images
- Chicago timezone handling for all event dates/times

### 2. Database (Cloudflare D1)
- **Events table**: Stores all running events with detailed information
- **Email subscribers table**: Manages notification recipients
- **Event notifications log**: Tracks sent notifications
- Automatic schema creation via SQL scripts in `/scripts`

### 3. Automated Email Notifications
- Sends emails via Resend API when events are:
  - Created (new event announcements)
  - Updated (event changes)
  - Deleted (cancellation notices)
- Beautiful HTML email templates with event details
- Subscriber management at `/admin/subscribers`
- Tracks notification history in database

### 4. Calendar Display
- Interactive calendar view at `/calendar`
- Month and list view options
- Filter by event type (weekly runs vs races)
- Export to Google Calendar or ICS file
- Email notification subscription form
- Real-time updates every 30 seconds

### 5. Homepage Integration
- Displays up to 3 featured weekly runs
- Displays up to 2 featured races
- Automatically pulls from D1 database
- Updates every 60 seconds

## Setup Instructions

### Prerequisites
- Cloudflare Workers account (for D1 database)
- Resend account (for email notifications)
- Environment variables configured in Vercel

### Environment Variables

Add these environment variables in the **Vars** section of the in-chat sidebar or in your Vercel project settings:

\`\`\`env
# Resend (Email)
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_audience_id
\`\`\`

The Cloudflare D1 database is automatically available in the Cloudflare Workers environment via the `DB` binding.

### Database Setup

The database schema is automatically created when you run the SQL scripts in the `/scripts` folder.

**Database Details:**
- Database binding: `DB`
- Database name: `slr-events`
- Database ID: `7ba37c21-1ce2-4801-938d-4beb617b0964`

**Schema Files:**
1. `scripts/01-create-events-schema.sql` - Creates tables
2. `scripts/02-seed-sample-events.sql` - Seeds sample data (optional)

You can run these scripts via the v0 interface or using the Wrangler CLI:

\`\`\`bash
wrangler d1 execute slr-events --file=scripts/01-create-events-schema.sql
wrangler d1 execute slr-events --file=scripts/02-seed-sample-events.sql
\`\`\`

## API Routes

### Events
- `GET /api/events` - Get all events
- `GET /api/events?upcoming=true` - Get upcoming events only
- `GET /api/events?type=weekly_run` - Filter by event type
- `GET /api/events?featured=true&type=race&limit=2` - Get featured races
- `POST /api/events` - Create new event (triggers email notifications)
- `GET /api/events/[id]` - Get single event
- `PUT /api/events/[id]` - Update event (triggers email notifications)
- `DELETE /api/events/[id]` - Delete event (triggers email notifications)

### Subscribers
- `GET /api/subscribers` - Get all active subscribers
- `POST /api/subscribers` - Add new subscriber

## Admin Pages

### Event Management
**URL:** `/admin/events`

Features:
- View all events organized by type
- Create new events with full details
- Edit existing events
- Delete events with confirmation
- Featured event indicators
- Automatic email notifications on changes

### Subscriber Management
**URL:** `/admin/subscribers`

Features:
- View all email subscribers
- Add new subscribers manually
- See subscription statistics
- Track active vs inactive subscribers

## Email Notification System

### How It Works

1. **Event Changes**: When an event is created, updated, or deleted via the admin interface:
   - System fetches all active subscribers from database
   - Generates appropriate email template (created/updated/deleted)
   - Sends batch email via Resend API
   - Logs notification in database with recipient count

2. **Email Templates**:
   - **Event Created**: Full event details with registration link
   - **Event Updated**: Alert banner with updated information
   - **Event Deleted**: Cancellation notice with original details

3. **Subscriber Management**:
   - Users can subscribe via calendar page
   - Admin can manually add subscribers
   - Subscribers automatically added to Resend audience
   - Unsubscribe links included in all emails

### Email Template Preview

Emails include:
- Club branding and logo
- Event title and description
- Date/time (Chicago timezone)
- Location and meeting point
- Distance and pace information
- Registration links (if applicable)
- Call-to-action buttons
- Unsubscribe option

## Homepage Featured Events

### Weekly Runs Section
- Displays up to 3 featured weekly runs
- Configurable via `is_featured` and `display_order` in database
- Shows event details, date/time, location
- Links to registration/more info

### Races Section
- Displays up to 2 featured races
- Includes race images if provided
- Registration buttons
- Prominent call-to-action

### How to Feature Events

In the admin interface (`/admin/events`):
1. Edit any event
2. Toggle "Feature on Homepage"
3. Set display order (0 = first, 1 = second, etc.)
4. Save changes

Events will automatically appear on homepage within 60 seconds.

## Database Schema

### Events Table
\`\`\`sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK(event_type IN ('weekly_run', 'race')),
  start_datetime TEXT NOT NULL,
  end_datetime TEXT,
  location TEXT NOT NULL,
  distance TEXT,
  pace TEXT,
  meeting_point TEXT,
  registration_url TEXT,
  image_url TEXT,
  is_featured INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
\`\`\`

### Email Subscribers Table
\`\`\`sql
CREATE TABLE email_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active INTEGER DEFAULT 1,
  subscribed_at TEXT NOT NULL,
  unsubscribed_at TEXT
);
\`\`\`

### Event Notifications Table
\`\`\`sql
CREATE TABLE event_notifications (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK(notification_type IN ('created', 'updated', 'deleted', 'reminder')),
  sent_at TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
\`\`\`

## Timezone Handling

All events are stored and displayed in **Chicago timezone (America/Chicago)**.

- Database stores ISO 8601 datetime strings
- API converts to Chicago timezone for display
- Admin interface uses `datetime-local` inputs
- Email notifications show Chicago timezone
- Calendar exports include timezone information

## Development

### Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Access the application at `http://localhost:3000`

### Testing Email Notifications

1. Add a test subscriber via admin interface
2. Create/update/delete an event
3. Check email inbox for notifications
4. Verify notification log in database

### Database Queries

Use Wrangler CLI to query D1:

\`\`\`bash
# View all events
wrangler d1 execute slr-events --command "SELECT * FROM events"

# View all subscribers
wrangler d1 execute slr-events --command "SELECT * FROM email_subscribers"

# View notification history
wrangler d1 execute slr-events --command "SELECT * FROM event_notifications"
\`\`\`

## Troubleshooting

### Emails Not Sending
- Verify `RESEND_API_KEY` is set correctly in the Vars section
- Check Resend dashboard for API usage/errors
- Ensure subscribers exist in database
- Check browser console for API errors

### Database Connection Issues
- Verify D1 binding is configured
- Check database exists in Cloudflare dashboard
- Run schema migration if tables missing
- Verify environment variables in deployment

### Events Not Appearing on Homepage
- Check `is_featured` flag is set to 1
- Verify `display_order` is set correctly
- Ensure event is in the future
- Clear browser cache and wait 60 seconds for refresh

## Support

For issues or questions, open an issue on the GitHub repository or contact the development team.
