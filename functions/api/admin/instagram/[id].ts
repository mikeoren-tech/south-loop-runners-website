import type { PagesFunction } from "worktop"
import type { D1Database } from "@cloudflare/workers-types"

interface Env {
  DB: D1Database
}

// PATCH update Instagram post
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { DB } = context.env
  const { id } = context.params

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = await context.request.json()
    const { URL, caption, display_order, is_active } = body

    const result = await DB.prepare(`
      UPDATE ig_feed SET
        URL = ?,
        caption = ?,
        display_order = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(URL, caption || null, display_order ? Number.parseInt(display_order) : 0, is_active ? 1 : 0, id)
      .run()

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error updating Instagram post:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to update post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// DELETE Instagram post
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { DB } = context.env
  const { id } = context.params

  if (!DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    await DB.prepare("DELETE FROM ig_feed WHERE id = ?").bind(id).run()

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Error deleting Instagram post:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to delete post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
