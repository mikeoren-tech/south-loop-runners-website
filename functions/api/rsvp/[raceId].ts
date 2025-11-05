// Cloudflare Pages Function for race RSVPs
// Handles GET, POST, DELETE for /api/rsvp/:raceId

export async function onRequestGet(context: any) {
  const { raceId } = context.params

  if (!raceId) {
    return new Response(JSON.stringify({ error: "Race ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  try {
    const rsvpsJson = await context.env.RACE_RSVPS.get(`race:${raceId}`)
    const rsvps = rsvpsJson ? JSON.parse(rsvpsJson) : []

    return new Response(JSON.stringify(rsvps), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching RSVPs:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}

export async function onRequestPost(context: any) {
  const { raceId } = context.params

  if (!raceId) {
    return new Response(JSON.stringify({ error: "Race ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  try {
    const newRSVP = await context.request.json()

    if (!newRSVP.firstName || !newRSVP.lastInitial || !newRSVP.type) {
      return new Response(JSON.stringify({ error: "Invalid RSVP data" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const rsvpsJson = await context.env.RACE_RSVPS.get(`race:${raceId}`)
    const rsvps = rsvpsJson ? JSON.parse(rsvpsJson) : []

    rsvps.push(newRSVP)

    await context.env.RACE_RSVPS.put(`race:${raceId}`, JSON.stringify(rsvps))

    return new Response(JSON.stringify(rsvps), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error adding RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to add RSVP" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}

export async function onRequestDelete(context: any) {
  const { raceId } = context.params

  if (!raceId) {
    return new Response(JSON.stringify({ error: "Race ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  try {
    const { id } = await context.request.json()

    if (!id) {
      return new Response(JSON.stringify({ error: "RSVP ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const rsvpsJson = await context.env.RACE_RSVPS.get(`race:${raceId}`)
    const rsvps = rsvpsJson ? JSON.parse(rsvpsJson) : []

    const updatedRSVPs = rsvps.filter((rsvp: any) => rsvp.id !== id)

    await context.env.RACE_RSVPS.put(`race:${raceId}`, JSON.stringify(updatedRSVPs))

    return new Response(JSON.stringify(updatedRSVPs), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error removing RSVP:", error)
    return new Response(JSON.stringify({ error: "Failed to remove RSVP" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
