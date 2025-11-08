import type { PagesFunction } from "@cloudflare/workers-types"

export const onRequestPost: PagesFunction<{
  ADMIN_PASSWORD: string
}> = async (context) => {
  try {
    const { password } = (await context.request.json()) as { password: string }
    const adminPassword = context.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return new Response(JSON.stringify({ error: "Admin password not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (password === adminPassword) {
      // Set HTTP-only cookie
      const headers = new Headers()
      headers.set("Content-Type", "application/json")
      headers.set("Set-Cookie", "admin-auth=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400")

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      })
    }

    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
