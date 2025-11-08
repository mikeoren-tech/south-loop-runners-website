import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

interface ReorderRequest {
  eventIds: string[]
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  try {
    const body = (await context.request.json()) as ReorderRequest

    if (!body.eventIds || !Array.isArray(body.eventIds)) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Update display_order for each event based on array position
    for (let i = 0; i < body.eventIds.length; i++) {
      await context.env.DB.prepare(`UPDATE events SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
        .bind(i, body.eventIds[i])
        .run()
    }

    return new Response(JSON.stringify({ success: true, message: "Display order updated successfully" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error reordering events:", error)
    return new Response(JSON.stringify({ error: "Failed to reorder events" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
