import type { D1Database } from "@cloudflare/workers-types"
import type { PagesFunction } from "@cloudflare/workers-types"

export interface Env {
  DB: D1Database
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context

  // Verify this is being called by Cloudflare Cron or has proper auth
  const authHeader = context.request.headers.get("X-Cloudflare-Cron")

  try {
    if (!env.DB) {
      console.error("[v0] DB binding not available")
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the current day of week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date()
    const dayOfWeek = today.getDay()

    console.log(`[v0] Running pace reset check for day ${dayOfWeek}`)

    // Determine which events to reset based on today being the day after the run
    // Thursday run (day 4) -> Reset on Friday (day 5)
    // Saturday run (day 6) -> Reset on Sunday (day 0)
    // Sunday run (day 0) -> Reset on Monday (day 1)

    let eventDaysToReset: number[] = []

    if (dayOfWeek === 5) {
      // Friday - reset Thursday runs
      eventDaysToReset = [4]
    } else if (dayOfWeek === 0) {
      // Sunday - reset Saturday runs
      eventDaysToReset = [6]
    } else if (dayOfWeek === 1) {
      // Monday - reset Sunday runs
      eventDaysToReset = [0]
    }

    if (eventDaysToReset.length === 0) {
      console.log("[v0] No events to reset today")
      return new Response(
        JSON.stringify({
          message: "No resets needed today",
          day: dayOfWeek,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Get events that need to be reset
    const eventsQuery = await env.DB.prepare(
      `SELECT id, title, day_of_week FROM events WHERE day_of_week IN (${eventDaysToReset.join(",")})`,
    ).all()

    if (!eventsQuery.results || eventsQuery.results.length === 0) {
      console.log("[v0] No events found for reset")
      return new Response(
        JSON.stringify({
          message: "No events found",
          day: dayOfWeek,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const resetResults = []

    // Reset pace interests for each event
    for (const event of eventsQuery.results) {
      const eventId = event.id as string
      const eventTitle = event.title as string

      console.log(`[v0] Resetting pace interests for event: ${eventTitle} (${eventId})`)

      // Reset all pace interest counts for this event
      const resetQuery = await env.DB.prepare(
        `UPDATE pace_interests 
         SET count = 0, 
             last_reset = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE event_id = ?`,
      )
        .bind(eventId)
        .run()

      resetResults.push({
        eventId,
        eventTitle,
        rowsAffected: resetQuery.meta.changes,
      })

      console.log(`[v0] Reset ${resetQuery.meta.changes} pace groups for ${eventTitle}`)
    }

    return new Response(
      JSON.stringify({
        message: "Pace interests reset successfully",
        day: dayOfWeek,
        results: resetResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("[v0] Error in pace reset:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to reset pace interests",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
