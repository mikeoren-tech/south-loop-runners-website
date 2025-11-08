# Cloudflare-Compatible Admin Authentication

This project uses **Cloudflare Pages Functions** with a static export build, which requires a different approach than standard Next.js middleware.

## Architecture Overview

### Why Not Standard Next.js Middleware?

With `output: 'export'` in `next.config.mjs`, the site is built as static HTML files. Standard Next.js middleware requires a Node.js server runtime, which isn't available in static exports.

### Cloudflare Pages Solution

Instead, we use **Cloudflare's `_middleware.ts`** which runs on Cloudflare's edge network:

\`\`\`
functions/
  _middleware.ts          # Edge middleware - protects ALL /admin/* routes
  api/
    admin/
      auth/
        login.ts          # POST /api/admin/auth/login
        check.ts          # GET /api/admin/auth/check
        logout.ts         # POST /api/admin/auth/logout
\`\`\`

## How It Works

### 1. Edge Protection (Server-Side)

**File: `functions/_middleware.ts`**

- Runs on Cloudflare's edge before ANY request reaches your static pages
- Intercepts ALL requests to `/admin/*` (except `/admin/login`)
- Checks for `admin_auth` cookie
- Verifies token matches `ADMIN_PASSWORD` environment variable
- Redirects to `/admin/login` if authentication fails

\`\`\`typescript
// Simplified flow:
if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
  const authCookie = extractCookie("admin_auth");
  if (!authCookie || !isValidToken(authCookie)) {
    return redirect("/admin/login");
  }
}
\`\`\`

### 2. Login Flow

**File: `functions/api/admin/auth/login.ts`**

When user submits password:
1. Compares with `ADMIN_PASSWORD` environment variable
2. Creates secure token: `btoa(password)` (base64 encoding)
3. Sets `admin_auth` cookie with:
   - `HttpOnly` - Cannot be accessed by JavaScript
   - `Secure` - Only sent over HTTPS
   - `SameSite=Strict` - CSRF protection
   - `Max-Age=604800` - 7 days expiration

### 3. Auth Check API

**File: `functions/api/admin/auth/check.ts`**

Client-side pages call this to verify authentication:
- Extracts `admin_auth` cookie
- Decodes base64 token
- Verifies against `ADMIN_PASSWORD`
- Returns `{ authenticated: true/false }`

### 4. Client-Side Protection (Defense in Depth)

**File: `app/admin/page.tsx`**

Even though edge middleware protects the route, the client-side page:
- Shows loading state while checking auth
- Calls `/api/admin/auth/check` endpoint
- Displays "Access Denied" message if unauthorized
- Redirects to login page

This provides better UX than just showing a blank page during redirect.

## Security Features

### Server-Side (Primary Defense)
- Edge middleware blocks unauthorized access before pages load
- No static admin content is ever sent to unauthenticated users
- Token verification happens on Cloudflare's edge (fast & secure)

### Cookie Security
- `HttpOnly` - Prevents XSS attacks from stealing cookie
- `Secure` - Forces HTTPS only
- `SameSite=Strict` - Prevents CSRF attacks
- 7-day expiration with automatic cleanup on logout

### Token Security
- Token is base64-encoded password (simple but effective for single-admin use)
- For multi-admin systems, consider JWT with expiration timestamps

## Environment Variables

Required in Cloudflare Pages:

\`\`\`
ADMIN_PASSWORD=your-secure-password-here
\`\`\`

Set this in:
1. Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
2. Add for both Production and Preview environments

## Testing Authentication

### Test Protected Route:
1. Visit `/admin` without logging in
2. Should immediately redirect to `/admin/login`
3. Browser network tab shows 302 redirect from edge middleware

### Test Valid Login:
1. Visit `/admin/login`
2. Enter correct password from `ADMIN_PASSWORD` env var
3. Should redirect to `/admin` and show dashboard
4. Cookie `admin_auth` visible in browser DevTools → Application → Cookies

### Test Invalid Login:
1. Enter wrong password
2. Should show "Invalid password" error
3. No cookie set
4. Cannot access `/admin`

### Test Logout:
1. Click "Logout" button in admin dashboard
2. Cookie is deleted (Max-Age=0)
3. Redirect to `/admin/login`
4. Cannot access `/admin` anymore

## Debugging

### Check Middleware Execution:
\`\`\`typescript
// Add to functions/_middleware.ts
console.log("[Cloudflare Middleware] Checking:", url.pathname);
console.log("[Cloudflare Middleware] Auth cookie:", authCookie);
\`\`\`

View logs in Cloudflare Dashboard → Pages → Your Project → Functions

### Check Cookie in Browser:
1. DevTools → Application → Cookies
2. Look for `admin_auth` cookie
3. Should be present after successful login
4. Should be HttpOnly and Secure

### Common Issues:

**Issue: Redirecting in loop**
- Check that `/admin/login` is excluded from middleware check
- Verify `ADMIN_PASSWORD` is set in Cloudflare environment

**Issue: Cookie not set**
- Ensure site is accessed via HTTPS (Secure flag requires it)
- Check Cloudflare SSL/TLS is enabled

**Issue: "Access Denied" after login**
- Verify password matches `ADMIN_PASSWORD` exactly
- Check browser console for auth check API errors
- Confirm cookie name is `admin_auth` (not `admin-auth`)

## Comparison: Cloudflare vs Next.js Middleware

| Feature | Next.js Middleware | Cloudflare Pages Middleware |
|---------|-------------------|----------------------------|
| Location | `middleware.ts` (root) | `functions/_middleware.ts` |
| Runtime | Node.js server | Cloudflare Workers (V8) |
| Static Export | ❌ Not compatible | ✅ Fully compatible |
| Edge Execution | ✅ Yes (with server) | ✅ Yes (always) |
| Environment Access | `process.env` | `context.env` |
| Cookie Handling | `NextRequest.cookies` | Manual header parsing |

## Production Checklist

Before deploying:
- [ ] `ADMIN_PASSWORD` set in Cloudflare environment variables
- [ ] Password is strong (12+ characters, mixed case, numbers, symbols)
- [ ] Test login/logout flow on production URL
- [ ] Verify edge middleware runs (check Cloudflare Functions logs)
- [ ] Confirm HTTPS is enabled (required for Secure cookies)
- [ ] Test that `/admin` redirects without authentication
- [ ] Test that `/admin` accessible after login

## Future Enhancements

For multi-admin or enhanced security:
1. Use JWT tokens instead of base64 encoding
2. Add token expiration timestamps
3. Implement rate limiting on login endpoint
4. Add session management in KV storage
5. Add 2FA authentication
6. Use Cloudflare Access for enterprise SSO
