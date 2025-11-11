import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT URL, caption FROM ig_feed WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC LIMIT 6",
    ).all()

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching active Instagram posts:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
