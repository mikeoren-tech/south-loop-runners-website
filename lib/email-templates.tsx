interface Event {
  id: string
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  distance?: string
  pace?: string
  type: string
  is_recurring: number
  day_of_week?: number
  facebook_link?: string
  strava_link?: string
  registration_url?: string
}

export function getNewEventEmailTemplate(event: Event) {
  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek]
  }

  const eventDate =
    event.is_recurring && event.day_of_week !== undefined
      ? `Every ${getDayName(event.day_of_week)}`
      : event.date
        ? new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "TBD"

  return {
    subject: `New Event: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; }
            .event-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; margin: 10px 0; }
            .detail-label { font-weight: 600; min-width: 100px; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 New Event Alert!</h1>
            </div>
            <div class="content">
              <h2 style="color: #667eea; margin-top: 0;">${event.title}</h2>
              ${event.description ? `<p>${event.description}</p>` : ""}
              
              <div class="event-details">
                <h3 style="margin-top: 0; color: #374151;">Event Details</h3>
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span>
                  <span>${eventDate}</span>
                </div>
                ${
                  event.time
                    ? `
                <div class="detail-row">
                  <span class="detail-label">🕐 Time:</span>
                  <span>${event.time}</span>
                </div>
                `
                    : ""
                }
                ${
                  event.location
                    ? `
                <div class="detail-row">
                  <span class="detail-label">📍 Location:</span>
                  <span>${event.location}</span>
                </div>
                `
                    : ""
                }
                ${
                  event.distance
                    ? `
                <div class="detail-row">
                  <span class="detail-label">📏 Distance:</span>
                  <span>${event.distance}</span>
                </div>
                `
                    : ""
                }
                ${
                  event.pace
                    ? `
                <div class="detail-row">
                  <span class="detail-label">⚡ Pace:</span>
                  <span>${event.pace}</span>
                </div>
                `
                    : ""
                }
              </div>

              <div style="text-align: center; margin: 30px 0;">
                ${event.facebook_link ? `<a href="${event.facebook_link}" class="cta-button">RSVP on Facebook</a>` : ""}
                ${event.strava_link ? `<a href="${event.strava_link}" class="cta-button">View on Strava</a>` : ""}
                ${event.registration_url ? `<a href="${event.registration_url}" class="cta-button">Register Now</a>` : ""}
              </div>

              <p>We can't wait to see you there! Mark your calendar and get ready for an amazing time with South Loop Runners.</p>
            </div>
            <div class="footer">
              <p>South Loop Runners | Chicago, IL</p>
              <p><a href="https://southlooprunners.com" style="color: #667eea;">Visit our website</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getUpdatedEventEmailTemplate(event: Event) {
  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek]
  }

  const eventDate =
    event.is_recurring && event.day_of_week !== undefined
      ? `Every ${getDayName(event.day_of_week)}`
      : event.date
        ? new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "TBD"

  return {
    subject: `Event Updated: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; }
            .event-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .detail-row { display: flex; margin: 10px 0; }
            .detail-label { font-weight: 600; min-width: 100px; }
            .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">📢 Event Update</h1>
            </div>
            <div class="content">
              <h2 style="color: #f59e0b; margin-top: 0;">${event.title}</h2>
              <p><strong>This event has been updated with new details.</strong></p>
              ${event.description ? `<p>${event.description}</p>` : ""}
              
              <div class="event-details">
                <h3 style="margin-top: 0; color: #92400e;">Updated Event Details</h3>
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span>
                  <span>${eventDate}</span>
                </div>
                ${
                  event.time
                    ? `
                <div class="detail-row">
                  <span class="detail-label">🕐 Time:</span>
                  <span>${event.time}</span>
                </div>
                `
                    : ""
                }
                ${
                  event.location
                    ? `
                <div class="detail-row">
                  <span class="detail-label">📍 Location:</span>
                  <span>${event.location}</span>
                </div>
                `
                    : ""
                }
                ${
                  event.distance
                    ? `
                <div class="detail-row">
                  <span class="detail-label">📏 Distance:</span>
                  <span>${event.distance}</span>
                </div>
                `
                    : ""
                }
                ${
                  event.pace
                    ? `
                <div class="detail-row">
                  <span class="detail-label">⚡ Pace:</span>
                  <span>${event.pace}</span>
                </div>
                `
                    : ""
                }
              </div>

              <div style="text-align: center; margin: 30px 0;">
                ${event.facebook_link ? `<a href="${event.facebook_link}" class="cta-button">View on Facebook</a>` : ""}
                ${event.strava_link ? `<a href="${event.strava_link}" class="cta-button">View on Strava</a>` : ""}
                ${event.registration_url ? `<a href="${event.registration_url}" class="cta-button">Register Now</a>` : ""}
              </div>

              <p>Please check the updated details and adjust your plans accordingly. We look forward to seeing you!</p>
            </div>
            <div class="footer">
              <p>South Loop Runners | Chicago, IL</p>
              <p><a href="https://southlooprunners.com" style="color: #f59e0b;">Visit our website</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function getCanceledEventEmailTemplate(event: Event) {
  return {
    subject: `Event Canceled: ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; }
            .event-details { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">❌ Event Canceled</h1>
            </div>
            <div class="content">
              <h2 style="color: #dc2626; margin-top: 0;">${event.title}</h2>
              <p><strong>We regret to inform you that this event has been canceled.</strong></p>
              
              <div class="event-details">
                <h3 style="margin-top: 0; color: #991b1b;">Canceled Event</h3>
                <p>The following event will no longer take place:</p>
                <p style="font-size: 18px; font-weight: 600; margin: 10px 0;">${event.title}</p>
                ${event.date ? `<p>Originally scheduled for: ${new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>` : ""}
              </div>

              <p>We apologize for any inconvenience this may cause. Please check our website or social media for upcoming events and alternative activities.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://southlooprunners.com" class="cta-button">View Other Events</a>
              </div>
            </div>
            <div class="footer">
              <p>South Loop Runners | Chicago, IL</p>
              <p><a href="https://southlooprunners.com" style="color: #667eea;">Visit our website</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
