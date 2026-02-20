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
    console.log("[v0] Creating new event:", body)

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
      max_rsvp_limit,
      image_url,
      sendEmail,
    } = body

    // Generate ID from title
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    await DB.prepare(`
      INSERT INTO events (
        id, title, description, type, is_recurring, has_post_run_social, collect_rsvp_names, max_rsvp_limit, date, time,
        day_of_week, location, distance, pace, facebook_link,
        strava_link, registration_url, display_order, route_map_iframe, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        id,
        title,
        description || null,
        type,
        is_recurring ? 1 : 0,
        has_post_run_social ? 1 : 0,
        collect_rsvp_names ? 1 : 0,
        max_rsvp_limit ? Number.parseInt(max_rsvp_limit) : null,
        date || null,
        time || "",
        day_of_week ? Number.parseInt(day_of_week) : null,
        location || null,
        distance || null,
        pace || null,
        facebook_link || null,
        strava_link || null,
        registration_url || null,
        display_order ? Number.parseInt(display_order) : null,
        route_map_iframe || null,
        image_url || null,
      )
      .run()

    console.log("[v0] Event created successfully with ID:", id)

    // If sendEmail is true, trigger email notification
    if (sendEmail) {
      console.log("[v0] Attempting to send new event email...")
      const emailUrl = `${new URL(context.request.url).origin}/api/admin/emails/new-event`
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

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error creating event:", error)
    console.error("[v0] Error stack:", error.stack)
    return new Response(JSON.stringify({ error: error.message || "Failed to create event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
