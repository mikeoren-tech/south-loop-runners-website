import { Resend } from "resend";
import { getNewEventEmailTemplate } from "@/lib/email-templates";

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

    const { subject, html } = getNewEventEmailTemplate(event);
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

    // STEP 2: Schedule for 9 AM Chicago Time
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const str = tomorrow.toLocaleString("en-US", { timeZone: "America/Chicago", timeZoneName: "short" });
    const isCDT = str.includes("CDT"); // Check for Daylight Saving
    const targetUTCHour = isCDT ? 14 : 15; // 9AM CDT is 14:00 UTC; 9AM CST is 15:00 UTC

    const scheduledDate = new Date(tomorrow);
    scheduledDate.setUTCHours(targetUTCHour, 0, 0, 0);
    
    const { data: sendData, error: sendError } = await resend.broadcasts.send(
      broadcastId,
      { scheduledAt: scheduledDate.toISOString() }
    );

    if (sendError) {
      console.error("[v0] Error sending broadcast:", sendError);
      return new Response(JSON.stringify({ error: "Failed to schedule broadcast", resendError: sendError }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      broadcastId: broadcastId,
      status: `Scheduled for ${scheduledDate.toISOString()}`
    }), { status: 200 });

  } catch (error: any) {
    console.error("[v0] Unhandled error in new-event function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
