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

// --- Interface Definitions (Required for type safety) ---
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

interface DailySummary {
  isRun: boolean
  isRace: boolean
}

const Tooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <div title={content}>{children}</div>
);

// --- Utility Functions (Complete) ---

function generateWeeklyRunOccurrences(run: DatabaseEvent, startDate: Date, weeks: number): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const start = new Date(startDate)

  if (run.day_of_week === null) return []

  const daysUntilRun = (run.day_of_week - start.getDay() + 7) % 7
  start.setDate(start.getDate() + daysUntilRun)

  for (let i = 0; i < weeks; i++) {
    const eventDate = new Date(start)
    eventDate.setDate(start.getDate() + i * 7)

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
      const start = new Date(event.date);
      const { hour, minutes } = parseEventTime(event.time);
      start.setHours(hour, minutes, 0, 0);
      const end = new Date(start.getTime() + 90 * 60 * 1000);
      const escapeICS = (str: string) => str.replace(/([,;\\\[\]])/g, '\\$1').replace(/\n/g, '\\n');
      const details = event.description || event.details;

      return [
        "BEGIN:VEVENT", `UID:${event.id}@southlooprunners.com`,
        `DTSTAMP:${formatDateForCalendar(new Date())}`,
        `DTSTART:${formatDateForCalendar(start)}`,
        `DTEND:${formatDateForCalendar(end)}`,
        `SUMMARY:${escapeICS(event.title)}`,
        `LOCATION:${escapeICS(event.location)}`,
        `DESCRIPTION:${escapeICS(details)}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const icsContent = [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "PRODID:-//South Loop Runners//Events Calendar//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    icsEvents, "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "south-loop-runners-events.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function addToGoogleCalendar(event: CalendarEvent) {
  const start = new Date(event.date);
  const { hour, minutes } = parseEventTime(event.time);
  start.setHours(hour, minutes, 0, 0);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const googleCalUrl = new URL("https://calendar.google.com/calendar/render");
  googleCalUrl.searchParams.set("action", "TEMPLATE");
  googleCalUrl.searchParams.set("text", event.title);
  googleCalUrl.searchParams.set("dates", `${formatDateForCalendar(start)}/${formatDateForCalendar(end)}`);
  googleCalUrl.searchParams.set("details", event.description || event.details);
  googleCalUrl.searchParams.set("location", event.location);
  window.open(googleCalUrl.toString(), "_blank");
}

function exportSingleEventToICS(event: CalendarEvent) {
  const start = new Date(event.date);
  const { hour, minutes } = parseEventTime(event.time);
  start.setHours(hour, minutes, 0, 0);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const escapeICS = (str: string) => str.replace(/([,;\\\[\]])/g, '\\$1').replace(/\n/g, '\\n');
  const details = event.description || event.details;

  const icsContent = [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "PRODID:-//South Loop Runners//Events Calendar//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:${event.id}@southlooprunners.com`,
    `DTSTAMP:${formatDateForCalendar(new Date())}`,
    `DTSTART:${formatDateForCalendar(start)}`,
    `DTEND:${formatDateForCalendar(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(details)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
    return window.innerWidth < 768 ? "list" : "month"
  }
  return "month"
}

// --- CalendarDayCell Component ---
interface CalendarDayCellProps {
  day: number
  date: Date
  dayEvents: CalendarEvent[]
  dailySummary: DailySummary | undefined
  isToday: boolean
  setSelectedEvent: (event: CalendarEvent) => void
}

function CalendarDayCell({ day, date, dayEvents, dailySummary, isToday, setSelectedEvent }: CalendarDayCellProps) {
  const hasRun = dailySummary?.isRun
  const hasRace = dailySummary?.isRace
  const hasEvents = dayEvents.length > 0;
  
  let ringClass = "border-foreground/30 hover:border-foreground/60";
  let numberColor = "text-foreground/80";
  let gradientWrapperStyle = undefined;
  let innerBgClass = 'bg-foreground/10 backdrop-blur-md';

  if (hasRun && hasRace) {
    gradientWrapperStyle = { 
        background: 'linear-gradient(135deg, var(--slr-blue) 0%, var(--slr-red) 100%)', 
        padding: '1px', 
        borderRadius: '14px' 
    };
    ringClass = "border-none shadow-xl transition-all duration-300 p-[2px]";
    numberColor = "text-foreground drop-shadow-sm";
    innerBgClass = 'bg-foreground/10 backdrop-blur-md'; 
  } else if (hasRace) {
    ringClass = "border-2 border-slr-red/80 ring-2 ring-slr-red/30 shadow-lg";
    numberColor = "text-slr-red";
  } else if (hasRun) {
    ringClass = "border-2 border-slr-blue/80 ring-2 ring-slr-blue/30 shadow-lg";
    numberColor = "text-slr-blue";
  }
  
  return (
    <div
      className={cn(
        "min-h-[120px] rounded-2xl p-2.5 transition-all relative overflow-hidden group cursor-pointer",
        ringClass,
        hasEvents ? "bg-foreground/10 hover:bg-foreground/20" : "bg-foreground/5 hover:bg-foreground/10",
      )}
      onClick={() => hasEvents && (dayEvents.length === 1 ? setSelectedEvent(dayEvents[0]) : setSelectedEvent(dayEvents[0]))}
      style={gradientWrapperStyle}
    >
        <div className={cn(
            'h-full w-full rounded-xl p-1',
            innerBgClass,
        )}>
            <div className={cn(
                "text-sm font-bold mb-2 relative z-10",
                numberColor
            )}>
                {day}
            </div>
            
            <div className="space-y-1.5">
                {dayEvents.slice(0, 3).map((event) => (
                <Tooltip key={event.id} content={`${event.title} - ${event.time}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                        className={cn(
                        "w-full text-[10px] px-2 py-1 rounded-md text-left transition-all font-semibold h-7 shadow-md", // Removed explicit text-foreground
                        "bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-foreground/30",
                        event.type === "weekly-run"
                            ? "bg-slr-blue/70 hover:bg-slr-blue **text-slr-blue-dark**" // FIX: Dark text for contrast on light blue
                            : "bg-slr-red/70 hover:bg-slr-red **text-foreground**" // foreground text is fine on dark red
                        )}
                    >
                        <div className="flex items-center h-full gap-1.5">
                            {event.type === "race" ? (
                                <Trophy className="h-3 w-3 flex-shrink-0" />
                            ) : (
                                <Activity className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="line-clamp-2 leading-tight">{event.title}</span>
                        </div>
                    </button>
                </Tooltip>
                ))}
                {dayEvents.length > 3 && (
                <div className="text-[10px] text-foreground/80 font-bold text-center py-1.5 bg-black/20 rounded-md backdrop-blur-sm border border-foreground/30 shadow-sm">
                    +{dayEvents.length - 3} more
                </div>
                )}
            </div>
        </div>
    </div>
  )
}


// --- Main CalendarView Component ---

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "list">(getInitialView)
  const [filters, setFilters] = useState<Set<string>>(new Set(["weekly-run", "race"]))
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dbEvents, setDbEvents] = useState<DatabaseEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)


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
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

    dbEvents.forEach((event) => {
      if (event.is_recurring && event.day_of_week !== null) {
        const occurrences = generateWeeklyRunOccurrences(event, new Date(), 12)
        events.push(...occurrences)
      } else if (event.date) {
        const [year, month, day] = event.date.split("-").map(Number)
        const localDate = new Date(year, month - 1, day)
        
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

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [dbEvents, isLoading])

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => filters.has(event.type))
  }, [allEvents, filters])
  
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
      return event.date.getFullYear() === year && event.date.getMonth() === month
    })
  }, [filteredEvents, currentDate])

  const dailyEventSummary = useMemo(() => {
    const summary = new Map<number, { isRun: boolean, isRace: boolean }>();
    monthEvents.forEach(event => {
      const day = event.date.getDate();
      const current = summary.get(day) || { isRun: false, isRace: false };
      if (event.type === 'weekly-run') {
        current.isRun = true;
      }
      if (event.type === 'race') {
        current.isRace = true;
      }
      summary.set(day, current);
    });
    return summary;
  }, [monthEvents]);

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

  // --- Start Render ---
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
          <Card className="rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-md shadow-2xl transition-shadow p-0"> 
            <CardContent className="p-6">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                {/* Filters Group (Left side) */}
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-foreground" />
                  <Button
                    variant={filters.has("weekly-run") ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setFilters(toggleFilter(filters, "weekly-run"))}
                    className="gap-2 bg-slr-blue/80 hover:bg-slr-blue text-foreground shadow-lg"
                  >
                    <Activity className="h-4 w-4" />
                    Weekly Runs
                  </Button>
                  <Button
                    variant={filters.has("race") ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => setFilters(toggleFilter(filters, "race"))}
                    className="gap-2 bg-slr-red/80 hover:bg-slr-red text-foreground shadow-lg"
                  >
                    <Trophy className="h-4 w-4" />
                    Races
                  </Button>
                </div>

                {/* CTA/Download Group (Right side) */}
                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto md:justify-end"> 
                  <Button
                    onClick={() => exportToICS(filteredEvents)}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-foreground hover:bg-foreground/20"
                  >
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                  {!subscribed && (
                    <Button
                      onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}
                      variant={isNotificationExpanded ? "outline" : "default"}
                      size="sm"
                      className="gap-2 bg-foreground/20 hover:bg-foreground/30 text-foreground"
                    >
                      <Bell className="h-4 w-4" />
                      {isNotificationExpanded ? "Close" : "Get Notifications"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Notification input area */}
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
                    className="flex-1 bg-foreground/30 border-foreground/50 text-foreground placeholder:text-foreground/70 focus:ring-2 focus:ring-slr-blue"
                  />
                  <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-foreground">
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>

              {/* Subscription success message */}
              {subscribed && (
                <div className="flex items-center gap-2 text-foreground bg-green-500/50 p-3 rounded-lg mt-4">
                  <Star className="h-4 w-4 fill-foreground" />
                  <span className="text-sm font-medium">You're subscribed to event updates!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Card className="rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")} className="w-full">
                
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-foreground/20 backdrop-blur-sm border border-foreground/40 shadow-xl rounded-xl">
                    <TabsTrigger value="month" className="gap-2 data-[state=active]:bg-slr-blue/80 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:rounded-lg">
                      <CalendarDays className="h-4 w-4" />
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-slr-blue/80 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:rounded-lg">
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
                        className="border-foreground/50 hover:bg-foreground/20 bg-foreground/10 text-foreground backdrop-blur-md shadow-md rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="font-bold text-lg text-foreground drop-shadow-sm">{monthName}</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateMonth("next")} 
                        className="border-foreground/50 hover:bg-foreground/20 bg-foreground/10 text-foreground backdrop-blur-md shadow-md rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <TabsContent value="month" className="mt-0">
                  {/* Assuming loading/empty state checks are rendered correctly here */}
                  
                  <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {/* Day labels (Sun, Mon, etc.) */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs sm:text-sm font-bold text-foreground py-3 border-b border-foreground/50 bg-foreground/20 rounded-t-lg">
                        {day}
                      </div>
                    ))}

                    {/* Renders leading empty cells before the 1st */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-leading-${i}`} className="min-h-[120px] rounded-2xl bg-foreground/5 border border-foreground/20" />
                    ))}

                    {/* Renders the cells for each day of the month using the fixed component */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const dayEvents = getEventsForDay(day)
                      const currentDateObject = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const isToday =
                        new Date().toDateString() === currentDateObject.toDateString()

                      return (
                        <CalendarDayCell
                          key={day}
                          day={day}
                          date={currentDateObject}
                          dayEvents={dayEvents}
                          dailySummary={dailyEventSummary.get(day)}
                          isToday={isToday}
                          setSelectedEvent={setSelectedEvent}
                        />
                      )
                    })}
                     {/* Renders trailing empty cells after the last day */}
                     {Array.from({ length: 42 - daysInMonth - startingDayOfWeek }).map((_, i) => (
                       <div key={`empty-trailing-${i}`} className="min-h-[120px] rounded-2xl bg-foreground/5 border border-foreground/20" />
                     ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  {isLoading ? (
                    <div className="text-center py-12 text-foreground/70">Loading events...</div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12 text-foreground/70">No events found.</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map((event) => (
                        <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full text-left">
                          <Card className="rounded-xl border-foreground/30 bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md hover:shadow-2xl transition-all hover:-translate-y-0.5">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-16 text-center bg-black/20 rounded-lg p-2 text-foreground">
                                  <div className="text-2xl font-bold">{event.date.getDate()}</div>
                                  <div className="text-sm font-medium">
                                    {event.date.toLocaleDateString("en-US", { month: "short" })}
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <h4 className="font-semibold text-lg flex items-start gap-2 truncate text-foreground">
                                        {event.title}
                                        {event.isRecurring && (
                                          <Badge variant="outline" className="text-xs border-foreground/50 text-foreground bg-foreground/10">Recurring</Badge>
                                        )}
                                      </h4>
                                      <p className="text-sm text-foreground/80">{event.details}</p>
                                    </div>
                                    <Badge
                                      variant={event.type === "race" ? "destructive" : "default"}
                                      className={cn("text-xs shrink-0 text-foreground", event.type === "race" ? "bg-slr-red/80" : "bg-slr-blue/80")}
                                    >
                                      {event.type === "race" ? (<><Trophy className="h-3 w-3 mr-1" />Race</>) : (<><Activity className="h-3 w-3 mr-1" />Run</>)}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                                    <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-foreground" />{event.time}</div>
                                    <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-foreground" />{event.location}</div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {/* COMPLETED DIALOG CONTENT */}
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-xl shadow-2xl text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedEvent?.type === "race" ? (
                <Trophy className="h-6 w-6 text-slr-red fill-slr-red/20" />
              ) : (
                <Star className="h-6 w-6 fill-slr-blue text-slr-blue" />
              )}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription className="text-base font-medium text-foreground/80">
                {selectedEvent?.details}
            </DialogDescription>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedEvent?.type && (
                <Badge 
                  variant={selectedEvent.type === "race" ? "destructive" : "default"}
                  className={cn("text-foreground", selectedEvent.type === "race" ? "bg-slr-red/80" : "bg-slr-blue/80")}
                >
                  {selectedEvent.type === "race" ? 'Race' : 'Weekly Run'}
                </Badge>
              )}
              {selectedEvent?.isRecurring && (
                <Badge variant="outline" className="border-foreground/50 text-foreground bg-foreground/10">Recurring</Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-slr-blue-dark flex-shrink-0 text-foreground" />
              <div className="text-sm">
                <p className="font-medium">Date</p>
                <p className="text-foreground/80">
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
              <Clock className="h-5 w-5 text-slr-blue-dark flex-shrink-0 text-foreground" />
              <div className="text-sm">
                <p className="font-medium">Time</p>
                <p className="text-foreground/80">{selectedEvent?.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slr-blue-dark flex-shrink-0 mt-1 text-foreground" />
              <div className="text-sm">
                <p className="font-medium">Location</p>
                <p className="text-foreground/80">{selectedEvent?.location}</p>
              </div>
            </div>
            
            {selectedEvent?.description && (
                <div className="space-y-2 pt-2 border-t border-foreground/30">
                    <p className="font-medium text-sm">Notes/Description</p>
                    <p className="text-sm text-foreground/80 foregroundspace-pre-line">{selectedEvent.description}</p>
                </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t border-foreground/30">
            {selectedEvent?.registrationUrl && (
                <Button asChild variant="destructive" className="w-full sm:w-auto bg-slr-red/80 hover:bg-slr-red text-foreground">
                    <a href={selectedEvent.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Register Now
                    </a>
                </Button>
            )}
            <Button onClick={() => selectedEvent && addToGoogleCalendar(selectedEvent)} variant="outline" className="w-full sm:w-auto text-foreground hover:bg-foreground/20 border-foreground/50 bg-foreground/10">
                <CalendarDays className="h-4 w-4 mr-2" />
                Google Calendar
            </Button>
            <Button onClick={() => selectedEvent && exportSingleEventToICS(selectedEvent)} variant="outline" className="w-full sm:w-auto text-foreground hover:bg-foreground/20 border-foreground/50 bg-foreground/10">
                <Download className="h-4 w-4 mr-2" />
                Download ICS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
