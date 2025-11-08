import { Resend } from "resend"
import { getNewEventEmailTemplate } from "@/lib/email-templates"

export async function onRequestPost(context: any) {
  const { DB } = context.env
  const resendApiKey = context.env.RESEND_API_KEY
  const audienceId = context.env.RESEND_AUDIENCE_ID

  if (!resendApiKey || !audienceId) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { eventId } = await context.request.json()

    // Fetch event details
    const event = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(eventId).first()

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Generate email template
    const { subject, html } = getNewEventEmailTemplate(event)

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Send email to audience
    const { data, error } = await resend.emails.send({
      from: "South Loop Runners <events@southlooprunners.com>",
      to: [`audience:${audienceId}`],
      subject,
      html,
    })

    if (error) {
      console.error("[v0] Error sending email:", error)
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error in new-event email:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
