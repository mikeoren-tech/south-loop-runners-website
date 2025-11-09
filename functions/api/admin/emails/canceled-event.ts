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
    const resend = new Resend(RESEND_API_KEY);

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

    const emailList = contacts.map(contact => contact.email);

    const { data, error } = await resend.emails.send({
      from: "South Loop Runners <updateds@updates.southlooprunners.com>",
      to: "South Loop Runners <updates@updates.southlooprunners.com>",
      bcc: emailList,
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
    console.error("[v0] Error in canceled-event email:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
