import type { PagesFunction } from "worktop"
import type { Env } from "./env" // Assuming Env is declared in a separate file named env.ts

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { DB } = context.env
  const { id } = context.params

  console.log("[v0] PATCH request received for event ID:", id)

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = await context.request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const {
      title,
      description,
      type,
      is_recurring,
      has_post_run_social,
      collect_rsvp_names,
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
      route_map_iframe,
      sendEmail,
    } = body

    console.log("[v0] Updating event with data:", {
      id,
      title,
      has_post_run_social,
      collect_rsvp_names,
      route_map_iframe,
      sendEmail,
    })

    const result = await DB.prepare(`
      UPDATE events SET
        title = ?,
        description = ?,
        type = ?,
        is_recurring = ?,
        has_post_run_social = ?,
        collect_rsvp_names = ?,
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
        route_map_iframe = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        title,
        description || null,
        type,
        is_recurring ? 1 : 0,
        has_post_run_social ? 1 : 0,
        collect_rsvp_names ? 1 : 0,
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
        route_map_iframe || null,
        id,
      )
      .run()

    console.log("[v0] Database update result:", result)
    console.log("[v0] Event updated successfully, changes:", result.meta.changes)

    const verifyEvent = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first()
    console.log("[v0] Verified event after update:", JSON.stringify(verifyEvent, null, 2))

    // If sendEmail is true, trigger email notification
    if (sendEmail) {
      console.log("[v0] Attempting to send email notification...")
      const emailUrl = `${new URL(context.request.url).origin}/api/admin/emails/updated-event`
      console.log("[v0] Email endpoint URL:", emailUrl)

      const emailResponse = await fetch(emailUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      })

      console.log("[v0] Email API response status:", emailResponse.status)
      const emailResult = await emailResponse.json()
      console.log("[v0] Email API response:", emailResult)

      if (!emailResponse.ok) {
        console.error("[v0] Email send failed:", emailResult)
      }
    } else {
      console.log("[v0] Email notification skipped (sendEmail = false)")
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error updating event:", error)
    console.error("[v0] Error stack:", error.stack)
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
