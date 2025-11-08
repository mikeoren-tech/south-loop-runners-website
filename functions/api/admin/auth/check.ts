import type { PagesFunction } from "@cloudflare/workers-types"

export const onRequestGet: PagesFunction = async (context) => {
  const cookie = context.request.headers.get("Cookie")
  const isAuthenticated = cookie?.includes("admin-auth=true") || false

  return new Response(JSON.stringify({ authenticated: isAuthenticated }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}
