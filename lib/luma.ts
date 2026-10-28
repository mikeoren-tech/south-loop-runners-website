// Helpers for Luma (luma.com / lu.ma) event links used by social events

// Luma's checkout button needs the event ID (evt-…), which appears in links like
// https://luma.com/event/evt-NKtOunD6yqoqjDW. Short share links (lu.ma/abc123) don't include it.
export function getLumaEventId(url?: string | null): string | null {
  return url?.match(/\bevt-[A-Za-z0-9]+/)?.[0] ?? null
}

// Accepts either a Luma event link or Luma's checkout-button embed code and returns the link
// to store. For embed code, keep the link (or build one from the event ID).
export function normalizeLumaInput(input: string): string {
  const value = input.trim()
  if (!value.includes("<")) return value

  const href = value.match(/href="([^"]+)"/)?.[1]
  if (href && getLumaEventId(href)) return href

  const eventId = value.match(/data-luma-event-id="(evt-[A-Za-z0-9]+)"/)?.[1]
  if (eventId) return `https://luma.com/event/${eventId}`

  return href ?? value
}
