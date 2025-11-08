import type { PagesFunction } from "worktop"
import type { Env } from "./env" // Assuming Env is declared in a separate file named env.ts

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { DB } = context.env
  const { id } = context.params

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

    // Update event in database
    await DB.prepare(`
      UPDATE events SET
        title = ?,
        description = ?,
        type = ?,
        is_recurring = ?,
        date = ?,
        time = ?,
        day_of_week = ?,
        location = ?,
        distance = ?,
        pace = ?,
        facebook_link = ?,
        strava_link = ?,
        registration_url = ?,
        display_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
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
        id,
      )
      .run()

    // If sendEmail is true, trigger email notification
    if (sendEmail) {
      await fetch(`${new URL(context.request.url).origin}/api/admin/emails/updated-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error updating event:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to update event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { DB } = context.env
  const { id } = context.params

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    // Get event details before deletion for email
    const event = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first()

    // Delete event from database
    await DB.prepare("DELETE FROM events WHERE id = ?").bind(id).run()

    // Send cancellation email
    if (event) {
      await fetch(`${new URL(context.request.url).origin}/api/admin/emails/canceled-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event }),
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error deleting event:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to delete event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
