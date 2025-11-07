"use client"

import type React from "react"
import { useState, useMemo } from "react"
import useSWR from "swr"
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
  Loader2,
} from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Event } from "@/lib/db"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatEventTime(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function exportToICS(events: Event[]) {
  const icsEvents = events
    .map((event) => {
      const start = new Date(event.start_datetime)
      const end = event.end_datetime ? new Date(event.end_datetime) : new Date(start.getTime() + 90 * 60 * 1000) // 90 min duration

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
        `DESCRIPTION:${event.description || event.distance || ""}`,
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

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "list">("month")
  const [filters, setFilters] = useState<Set<string>>(new Set(["weekly_run", "race"]))
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const { data: allEvents = [], isLoading } = useSWR<Event[]>("/api/events?upcoming=true", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => filters.has(event.event_type))
  }, [allEvents, filters])

  const monthEvents = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.start_datetime)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
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
    return monthEvents.filter((event) => {
      const eventDate = new Date(event.start_datetime)
      return eventDate.getDate() === day
    })
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
        setIsNotificationExpanded(false)
        setTimeout(() => setSubscribed(false), 5000)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Subscription error:", error)
      alert("Failed to subscribe. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSingleEventToGoogleCalendar = (event: Event) => {
    const start = new Date(event.start_datetime)
    const end = event.end_datetime ? new Date(event.end_datetime) : new Date(start.getTime() + 90 * 60 * 1000)

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const googleCalUrl = new URL("https://calendar.google.com/calendar/render")
    googleCalUrl.searchParams.set("action", "TEMPLATE")
    googleCalUrl.searchParams.set("text", event.title)
    googleCalUrl.searchParams.set("dates", `${formatGoogleDate(start)}/${formatGoogleDate(end)}`)
    googleCalUrl.searchParams.set("details", event.description || event.distance || "")
    googleCalUrl.searchParams.set("location", event.location)

    window.open(googleCalUrl.toString(), "_blank")
  }

  const exportSingleEventToICS = (event: Event) => {
    exportToICS([event])
  }

  const toggleFilter = (type: string) => {
    const newFilters = new Set(filters)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    setFilters(newFilters)
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
                      variant={filters.has("weekly_run") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter("weekly_run")}
                      className="gap-2"
                    >
                      <Activity className="h-4 w-4" />
                      Weekly Runs
                    </Button>
                    <Button
                      variant={filters.has("race") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter("race")}
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
                        {isNotificationExpanded ? "Close" : "Get notifications"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToICS(filteredEvents)}
                      disabled={filteredEvents.length === 0}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export All
                    </Button>
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
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
                                      event.event_type === "weekly_run"
                                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                        : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
                                    )}
                                    title={`${event.title} - ${formatEventTime(event.start_datetime)}`}
                                  >
                                    {event.event_type === "race" ? (
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
                          filteredEvents.map((event) => {
                            const eventDate = new Date(event.start_datetime)
                            return (
                              <button
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className="w-full text-left"
                              >
                                <Card className="glass border-0 hover-lift transition-transform">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                      <div className="flex-shrink-0 w-16 text-center">
                                        <div className="text-2xl font-bold">{eventDate.getDate()}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {eventDate.toLocaleDateString("en-US", { month: "short" })}
                                        </div>
                                      </div>

                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                          <div>
                                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                              {event.title}
                                              {event.is_featured === 1 && (
                                                <Badge variant="outline" className="text-xs">
                                                  Featured
                                                </Badge>
                                              )}
                                            </h4>
                                            {event.description && (
                                              <p className="text-sm text-muted-foreground line-clamp-2">
                                                {event.description}
                                              </p>
                                            )}
                                          </div>

                                          <Badge
                                            variant={event.event_type === "race" ? "destructive" : "default"}
                                            className="shrink-0"
                                          >
                                            {event.event_type === "race" ? (
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
                                            {formatEventTime(event.start_datetime)}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {event.location}
                                          </div>
                                        </div>

                                        {(event.distance || event.pace) && (
                                          <div className="flex flex-wrap gap-2">
                                            {event.distance && <Badge variant="outline">{event.distance}</Badge>}
                                            {event.pace && <Badge variant="outline">{event.pace}</Badge>}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </button>
                            )
                          })
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px] glass-strong border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedEvent?.event_type === "race" ? (
                <Trophy className="h-6 w-6 text-red-600" />
              ) : (
                <Activity className="h-6 w-6 text-blue-600" />
              )}
              {selectedEvent?.title}
            </DialogTitle>
            {selectedEvent?.description && (
              <DialogDescription className="text-base">{selectedEvent.description}</DialogDescription>
            )}
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatEventDate(selectedEvent.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatEventTime(selectedEvent.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                  {selectedEvent.meeting_point && ` • ${selectedEvent.meeting_point}`}
                </div>
              </div>

              {(selectedEvent.distance || selectedEvent.pace) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {selectedEvent.distance && <Badge variant="outline">Distance: {selectedEvent.distance}</Badge>}
                  {selectedEvent.pace && <Badge variant="outline">Pace: {selectedEvent.pace}</Badge>}
                </div>
              )}

              {selectedEvent.registration_url && (
                <div className="pt-2 border-t">
                  <Button variant="default" asChild className="w-full">
                    <a href={selectedEvent.registration_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Register for Event
                    </a>
                  </Button>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Add to your calendar</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => addSingleEventToGoogleCalendar(selectedEvent)}
                    className="gap-2 w-full"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportSingleEventToICS(selectedEvent)}
                    className="gap-2 w-full"
                  >
                    <Download className="h-4 w-4" />
                    ICS File
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
