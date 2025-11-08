import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; params: { runId: string } }) {
  console.log("[v0] GET pace-interests for runId:", context.params.runId)

  try {
    const { runId } = context.params

    if (!context.env.DB) {
      console.error("[v0] DB binding not found in GET")
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
      console.log("[v0] Querying pace_interests for event_id:", runId)
      const queryResult = await context.env.DB.prepare(
        `SELECT pace, count FROM pace_interests WHERE event_id = ? ORDER BY pace`,
      )
        .bind(runId)
        .all()
      results = queryResult.results
      console.log("[v0] Query results:", results)
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
    console.error("[v0] Error in pace interests GET endpoint:", error)
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
  console.log("[v0] POST pace-interests for runId:", context.params.runId)

  try {
    const { runId } = context.params

    if (!context.env.DB) {
      console.error("[v0] DB binding not found in POST")
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    const body = await context.request.json()
    const { pace } = body

    console.log("[v0] Adding pace interest:", pace, "for runId:", runId)

    if (!pace) {
      return new Response(JSON.stringify({ error: "Pace is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    try {
      await context.env.DB.prepare(
        `UPDATE pace_interests SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE event_id = ? AND pace = ?`,
      )
        .bind(runId, pace)
        .run()

      console.log("[v0] Successfully updated pace interest")
    } catch (updateError) {
      console.error("[v0] Error updating pace interest:", updateError)
      return new Response(JSON.stringify({ error: "Failed to update pace interest" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    let results
    try {
      const queryResult = await context.env.DB.prepare(
        `SELECT pace, count FROM pace_interests WHERE event_id = ? ORDER BY pace`,
      )
        .bind(runId)
        .all()
      results = queryResult.results || []
      console.log("[v0] Fetched updated results:", results)
    } catch (queryError) {
      console.error("[v0] Error fetching updated results:", queryError)
      return new Response(JSON.stringify({ error: "Failed to fetch updated results" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[v0] Error in pace interests POST endpoint:", error)
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
