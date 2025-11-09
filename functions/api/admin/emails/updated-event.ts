import { Resend } from "resend";
import { getUpdatedEventEmailTemplate } from "@/lib/email-templates";

export async function onRequestPost(context: any) {
  const { DB, RESEND_API_KEY, RESEND_AUDIENCE_ID } = context.env;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error("Email service bindings (KEY or AUDIENCE_ID) are missing.");
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!DB) {
    console.error("Database (DB) binding is missing.");
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { eventId } = await context.request.json();

    const event = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(eventId).first();

    if (!event) {
      console.warn(`Event not found for ID: ${eventId}`);
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { subject, html } = getUpdatedEventEmailTemplate(event);

    // ⬇️ FIX 1: Use the correct variable name (RESEND_API_KEY)
    const resend = new Resend(RESEND_API_KEY);

    const { data: audienceData, error: audienceError } = await resend.contacts.list({
      audienceId: RESEND_AUDIENCE_ID,
    });

    if (audienceError) {
      console.error("Error fetching Resend audience:", audienceError);
      return new Response(JSON.stringify({ error: "Failed to fetch audience" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contacts = audienceData?.data;
    if (!contacts || contacts.length === 0) {
      console.log("No contacts in audience to email. Exiting gracefully.");
      return new Response(JSON.stringify({ success: true, message: "No contacts in audience to email." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const emailList = contacts.map(contact => contact.email);

    const { data, error } = await resend.emails.send({
      from: "South Loop Runners <updates@updates.southlooprunners.com>",
      to: "South Loop Runners <updates@updates.southlooprunners.com>",
      bcc: emailList,
      subject,
      html,
    });

    if (error) {
      console.error("[v0] Error sending email:", error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ⬇️ FIX 2: Added all the missing code from here to the end
    return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    console.error("[v0] Error in updated-event email:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
