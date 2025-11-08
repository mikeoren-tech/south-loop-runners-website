import type { PagesFunction } from "@cloudflare/workers-types"

export const onRequestPost: PagesFunction = async () => {
  const headers = new Headers()
  headers.set("Content-Type", "application/json")
  headers.set("Set-Cookie", "admin-auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0")

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  })
}
