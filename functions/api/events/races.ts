import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env }) {
  try {
    const now = new Date().toISOString()

    const { results } = await context.env.DB.prepare(
      `SELECT * FROM events WHERE type = 'race' AND deleted_at IS NULL AND (date >= ? OR is_recurring = 1) ORDER BY date ASC LIMIT 10`,
    )
      .bind(now)
      .all()

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching races:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch races" }), {
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
