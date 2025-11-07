interface Env {
  RESEND_API_KEY: string
  RESEND_AUDIENCE_ID: string
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const resendApiKey = context.env.RESEND_API_KEY
    const audienceId = context.env.RESEND_AUDIENCE_ID

    if (!resendApiKey) {
      console.error("[v0] Missing RESEND_API_KEY environment variable")
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please add RESEND_API_KEY to environment variables." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    if (!audienceId) {
      console.error("[v0] Missing RESEND_AUDIENCE_ID environment variable")
      return new Response(
        JSON.stringify({
          error: "Email service not configured. Please add RESEND_AUDIENCE_ID to environment variables.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    console.log("[v0] Attempting to subscribe email to Resend audience:", email)

    // Add contact to Resend Audience
    const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        unsubscribed: false,
      }),
    })

    console.log("[v0] Resend API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Resend API error:", errorText)

      // Check if contact already exists
      if (response.status === 400 && errorText.includes("already exists")) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "You're already subscribed to event notifications!",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        )
      }

      return new Response(
        JSON.stringify({
          error: `Failed to subscribe: ${errorText}`,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    const data = await response.json()
    console.log("[v0] Successfully subscribed to Resend audience:", data)

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully subscribed to event notifications!",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Subscription error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to subscribe to notifications",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
