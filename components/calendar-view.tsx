"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
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
} from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

    events.push({
      id: `${run.id}-${eventDate.toISOString()}`,
      title: run.title,
      date: eventDate,
      time: run.time,
      location: run.location,
      type: run.type === "race" ? "race" : "weekly-run",
      details: `${run.distance || ""} • ${run.pace || ""}`.trim(),
      isRecurring: true,
      description: run.description,
      facebookLink: run.facebook_link || undefined,
      stravaLink: run.strava_link || undefined,
    })
  }

  return events
}

function exportToICS(events: CalendarEvent[]) {
  const icsEvents = events
    .map((event) => {
      const start = new Date(event.date)
      const [hours, minutes] = event.time.split(":")
      const period = event.time.includes("PM") ? "PM" : "AM"
      let hour = Number.parseInt(hours)
      if (period === "PM" && hour !== 12) hour += 12
      if (period === "AM" && hour === 12) hour = 0

      start.setHours(hour, Number.parseInt(minutes.replace(/[^\d]/g, "")), 0)
      const end = new Date(start.getTime() + 90 * 60 * 1000)

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      }

      return [
        "BEGIN:VEVENT",
        `UID:${event.id}@southlooprunners.com`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location}`,
        `DESCRIPTION:${event.details}`,
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

function addToGoogleCalendar(events: CalendarEvent[]) {
  const nextEvent = events.find((e) => e.date >= new Date())
  if (!nextEvent) return

  const start = new Date(nextEvent.date)
  const [hours, minutes] = nextEvent.time.split(":")
  const period = nextEvent.time.includes("PM") ? "PM" : "AM"
  let hour = Number.parseInt(hours)
  if (period === "PM" && hour !== 12) hour += 12
  if (period === "AM" && hour === 12) hour = 0
  start.setHours(hour, Number.parseInt(minutes.replace(/[^\d]/g, "")), 0)

  const end = new Date(start.getTime() + 90 * 60 * 1000)

  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const googleCalUrl = new URL("https://calendar.google.com/calendar/render")
  googleCalUrl.searchParams.set("action", "TEMPLATE")
  googleCalUrl.searchParams.set("text", nextEvent.title)
  googleCalUrl.searchParams.set("dates", `${formatGoogleDate(start)}/${formatGoogleDate(end)}`)
  googleCalUrl.searchParams.set("details", nextEvent.details)
  googleCalUrl.searchParams.set("location", nextEvent.location)

  window.open(googleCalUrl.toString(), "_blank")
}

function addSingleEventToGoogleCalendar(event: CalendarEvent) {
  const start = new Date(event.date)
  const [hours, minutes] = event.time.split(":")
  const period = event.time.includes("PM") ? "PM" : "AM"
  let hour = Number.parseInt(hours)
  if (period === "PM" && hour !== 12) hour += 12
  if (period === "AM" && hour === 12) hour = 0
  start.setHours(hour, Number.parseInt(minutes.replace(/[^\d]/g, "")), 0)

  const end = new Date(start.getTime() + 90 * 60 * 1000)

  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const googleCalUrl = new URL("https://calendar.google.com/calendar/render")
  googleCalUrl.searchParams.set("action", "TEMPLATE")
  googleCalUrl.searchParams.set("text", event.title)
  googleCalUrl.searchParams.set("dates", `${formatGoogleDate(start)}/${formatGoogleDate(end)}`)
  googleCalUrl.searchParams.set("details", event.details)
  googleCalUrl.searchParams.set("location", event.location)

  window.open(googleCalUrl.toString(), "_blank")
}

function exportSingleEventToICS(event: CalendarEvent) {
  const start = new Date(event.date)
  const [hours, minutes] = event.time.split(":")
  const period = event.time.includes("PM") ? "PM" : "AM"
  let hour = Number.parseInt(hours)
  if (period === "PM" && hour !== 12) hour += 12
  if (period === "AM" && hour === 12) hour = 0

  start.setHours(hour, Number.parseInt(minutes.replace(/[^\d]/g, "")), 0)
  const end = new Date(start.getTime() + 90 * 60 * 1000)

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//South Loop Runners//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@southlooprunners.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.details}`,
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

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "list">("month")
  const [filters, setFilters] = useState<Set<string>>(new Set(["weekly-run", "race"]))
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dbEvents, setDbEvents] = useState<DatabaseEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events/all")
        if (response.ok) {
          const data = await response.json()
          setDbEvents(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch events:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const allEvents = useMemo(() => {
    if (isLoading || dbEvents.length === 0) return []

    const events: CalendarEvent[] = []

    dbEvents.forEach((event) => {
      if (event.is_recurring && event.day_of_week !== null) {
        const occurrences = generateWeeklyRunOccurrences(event, new Date(), 12)
        events.push(...occurrences)
      } else if (event.date) {
        const [year, month, day] = event.date.split("-").map(Number)
        const localDate = new Date(year, month - 1, day)

        events.push({
          id: event.id,
          title: event.title,
          date: localDate,
          time: event.time,
          location: event.location,
          type: event.type === "race" ? "race" : "weekly-run",
          details: event.distances ? JSON.parse(event.distances).join(", ") : event.distance || "",
          isRecurring: false,
          description: event.description,
          facebookLink: event.facebook_link || undefined,
          stravaLink: event.strava_link || undefined,
          registrationUrl: event.registration_url || undefined,
        })
      }
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [dbEvents, isLoading])

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => filters.has(event.type))
  }, [allEvents, filters])

  const monthEvents = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return filteredEvents.filter((event) => {
      return event.date.getFullYear() === year && event.date.getMonth() === month
    })
  }, [filteredEvents, currentDate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }

  const getEventsForDay = (day: number) => {
    return monthEvents.filter((event) => event.date.getDate() === day)
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
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
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] to-white py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events Calendar</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View all upcoming weekly runs and races. Never miss an event!
          </p>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto space-y-6">
          <ScrollReveal delay={100}>
            <Card className="glass-strong border-0">
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
                      variant={filters.has("race") ? "default" : "outline"}
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
                      <Button
                        onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}
                        variant={isNotificationExpanded ? "secondary" : "default"}
                        size="sm"
                        className="gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        {isNotificationExpanded ? "Close" : "Sign up for event notifications"}
                      </Button>
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
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </form>
                </div>

                {subscribed && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 p-3 rounded-lg mt-4">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">You're subscribed to event updates!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Card className="glass-strong border-0">
              <CardContent className="p-6">
                <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="month" className="gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Month
                      </TabsTrigger>
                      <TabsTrigger value="list" className="gap-2">
                        <List className="h-4 w-4" />
                        List
                      </TabsTrigger>
                    </TabsList>

                    {view === "month" && (
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="font-semibold text-lg">{monthName}</h3>
                        <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <TabsContent value="month" className="mt-0">
                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}

                      {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const dayEvents = getEventsForDay(day)
                        const isToday =
                          new Date().toDateString() ===
                          new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                        return (
                          <div
                            key={day}
                            className={cn(
                              "aspect-square border rounded-lg p-2 transition-colors hover:bg-muted/50",
                              isToday && "border-primary bg-primary/5",
                            )}
                          >
                            <div className="text-sm font-medium mb-1">{day}</div>
                            <div className="space-y-1">
                              {dayEvents.map((event) => (
                                <button
                                  key={event.id}
                                  onClick={() => setSelectedEvent(event)}
                                  className={cn(
                                    "w-full text-xs p-1 rounded truncate text-left hover:opacity-80 transition-opacity",
                                    event.type === "weekly-run"
                                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
                                  )}
                                  title={`${event.title} - ${event.time}`}
                                >
                                  {event.type === "race" ? (
                                    <Trophy className="h-3 w-3 inline mr-1" />
                                  ) : (
                                    <Activity className="h-3 w-3 inline mr-1" />
                                  )}
                                  {event.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="list" className="mt-0">
                    <div className="space-y-4">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No events match your filters</p>
                        </div>
                      ) : (
                        filteredEvents.map((event) => (
                          <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full text-left">
                            <Card className="glass border-0 hover-lift transition-transform">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-16 text-center">
                                    <div className="text-2xl font-bold">{event.date.getDate()}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {event.date.toLocaleDateString("en-US", { month: "short" })}
                                    </div>
                                  </div>

                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <h4 className="font-semibold text-lg flex items-center gap-2">
                                          {event.title}
                                          {event.isRecurring && (
                                            <Badge variant="outline" className="text-xs">
                                              Recurring
                                            </Badge>
                                          )}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{event.details}</p>
                                      </div>

                                      <Badge
                                        variant={event.type === "race" ? "destructive" : "default"}
                                        className="shrink-0"
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
                                        <Clock className="h-4 w-4" />
                                        {event.time}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px] glass-strong border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedEvent?.type === "race" ? (
                <Trophy className="h-6 w-6 text-red-600" />
              ) : (
                <Activity className="h-6 w-6 text-blue-600" />
              )}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-base">{selectedEvent?.details}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedEvent?.description && <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {selectedEvent?.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent?.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent?.location}</span>
              </div>
            </div>

            {(selectedEvent?.facebookLink || selectedEvent?.stravaLink || selectedEvent?.registrationUrl) && (
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">RSVP & More Info</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.facebookLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedEvent.facebookLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Facebook
                      </a>
                    </Button>
                  )}
                  {selectedEvent.stravaLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedEvent.stravaLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Strava
                      </a>
                    </Button>
                  )}
                  {selectedEvent.registrationUrl && (
                    <Button variant="default" size="sm" asChild>
                      <a
                        href={selectedEvent.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Register
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Add to your calendar</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => selectedEvent && addSingleEventToGoogleCalendar(selectedEvent)}
                  className="gap-2 w-full"
                >
                  <ExternalLink className="h-4 w-4" />
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => selectedEvent && exportSingleEventToICS(selectedEvent)}
                  className="gap-2 w-full"
                >
                  <Download className="h-4 w-4" />
                  Apple / Outlook
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
