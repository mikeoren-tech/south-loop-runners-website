# Homepage Featured Events Configuration

This guide explains how to configure which events appear prominently on the homepage of the South Loop Runners website.

## Overview

The featured events system allows administrators to:
- Select up to 5 events to display prominently on the homepage
- Arrange the display order via drag-and-drop interface
- Include weekly runs, special events, or races
- Automatically keep all other events visible in the full calendar

## Accessing the Featured Events Manager

1. Log in to the admin dashboard at `/admin/login`
2. From the admin dashboard, click "Manage Featured" in the highlighted card
3. Or navigate directly to `/admin/featured`

## Managing Featured Events

### Adding Events to Homepage

1. Scroll to the "Available Events" section at the bottom
2. Find the event you want to feature
3. Click the "Feature" button (star icon)
4. The event will be added to the featured list at the top

### Removing Events from Homepage

1. In the "Featured Events" section, find the event
2. Click the "Remove from featured" button (star-off icon) on the right
3. The event moves back to the available events list

### Reordering Featured Events

1. In the "Featured Events" section, click and hold the grip handle (⋮⋮) on the left of any event
2. Drag the event up or down to change its position
3. Release to drop it in the new position
4. The order saves automatically

## Best Practices

### Recommended Number of Featured Events
- **Optimal:** 3-5 events for clean homepage display
- **Minimum:** 1 event (always have something featured)
- **Maximum:** No hard limit, but more than 7 may clutter the homepage

### What to Feature

**Good candidates for featuring:**
- Upcoming special events (field trips, social runs, etc.)
- Time-sensitive registration deadlines
- New or popular weekly runs
- Important races with upcoming deadlines
- Seasonal events or holiday-themed runs

**Not necessary to feature:**
- Regular weekly runs already shown in the standard section
- Past events
- Events far in the future (more than 2 months out)

### Display Order Strategy

**Position 1 (Top):** Most urgent or important event
- Registration closing soon
- Happening this week
- Major special event

**Positions 2-3:** Regular weekly runs or popular events
- Saturday Anchor Run
- Thursday Light Up the Lakefront
- Sunday Social Run

**Positions 4-5:** Secondary events
- Upcoming races
- Future special events
- Alternative run options

## Technical Details

### Database Fields
Featured events are controlled by two fields in the `events` table:
- `is_featured_homepage` (0 or 1): Whether the event is featured
- `display_order` (integer): Sort order on homepage (lower = higher priority)

### API Endpoints

**Fetch Featured Events:**
\`\`\`
GET /api/events/featured
\`\`\`

**Toggle Featured Status:**
\`\`\`
POST /api/admin/events/featured/toggle
Body: { eventId: string, isFeatured: boolean }
\`\`\`

**Reorder Events:**
\`\`\`
POST /api/admin/events/featured/reorder
Body: { eventIds: string[] }
\`\`\`

### Cloudflare Compatibility

All featured event APIs use Cloudflare D1 database bindings and work seamlessly with your static export configuration. No additional setup required beyond the existing D1 database connection.

## Calendar Integration

**Important:** Featured events are ALSO visible in the full events calendar. The featured system only controls homepage prominence, not calendar visibility.

To hide an event entirely:
1. Go to the main admin dashboard
2. Use the delete button (trash icon) on the event
3. This soft-deletes the event (sets `deleted_at` timestamp)

## Troubleshooting

### Events not appearing on homepage
1. Verify the event is marked as featured in `/admin/featured`
2. Check that `is_featured_homepage = 1` in the database
3. Clear browser cache and refresh

### Drag-and-drop not working
1. Ensure JavaScript is enabled
2. Try using a desktop browser (mobile may have limited support)
3. Check browser console for errors

### Changes not saving
1. Verify you're logged in (check for "Saving..." indicator)
2. Check browser network tab for failed API calls
3. Verify D1 database connection in Cloudflare dashboard

## Need Help?

If you encounter issues with the featured events system:
1. Check Cloudflare Pages Functions logs for errors
2. Verify D1 database binding is configured
3. Ensure admin authentication is working
4. Open a support ticket at vercel.com/help for persistent issues
