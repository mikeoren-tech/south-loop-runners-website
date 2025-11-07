import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Check if required environment variables are set
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      console.error("[v0] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID environment variables")
      return NextResponse.json(
        { error: "Email service not configured. Please contact the administrator." },
        { status: 500 },
      )
    }

    // Add contact to Resend audience
    const result = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to event notifications!",
    })
  } catch (error: any) {
    console.error("[v0] Subscription error:", error)

    // Handle duplicate email gracefully
    if (error.message?.includes("already exists")) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to notifications!",
      })
    }

    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
