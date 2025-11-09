import { Resend } from "resend";
// Make sure to get your email template function
import { getNewEventEmailTemplate } from "@/lib/email-templates"; 

export async function onRequestPost(context: any) {
  const { DB, RESEND_API_KEY, RESEND_AUDIENCE_ID } = context.env;

    // 1. Check bindings
      if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
          console.error("Email service bindings (KEY or AUDIENCE_ID) are missing.");
              return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500 });
                }
                  if (!DB) {
                      console.error("Database (DB) binding is missing.");
                          return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
                            }

                              try {
                                  // 2. Get event data (you still need this for the template)
                                      const { eventId } = await context.request.json();
                                          const event = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(eventId).first();

                                              if (!event) {
                                                    console.warn(`Event not found for ID: ${eventId}`);
                                                          return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
                                                              }

                                                                  // 3. Get the template
                                                                      const { subject, html } = getNewEventEmailTemplate(event);

                                                                          // 4. CRITICAL: Add the required unsubscribe link
                                                                              // Resend *requires* this for broadcasts.
                                                                                  const finalHtml = `${html}<br><p>To unsubscribe, <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">click here</a>.</p>`;

                                                                                      // 5. Initialize Resend
                                                                                          const resend = new Resend(RESEND_API_KEY);

                                                                                              // 6. Make the SINGLE Broadcast API call
                                                                                                  const { data, error } = await resend.broadcasts.create({
                                                                                                        segmentId: RESEND_AUDIENCE_ID, // Use the ID from your env
                                                                                                              from: "South Loop Runners <updates@updates.southlooprunners.com>", // Your verified domain
                                                                                                                    subject: subject,
                                                                                                                          html: finalHtml, // Use the template with the unsubscribe link
                                                                                                                              });

                                                                                                                                  if (error) {
                                                                                                                                        console.error("[v0] Error creating broadcast:", error);
                                                                                                                                              return new Response(JSON.stringify({ error: "Failed to create broadcast", resendError: error }), { status: 500 });
                                                                                                                                                  }

                                                                                                                                                      // 7. Respond immediately
                                                                                                                                                          return new Response(JSON.stringify({ success: true, broadcastId: data?.id, message: "Broadcast is sending." }), {
                                                                                                                                                                status: 200, 
                                                                                                                                                                    });

                                                                                                                                                                      } catch (error: any) {
                                                                                                                                                                          console.error("[v0] Unhandled error in broadcast function:", error.message);
                                                                                                                                                                              return new Response(JSON.stringify({ error: error.message }), { status: 500 });
                                                                                                                                                                                }
                                                                                                                                                                                }
