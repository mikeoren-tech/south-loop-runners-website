import { type NextRequest, NextResponse } from "next/server"
import { getEvent, updateEvent, deleteEvent, getActiveSubscribers, logNotification } from "@/lib/db"
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDB(request)

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { id } = params
    const event = await getEvent(db, id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("[v0] Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDB(request)

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { id } = params
    const eventData = await request.json()

    // Check if event exists
    const existingEvent = await getEvent(db, id)
    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    await updateEvent(db, id, eventData)
    const updatedEvent = await getEvent(db, id)

    const subscribers = await getActiveSubscribers(db, updatedEvent?.event_type)
    if (subscribers.length > 0 && updatedEvent) {
      const emails = subscribers.map((s) => s.email)
      const result = await sendEventNotification(emails, updatedEvent, "updated")

      if (result.success) {
        await logNotification(db, id, "updated", result.count)
      }
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("[v0] Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDB(request)

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { id } = params

    // Get event before deletion for notification
    const event = await getEvent(db, id)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    await deleteEvent(db, id)

    const subscribers = await getActiveSubscribers(db, event.event_type)
    if (subscribers.length > 0) {
      const emails = subscribers.map((s) => s.email)
      const result = await sendEventNotification(emails, event, "deleted")

      if (result.success) {
        await logNotification(db, id, "deleted", result.count)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
