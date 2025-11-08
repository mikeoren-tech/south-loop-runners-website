import { Resend } from "resend"
import { getCanceledEventEmailTemplate } from "@/lib/email-templates"

export async function onRequestPost(context: any) {
  const resendApiKey = context.env.RESEND_API_KEY
  const audienceId = context.env.RESEND_AUDIENCE_ID

  if (!resendApiKey || !audienceId) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { event } = await context.request.json()

    if (!event) {
      return new Response(JSON.stringify({ error: "Event data not provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Generate email template
    const { subject, html } = getCanceledEventEmailTemplate(event)

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
    console.error("[v0] Error in canceled-event email:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
