import type { KVNamespace } from "@cloudflare/workers-types"

interface Env {
  RACE_RSVPS: KVNamespace
}

interface PaceInterest {
  pace: string
  timestamp: number
}

export async function onRequestGet(context: { env: Env; params: { runId: string } }) {
  try {
    const { runId } = context.params
    const key = `run-interest:${runId}`
    const data = await context.env.RACE_RSVPS.get(key)

    const interests: PaceInterest[] = data ? JSON.parse(data) : []

    return new Response(JSON.stringify(interests), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching run interest:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch run interest" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
      })
    }

    const key = `run-interest:${runId}`
    const data = await context.env.RACE_RSVPS.get(key)
    const interests: PaceInterest[] = data ? JSON.parse(data) : []

    // Add new interest
    interests.push({
      pace,
      timestamp: Date.now(),
    })

    await context.env.RACE_RSVPS.put(key, JSON.stringify(interests))

    return new Response(JSON.stringify(interests), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error adding run interest:", error)
    return new Response(JSON.stringify({ error: "Failed to add run interest" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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
