import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestPost(context: { env: Env; params: { eventId: string } }) {
  try {
    const { eventId } = context.params

    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    const deleteResult = await context.env.DB.prepare(
      `DELETE FROM run_rsvps WHERE event_id = ?`,
    )
      .bind(eventId)
      .run()

    const deletedCount = deleteResult.meta?.changes || 0

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleared ${deletedCount} RSVPs`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error resetting run RSVPs:", error)
    return new Response(JSON.stringify({ error: "Failed to reset run RSVPs" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
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
