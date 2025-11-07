import { type NextRequest, NextResponse } from "next/server"
import {
  getAllEvents,
  createEvent,
  getUpcomingEvents,
  getFeaturedEvents,
  getActiveSubscribers,
  logNotification,
} from "@/lib/db"
import { sendEventNotification } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const db = process.env.DB || globalThis.DB

    if (!db) {
      console.error("[v0] Database not configured")
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get("upcoming") === "true"
    const featured = searchParams.get("featured") === "true"
    const eventType = searchParams.get("type") as "weekly_run" | "race" | undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    let events

    if (featured) {
      events = await getFeaturedEvents(db, eventType, limit)
    } else if (upcoming) {
      events = await getUpcomingEvents(db, eventType, limit)
    } else {
      events = await getAllEvents(db)
    }

    return NextResponse.json(Array.isArray(events) ? events : [])
  } catch (error) {
    console.error("[v0] Error fetching events:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const db = process.env.DB || globalThis.DB

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const eventData = await request.json()

    // Validate required fields
    if (!eventData.title || !eventData.event_type || !eventData.start_datetime || !eventData.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const event = await createEvent(db, eventData)

    // Send notification emails to subscribers
    const subscribers = await getActiveSubscribers(db)
    if (subscribers.length > 0) {
      const emails = subscribers.map((s) => s.email)
      const result = await sendEventNotification(emails, event, "created")

      if (result.success) {
        await logNotification(db, event.id, "created", result.count)
      }
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
