// Email notification utilities using Resend
import { Resend } from "resend"
import type { Event } from "./db"

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Format date for display in Chicago timezone
function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

// Generate email template for event created
function createEventCreatedTemplate(event: Event): EmailTemplate {
  const eventDate = formatEventDate(event.start_datetime)
  const eventTypeLabel = event.event_type === "weekly_run" ? "Weekly Run" : "Race"

  return {
    subject: `New ${eventTypeLabel}: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #b4def7; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .event-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #1e3a8a; }
          .button { display: inline-block; background-color: #b4def7; color: #1e3a8a; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏃 South Loop Runners</h1>
          </div>
          <div class="content">
            <h2>New ${eventTypeLabel} Added!</h2>
            <p>We've just added a new ${eventTypeLabel.toLowerCase()} to our calendar:</p>
            
            <div class="event-details">
              <h3>${event.title}</h3>
              ${event.description ? `<p>${event.description}</p>` : ""}
              
              <div class="detail-row">
                <span class="label">📅 When:</span> ${eventDate}
              </div>
              
              <div class="detail-row">
                <span class="label">📍 Location:</span> ${event.location}
              </div>
              
              ${
                event.meeting_point
                  ? `
                <div class="detail-row">
                  <span class="label">🎯 Meeting Point:</span> ${event.meeting_point}
                </div>
              `
                  : ""
              }
              
              ${
                event.distance
                  ? `
                <div class="detail-row">
                  <span class="label">🏁 Distance:</span> ${event.distance}
                </div>
              `
                  : ""
              }
              
              ${
                event.pace
                  ? `
                <div class="detail-row">
                  <span class="label">⏱️ Pace:</span> ${event.pace}
                </div>
              `
                  : ""
              }
              
              ${
                event.registration_url
                  ? `
                <a href="${event.registration_url}" class="button">Register Now</a>
              `
                  : ""
              }
            </div>
            
            <p>See you on the trail! 👟</p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you're subscribed to South Loop Runners event notifications.</p>
            <p><a href="#">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New ${eventTypeLabel}: ${event.title}

${event.description || ""}

When: ${eventDate}
Location: ${event.location}
${event.meeting_point ? `Meeting Point: ${event.meeting_point}` : ""}
${event.distance ? `Distance: ${event.distance}` : ""}
${event.pace ? `Pace: ${event.pace}` : ""}
${event.registration_url ? `Register: ${event.registration_url}` : ""}

See you on the trail!

---
South Loop Runners
You're receiving this email because you're subscribed to event notifications.
    `.trim(),
  }
}

// Generate email template for event updated
function createEventUpdatedTemplate(event: Event): EmailTemplate {
  const eventDate = formatEventDate(event.start_datetime)
  const eventTypeLabel = event.event_type === "weekly_run" ? "Weekly Run" : "Race"

  return {
    subject: `Updated ${eventTypeLabel}: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #b4def7; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .event-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #1e3a8a; }
          .alert { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
          .button { display: inline-block; background-color: #b4def7; color: #1e3a8a; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏃 South Loop Runners</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>⚠️ Event Update</strong><br>
              This ${eventTypeLabel.toLowerCase()} has been updated with new information.
            </div>
            
            <h2>${event.title}</h2>
            
            <div class="event-details">
              ${event.description ? `<p>${event.description}</p>` : ""}
              
              <div class="detail-row">
                <span class="label">📅 When:</span> ${eventDate}
              </div>
              
              <div class="detail-row">
                <span class="label">📍 Location:</span> ${event.location}
              </div>
              
              ${
                event.meeting_point
                  ? `
                <div class="detail-row">
                  <span class="label">🎯 Meeting Point:</span> ${event.meeting_point}
                </div>
              `
                  : ""
              }
              
              ${
                event.distance
                  ? `
                <div class="detail-row">
                  <span class="label">🏁 Distance:</span> ${event.distance}
                </div>
              `
                  : ""
              }
              
              ${
                event.pace
                  ? `
                <div class="detail-row">
                  <span class="label">⏱️ Pace:</span> ${event.pace}
                </div>
              `
                  : ""
              }
              
              ${
                event.registration_url
                  ? `
                <a href="${event.registration_url}" class="button">View Details</a>
              `
                  : ""
              }
            </div>
            
            <p>Please take note of the updated details!</p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you're subscribed to South Loop Runners event notifications.</p>
            <p><a href="#">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
EVENT UPDATE: ${event.title}

This ${eventTypeLabel.toLowerCase()} has been updated with new information.

${event.description || ""}

When: ${eventDate}
Location: ${event.location}
${event.meeting_point ? `Meeting Point: ${event.meeting_point}` : ""}
${event.distance ? `Distance: ${event.distance}` : ""}
${event.pace ? `Pace: ${event.pace}` : ""}
${event.registration_url ? `View Details: ${event.registration_url}` : ""}

Please take note of the updated details!

---
South Loop Runners
You're receiving this email because you're subscribed to event notifications.
    `.trim(),
  }
}

// Generate email template for event deleted
function createEventDeletedTemplate(event: Event): EmailTemplate {
  const eventDate = formatEventDate(event.start_datetime)
  const eventTypeLabel = event.event_type === "weekly_run" ? "Weekly Run" : "Race"

  return {
    subject: `Cancelled: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #b4def7; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .alert { background-color: #fee2e2; padding: 15px; border-left: 4px solid #d92a31; margin: 15px 0; }
          .event-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #1e3a8a; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏃 South Loop Runners</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>🚫 Event Cancelled</strong><br>
              The following ${eventTypeLabel.toLowerCase()} has been cancelled.
            </div>
            
            <h2>${event.title}</h2>
            
            <div class="event-details">
              <div class="detail-row">
                <span class="label">📅 Originally Scheduled:</span> ${eventDate}
              </div>
              
              <div class="detail-row">
                <span class="label">📍 Location:</span> ${event.location}
              </div>
            </div>
            
            <p>We apologize for any inconvenience. Check our calendar for other upcoming events!</p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you're subscribed to South Loop Runners event notifications.</p>
            <p><a href="#">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
EVENT CANCELLED: ${event.title}

The following ${eventTypeLabel.toLowerCase()} has been cancelled.

Originally Scheduled: ${eventDate}
Location: ${event.location}

We apologize for any inconvenience. Check our calendar for other upcoming events!

---
South Loop Runners
You're receiving this email because you're subscribed to event notifications.
    `.trim(),
  }
}

// Send email notification
export async function sendEventNotification(
  recipients: string[],
  event: Event,
  notificationType: "created" | "updated" | "deleted",
): Promise<{ success: boolean; count: number }> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[v0] RESEND_API_KEY not configured")
    return { success: false, count: 0 }
  }

  let template: EmailTemplate

  switch (notificationType) {
    case "created":
      template = createEventCreatedTemplate(event)
      break
    case "updated":
      template = createEventUpdatedTemplate(event)
      break
    case "deleted":
      template = createEventDeletedTemplate(event)
      break
  }

  try {
    // Send email to all recipients
    const { data, error } = await resend.emails.send({
      from: "South Loop Runners <events@southlooprunners.com>",
      to: recipients,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error("[v0] Error sending email:", error)
      return { success: false, count: 0 }
    }

    console.log("[v0] Email sent successfully:", data)
    return { success: true, count: recipients.length }
  } catch (error) {
    console.error("[v0] Exception sending email:", error)
    return { success: false, count: 0 }
  }
}

// Add subscriber to Resend audience
export async function addToResendAudience(email: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error("[v0] Resend not fully configured")
    return false
  }

  try {
    const { data, error } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    if (error) {
      console.error("[v0] Error adding to audience:", error)
      return false
    }

    console.log("[v0] Added to audience:", data)
    return true
  } catch (error) {
    console.error("[v0] Exception adding to audience:", error)
    return false
  }
}
