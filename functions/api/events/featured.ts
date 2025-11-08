import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  try {
    const query = `
      SELECT 
        id, title, description, date, time, location, 
        type, is_recurring, day_of_week, is_featured_homepage, 
        display_order, distance, pace, facebook_link, strava_link,
        has_post_run_social,
        created_at, updated_at
      FROM events 
      WHERE deleted_at IS NULL 
      AND is_featured_homepage = 1
      AND type IN ('weekly-run', 'special-event')
      ORDER BY display_order ASC, created_at ASC
    `

    const { results } = await context.env.DB.prepare(query).all()

        // Convert integer boolean fields to actual booleans
            const events = results?.map((event: any) => ({
                  ...event,
                        has_post_run_social: Boolean(event.has_post_run_social),
                              is_recurring: Boolean(event.is_recurring),
                                    is_featured_homepage: Boolean(event.is_featured_homepage),
                                        }))

    console.log("[v0] Featured events fetched (excluding races):", results?.length || 0)
    console.log(
      "[v0] Display orders:",
      results?.map((r: any) => ({ id: r.id, type: r.type, order: r.display_order })),
    )

return new Response(JSON.stringify(events), {
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
