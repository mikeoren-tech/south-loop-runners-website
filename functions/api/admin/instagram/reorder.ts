import type { PagesFunction } from "worktop"
import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

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
    const { postIds } = body as { postIds: number[] }

    if (!Array.isArray(postIds)) {
      return new Response(JSON.stringify({ error: "postIds must be an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Update display_order for each post
    for (let i = 0; i < postIds.length; i++) {
      await DB.prepare("UPDATE ig_feed SET display_order = ? WHERE id = ?").bind(i, postIds[i]).run()
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error reordering Instagram posts:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to reorder posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
