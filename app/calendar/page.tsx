import { CalendarView } from "@/components/calendar-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events Calendar | South Loop Runners",
  description:
    "View all upcoming weekly runs and races on our interactive events calendar. Get notifications for new events and stay connected with the South Loop running community.",
}

export const runtime = "edge"

export default function CalendarPage() {
  return <CalendarView />
}
