import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestPost(context: { env: Env; params: { runId: string }; request: Request }) {
  try {
    const { runId } = context.params
    const body = await context.request.json()
    const { attending } = body

    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Increment or decrement the social count
    const change = attending ? 1 : -1
    await context.env.DB.prepare(
      `UPDATE events 
       SET post_run_social_count = MAX(0, post_run_social_count + ?),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
      .bind(change, runId)
      .run()

    // Get the updated count
    const result = await context.env.DB.prepare(`SELECT post_run_social_count FROM events WHERE id = ?`)
      .bind(runId)
      .first()

    return new Response(
      JSON.stringify({
        success: true,
        socialCount: result?.post_run_social_count || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error updating social RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to update social RSVP" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function onRequestGet(context: { env: Env; params: { runId: string } }) {
  try {
    const { runId } = context.params

    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const result = await context.env.DB.prepare(`SELECT post_run_social_count FROM events WHERE id = ?`)
      .bind(runId)
      .first()

    return new Response(
      JSON.stringify({
        socialCount: result?.post_run_social_count || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error fetching social RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch social RSVP" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
