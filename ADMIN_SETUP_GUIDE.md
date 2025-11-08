# Admin Dashboard Setup Guide

## Overview
The admin dashboard allows authorized users to manage events and send email notifications to subscribers through the Resend integration.

## Prerequisites
You need the following environment variables configured in Cloudflare:

### Required Environment Variables
1. **ADMIN_PASSWORD** - Password for accessing the admin dashboard
2. **RESEND_API_KEY** - Your Resend API key (already configured)
3. **RESEND_AUDIENCE_ID** - Your Resend audience ID (already configured)

### D1 Database Binding
- **Binding Name**: `DB`
- **Database**: `slr-events`

## Accessing the Admin Dashboard

### 1. Set Admin Password
Add the `ADMIN_PASSWORD` environment variable in Cloudflare Pages:
- Go to your project in Cloudflare Dashboard
- Navigate to **Settings** → **Environment variables**
- Add `ADMIN_PASSWORD` with a secure password value
- Save and redeploy

### 2. Login
- Visit: `https://yourdomain.com/admin/login`
- Enter the password you configured
- You'll be redirected to the admin dashboard

### 3. Managing Events

#### Add New Event
1. Click "Add Event" button
2. Fill in event details:
   - **Event Title** (required)
   - **Description**
   - **Event Type**: Weekly Run, Special Event, or Race
   - **Recurring**: Check if event repeats weekly
   - **Date/Day**: Specific date or day of week
   - **Time**, **Location**, **Distance**, **Pace**
   - **Links**: Facebook, Strava, Registration URL
3. Check "Send notification email to subscribers" if you want to notify members
4. Click "Create Event"

#### Edit Event
1. Click the edit (pencil) icon on any event
2. Modify the details
3. Check "Send notification email" to alert subscribers of changes
4. Click "Update Event"

#### Delete Event
1. Click the trash icon on any event
2. Confirm deletion
3. Cancellation email will be sent automatically to subscribers

## Email Notifications

### Notification Types
- **New Event**: Sent when creating a new event (if checkbox is checked)
- **Updated Event**: Sent when editing an event (if checkbox is checked)
- **Canceled Event**: Automatically sent when deleting an event

### Email Recipients
Emails are sent to all contacts in your Resend audience (`RESEND_AUDIENCE_ID`). Make sure subscribers are added to this audience in your Resend dashboard.

### Email Content
Each notification includes:
- Event title and description
- Date, time, and location
- Distance and pace (if applicable)
- RSVP/Registration links
- Branded South Loop Runners design

## Security

### Session Management
- Admin sessions last 7 days
- HTTP-only cookies prevent XSS attacks
- Logout available from dashboard header

### Protected Routes
All `/admin/*` routes except `/admin/login` require authentication via middleware.

## Troubleshooting

### Can't Login
- Verify `ADMIN_PASSWORD` is set in Cloudflare environment variables
- Clear cookies and try again
- Check browser console for errors

### Emails Not Sending
- Verify `RESEND_API_KEY` is valid
- Check `RESEND_AUDIENCE_ID` exists in Resend
- Review Cloudflare Functions logs for errors
- Ensure "from" email domain is verified in Resend

### Database Errors
- Confirm D1 binding `DB` is configured
- Run all migration scripts in order
- Check Cloudflare D1 dashboard for connection issues

## Support
For issues or questions, check:
- Cloudflare Functions logs
- Resend email logs
- Browser console for client-side errors
