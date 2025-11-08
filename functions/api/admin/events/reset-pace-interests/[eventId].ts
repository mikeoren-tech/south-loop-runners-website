import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestPost(context: { env: Env; params: { eventId: string } }) {
  console.log("[v0] POST reset pace interests for eventId:", context.params.eventId)

  try {
    const { eventId } = context.params

    if (!context.env.DB) {
      console.error("[v0] DB binding not found")
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    // Reset all pace interest counts for this event to 0
    const resetResult = await context.env.DB.prepare(
      `UPDATE pace_interests 
       SET count = 0, 
           last_reset = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE event_id = ?`,
    )
      .bind(eventId)
      .run()

    console.log("[v0] Reset result:", resetResult)

    if (!resetResult.success) {
      throw new Error("Failed to reset pace interests")
    }

    // Get the updated pace interests to return
    const queryResult = await context.env.DB.prepare(
      `SELECT pace_group as pace, count FROM pace_interests WHERE event_id = ? ORDER BY pace_group`,
    )
      .bind(eventId)
      .all()

    const paceInterests = queryResult.results || []
    const changesCount = resetResult.meta?.changes || 0

    return new Response(
      JSON.stringify({
        success: true,
        message: `Reset ${changesCount} pace group counts`,
        paceInterests,
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
    console.error("[v0] Error resetting pace interests:", error)
    return new Response(JSON.stringify({ error: "Failed to reset pace interests" }), {
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
