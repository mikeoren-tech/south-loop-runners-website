import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

interface ToggleRequest {
  eventId: string
  isFeatured: boolean
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  try {
    const body = (await context.request.json()) as ToggleRequest

    if (!body.eventId || typeof body.isFeatured !== "boolean") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // If setting to featured, get the current max display_order and increment
    let displayOrder = 999
    if (body.isFeatured) {
      const { results } = await context.env.DB.prepare(
        `SELECT MAX(display_order) as max_order FROM events WHERE is_featured_homepage = 1`,
      ).all()

      displayOrder = results && results[0] && typeof results[0].max_order === "number" ? results[0].max_order + 1 : 0
    }

    await context.env.DB.prepare(
      `UPDATE events 
       SET is_featured_homepage = ?, 
           display_order = ?,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
    )
      .bind(body.isFeatured ? 1 : 0, displayOrder, body.eventId)
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: body.isFeatured ? "Event featured on homepage" : "Event removed from homepage",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("[Cloudflare Function] Error toggling featured status:", error)
    return new Response(JSON.stringify({ error: "Failed to toggle featured status" }), {
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
