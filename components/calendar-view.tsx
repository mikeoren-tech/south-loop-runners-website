"use client"

import type React from "react"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  MapPin,
  Trophy,
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarDays,
  List,
  Download,
  ExternalLink,
  Star,
} from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface DatabaseEvent {
  id: string
  title: string
  description: string
  date: string | null
  time: string
  location: string
  distance: string | null
  pace: string | null
  type: string
  is_recurring: number
  day_of_week: number | null
  display_order: number | null
  facebook_link: string | null
  strava_link: string | null
  distances: string | null
  registration_url: string | null
  highlights: string | null
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  location: string
  type: "weekly-run" | "race"
  details: string
  isRecurring: boolean
  description?: string
  facebookLink?: string
  stravaLink?: string
  registrationUrl?: string
}

function generateWeeklyRunOccurrences(run: DatabaseEvent, startDate: Date, weeks: number): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const start = new Date(startDate)

  if (run.day_of_week === null) return []

  const daysUntilRun = (run.day_of_week - start.getDay() + 7) % 7
  start.setDate(start.getDate() + daysUntilRun)

  for (let i = 0; i < weeks; i++) {
    const eventDate = new Date(start)
    eventDate.setDate(start.getDate() + i * 7)

    // Check if the generated event is not in the past
    if (eventDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        continue;
    }

    events.push({
      id: `${run.id}-${eventDate.toISOString()}`,
      title: run.title,
      date: eventDate,
      time: run.time,
      location: run.location,
      type: run.type === "race" ? "race" : "weekly-run",
      details: `${run.distance || ""} • ${run.pace || ""}`.trim().replace(/^ • | • $/g, ""),
      isRecurring: true,
      description: run.description,
      facebookLink: run.facebook_link || undefined,
      stravaLink: run.strava_link || undefined,
      registrationUrl: run.registration_url || undefined,
    })
  }

  return events
}

function parseEventTime(timeStr: string): { hour: number; minutes: number } {
  // Use a regex to capture hour, minutes (optional), and AM/PM part
  const match = timeStr.match(/(\d+)(:(\d+))?(\s*(AM|PM))?/i)
  if (!match) return { hour: 0, minutes: 0 }

  let hour = Number.parseInt(match[1])
  const minutes = Number.parseInt(match[3] || '0')
  const period = match[5]?.toUpperCase()

  if (period === "PM" && hour !== 12) hour += 12
  if (period === "AM" && hour === 12) hour = 0
  
  return { hour, minutes }
}

function formatDateForCalendar(date: Date): string {
  // Generates date string in the format YYYYMMDDTHHMMSSZ for ICS/Google Calendar
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function exportToICS(events: CalendarEvent[]) {
  const icsEvents = events
    .map((event) => {
      const start = new Date(event.date)
      const { hour, minutes } = parseEventTime(event.time)
      start.setHours(hour, minutes, 0, 0)
      const end = new Date(start.getTime() + 90 * 60 * 1000) // Assumes 90-minute duration

      // Escape special characters in SUMMARY and DESCRIPTION for ICS
      const escapeICS = (str: string) => str.replace(/([,;\\\[\]])/g, '\\$1').replace(/\n/g, '\\n')
      
      const details = event.description || event.details

      return [
        "BEGIN:VEVENT",
        `UID:${event.id}@southlooprunners.com`,
        `DTSTAMP:${formatDateForCalendar(new Date())}`,
        `DTSTART:${formatDateForCalendar(start)}`,
        `DTEND:${formatDateForCalendar(end)}`,
        `SUMMARY:${escapeICS(event.title)}`,
        `LOCATION:${escapeICS(event.location)}`,
        `DESCRIPTION:${escapeICS(details)}`,
        "END:VEVENT",
      ].join("\r\n")
    })
    .join("\r\n")

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//South Loop Runners//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    icsEvents,
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "south-loop-runners-events.ics"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function addToGoogleCalendar(event: CalendarEvent) {
  const start = new Date(event.date)
  const { hour, minutes } = parseEventTime(event.time)
  start.setHours(hour, minutes, 0, 0)
  const end = new Date(start.getTime() + 90 * 60 * 1000)

  const googleCalUrl = new URL("https://calendar.google.com/calendar/render")
  googleCalUrl.searchParams.set("action", "TEMPLATE")
  googleCalUrl.searchParams.set("text", event.title)
  googleCalUrl.searchParams.set("dates", `${formatDateForCalendar(start)}/${formatDateForCalendar(end)}`)
  googleCalUrl.searchParams.set("details", event.description || event.details)
  googleCalUrl.searchParams.set("location", event.location)

  window.open(googleCalUrl.toString(), "_blank")
}

function exportSingleEventToICS(event: CalendarEvent) {
  const start = new Date(event.date)
  const { hour, minutes } = parseEventTime(event.time)
  start.setHours(hour, minutes, 0, 0)
  const end = new Date(start.getTime() + 90 * 60 * 1000)

  // Escape special characters in SUMMARY and DESCRIPTION for ICS
  const escapeICS = (str: string) => str.replace(/([,;\\\[\]])/g, '\\$1').replace(/\n/g, '\\n')
  const details = event.description || event.details

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//South Loop Runners//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@southlooprunners.com`,
    `DTSTAMP:${formatDateForCalendar(new Date())}`,
    `DTSTART:${formatDateForCalendar(start)}`,
    `DTEND:${formatDateForCalendar(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function toggleFilter(filters: Set<string>, type: string): Set<string> {
  const newFilters = new Set(filters)
  if (newFilters.has(type)) {
    newFilters.delete(type)
  } else {
    newFilters.add(type)
  }
  return newFilters
}

function getInitialView(): "month" | "list" {
  if (typeof window !== "undefined") {
    // Return "list" for small screens (less than 768px wide), "month" otherwise
    return window.innerWidth < 768 ? "list" : "month"
  }
  return "month" // Default for SSR
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  // Added responsive effect for view
  const [view, setView] = useState<"month" | "list">(getInitialView)
  const [filters, setFilters] = useState<Set<string>>(new Set(["weekly-run", "race"]))
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dbEvents, setDbEvents] = useState<DatabaseEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Recalculate view on window resize
  useEffect(() => {
    function handleResize() {
        setView(getInitialView());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events/all")
        if (response.ok) {
          const data = await response.json()
          console.log("[Calendar] Fetched events:", data)
          setDbEvents(data)
        } else {
          console.error("[Calendar] Failed to fetch events, status:", response.status)
          const errorText = await response.text()
          console.error("[Calendar] Error response:", errorText)
        }
      } catch (error) {
        console.error("[Calendar] Failed to fetch events:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const allEvents = useMemo(() => {
    if (isLoading || dbEvents.length === 0) return []

    const events: CalendarEvent[] = []
    // Get the start of today for filtering out past one-time events
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

    dbEvents.forEach((event) => {
      if (event.is_recurring && event.day_of_week !== null) {
        // Generate occurrences for 12 weeks into the future
        const occurrences = generateWeeklyRunOccurrences(event, new Date(), 12)
        events.push(...occurrences)
      } else if (event.date) {
        const [year, month, day] = event.date.split("-").map(Number)
        // Date constructor uses local time zone
        const localDate = new Date(year, month - 1, day)
        
        // Skip past one-time events
        if (localDate < todayStart) {
          return;
        }

        let details = event.distance || ""
        if (event.distances) {
          try {
            const distancesArray = JSON.parse(event.distances);
            if (Array.isArray(distancesArray) && distancesArray.length > 0) {
              details = distancesArray.join(", ");
            }
          } catch (e) {
            console.error("Failed to parse distances:", e);
          }
        }
        
        events.push({
          id: event.id,
          title: event.title,
          date: localDate,
          time: event.time,
          location: event.location,
          type: event.type === "race" ? "race" : "weekly-run",
          details: details,
          isRecurring: false,
          description: event.description,
          facebookLink: event.facebook_link || undefined,
          stravaLink: event.strava_link || undefined,
          registrationUrl: event.registration_url || undefined,
        })
      }
    })

    // Sort all events by date
    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [dbEvents, isLoading])

  const filteredEvents = useMemo(() => {
    // Filter events by the selected types
    return allEvents.filter((event) => filters.has(event.type))
  }, [allEvents, filters])
  
  // Use useCallback to memoize the navigation functions
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }, [])

  const monthEvents = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return filteredEvents.filter((event) => {
      // Filter for events in the currently selected month, including recurring events that fall in this month
      return event.date.getFullYear() === year && event.date.getMonth() === month
    })
  }, [filteredEvents, currentDate])

  // Memoize month details calculation
  const { daysInMonth, startingDayOfWeek, monthName } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return { 
        daysInMonth: lastDay.getDate(), 
        startingDayOfWeek: firstDay.getDay(),
        monthName
    }
  }, [currentDate])


  const getEventsForDay = (day: number) => {
    return monthEvents.filter((event) => event.date.getDate() === day)
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // API call to subscribe
      const response = await fetch("/api/subscribe-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
        setIsNotificationExpanded(false)
        setTimeout(() => setSubscribed(false), 5000)
      } else {
        alert(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Subscription error:", error)
      alert("Failed to subscribe. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ScrollReveal className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          <span className="text-slr-red">★</span>{" "}
          <span className="text-slr-blue">Events Calendar</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View all upcoming weekly runs and races. Never miss an event!
        </p>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto space-y-6">
        <ScrollReveal delay={100}>
          <Card className="border-slr-blue/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant={filters.has("weekly-run") ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(toggleFilter(filters, "weekly-run"))}
                    className="gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Weekly Runs
                  </Button>
                  <Button
                    variant={filters.has("race") ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setFilters(toggleFilter(filters, "race"))}
                    className="gap-2"
                  >
                    <Trophy className="h-4 w-4" />
                    Races
                  </Button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {!subscribed && (
                    <>
                      <Button
                        onClick={() => exportToICS(filteredEvents)}
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-slr-blue-dark hover:text-slr-blue"
                      >
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                      <Button
                        onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}
                        variant={isNotificationExpanded ? "secondary" : "default"}
                        size="sm"
                        className="gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        {isNotificationExpanded ? "Close" : "Get Notifications"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isNotificationExpanded ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0",
                )}
              >
                <form onSubmit={handleNotificationSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex-1 border-slr-blue/30 focus:border-slr-blue"
                  />
                  <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>

              {subscribed && (
                <div className="flex items-center gap-2 text-slr-blue-dark bg-slr-blue-light/50 p-3 rounded-lg mt-4">
                  <Star className="h-4 w-4 fill-slr-blue" />
                  <span className="text-sm font-medium">You're subscribed to event updates!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Card className="border-2 border-slr-blue/40 shadow-2xl backdrop-blur-lg bg-gradient-to-br from-white/70 via-white/50 to-white/40 dark:from-slate-900/70 dark:via-slate-900/50 dark:to-slate-900/40">
            <CardContent className="p-6">
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-2 border-slr-blue/30 shadow-lg">
                    <TabsTrigger value="month" className="gap-2 data-[state=active]:bg-slr-blue data-[state=active]:text-white data-[state=active]:shadow-md">
                      <CalendarDays className="h-4 w-4" />
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-slr-blue data-[state=active]:text-white data-[state=active]:shadow-md">
                      <List className="h-4 w-4" />
                      List
                    </TabsTrigger>
                  </TabsList>

                  {view === "month" && (
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateMonth("prev")} 
                        className="border-2 border-slr-blue/50 hover:bg-slr-blue/20 hover:border-slr-blue backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-md"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="font-bold text-lg text-slr-blue-dark drop-shadow-sm">{monthName}</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateMonth("next")} 
                        className="border-2 border-slr-blue/50 hover:bg-slr-blue/20 hover:border-slr-blue backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-md"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <TabsContent value="month" className="mt-0">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading events...
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg font-medium mb-2">No events found</p>
                      <p className="text-sm">Try adjusting your filters or check back later.</p>
                      {dbEvents.length === 0 && (
                        <p className="text-sm mt-2 text-amber-600">Database appears to be empty. Contact admin.</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-xs sm:text-sm font-bold text-slr-blue py-3 border-b-2 border-slr-blue/30 bg-gradient-to-b from-slr-blue/5 to-transparent">
                          {day}
                        </div>
                      ))}

                      {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[120px] rounded-xl backdrop-blur-sm bg-gradient-to-br from-slate-100/40 to-slate-50/20 dark:from-slate-800/40 dark:to-slate-900/20 border border-slate-200/30 dark:border-slate-700/30" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const dayEvents = getEventsForDay(day)
                        const currentDateObject = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isToday =
                          new Date().toDateString() === currentDateObject.toDateString()

                        return (
                          <div
                            key={day}
                            className={cn(
                              "min-h-[120px] rounded-xl p-2.5 transition-all backdrop-blur-md relative overflow-hidden group cursor-pointer",
                              "bg-gradient-to-br from-white/60 via-white/40 to-white/30 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/30",
                              "border-2 shadow-sm",
                              isToday
                                ? "border-slr-red shadow-lg shadow-slr-red/30 ring-2 ring-slr-red/20"
                                : dayEvents.length > 0
                                  ? "border-slr-red/60 hover:border-slr-red hover:shadow-xl hover:shadow-slr-red/25 hover:ring-2 hover:ring-slr-red/20"
                                  : "border-slr-blue/40 hover:border-slr-blue/60 hover:shadow-lg hover:shadow-slr-blue/15"
                            )}
                            onClick={() => dayEvents.length === 1 ? setSelectedEvent(dayEvents[0]) : dayEvents.length > 1 && setSelectedEvent(dayEvents[0])} // Click opens dialog if one event or falls back to first event if more
                          >
                            <div className={cn(
                              "text-sm font-bold mb-2 relative z-10",
                              isToday ? "text-slr-red drop-shadow-sm" : dayEvents.length > 0 ? "text-slr-red" : "text-slr-blue"
                            )}>
                              {day}
                            </div>
                            <div className="space-y-1.5">
                              {dayEvents.slice(0, 3).map((event) => (
                                <button
                                  key={event.id}
                                  onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                  className={cn(
                                    "w-full text-[10px] px-2 py-1 rounded-md text-left transition-all font-semibold h-7", // FIX 1: Smaller font, padding, and fixed height
                                    "backdrop-blur-sm border shadow-sm",
                                    event.type === "weekly-run"
                                      ? "bg-slr-blue hover:bg-slr-blue-dark text-white border-slr-blue-dark/30 hover:shadow-md"
                                      : "bg-slr-red hover:bg-slr-red-dark text-white border-slr-red-dark/30 hover:shadow-md",
                                    "hover:scale-[1.02] hover:-translate-y-0.5"
                                  )}
                                  title={`${event.title} - ${event.time}`}
                                >
                                  <div className="flex items-center h-full gap-1.5"> {/* FIX 1: Centering content */}
                                    {event.type === "race" ? (
                                      <Trophy className="h-3 w-3 flex-shrink-0" /> // FIX: Removed comment from JSX expression
                                    ) : (
                                      <Activity className="h-3 w-3 flex-shrink-0" /> // FIX: Removed comment from JSX expression
                                    )}
                                    <span className="line-clamp-2 leading-tight">{event.title}</span> {/* FIX 1: Tighter line-height */}
                                  </div>
                                </button>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-[10px] text-slr-red font-bold text-center py-1.5 bg-gradient-to-r from-slr-red/20 via-slr-red/30 to-slr-red/20 rounded-md backdrop-blur-sm border border-slr-red/30 shadow-sm">
                                  +{dayEvents.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading events...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No events match your filters</p>
                          {dbEvents.length === 0 && (
                            <p className="text-sm mt-2 text-amber-600">Database appears to be empty. Contact admin.</p>
                          )}
                        </div>
                      ) : (
                        filteredEvents.map((event) => (
                          <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full text-left">
                            <Card className="border-slr-blue/20 hover:border-slr-blue/50 hover:shadow-lg transition-all hover:-translate-y-1">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-16 text-center bg-slr-blue-light/50 rounded-lg p-2">
                                    <div className="text-2xl font-bold text-primary">{event.date.getDate()}</div>
                                    <div className="text-sm text-slr-blue-dark font-medium">
                                      {event.date.toLocaleDateString("en-US", { month: "short" })}
                                    </div>
                                  </div>

                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between **gap-2**"> {/* FIX 2: Reduced gap */}
                                      <div **className="min-w-0"**> {/* FIX 2: Allows title div to shrink */}
                                        <h4 className="font-semibold text-lg flex items-start gap-2 **truncate**"> {/* FIX 2: Prevents title overflow */}
                                          {event.title}
                                          {event.isRecurring && (
                                            <Badge variant="outline" className="text-xs border-slr-blue text-slr-blue-dark">
                                              Recurring
                                            </Badge>
                                          )}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{event.details}</p>
                                      </div>

                                      <Badge
                                        variant={event.type === "race" ? "destructive" : "default"}
                                        className="**text-xs** shrink-0" // FIX 2: Smaller font for badge
                                      >
                                        {event.type === "race" ? (
                                          <>
                                            <Trophy className="h-3 w-3 mr-1" />
                                            Race
                                          </>
                                        ) : (
                                          <>
                                            <Activity className="h-3 w-3 mr-1" />
                                            Run
                                          </>
                                        )}
                                      </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-slr-blue-dark" />
                                        {event.time}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-slr-blue-dark" />
                                        {event.location}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px] border-slr-blue/20">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedEvent?.type === "race" ? (
                <Trophy className="h-6 w-6 text-slr-red fill-slr-red/20" />
              ) : (
                <Star className="h-6 w-6 fill-slr-blue text-slr-blue" />
              )}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
                {selectedEvent?.details}
            </DialogDescription>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedEvent?.type && (
                <Badge variant={selectedEvent.type === "race" ? "destructive" : "default"}>
                  {selectedEvent.type === "race" ? 'Race' : 'Weekly Run'}
                </Badge>
              )}
              {selectedEvent?.isRecurring && (
                <Badge variant="outline" className="border-slr-blue text-slr-blue-dark">Recurring</Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-slr-blue-dark flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">
                  {selectedEvent?.date.toLocaleDateString("en-US", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-slr-blue-dark flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Time</p>
                <p className="text-muted-foreground">{selectedEvent?.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slr-blue-dark flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{selectedEvent?.location}</p>
              </div>
            </div>
            
            {selectedEvent?.description && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <p className="font-medium text-sm">Notes/Description</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedEvent.description}</p>
                </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            {selectedEvent?.registrationUrl && (
                <Button asChild variant="destructive" className="w-full sm:w-auto">
                    <a href={selectedEvent.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Register Now
                    </a>
                </Button>
            )}
            <Button onClick={() => selectedEvent && addToGoogleCalendar(selectedEvent)} variant="outline" className="w-full sm:w-auto text-slr-blue-dark hover:bg-slr-blue/10 border-slr-blue/50">
                <CalendarDays className="h-4 w-4 mr-2" />
                Google Calendar
            </Button>
            <Button onClick={() => selectedEvent && exportSingleEventToICS(selectedEvent)} variant="outline" className="w-full sm:w-auto text-slr-blue-dark hover:bg-slr-blue/10 border-slr-blue/50">
                <Download className="h-4 w-4 mr-2" />
                Download ICS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
