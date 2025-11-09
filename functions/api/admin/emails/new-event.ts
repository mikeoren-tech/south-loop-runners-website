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

    const { data: audienceData, error: audienceError } = await resend.contacts.list({
      audienceId: RESEND_AUDIENCE_ID,
    });

    if (audienceError) {
      throw new Error(`Failed to fetch Resend audience: ${audienceError.message}`);
    }

    const contacts = audienceData?.data;
    if (!contacts || contacts.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No contacts to email." }), { status: 200 });
    }

    // 2. Get the actual email addresses
    const emailList = contacts.map(contact => contact.email);

    // 3. Send the email
    const { data, error } = await resend.emails.send({
      from: "South Loop Runners <events@southlooprunners.com>",
      to: "events@southlooprunners.com", // Send to yourself
      bcc: emailList, // Put your 2 subscribers (and future 1500) here
      subject,
      html,
    });

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
