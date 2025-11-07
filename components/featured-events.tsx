"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Activity, Trophy, ExternalLink, Loader2 } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import useSWR from "swr"
import type { Event } from "@/lib/db"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch events")
    return res.json()
  })

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

export function FeaturedWeeklyRuns() {
  const { data, isLoading, error } = useSWR<Event[]>("/api/events?upcoming=true&type=weekly_run", fetcher, {
    refreshInterval: 60000,
  })

  const events = Array.isArray(data) ? data : []
  const featuredEvents = events.filter((e) => e.is_featured === 1).slice(0, 3)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    console.error("[v0] Error loading weekly runs:", error)
    return null
  }

  if (featuredEvents.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredEvents.map((event, index) => (
        <ScrollReveal key={event.id} delay={index * 100}>
          <Card className="glass-strong rounded-3xl shadow-soft hover-lift h-full border-0">
            <CardHeader>
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {event.title}
              </CardTitle>
              {event.description && <CardDescription>{event.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatEventDate(event.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatEventTime(event.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                {event.meeting_point && (
                  <div className="text-sm text-muted-foreground pl-6">Meeting point: {event.meeting_point}</div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {event.distance && <Badge variant="outline">{event.distance}</Badge>}
                {event.pace && <Badge variant="outline">{event.pace}</Badge>}
              </div>

              {event.registration_url && (
                <Button className="w-full" variant="default" asChild>
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    More Info
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  )
}

export function FeaturedRaces() {
  const { data, isLoading, error } = useSWR<Event[]>("/api/events?upcoming=true&type=race", fetcher, {
    refreshInterval: 60000,
  })

  const events = Array.isArray(data) ? data : []
  const featuredEvents = events.filter((e) => e.is_featured === 1).slice(0, 2)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    console.error("[v0] Error loading races:", error)
    return null
  }

  if (featuredEvents.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {featuredEvents.map((event, index) => (
        <ScrollReveal key={event.id} delay={index * 150}>
          <Card className="glass-strong rounded-3xl shadow-soft hover-lift h-full border-0">
            {event.image_url && (
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-destructive/60 to-primary/60" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-destructive" />
                {event.title}
              </CardTitle>
              {event.description && <CardDescription className="text-base">{event.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 p-4 bg-gradient-to-br from-primary/10 to-destructive/10 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Race Day</div>
                    <div className="text-lg font-bold">{formatEventDate(event.start_datetime)}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatEventTime(event.start_datetime)} • {event.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.distance && <Badge className="bg-destructive/90 text-white border-0">{event.distance}</Badge>}
                {event.pace && <Badge variant="outline">{event.pace}</Badge>}
              </div>

              {event.registration_url && (
                <Button
                  className="w-full bg-destructive/80 hover:bg-destructive/90 text-destructive-foreground"
                  size="lg"
                  asChild
                >
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    Register Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  )
}
