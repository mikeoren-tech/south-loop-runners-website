"use client"

import type React from "react"
import { useEffect } from "react"
import { getLumaEventId } from "@/lib/luma"

// Loads Luma's checkout script once; it turns links with data-luma-action="checkout" into
// buttons that open registration in an overlay on our page.
function useLumaCheckoutScript(enabled: boolean) {
  useEffect(() => {
    if (!enabled || document.getElementById("luma-checkout")) return
    const script = document.createElement("script")
    script.id = "luma-checkout"
    script.src = "https://embed.lu.ma/checkout-button.js"
    script.async = true
    document.body.appendChild(script)
  }, [enabled])
}

interface LumaRsvpLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url: string
}

// A link to a Luma event. When the link includes the event ID (evt-…), registration opens in
// Luma's overlay. We leave off Luma's "luma-checkout--button" class so our own styles apply.
// If the script doesn't load, it's still a normal link to the event page.
export function LumaRsvpLink({ url, children, ...props }: LumaRsvpLinkProps) {
  const eventId = getLumaEventId(url)
  useLumaCheckoutScript(Boolean(eventId))

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      {...(eventId && { "data-luma-action": "checkout", "data-luma-event-id": eventId })}
      {...props}
    >
      {children}
    </a>
  )
}
