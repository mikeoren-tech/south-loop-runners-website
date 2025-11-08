import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check for auth cookie
    const authCookie = request.cookies.get("admin-auth")

    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      // If already authenticated, redirect to dashboard
      if (authCookie?.value === "authenticated") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.next()
    }

    // Protect all other admin routes
    if (authCookie?.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
