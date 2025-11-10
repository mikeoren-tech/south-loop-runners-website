import { CalendarView } from "@/components/calendar-view"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Events Calendar | South Loop Runners",
  description:
    "View all upcoming weekly runs and races on our interactive events calendar. Get notifications for new events and stay connected with the South Loop running community.",
}

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background"> 
      <header 
        className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10"
      >
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5 text-slr-blue" />
            <Image
              src="/slr-logo.png"
              alt="South Loop Runners"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>
      </header>
      <CalendarView />
    </div>
  )
}
