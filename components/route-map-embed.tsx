"use client"

import { useEffect, useRef } from "react"

interface RouteMapEmbedProps {
  html: string
  className?: string
}

// Renders admin-provided route map embed code. MapMyRun embeds are a plain <iframe>,
// but Strava embeds are a placeholder <div> plus a <script> (strava-embeds.com/embed.js)
// that swaps in the map. Scripts inserted via innerHTML never run, so re-create them
// as real script elements to let embeds like Strava's load.
export function RouteMapEmbed({ html, className }: RouteMapEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = html

    container.querySelectorAll("script").forEach((oldScript) => {
      const script = document.createElement("script")
      for (const attr of Array.from(oldScript.attributes)) {
        script.setAttribute(attr.name, attr.value)
      }
      script.text = oldScript.text
      oldScript.replaceWith(script)
    })

    return () => {
      container.innerHTML = ""
    }
  }, [html])

  return <div ref={containerRef} className={className} />
}
