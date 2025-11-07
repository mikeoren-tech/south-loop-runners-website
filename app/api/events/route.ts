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
import type { D1Database } from "@cloudflare/workers-types"

export const runtime = "edge"
export const dynamic = "force-dynamic"

function getDB(request: NextRequest): D1Database | null {
  try {
    // Try accessing from Cloudflare Workers context
    const cfContext = (request as any).cf || (globalThis as any).cloudflare
    if (cfContext?.env?.DB) {
      return cfContext.env.DB
    }

    // Fallback to process.env
    if (process.env.DB) {
      return process.env.DB as any
    }

    return null
  } catch (error) {
    console.error("[v0] Error accessing DB:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDB(request)

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
    const db = getDB(request)

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const eventData = await request.json()

    // Validate required fields
    if (!eventData.title || !eventData.event_type || !eventData.start_datetime || !eventData.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const event = await createEvent(db, eventData)

    const subscribers = await getActiveSubscribers(db, event.event_type)
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
