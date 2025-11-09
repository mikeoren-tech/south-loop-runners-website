import { Resend } from "resend";
import { getNewEventEmailTemplate } from "@/lib/email-templates";

export async function onRequestPost(context) {
  const { DB, RESEND_API_KEY, RESEND_AUDIENCE_ID } = context.env;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error("Email service bindings (KEY or AUDIENCE_ID) are missing.");
    return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500 });
  }

  try {
    const { eventId } = await context.request.json();
    const event = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(eventId).first();

    if (!event) {
      console.warn(`Event not found for ID: ${eventId}`);
      return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
    }

    const { subject, html } = getNewEventEmailTemplate(event);

    const resend = new Resend(RESEND_API_KEY);

    const { data: audienceData, error: audienceError } = await resend.contacts.list({
      audienceId: RESEND_AUDIENCE_ID,
    });

    if (audienceError) {
      console.error("Error fetching Resend audience:", audienceError.message);
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
      console.error("Error sending email via Resend:", error);
      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, emailId: data?.id }), { status: 200 });

  } catch (error) {
    // This will catch any errors (like the ReferenceError)
    console.error("[v0] Unhandled error in new-event email:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
