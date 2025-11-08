import type { PagesFunction } from "worktop"
import type { Env } from "../../env"

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { DB } = context.env

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = await context.request.json()
    const {
      title,
      description,
      type,
      is_recurring,
      date,
      time,
      day_of_week,
      location,
      distance,
      pace,
      facebook_link,
      strava_link,
      registration_url,
      display_order,
      sendEmail,
    } = body

    // Generate ID from title
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    // Insert event into database
    await DB.prepare(`
      INSERT INTO events (
        id, title, description, type, is_recurring, date, time,
        day_of_week, location, distance, pace, facebook_link,
        strava_link, registration_url, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        id,
        title,
        description || null,
        type,
        is_recurring ? 1 : 0,
        date || null,
        time || null,
        day_of_week ? Number.parseInt(day_of_week) : null,
        location || null,
        distance || null,
        pace || null,
        facebook_link || null,
        strava_link || null,
        registration_url || null,
        display_order ? Number.parseInt(display_order) : null,
      )
      .run()

    // If sendEmail is true, trigger email notification
    if (sendEmail) {
      // Call email API to send new event notification
      await fetch(`${new URL(context.request.url).origin}/api/admin/emails/new-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      })
    }

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error creating event:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to create event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
