import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  try {
    const url = new URL(context.request.url)
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")
    const type = url.searchParams.get("type")

    let query = `SELECT * FROM events WHERE deleted_at IS NULL`
    const params: string[] = []

    if (type) {
      query += ` AND type = ?`
      params.push(type)
    }

    if (startDate) {
      query += ` AND (date >= ? OR is_recurring = 1)`
      params.push(startDate)
    }

    if (endDate && !startDate) {
      query += ` AND date <= ?`
      params.push(endDate)
    }

    query += ` ORDER BY date ASC, day_of_week ASC`

    const stmt = context.env.DB.prepare(query)
    const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching events:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
