# Deploying to Cloudflare Pages

This Next.js application can be deployed to Cloudflare Pages using the standard Next.js build.

## Prerequisites

- A Cloudflare account
- Git repository connected to Cloudflare Pages

## Deployment Steps

### Deploy via Cloudflare Dashboard (Recommended)

1. Log in to your Cloudflare account at https://dash.cloudflare.com
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your repository (south-loop-runners-website)
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Add environment variables (optional):
   - Go to **Settings** → **Environment variables**
   - Add `STRAVA_ACCESS_TOKEN` if you want to enable Strava integration
6. Click **Save and Deploy**

### Subsequent Deployments

After the initial setup, Cloudflare Pages will automatically deploy your site whenever you push to your main branch.

## Environment Variables

The site currently uses these environment variables:
- `STRAVA_ACCESS_TOKEN` (optional) - For Strava club integration

To add environment variables:
1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to **Settings** → **Environment variables**
3. Add variables for Production and/or Preview environments

## Features

- **Automatic deployments** from Git pushes
- **Preview deployments** for pull requests
- **Custom domains** can be added in Settings → Custom domains
- **Analytics** available in the Analytics tab

## Notes

- The site is a standard Next.js app with static and dynamic features
- Instagram embeds load client-side via Instagram's embed.js
- All social media links (Facebook, Strava, Instagram) work without additional configuration
- Images are unoptimized for better compatibility with Cloudflare's edge network

## Troubleshooting

If you encounter build errors:
1. Check the build logs in the Cloudflare Dashboard
2. Ensure all dependencies are listed in package.json
3. Verify Node.js version compatibility (18+)
4. Check that environment variables are set correctly

For more information, visit: https://developers.cloudflare.com/pages/framework-guides/nextjs/
