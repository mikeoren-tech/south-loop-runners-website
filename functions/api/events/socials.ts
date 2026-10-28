import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env }) {
  try {
    // Event dates are stored as YYYY-MM-DD, so compare against today's date in Chicago
    // to keep a social listed through the end of its day.
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" })

    const { results } = await context.env.DB.prepare(
      `SELECT * FROM events WHERE type = 'social' AND deleted_at IS NULL AND date >= ? ORDER BY date ASC, created_at ASC LIMIT 12`,
    )
      .bind(today)
      .all()

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching socials:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch socials" }), {
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
