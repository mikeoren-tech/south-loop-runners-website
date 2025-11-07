import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber, getActiveSubscribers } from "@/lib/db"
import { addToResendAudience } from "@/lib/email"
import type { D1Database } from "@cloudflare/workers-types"

export const runtime = "edge"
export const dynamic = "force-dynamic"

function getDB(request?: NextRequest): D1Database | null {
  try {
    // Try accessing from Cloudflare Workers context
    if (request) {
      const cfContext = (request as any).cf || (globalThis as any).cloudflare
      if (cfContext?.env?.DB) {
        return cfContext.env.DB
      }
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

export async function GET() {
  try {
    const db = getDB()

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const subscribers = await getActiveSubscribers(db)
    return NextResponse.json(subscribers)
  } catch (error) {
    console.error("[v0] Error fetching subscribers:", error)
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDB(request)

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { email, event_preferences } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const subscriber = await addSubscriber(db, email, event_preferences)

    // Add to Resend audience
    await addToResendAudience(email)

    return NextResponse.json(subscriber, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding subscriber:", error)
    return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 })
  }
}
