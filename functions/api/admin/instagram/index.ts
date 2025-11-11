import type { PagesFunction } from "worktop"
import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

// GET all Instagram posts
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { results } = await DB.prepare("SELECT * FROM ig_feed ORDER BY display_order ASC, created_at DESC").all()

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching Instagram posts:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// POST new Instagram post
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { DB } = context.env

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = await context.request.json()
    const { URL, caption, display_order } = body

    if (!URL) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    await DB.prepare("INSERT INTO ig_feed (URL, caption, display_order, is_active) VALUES (?, ?, ?, 1)")
      .bind(URL, caption || null, display_order ? Number.parseInt(display_order) : 0)
      .run()

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error creating Instagram post:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to create post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
