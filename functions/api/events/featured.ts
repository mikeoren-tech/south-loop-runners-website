import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  try {
    // Fetch events that are featured on homepage, ordered by display_order
    const query = `
      SELECT * FROM events 
      WHERE deleted_at IS NULL 
      AND is_featured_homepage = 1
      ORDER BY display_order ASC, created_at ASC
    `

    const { results } = await context.env.DB.prepare(query).all()

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching featured events:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch featured events" }), {
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
