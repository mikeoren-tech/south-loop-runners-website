"use server"

import { revalidatePath } from "next/cache"

type Attendee = {
  id: string
  name: string
  type: "racing" | "cheering"
  timestamp: number
}

type RaceRSVPs = {
  [raceId: string]: Attendee[]
}

// In-memory storage (will be replaced with Redis/DB in production)
// Note: This will reset on server restart, but works for development
const rsvpStore: RaceRSVPs = {}

export async function getRSVPs(raceId: string): Promise<Attendee[]> {
  return rsvpStore[raceId] || []
}

export async function addRSVP(raceId: string, name: string, type: "racing" | "cheering") {
  if (!rsvpStore[raceId]) {
    rsvpStore[raceId] = []
  }

  const newAttendee: Attendee = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    timestamp: Date.now(),
  }

  rsvpStore[raceId].push(newAttendee)

  // Revalidate the path to trigger re-fetch
  revalidatePath("/")

  return { success: true, attendee: newAttendee }
}

export async function removeRSVP(raceId: string, attendeeId: string) {
  if (!rsvpStore[raceId]) {
    return { success: false, error: "Race not found" }
  }

  const initialLength = rsvpStore[raceId].length
  rsvpStore[raceId] = rsvpStore[raceId].filter((a) => a.id !== attendeeId)

  if (rsvpStore[raceId].length === initialLength) {
    return { success: false, error: "Attendee not found" }
  }

  // Revalidate the path to trigger re-fetch
  revalidatePath("/")

  return { success: true }
}

export async function getAllRSVPs(): Promise<RaceRSVPs> {
  return rsvpStore
}
