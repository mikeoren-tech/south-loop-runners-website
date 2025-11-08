# Admin Security Implementation

## Overview
The admin dashboard uses a multi-layered security approach to protect sensitive administrative functions.

## Security Layers

### 1. Server-Side Route Protection (middleware.ts)
- **Primary Defense**: Next.js middleware intercepts all requests to `/admin/*` routes
- **Validation**: Checks for valid `admin-auth` cookie before allowing access
- **Automatic Redirect**: Unauthenticated users are immediately redirected to `/admin/login`
- **Scope**: Protects all admin routes except the login page

### 2. Client-Side Authentication Check
- **Secondary Defense**: React component verifies authentication status on mount
- **Server Verification**: Makes API call to `/api/admin/auth/check` for server-side validation
- **User Feedback**: Shows loading state during verification and error state if unauthorized
- **Graceful Handling**: Redirects to login with user-friendly error message

### 3. HTTP-Only Secure Cookies
- **Cookie Attributes**:
  - `HttpOnly`: Prevents JavaScript access (XSS protection)
  - `Secure`: Only transmitted over HTTPS
  - `SameSite=Strict`: CSRF protection
  - `Max-Age=604800`: 7-day expiration
- **Storage**: Cookie stored securely by browser, inaccessible to client-side scripts

### 4. API Route Protection
- All `/api/admin/*` endpoints should verify the admin-auth cookie
- Returns 401 Unauthorized if cookie is invalid
- Implements proper HTTP status codes for security responses

## Why This Approach?

1. **Defense in Depth**: Multiple security layers ensure that if one fails, others provide protection
2. **Server-First**: Primary authentication happens at the server level, not client-side
3. **Proper HTTP Semantics**: Uses correct status codes (401 for unauthorized)
4. **User Experience**: Provides clear feedback while maintaining security

## Testing Authentication

### Test Valid Access:
1. Log in at `/admin/login` with correct password
2. Navigate to `/admin`
3. Should see dashboard immediately

### Test Invalid Access:
1. Clear cookies or use incognito mode
2. Navigate directly to `/admin`
3. Should be immediately redirected to `/admin/login` by middleware
4. Should see "Access Denied" briefly if client-side check triggers

### Test Session Expiry:
1. Log in and wait 7 days (or manually delete cookie)
2. Try to access `/admin`
3. Should be redirected to login

## Environment Variables

**Required**: `ADMIN_PASSWORD` must be set in Cloudflare Pages environment variables

\`\`\`bash
# In Cloudflare Dashboard → Pages → Settings → Environment Variables
ADMIN_PASSWORD=your_secure_password_here
\`\`\`

## Security Best Practices

✅ **Do**:
- Use a strong, unique password for `ADMIN_PASSWORD`
- Keep middleware protection enabled
- Regularly review access logs
- Use HTTPS in production (automatic with Cloudflare)

❌ **Don't**:
- Share admin credentials
- Commit passwords to Git
- Disable middleware protection
- Use the same password across environments
