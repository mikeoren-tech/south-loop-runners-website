import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env }) {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT * FROM events WHERE type = 'weekly-run' AND is_recurring = 1 AND deleted_at IS NULL ORDER BY display_order ASC`,
    ).all()

    console.log(
      "[v0] Weekly runs API - Returned order:",
      results?.map((r: any) => ({ id: r.id, display_order: r.display_order, title: r.title })),
    )

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching weekly runs:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch weekly runs" }), {
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
