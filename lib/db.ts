// Database utility functions for Cloudflare D1
import { nanoid } from "nanoid"

// Types for our database models
export interface Event {
  id: string
  title: string
  description: string | null
  event_type: "weekly_run" | "race"
  start_datetime: string // ISO 8601 format
  end_datetime: string | null
  location: string
  distance: string | null
  pace: string | null
  meeting_point: string | null
  registration_url: string | null
  image_url: string | null
  is_featured: number
  display_order: number
  created_at: string
  updated_at: string
}

export interface EmailSubscriber {
  id: string
  email: string
  is_active: number
  subscribed_at: string
  unsubscribed_at: string | null
}

export interface EventNotification {
  id: string
  event_id: string
  notification_type: "created" | "updated" | "deleted" | "reminder"
  sent_at: string
  recipient_count: number
}

// Get D1 database instance from environment
export function getDB() {
  // In production with Cloudflare Workers, this would be:
  // return env.DB
  // For now, we'll handle this in API routes
  return null
}

// Helper to convert Date to Chicago timezone ISO string
export function toChicagoDateTime(date: Date): string {
  return date
    .toLocaleString("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/, "$3-$1-$2T$4:$5:$6")
}

// Helper to parse Chicago datetime string to Date object
export function fromChicagoDateTime(dateTimeStr: string): Date {
  // Parse as Chicago time
  return new Date(dateTimeStr + "-05:00") // Chicago is UTC-5 (or UTC-6 with DST)
}

// Generate a unique ID for database records
export function generateId(): string {
  return nanoid()
}

// Database query helpers
export async function createEvent(db: any, event: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
  const id = generateId()
  const now = new Date().toISOString()

  await db
    .prepare(`
    INSERT INTO events (
      id, title, description, event_type, start_datetime, end_datetime,
      location, distance, pace, meeting_point, registration_url, image_url,
      is_featured, display_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      id,
      event.title,
      event.description,
      event.event_type,
      event.start_datetime,
      event.end_datetime,
      event.location,
      event.distance,
      event.pace,
      event.meeting_point,
      event.registration_url,
      event.image_url,
      event.is_featured,
      event.display_order,
      now,
      now,
    )
    .run()

  return { id, ...event, created_at: now, updated_at: now }
}

export async function updateEvent(
  db: any,
  id: string,
  event: Partial<Omit<Event, "id" | "created_at" | "updated_at">>,
): Promise<void> {
  const now = new Date().toISOString()
  const updates: string[] = []
  const values: any[] = []

  Object.entries(event).forEach(([key, value]) => {
    updates.push(`${key} = ?`)
    values.push(value)
  })

  updates.push("updated_at = ?")
  values.push(now)
  values.push(id)

  await db
    .prepare(`
    UPDATE events SET ${updates.join(", ")} WHERE id = ?
  `)
    .bind(...values)
    .run()
}

export async function deleteEvent(db: any, id: string): Promise<void> {
  await db.prepare("DELETE FROM events WHERE id = ?").bind(id).run()
}

export async function getEvent(db: any, id: string): Promise<Event | null> {
  const result = await db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first()
  return result as Event | null
}

export async function getAllEvents(db: any): Promise<Event[]> {
  const result = await db.prepare("SELECT * FROM events ORDER BY start_datetime ASC").all()
  return result.results as Event[]
}

export async function getFeaturedEvents(db: any, eventType?: "weekly_run" | "race", limit?: number): Promise<Event[]> {
  let query = "SELECT * FROM events WHERE is_featured = 1"

  if (eventType) {
    query += ` AND event_type = '${eventType}'`
  }

  query += " ORDER BY display_order ASC, start_datetime ASC"

  if (limit) {
    query += ` LIMIT ${limit}`
  }

  const result = await db.prepare(query).all()
  return result.results as Event[]
}

export async function getUpcomingEvents(db: any, eventType?: "weekly_run" | "race", limit?: number): Promise<Event[]> {
  const now = new Date().toISOString()
  let query = "SELECT * FROM events WHERE start_datetime >= ?"
  const bindings = [now]

  if (eventType) {
    query += ` AND event_type = ?`
    bindings.push(eventType)
  }

  query += " ORDER BY start_datetime ASC"

  if (limit) {
    query += ` LIMIT ${limit}`
  }

  const result = await db
    .prepare(query)
    .bind(...bindings)
    .all()
  return result.results as Event[]
}

// Email subscriber functions
export async function addSubscriber(db: any, email: string): Promise<EmailSubscriber> {
  const id = generateId()
  const now = new Date().toISOString()

  await db
    .prepare(`
    INSERT INTO email_subscribers (id, email, is_active, subscribed_at)
    VALUES (?, ?, 1, ?)
  `)
    .bind(id, email, now)
    .run()

  return { id, email, is_active: 1, subscribed_at: now, unsubscribed_at: null }
}

export async function getActiveSubscribers(db: any): Promise<EmailSubscriber[]> {
  const result = await db.prepare("SELECT * FROM email_subscribers WHERE is_active = 1").all()
  return result.results as EmailSubscriber[]
}

// Event notification tracking
export async function logNotification(
  db: any,
  eventId: string,
  notificationType: "created" | "updated" | "deleted" | "reminder",
  recipientCount: number,
): Promise<void> {
  const id = generateId()
  const now = new Date().toISOString()

  await db
    .prepare(`
    INSERT INTO event_notifications (id, event_id, notification_type, sent_at, recipient_count)
    VALUES (?, ?, ?, ?, ?)
  `)
    .bind(id, eventId, notificationType, now, recipientCount)
    .run()
}
