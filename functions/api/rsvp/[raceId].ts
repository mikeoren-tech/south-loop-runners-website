// Cloudflare Pages Function for race RSVPs
// Handles GET, POST, DELETE for /api/rsvp/:raceId using D1

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
}

export async function onRequestGet(context: any) {
  const { raceId } = context.params

  if (!raceId) {
    return new Response(JSON.stringify({ error: "Race ID is required" }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, name, rsvp_type as type, created_at as timestamp FROM race_rsvps WHERE event_id = ? ORDER BY created_at ASC`,
    )
      .bind(raceId)
      .all()

    // Map to the Attendee shape the frontend expects: { id, name, type, timestamp }
    const attendees = (results || []).map((row: any) => ({
      id: String(row.id),
      name: row.name,
      type: row.type || "racing",
      timestamp: new Date(row.timestamp).getTime(),
    }))

    return new Response(JSON.stringify(attendees), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching RSVPs:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}

export async function onRequestPost(context: any) {
  const { raceId } = context.params

  if (!raceId) {
    return new Response(JSON.stringify({ error: "Race ID is required" }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  try {
    const body = await context.request.json()

    // Frontend sends { id, name, type, timestamp }
    const name = body.name?.trim()
    const rsvpType = body.type || "racing"

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    await context.env.DB.prepare(
      `INSERT INTO race_rsvps (event_id, name, rsvp_type) VALUES (?, ?, ?)`,
    )
      .bind(raceId, name.slice(0, 50), rsvpType)
      .run()

    // Return the full updated list
    const { results } = await context.env.DB.prepare(
      `SELECT id, name, rsvp_type as type, created_at as timestamp FROM race_rsvps WHERE event_id = ? ORDER BY created_at ASC`,
    )
      .bind(raceId)
      .all()

    const attendees = (results || []).map((row: any) => ({
      id: String(row.id),
      name: row.name,
      type: row.type || "racing",
      timestamp: new Date(row.timestamp).getTime(),
    }))

    return new Response(JSON.stringify(attendees), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error("Error adding RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to add RSVP" }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}

export async function onRequestDelete(context: any) {
  const { raceId } = context.params

  if (!raceId) {
    return new Response(JSON.stringify({ error: "Race ID is required" }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  try {
    // Support both body { id } and query param ?attendeeId=
    let attendeeId: string | null = null

    const url = new URL(context.request.url)
    attendeeId = url.searchParams.get("attendeeId")

    if (!attendeeId) {
      try {
        const body = await context.request.json()
        attendeeId = body.id
      } catch {
        // No body provided
      }
    }

    if (!attendeeId) {
      return new Response(JSON.stringify({ error: "Attendee ID is required" }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    await context.env.DB.prepare(
      `DELETE FROM race_rsvps WHERE id = ? AND event_id = ?`,
    )
      .bind(attendeeId, raceId)
      .run()

    // Return updated list
    const { results } = await context.env.DB.prepare(
      `SELECT id, name, rsvp_type as type, created_at as timestamp FROM race_rsvps WHERE event_id = ? ORDER BY created_at ASC`,
    )
      .bind(raceId)
      .all()

    const attendees = (results || []).map((row: any) => ({
      id: String(row.id),
      name: row.name,
      type: row.type || "racing",
      timestamp: new Date(row.timestamp).getTime(),
    }))

    return new Response(JSON.stringify(attendees), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error("Error removing RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to remove RSVP" }), {
      status: 500,
      headers: corsHeaders,
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
