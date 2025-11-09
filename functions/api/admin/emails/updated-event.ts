import { Resend } from "resend";
import { getUpdatedEventEmailTemplate } from "@/lib/email-templates";

export async function onRequestPost(context: any) {
  const { DB, RESEND_API_KEY, RESEND_AUDIENCE_ID } = context.env;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error("Email service bindings (KEY or AUDIENCE_ID) are missing.");
    return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500 });
  }
  if (!DB) {
    console.error("Database (DB) binding is missing.");
    return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
  }

  try {
    const { eventId } = await context.request.json();
    const event = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(eventId).first();

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
    }

    const { subject, html } = getUpdatedEventEmailTemplate(event);
    const finalHtml = `${html}<br><p><a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p>`;

    const resend = new Resend(RESEND_API_KEY);

    // STEP 1: Create the Broadcast
    const { data: createData, error: createError } = await resend.broadcasts.create({
      segmentId: RESEND_AUDIENCE_ID,
      from: "South Loop Runners <updates@updates.southlooprunners.com>",
      subject: subject,
      html: finalHtml,
    });

    if (createError) {
      console.error("[v0] Error creating broadcast:", createError);
      return new Response(JSON.stringify({ error: "Failed to create broadcast", resendError: createError }), { status: 500 });
    }

    const broadcastId = createData.id;

    // STEP 2: Schedule to send immediately
    const { data: sendData, error: sendError } = await resend.broadcasts.send(
      broadcastId,
      { scheduledAt: 'in 1 min' }
    );

    if (sendError) {
      console.error("[v0] Error sending broadcast:", sendError);
      return new Response(JSON.stringify({ error: "Failed to send broadcast", resendError: sendError }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      broadcastId: broadcastId,
      status: "Sending now"
    }), { status: 200 });

  } catch (error: any) {
    console.error("[v0] Unhandled error in updated-event function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
