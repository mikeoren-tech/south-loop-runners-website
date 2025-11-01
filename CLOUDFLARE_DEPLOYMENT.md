# Deploying to Cloudflare Pages

This Next.js application is configured for deployment on Cloudflare Pages as a static export.

## Prerequisites

- A Cloudflare account
- Git repository connected to Cloudflare Pages

## Deployment Steps

### Deploy via Cloudflare Dashboard (Recommended)

1. Log in to your Cloudflare account at https://dash.cloudflare.com
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your repository (south-loop-runners-website)
4. Configure build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `pnpm run build` (or `npm run build`)
   - **Build output directory**: `out` // Updated from .next to out for static export
   - **Root directory**: `/` (leave as default)
5. **IMPORTANT**: Do not set a deploy command - leave it empty // Added critical instruction
6. Add environment variables (optional):
   - Go to **Settings** → **Environment variables**
   - Add `STRAVA_ACCESS_TOKEN` if you want to enable Strava integration
7. Click **Save and Deploy**

### Subsequent Deployments

After the initial setup, Cloudflare Pages will automatically deploy your site whenever you push to your main branch.

## Important: Build Configuration

### Critical Settings

Make sure these are configured correctly in Cloudflare Pages:

- **Build output directory**: `out` (not `.next`)
- **Deploy command**: **LEAVE EMPTY** - Cloudflare Pages handles deployment automatically

### Common Error: "Missing entry-point"

If you see an error like `Missing entry-point to Worker script`, it means:
- A deploy command is set in your Cloudflare Pages settings
- Go to **Settings** → **Builds & deployments**
- Remove any deploy command (should be empty)
- Cloudflare Pages will automatically deploy after the build completes

## Static Export Configuration

This app uses `output: 'export'` in `next.config.mjs` to generate a static HTML export, which is required for Cloudflare Pages.

### What This Means

- All pages are pre-rendered as static HTML
- No server-side rendering (SSR)
- No API routes (client-side only)
- Perfect for static sites with client-side interactivity

All features in this app (Instagram embeds, social links, event displays) work perfectly with static export.

## Environment Variables

The site currently uses these environment variables:
- `STRAVA_ACCESS_TOKEN` (optional) - For Strava club integration

To add environment variables:
1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to **Settings** → **Environment variables**
3. Add variables for Production and/or Preview environments
4. Client-side variables must be prefixed with `NEXT_PUBLIC_`

## Features

- **Automatic deployments** from Git pushes
- **Preview deployments** for pull requests
- **Custom domains** can be added in Settings → Custom domains
- **Analytics** available in the Analytics tab

## Troubleshooting

### Build Fails
1. Check the build logs in the Cloudflare Dashboard
2. Ensure all dependencies are listed in package.json
3. Verify Node.js version compatibility (18+)
4. Check that environment variables are set correctly

### "Missing entry-point" Error
- Remove any deploy command from Cloudflare Pages settings
- The deploy command field should be empty
- Cloudflare Pages automatically deploys after build

### Instagram Embeds Not Loading
- Update `components/instagram-feed.tsx` with real Instagram post URLs
- Replace placeholder URLs with actual posts from @southlooprunners

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Pages Framework Guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
