import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber, getActiveSubscribers } from "@/lib/db"
import { addToResendAudience } from "@/lib/email"

export async function GET() {
  try {
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const db = process.env.DB || globalThis.DB

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
    // @ts-ignore - D1 binding available in Cloudflare Workers
    const db = process.env.DB || globalThis.DB

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const subscriber = await addSubscriber(db, email)

    // Add to Resend audience
    await addToResendAudience(email)

    return NextResponse.json(subscriber, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding subscriber:", error)
    return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 })
  }
}
