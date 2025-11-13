import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { eventName, eventType, eventDate, eventDetails, isNew } = await request.json()

    const subject = isNew ? `🏃 New ${eventType}: ${eventName}` : `📅 Updated Event: ${eventName}`

    // Send email to all subscribers in the audience
    const result = await resend.emails.send({
      from: "South Loop Runners <events@southlooprunners.com>",
      to: [`audience:${process.env.RESEND_AUDIENCE_ID}`],
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${isNew ? "🏃 New Event!" : "📅 Event Updated"}</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #dc2626; margin-top: 0;">${eventName}</h2>
              <p style="font-size: 16px; color: #6b7280; margin: 10px 0;"><strong>Type:</strong> ${eventType}</p>
              <p style="font-size: 16px; color: #6b7280; margin: 10px 0;"><strong>Date:</strong> ${eventDate}</p>
              
              ${
                eventDetails
                  ? `<div style="margin: 20px 0; padding: 15px; background: white; border-radius: 8px;">
                <p style="margin: 0;">${eventDetails}</p>
              </div>`
                  : ""
              }
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://southlooprunners.com/calendar" 
                   style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Full Calendar
                </a>
              </div>
              
              <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; text-align: center;">
                You're receiving this because you subscribed to South Loop Runners event notifications.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, messageId: result.data?.id })
  } catch (error) {
    console.error("[v0] Notification send error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
