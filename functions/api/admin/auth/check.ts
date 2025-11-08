import type { PagesFunction } from "@cloudflare/workers-types"

export const onRequestGet: PagesFunction<{
  ADMIN_PASSWORD: string
}> = async (context) => {
  const cookie = context.request.headers.get("Cookie")

  const authCookie = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("admin_auth="))
    ?.split("=")[1]

  if (!authCookie) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  }

  const adminPassword = context.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  }

  try {
    const decodedToken = atob(authCookie)
    if (decodedToken !== adminPassword) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  }

  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  })
}
