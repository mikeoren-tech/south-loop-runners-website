import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  try {
    // Fetch events that are featured on homepage, ordered by display_order
    const query = `
      SELECT 
        id, title, description, date, time, location, 
        type, is_recurring, day_of_week, is_featured_homepage, 
        display_order, created_at, updated_at
      FROM events 
      WHERE deleted_at IS NULL 
      AND is_featured_homepage = 1
      ORDER BY display_order ASC, created_at ASC
    `

    const { results } = await context.env.DB.prepare(query).all()

    console.log("[v0] Featured events fetched:", results?.length || 0)
    console.log(
      "[v0] Display orders:",
      results?.map((r: any) => ({ id: r.id, order: r.display_order })),
    )

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=10, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching featured events:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to fetch featured events",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      },
    )
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
