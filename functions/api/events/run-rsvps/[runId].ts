import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; params: { runId: string } }) {
  try {
    const { runId } = context.params

    if (!context.env.DB) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const queryResult = await context.env.DB.prepare(
      `SELECT id, name, pace, created_at FROM run_rsvps WHERE event_id = ? ORDER BY created_at ASC`,
    )
      .bind(runId)
      .all()

    const rsvps = queryResult.results || []

    return new Response(JSON.stringify(rsvps), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching run RSVPs:", error)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}

export async function onRequestPost(context: { env: Env; params: { runId: string }; request: Request }) {
  try {
    const { runId } = context.params

    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    const body = await context.request.json()
    const { name, pace } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    // Sanitize name input (first name + last initial, max 50 chars)
    const sanitizedName = name.trim().slice(0, 50)

    await context.env.DB.prepare(
      `INSERT INTO run_rsvps (event_id, name, pace) VALUES (?, ?, ?)`,
    )
      .bind(runId, sanitizedName, pace || null)
      .run()

    // Return updated list
    const queryResult = await context.env.DB.prepare(
      `SELECT id, name, pace, created_at FROM run_rsvps WHERE event_id = ? ORDER BY created_at ASC`,
    )
      .bind(runId)
      .all()

    return new Response(JSON.stringify(queryResult.results || []), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[v0] Error adding run RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to add RSVP" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
