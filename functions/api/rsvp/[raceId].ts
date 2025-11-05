// Cloudflare Pages Function for race RSVPs using KV storage
// This handles GET, POST, and DELETE requests for race attendance

import type { KVNamespace } from "@cloudflare/workers-types"

interface Env {
  RACE_RSVPS: KVNamespace
}

interface Attendee {
  id: string
  name: string
  type: "racing" | "cheering"
  timestamp: number
}

// GET /api/rsvp/:raceId - Fetch all RSVPs for a race
export async function onRequestGet(context: { env: Env; params: { raceId: string } }) {
  try {
    const { raceId } = context.params
    const rsvps = await context.env.RACE_RSVPS.get(`race:${raceId}`)

    return new Response(rsvps || "[]", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// POST /api/rsvp/:raceId - Add a new RSVP
export async function onRequestPost(context: { env: Env; params: { raceId: string }; request: Request }) {
  try {
    const { raceId } = context.params
    const newAttendee: Attendee = await context.request.json()

    // Get existing RSVPs
    const existing = await context.env.RACE_RSVPS.get(`race:${raceId}`)
    const rsvps: Attendee[] = existing ? JSON.parse(existing) : []

    // Add new RSVP
    rsvps.push(newAttendee)

    // Save back to KV
    await context.env.RACE_RSVPS.put(`race:${raceId}`, JSON.stringify(rsvps))

    return new Response(JSON.stringify(rsvps), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add RSVP" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// DELETE /api/rsvp/:raceId - Remove an RSVP
export async function onRequestDelete(context: { env: Env; params: { raceId: string }; request: Request }) {
  try {
    const { raceId } = context.params
    const url = new URL(context.request.url)
    const attendeeId = url.searchParams.get("attendeeId")

    if (!attendeeId) {
      return new Response(JSON.stringify({ error: "attendeeId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get existing RSVPs
    const existing = await context.env.RACE_RSVPS.get(`race:${raceId}`)
    const rsvps: Attendee[] = existing ? JSON.parse(existing) : []

    // Remove the RSVP
    const updatedRsvps = rsvps.filter((a) => a.id !== attendeeId)

    // Save back to KV
    await context.env.RACE_RSVPS.put(`race:${raceId}`, JSON.stringify(updatedRsvps))

    return new Response(JSON.stringify(updatedRsvps), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to remove RSVP" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
