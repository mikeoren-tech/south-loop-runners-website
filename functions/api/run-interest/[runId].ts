import type { KVNamespace } from "@cloudflare/workers-types"

interface Env {
  RACE_RSVPS: KVNamespace
}

interface PaceInterest {
  pace: string
  timestamp: number
}

interface RunData {
  interests: PaceInterest[]
  lastResetTimestamp: number
}

function getNextDayOfWeek(dayOfWeek: number, afterDate: Date): Date {
  const result = new Date(afterDate)
  result.setHours(22, 0, 0, 0) // Set to 10 PM on that day

  const daysUntilTarget = (dayOfWeek - afterDate.getDay() + 7) % 7
  if (daysUntilTarget === 0 && afterDate.getHours() < 22) {
    // If it's the same day but before 10 PM, use today at 10 PM
    return result
  }

  result.setDate(result.getDate() + (daysUntilTarget || 7))
  return result
}

function shouldResetData(runId: string, lastResetTimestamp: number): boolean {
  const now = new Date()
  const chicagoTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }))

  // Determine which day this run occurs on
  let runDayOfWeek: number
  if (runId === "thursday-light-up") {
    runDayOfWeek = 4 // Thursday
  } else if (runId === "saturday-anchor") {
    runDayOfWeek = 6 // Saturday
  } else if (runId === "sunday-social") {
    runDayOfWeek = 0 // Sunday
  } else {
    return false
  }

  // If never reset, check if we're past 10 PM on the run day
  if (lastResetTimestamp === 0) {
    const currentDay = chicagoTime.getDay()
    const currentHour = chicagoTime.getHours()

    if (currentDay === runDayOfWeek && currentHour >= 22) {
      return true
    }
    if (currentDay !== runDayOfWeek) {
      // Check if we're between the run day at 10 PM and now
      const lastRunDay = new Date(chicagoTime)
      const daysSinceRun = (currentDay - runDayOfWeek + 7) % 7
      lastRunDay.setDate(lastRunDay.getDate() - daysSinceRun)
      lastRunDay.setHours(22, 0, 0, 0)

      if (chicagoTime >= lastRunDay) {
        return true
      }
    }
    return false
  }

  // Convert last reset timestamp to Chicago time
  const lastReset = new Date(lastResetTimestamp)
  const lastResetChicago = new Date(lastReset.toLocaleString("en-US", { timeZone: "America/Chicago" }))

  // Get the next reset time (next occurrence of run day at 10 PM after last reset)
  const nextResetTime = getNextDayOfWeek(runDayOfWeek, lastResetChicago)

  // Reset only if current time is past the next reset time
  return chicagoTime >= nextResetTime
}

export async function onRequestGet(context: { env: Env; params: { runId: string } }) {
  try {
    const { runId } = context.params
    const key = `run-interest:${runId}`

    const data = await context.env.RACE_RSVPS.get(key)

    let runData: RunData = data ? JSON.parse(data) : { interests: [], lastResetTimestamp: 0 }

    if (shouldResetData(runId, runData.lastResetTimestamp)) {
      console.log("[v0] Resetting data for", runId, "last reset was:", new Date(runData.lastResetTimestamp))
      // Reset the data and update last reset timestamp
      runData = {
        interests: [],
        lastResetTimestamp: Date.now(),
      }
      await context.env.RACE_RSVPS.put(key, JSON.stringify(runData))
    }

    return new Response(JSON.stringify(runData.interests), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error fetching run interest:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch run interest" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function onRequestPost(context: { env: Env; params: { runId: string }; request: Request }) {
  try {
    const { runId } = context.params
    const body = await context.request.json()
    const { pace } = body

    if (!pace) {
      return new Response(JSON.stringify({ error: "Pace is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const key = `run-interest:${runId}`

    const data = await context.env.RACE_RSVPS.get(key)
    let runData: RunData = data ? JSON.parse(data) : { interests: [], lastResetTimestamp: 0 }

    if (shouldResetData(runId, runData.lastResetTimestamp)) {
      console.log("[v0] Resetting data on POST for", runId)
      runData = {
        interests: [],
        lastResetTimestamp: Date.now(),
      }
    }

    // Add new interest
    runData.interests.push({
      pace,
      timestamp: Date.now(),
    })

    await context.env.RACE_RSVPS.put(key, JSON.stringify(runData))

    return new Response(JSON.stringify(runData.interests), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[Cloudflare Function] Error adding run interest:", error)
    return new Response(JSON.stringify({ error: "Failed to add run interest" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
