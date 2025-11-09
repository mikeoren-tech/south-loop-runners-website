import { Resend } from "resend"
import { getUpdatedEventEmailTemplate } from "@/lib/email-templates"

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

    // 1. Fetch the list of contacts from your audience
    const { data: audienceData, error: audienceError } = await resend.contacts.list({
      audienceId: audienceId,
    })

    if (audienceError) {
      console.error("Error fetching Resend audience:", audienceError)
      return new Response(JSON.stringify({ error: "Failed to fetch audience" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // The contacts are nested in a 'data' property
    const contacts = audienceData?.data

    if (!contacts || contacts.length === 0) {
      // Nothing to do, but not an "error"
      return new Response(JSON.stringify({ success: true, message: "No contacts in audience to email." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // 2. Get the list of email addresses
    const emailList = contacts.map(contact => contact.email)

    // 3. Send email using BCC to protect privacy
    const { data, error } = await resend.emails.send({
      from: "South Loop Runners <events@southlooprunners.com>",
      to: "events@southlooprunners.com", 
      // Use BCC for the audience list
      bcc: emailList, 
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
    console.error("[v0] Error in updated-event email:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
