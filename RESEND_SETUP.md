# Resend Email Notification Setup

This guide will help you set up email notifications for South Loop Runners events using Resend.

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. The free tier includes 3,000 emails per month, which should be sufficient for event notifications

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "South Loop Runners Production")
5. Copy the API key (it will only be shown once)

## Step 3: Create an Audience

1. In your Resend dashboard, navigate to **Audiences**
2. Click **Create Audience**
3. Name it "Event Notifications" or similar
4. Copy the **Audience ID** (you'll need this for the next step)

## Step 4: Verify Your Domain (Important for deliverability)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `southlooprunners.com`)
4. Follow the DNS verification steps provided by Resend
5. Add the required DNS records to your domain registrar

**Note:** Until domain verification is complete, you can only send emails to verified email addresses. Once verified, you can send to anyone.

## Step 5: Add Environment Variables

Add these environment variables to your Vercel project:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

\`\`\`
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
\`\`\`

4. Make sure to add them for **Production**, **Preview**, and **Development** environments

## Step 6: Update the From Email Address

In `app/api/send-event-notification/route.ts`, update the `from` address to match your verified domain:

\`\`\`typescript
from: 'South Loop Runners <events@southlooprunners.com>'
\`\`\`

Replace `southlooprunners.com` with your actual domain.

## Step 7: Test the Integration

1. Deploy your changes to Vercel
2. Visit `/calendar` on your site
3. Click "Sign up for event notifications"
4. Enter your email and subscribe
5. Check your Resend dashboard to confirm the contact was added to your audience

## Sending Event Notifications

To notify subscribers about new or updated events, you can make a POST request to `/api/send-event-notification`:

\`\`\`bash
curl -X POST https://your-domain.com/api/send-event-notification \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Summer 5K Race",
    "eventType": "Race",
    "eventDate": "August 15, 2025 at 8:00 AM",
    "eventDetails": "Join us for a fun 5K along the lakefront!",
    "isNew": true
  }'
\`\`\`

**Security Note:** You may want to add authentication to this endpoint to prevent unauthorized use.

## Troubleshooting

- **Emails not sending?** Check that your domain is verified in Resend
- **Subscribers not being added?** Verify your `RESEND_AUDIENCE_ID` is correct
- **API errors?** Check your `RESEND_API_KEY` is valid and has the correct permissions

## Cost Information

- Free tier: 3,000 emails/month
- Pro plan: $20/month for 50,000 emails
- No credit card required for free tier

For more information, visit the [Resend documentation](https://resend.com/docs).
