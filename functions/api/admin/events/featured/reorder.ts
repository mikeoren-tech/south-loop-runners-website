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

    console.log("[v0] Reorder request received:", body)

    if (!body.eventIds || !Array.isArray(body.eventIds)) {
      console.log("[v0] Invalid request body")
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const batch = []
    for (let i = 0; i < body.eventIds.length; i++) {
      const displayOrder = i + 1
      console.log(`[v0] Updating event ${body.eventIds[i]} to position ${displayOrder}`)

      batch.push(
        context.env.DB.prepare(`UPDATE events SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(
          displayOrder,
          body.eventIds[i],
        ),
      )
    }

    const results = await context.env.DB.batch(batch)
    console.log("[v0] Batch update results:", results)

    const verifyQuery = await context.env.DB.prepare(
      `SELECT id, display_order FROM events WHERE is_featured_homepage = 1 ORDER BY display_order ASC`,
    ).all()

    console.log("[v0] Verification query results:", verifyQuery.results)
    console.log("[v0] Display order updated successfully")

    return new Response(
      JSON.stringify({
        success: true,
        message: "Display order updated successfully",
        updated: verifyQuery.results,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
  } catch (error) {
    console.error("[Cloudflare Function] Error reordering events:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to reorder events",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
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
