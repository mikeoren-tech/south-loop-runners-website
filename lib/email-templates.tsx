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

// Shared utility functions
const getDayName = (dayOfWeek: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayOfWeek] || "Unknown"
}

const formatEventDate = (event: Event): string => {
  if (event.is_recurring && event.day_of_week !== undefined) {
    return `Every ${getDayName(event.day_of_week)}`
  }
  
  if (event.date) {
    try {
      return new Date(event.date).toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      })
    } catch (error) {
      console.error("Invalid date:", event.date)
      return "TBD"
    }
  }
  
  return "TBD"
}

const formatGoogleDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

const getICalDay = (dayOfWeek: number): string => {
  const iCalDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
  return iCalDays[dayOfWeek] || 'MO'
}

const generateGoogleCalendarUrl = (event: Event): string => {
  try {
    let startDate: Date
    
    if (event.is_recurring && event.day_of_week !== undefined) {
      // For recurring events, find the next occurrence of the day
      const today = new Date()
      const targetDay = event.day_of_week
      const currentDay = today.getDay()
      const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7
      
      startDate = new Date(today)
      startDate.setDate(today.getDate() + daysUntilTarget)
      startDate.setHours(0, 0, 0, 0)
    } else {
      startDate = event.date ? new Date(event.date) : new Date()
    }
    
    // If time is provided, try to parse it
    if (event.time) {
      const [hours, minutes] = event.time.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        startDate.setHours(hours, minutes, 0, 0)
      }
    }
    
    // Default to 1 hour duration
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.description || '',
      location: event.location || ''
    })
    
    // Add recurrence rule for recurring events
    if (event.is_recurring && event.day_of_week !== undefined) {
      const iCalDay = getICalDay(event.day_of_week)
      params.set('recur', `RRULE:FREQ=WEEKLY;BYDAY=${iCalDay}`)
    }
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  } catch (error) {
    console.error("Error generating calendar URL:", error)
    return ""
  }
}

// Shared CSS styles
const getEmailStyles = (): string => `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background-color: #f8f9fa;
  }
  .email-wrapper {
    background: #f8f9fa;
    padding: 20px;
  }
  .container { 
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  }
  .header { 
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #1a1a1a;
    padding: 40px 30px 30px;
    text-align: center;
  }
  .logo-image {
    max-width: 220px;
    width: 100%;
    height: auto;
    margin: 0 auto 25px;
    display: block;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.3;
    color: #1a1a1a;
  }
  .header-subtitle {
    font-size: 16px;
    color: #6b7280;
    margin-top: 8px;
  }
  .accent-bar {
    height: 3px;
    background: linear-gradient(90deg, #e74c3c 0%, #a8d8ea 100%);
  }
  .content { 
    padding: 40px 30px;
  }
  .event-title {
    color: #1a1a1a;
    font-size: 30px;
    font-weight: 800;
    margin: 0 0 15px 0;
    line-height: 1.2;
  }
  .event-description {
    color: #4a4a4a;
    font-size: 16px;
    margin-bottom: 30px;
    line-height: 1.8;
  }
  .alert {
    padding: 18px 20px;
    border-radius: 10px;
    margin: 25px 0;
    border: 2px solid;
    line-height: 1.5;
  }
  .alert strong {
    display: block;
    font-size: 17px;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .alert-warning {
    background-color: #fefce8;
    border-color: #fde68a;
    color: #854d0e;
  }
  .alert-danger {
    background-color: #fef2f2;
    border-color: #fecaca;
    color: #991b1b;
  }
  .details-card { 
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 28px;
    margin: 30px 0;
  }
  .details-title {
    color: #e74c3c;
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 20px 0;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  .detail-row { 
    display: flex;
    align-items: flex-start;
    margin: 12px 0;
    font-size: 15px;
  }
  .detail-icon {
    min-width: 30px;
    font-size: 18px;
  }
  .detail-label { 
    font-weight: 600;
    color: #4a4a4a;
    min-width: 90px;
  }
  .detail-value {
    color: #4a4a4a;
  }
  .cta-container {
    text-align: center;
    margin: 40px 0 30px;
  }
  .cta-row {
    margin-bottom: 15px;
  }
  .cta-button { 
    display: inline-block;
    background: #e74c3c;
    color: white !important;
    padding: 16px 36px;
    text-decoration: none;
    border-radius: 8px;
    margin: 8px 6px;
    font-weight: 700;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
  }
  .cta-button:hover {
    background: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }
  .cta-button.secondary {
    background: #ffffff;
    color: #1a1a1a !important;
    border: 2px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  .cta-button.secondary:hover {
    background: #f8f9fa;
    border-color: #a8d8ea;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .cta-button.calendar {
    background: #a8d8ea;
    color: #1a1a1a !important;
    box-shadow: 0 2px 4px rgba(168, 216, 234, 0.3);
  }
  .cta-button.calendar:hover {
    background: #7eb8d4;
  }
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
    margin: 35px 0;
  }
  .closing-message {
    color: #4a4a4a;
    font-size: 16px;
    line-height: 1.8;
    text-align: center;
    margin: 30px 0;
    padding: 0 20px;
  }
  .footer { 
    background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
    color: #ffffff;
    text-align: center;
    padding: 35px 20px;
  }
  .footer-logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
    color: #a8d8ea;
  }
  .footer-location {
    font-size: 14px;
    margin: 10px 0;
    opacity: 0.85;
  }
  .footer-link {
    color: #e74c3c;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
  }
  .footer-link:hover {
    color: #ff6b5a;
  }
  
  @media only screen and (max-width: 600px) {
    .email-wrapper { padding: 10px; }
    .container { border-radius: 8px; }
    .header { padding: 30px 20px; }
    .content { padding: 30px 20px; }
    .event-title { font-size: 26px; }
    .header h1 { font-size: 24px; }
    .details-card { padding: 22px; border-radius: 10px; }
    .cta-button { 
      display: block;
      margin: 10px 0;
      padding: 15px 28px;
    }
    .logo-image { max-width: 180px; }
  }
`

// Shared HTML component builders
const buildHeader = (title: string, subtitle: string): string => `
  <div class="header">
    <img 
      src="/images/design-mode/slr-logo.png" 
      alt="South Loop Runners" 
      class="logo-image"
      onerror="this.style.display='none'"
    >
    <h1>${title}</h1>
    <p class="header-subtitle">${subtitle}</p>
  </div>
  <div class="accent-bar"></div>
`

const buildEventDetails = (event: Event, detailsTitle: string = "📋 Event Details"): string => {
  const eventDate = formatEventDate(event)
  
  return `
    <div class="details-card">
      <h3 class="details-title">${detailsTitle}</h3>
      <div class="detail-row">
        <span class="detail-icon">📅</span>
        <span class="detail-label">Date:</span>
        <span class="detail-value">${eventDate}</span>
      </div>
      ${event.time ? `
      <div class="detail-row">
        <span class="detail-icon">🕐</span>
        <span class="detail-label">Time:</span>
        <span class="detail-value">${event.time}</span>
      </div>
      ` : ""}
      ${event.location ? `
      <div class="detail-row">
        <span class="detail-icon">📍</span>
        <span class="detail-label">Location:</span>
        <span class="detail-value">${event.location}</span>
      </div>
      ` : ""}
      ${event.distance ? `
      <div class="detail-row">
        <span class="detail-icon">📏</span>
        <span class="detail-label">Distance:</span>
        <span class="detail-value">${event.distance}</span>
      </div>
      ` : ""}
      ${event.pace ? `
      <div class="detail-row">
        <span class="detail-icon">⚡</span>
        <span class="detail-label">Pace:</span>
        <span class="detail-value">${event.pace}</span>
      </div>
      ` : ""}
    </div>
  `
}

const buildCTAButtons = (event: Event, includeCalendar: boolean = true): string => {
  const googleCalendarUrl = includeCalendar ? generateGoogleCalendarUrl(event) : ""
  
  return `
    <div class="cta-container">
      ${googleCalendarUrl ? `
      <div class="cta-row">
        <a href="${googleCalendarUrl}" class="cta-button calendar" target="_blank">📅 Add to Calendar</a>
      </div>
      ` : ""}
      <div class="cta-row">
        ${event.registration_url ? `<a href="${event.registration_url}" class="cta-button" target="_blank">View Pace Groups</a>` : ""}
        ${event.facebook_link ? `<a href="${event.facebook_link}" class="cta-button secondary" target="_blank">RSVP on Facebook</a>` : ""}
        ${event.strava_link ? `<a href="${event.strava_link}" class="cta-button secondary" target="_blank">View on Strava</a>` : ""}
      </div>
    </div>
  `
}

const buildFooter = (): string => `
  <div class="footer">
    <div class="footer-logo">South Loop Runners</div>
    <div class="footer-location">Chicago, IL</div>
    <p style="margin-top: 15px;">
      <a href="https://southlooprunners.com" class="footer-link">Visit our website →</a>
    </p>
  </div>
`

const buildEmailTemplate = (content: string): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getEmailStyles()}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          ${content}
        </div>
      </div>
    </body>
  </html>
`

// Main template functions
export function getNewEventEmailTemplate(event: Event) {
  const content = `
    ${buildHeader("You're Invited! 🏃", "New event from South Loop Runners")}
    
    <div class="content">
      <h2 class="event-title">${event.title}</h2>
      ${event.description ? `<p class="event-description">${event.description}</p>` : ""}
      
      ${buildEventDetails(event)}
      ${buildCTAButtons(event, true)}
      
      <div class="divider"></div>
      
      <p class="closing-message">
        We can't wait to see you there! Mark your calendar and get ready for an amazing run with South Loop Runners. 🎉
      </p>
    </div>
    
    ${buildFooter()}
  `

  return {
    subject: `New SLR Run: ${event.title}`,
    html: buildEmailTemplate(content)
  }
}

export function getUpdatedEventEmailTemplate(event: Event) {
  const content = `
    ${buildHeader("📢 Event Update", "Details have changed for an SLR event")}
    
    <div class="content">
      <h2 class="event-title">${event.title}</h2>
      
      <div class="alert alert-warning">
        <strong>Heads up!</strong>
        The details for this event have been updated. Please review the new information below.
      </div>
      
      ${event.description ? `<p class="event-description">${event.description}</p>` : ""}
      
      ${buildEventDetails(event, "📋 Updated Details")}
      ${buildCTAButtons(event, true)}
      
      <div class="divider"></div>
      
      <p class="closing-message">
        Please adjust your plans accordingly. We apologize for any inconvenience and hope to see you there!
      </p>
    </div>
    
    ${buildFooter()}
  `

  return {
    subject: `SLR Event Updated: ${event.title}`,
    html: buildEmailTemplate(content)
  }
}

export function getCanceledEventEmailTemplate(event: Event) {
  const content = `
    ${buildHeader("❌ Event Canceled", "An update from South Loop Runners")}
    
    <div class="content">
      <h2 class="event-title">${event.title}</h2>

      <div class="alert alert-danger">
        <strong>This event has been canceled.</strong>
        <p style="margin-top: 5px; margin-bottom: 0;">We regret to inform you that the event listed below will no longer take place.</p>
      </div>
      
      ${buildEventDetails(event, "Canceled Event Details")}
      
      <div class="cta-container">
        <div class="cta-row">
          <a href="https://southlooprunners.com" class="cta-button" target="_blank">View Other Events</a>
        </div>
      </div>

      <div class="divider"></div>

      <p class="closing-message">
        We apologize for any inconvenience this may cause. We hope to see you at another run soon!
      </p>
    </div>
    
    ${buildFooter()}
  `

  return {
    subject: `SLR Event Canceled: ${event.title}`,
    html: buildEmailTemplate(content)
  }
}
