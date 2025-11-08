import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; params: { runId: string } }) {
  try {
    const { runId } = context.params

    if (!context.env.DB) {
      console.error("[v0] DB binding not found")
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    let results
    try {
      const queryResult = await context.env.DB.prepare(
        `SELECT pace, count FROM pace_interests WHERE event_id = ? ORDER BY pace`,
      )
        .bind(runId)
        .all()
      results = queryResult.results
    } catch (dbError) {
      console.error("[v0] DB query error:", dbError)
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const paceInterests = Array.isArray(results) ? results : []

    return new Response(JSON.stringify(paceInterests), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[v0] Error in pace interests endpoint:", error)
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
    const body = await context.request.json()
    const { pace } = body

    if (!pace) {
      return new Response(JSON.stringify({ error: "Pace is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    // Increment the count for this pace
    await context.env.DB.prepare(
      `UPDATE pace_interests SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE event_id = ? AND pace = ?`,
    )
      .bind(runId, pace)
      .run()

    // Fetch updated results
    const { results } = await context.env.DB.prepare(
      `SELECT pace, count FROM pace_interests WHERE event_id = ? ORDER BY pace`,
    )
      .bind(runId)
      .all()

    return new Response(JSON.stringify(results || []), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[v0] Error adding pace interest:", error)
    return new Response(JSON.stringify({ error: "Failed to add pace interest" }), {
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
