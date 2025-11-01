# Deploying to Cloudflare Pages

This Next.js application is configured for deployment to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Git repository connected to Cloudflare Pages

## Deployment Steps

### Option 1: Deploy via Cloudflare Dashboard

1. Log in to your Cloudflare account
2. Go to **Pages** → **Create a project**
3. Connect your Git repository
4. Configure build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
5. Add environment variables (if needed):
   - Go to **Settings** → **Environment variables**
   - Add `STRAVA_ACCESS_TOKEN` if using Strava integration
6. Add compatibility flag:
   - Go to **Settings** → **Functions** → **Compatibility flags**
   - Add `nodejs_compat`
7. Click **Save and Deploy**

### Option 2: Deploy via Wrangler CLI

\`\`\`bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run pages:build

# Deploy to Cloudflare Pages
wrangler pages deploy .vercel/output/static --project-name=south-loop-runners
\`\`\`

## Environment Variables

If you're using any environment variables (like `STRAVA_ACCESS_TOKEN`), make sure to add them in:
- **Cloudflare Dashboard**: Settings → Environment variables
- **Wrangler CLI**: Use `wrangler pages secret put <KEY>`

## Notes

- The site uses static export mode for optimal Cloudflare Pages compatibility
- Images are unoptimized for Cloudflare's edge network
- Instagram embeds require client-side JavaScript to load
- All external links (Facebook, Strava, Instagram) work without additional configuration

## Troubleshooting

If you encounter build errors:
1. Ensure Node.js version is 18 or higher
2. Clear build cache: `rm -rf .next .vercel`
3. Check that all dependencies are installed: `npm install`
4. Verify environment variables are set correctly

For more information, visit: https://developers.cloudflare.com/pages/framework-guides/nextjs/
