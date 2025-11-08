// Cloudflare Pages Middleware for Admin Route Protection
// This runs on Cloudflare's edge before any request reaches your static pages

import type { KVNamespace } from "@cloudflare/workers-types"

interface Env {
  RACE_RSVPS: KVNamespace
  ADMIN_PASSWORD: string
}

export async function onRequest(context: { request: Request; next: () => Promise<Response>; env: Env }) {
  const url = new URL(context.request.url)

  // Only protect /admin routes (except login page)
  if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
    // Check for auth cookie
    const cookies = context.request.headers.get("cookie") || ""
    const authCookie = cookies
      .split(";")
      .find((c) => c.trim().startsWith("admin_auth="))
      ?.split("=")[1]

    if (!authCookie) {
      // No auth cookie - redirect to login
      return Response.redirect(new URL("/admin/login", context.request.url), 302)
    }

    // Verify the auth token matches the admin password
    const adminPassword = context.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error("[Cloudflare Middleware] ADMIN_PASSWORD not set in environment")
      return Response.redirect(new URL("/admin/login", context.request.url), 302)
    }

    // Simple token verification (token is base64 encoded password)
    try {
      const decodedToken = atob(authCookie)
      if (decodedToken !== adminPassword) {
        // Invalid token - redirect to login
        return Response.redirect(new URL("/admin/login", context.request.url), 302)
      }
    } catch (error) {
      // Invalid token format - redirect to login
      return Response.redirect(new URL("/admin/login", context.request.url), 302)
    }
  }

  // Allow request to proceed
  return context.next()
}
