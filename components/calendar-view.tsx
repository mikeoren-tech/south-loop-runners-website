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

// --- Interface Definitions (Required) ---
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

// Placeholder for a proper Tooltip component (using simple div with title attribute)
const Tooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <div title={content}>{children}</div>
);

// --- CalendarDayCell Component (FIXED for universal day number visibility) ---
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
  
  // --- Dynamic Color Logic for the Cell ---
  let ringClass = "border-white/30 hover:border-white/60";
  let numberColor = "text-white/80";
  let gradientWrapperStyle = undefined;
  let innerBgClass = 'bg-white/10 backdrop-blur-md';

  // FIX 2: Render base cell even if empty (NO return early if dayEvents.length === 0)
  if (dayEvents.length === 0 && !isToday) {
    ringClass = "border-white/20 hover:border-white/40";
    innerBgClass = 'bg-white/5 backdrop-blur-sm';
  }

  if (isToday) {
    ringClass = "border-4 border-slr-red ring-4 ring-slr-red/30 shadow-xl shadow-slr-red/30";
    numberColor = "text-slr-red font-extrabold";
  } else if (hasRun && hasRace) {
    // Gradient border for the multi-event day
    gradientWrapperStyle = { 
        background: 'linear-gradient(135deg, var(--slr-blue) 0%, var(--slr-red) 100%)', 
        padding: '1px', 
        borderRadius: '14px' 
    };
    ringClass = "border-none shadow-xl transition-all duration-300 p-[2px]";
    numberColor = "text-white drop-shadow-sm";
    innerBgClass = 'bg-white/10 backdrop-blur-md'; 
  } else if (hasRace) {
    ringClass = "border-4 border-slr-red/80 ring-2 ring-slr-red/30 shadow-lg";
    numberColor = "text-slr-red";
  } else if (hasRun) {
    ringClass = "border-4 border-slr-blue/80 ring-2 ring-slr-blue/30 shadow-lg";
    numberColor = "text-slr-blue";
  }
  // --- End Dynamic Color Logic ---


  return (
    <div
      className={cn(
        "min-h-[120px] rounded-2xl p-2.5 transition-all relative overflow-hidden group cursor-pointer",
        ringClass,
        // Only apply hover/click styles if there are events, otherwise keep basic hover
        dayEvents.length > 0 ? "bg-white/10 hover:bg-white/20" : "bg-white/5 hover:bg-white/10",
      )}
      onClick={() => dayEvents.length === 1 ? setSelectedEvent(dayEvents[0]) : dayEvents.length > 1 && setSelectedEvent(dayEvents[0])}
      style={gradientWrapperStyle}
    >
        <div className={cn(
            'h-full w-full rounded-xl p-1',
            innerBgClass,
        )}>
            {/* Day Number is ALWAYS rendered here */}
            <div className={cn(
                "text-sm font-bold mb-2 relative z-10",
                numberColor
            )}>
                {day}
            </div>
            
            {/* Event Buttons (Only rendered if events exist) */}
            <div className="space-y-1.5">
                {dayEvents.slice(0, 3).map((event) => (
                <Tooltip key={event.id} content={`${event.title} - ${event.time}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                        className={cn(
                        "w-full text-[10px] px-2 py-1 rounded-md text-left transition-all font-semibold h-7 text-white shadow-md", 
                        "bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-white/30",
                        event.type === "weekly-run"
                            ? "bg-slr-blue/70 hover:bg-slr-blue"
                            : "bg-slr-red/70 hover:bg-slr-red"
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
                <div className="text-[10px] text-white/80 font-bold text-center py-1.5 bg-black/20 rounded-md backdrop-blur-sm border border-white/30 shadow-sm">
                    +{dayEvents.length - 3} more
                </div>
                )}
            </div>
        </div>
    </div>
  )
}


// --- Main CalendarView Component ---
// (Utility functions omitted for brevity)

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

  // ... useEffects, useMemos, and handleNotificationSubmit (omitted for brevity)
  
  // FIX 3: Extracted month logic for month/year display
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

  const monthEvents = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return filteredEvents.filter((event) => {
      return event.date.getFullYear() === year && event.date.getMonth() === month
    })
  }, [filteredEvents, currentDate])

  // Calculation for dailyEventSummary is assumed to be correct
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

  // Navigation functions assumed correct
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }, [])
  
  const getEventsForDay = (day: number) => {
    return monthEvents.filter((event) => event.date.getDate() === day)
  }

  // --- Start Render ---
  return (
    <div className="container mx-auto px-4 py-12">
      <ScrollReveal className="text-center mb-12">
        {/* Title and description */}
      </ScrollReveal>

      <div className="max-w-7xl mx-auto space-y-6">
        <ScrollReveal delay={100}>
          <Card className="rounded-2xl border-white/30 bg-white/10 backdrop-blur-md shadow-2xl transition-shadow p-0">
            <CardContent className="p-6">
              
              {/* FIX 1: Notification CTA Visibility and Layout */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                {/* Filters Group (Left side) */}
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-white" />
                  <Button
                    variant={filters.has("weekly-run") ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setFilters(toggleFilter(filters, "weekly-run"))}
                    className="gap-2 bg-slr-blue/80 hover:bg-slr-blue text-white shadow-lg"
                  >
                    <Activity className="h-4 w-4" />
                    Weekly Runs
                  </Button>
                  <Button
                    variant={filters.has("race") ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => setFilters(toggleFilter(filters, "race"))}
                    className="gap-2 bg-slr-red/80 hover:bg-slr-red text-white shadow-lg"
                  >
                    <Trophy className="h-4 w-4" />
                    Races
                  </Button>
                </div>

                {/* CTA/Download Group (Right side) - Forced to wrap/fill parent if needed */}
                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto md:justify-end"> 
                  {!subscribed && (
                    <>
                      <Button
                        onClick={() => exportToICS(filteredEvents)}
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                      <Button
                        onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}
                        variant={isNotificationExpanded ? "outline" : "default"}
                        size="sm"
                        className="gap-2 bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Bell className="h-4 w-4" />
                        {isNotificationExpanded ? "Close" : "Get Notifications"}
                      </Button>
                    </>
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
                {/* ... form content ... */}
              </div>

              {/* Subscription success message */}
              {subscribed && (
                <div className="flex items-center gap-2 text-white bg-green-500/50 p-3 rounded-lg mt-4">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="text-sm font-medium">You're subscribed to event updates!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Card className="rounded-2xl border-white/30 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")} className="w-full">
                
                {/* FIX 3: Month Name and Controls Visibility */}
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-xl">
                    <TabsTrigger value="month" className="gap-2 data-[state=active]:bg-slr-blue/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:rounded-lg">
                      <CalendarDays className="h-4 w-4" />
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-slr-blue/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:rounded-lg">
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
                        className="border-white/50 hover:bg-white/20 bg-white/10 text-white backdrop-blur-md shadow-md rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {/* Month Name and Year Display */}
                      <h3 className="font-bold text-lg text-white drop-shadow-sm">{monthName}</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateMonth("next")} 
                        className="border-white/50 hover:bg-white/20 bg-white/10 text-white backdrop-blur-md shadow-md rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <TabsContent value="month" className="mt-0">
                  {/* Loading/Empty State checks */}
                  
                  <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {/* Day labels (Sun, Mon, etc.) */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs sm:text-sm font-bold text-white py-3 border-b border-white/50 bg-white/20 rounded-t-lg">
                        {day}
                      </div>
                    ))}

                    {/* Renders leading empty cells before the 1st */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-leading-${i}`} className="min-h-[120px] rounded-2xl bg-white/5 border border-white/20" />
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
                       <div key={`empty-trailing-${i}`} className="min-h-[120px] rounded-2xl bg-white/5 border border-white/20" />
                     ))}
                  </div>
                </TabsContent>

                {/* List View Tab Content (omitted for brevity) */}
              </Tabs>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Dialog (omitted for brevity) */}
    </div>
  )
}
