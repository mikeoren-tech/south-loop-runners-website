# Pace Interest Reset System

## Overview
Pace interests are automatically reset the day after each run occurs:
- **Thursday Light Up** → Resets Friday at 4 AM CT
- **Saturday Anchor** → Resets Sunday at 4 AM CT  
- **Sunday Social** → Resets Monday at 4 AM CT

## Implementation

### Cloudflare Cron Trigger
A scheduled function runs daily at 4 AM Central Time (10 AM UTC) to check if any runs occurred yesterday and resets their pace interest counts.

### Setup in Cloudflare Dashboard

1. **Deploy the Cron Function**
   - The function is located at `functions/scheduled/reset-pace-interests.ts`
   - It automatically gets deployed with your Pages project

2. **Configure Cron Trigger** (if not using wrangler.toml)
   - Go to **Workers & Pages** → Your project
   - Navigate to **Settings** → **Functions** → **Cron Triggers**
   - Add cron expression: `0 10 * * *` (runs daily at 10 AM UTC / 4 AM CT)
   - This will trigger the `/scheduled/reset-pace-interests` endpoint

3. **Using Wrangler CLI**
   \`\`\`bash
   # The wrangler.toml file includes the cron configuration
   # Deploy with:
   wrangler pages deploy
   \`\`\`

### Manual Reset (if needed)

You can manually trigger a reset by calling the endpoint directly:

\`\`\`bash
curl -X GET https://southlooprunners.com/scheduled/reset-pace-interests
\`\`\`

### Testing

To test the reset logic without waiting for the cron:
1. Visit `/scheduled/reset-pace-interests` manually
2. Check Cloudflare logs to see which events were reset
3. Verify pace interest counts are back to 0 in the database

### Database Schema

The reset updates these fields in the `pace_interests` table:
- `count` → Set to 0
- `last_reset` → Updated to current timestamp
- `updated_at` → Updated to current timestamp

### Monitoring

Check Cloudflare Pages logs to monitor reset execution:
- **Workers & Pages** → Your project → **Functions** → **Logs**
- Look for `[v0] Running pace reset check` messages
- Verify successful resets show row counts updated
