"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  Star,
  StarOff,
  ChevronUp,
  ChevronDown,
  Trophy,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  type: string
  is_recurring: number
  day_of_week?: number
  is_featured_homepage: number
  display_order: number
}

function FeaturedEventItem({
  event,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  event: Event
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}) {
  const getEventType = (type: string, isRecurring: number) => {
    if (isRecurring) return "Weekly Run"
    if (type === "race") return "Race"
    return "Special Event"
  }

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek]
  }

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex flex-col gap-1 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveUp}
          disabled={index === 0}
          className="h-8 w-8 p-0"
          title="Move up"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="h-8 w-8 p-0"
          title="Move down"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs">
            #{index + 1}
          </Badge>
          <h3 className="font-semibold">{event.title}</h3>
          <Badge variant="secondary">{getEventType(event.type, event.is_recurring)}</Badge>
        </div>

        {event.description && <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {event.is_recurring ? (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {event.day_of_week !== undefined && getDayName(event.day_of_week)}s
            </div>
          ) : (
            event.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.date), "MMM d, yyyy")}
              </div>
            )
          )}

          {event.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.time}
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
        title="Remove from featured"
        className="shrink-0 bg-transparent"
      >
        <StarOff className="w-4 h-4" />
      </Button>
    </div>
  )
}

function AvailableEventItem({ event, onToggle }: { event: Event; onToggle: (eventId: string) => void }) {
  const getEventType = (type: string, isRecurring: number) => {
    if (isRecurring) return "Weekly Run"
    if (type === "race") return "Race"
    return "Special Event"
  }

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek]
  }

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{event.title}</h3>
          <Badge variant="secondary">{getEventType(event.type, event.is_recurring)}</Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {event.is_recurring ? (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {event.day_of_week !== undefined && getDayName(event.day_of_week)}s
            </div>
          ) : (
            event.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.date), "MMM d, yyyy")}
              </div>
            )
          )}

          {event.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.time}
            </div>
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => onToggle(event.id)}>
        <Star className="w-4 h-4 mr-2" />
        Feature
      </Button>
    </div>
  )
}

export default function FeaturedEventsAdmin() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [availableEvents, setAvailableEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [showRaces, setShowRaces] = useState(true)
  const [showRuns, setShowRuns] = useState(true)
  const router = useRouter()

  const moveUp = async (index: number) => {
    if (index === 0) return

    const newOrder = [...featuredEvents]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp

    setFeaturedEvents(newOrder)
    await saveOrder(newOrder.map((item) => item.id))
  }

  const moveDown = async (index: number) => {
    if (index === featuredEvents.length - 1) return

    const newOrder = [...featuredEvents]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp

    setFeaturedEvents(newOrder)
    await saveOrder(newOrder.map((item) => item.id))
  }

  const saveOrder = async (eventIds: string[]) => {
    setSaving(true)
    try {
      console.log("[v0] Saving order:", eventIds)
      const response = await fetch("/api/admin/events/featured/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ eventIds }),
      })

      console.log("[v0] Save order response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] Save order response data:", responseData)

      if (!response.ok) {
        alert(`Failed to save order: ${responseData.details || responseData.error}`)
        await loadEvents()
      } else {
        console.log("[v0] Order saved successfully, reloading to verify...")
        await loadEvents()
      }
    } catch (error) {
      console.error("Failed to save order:", error)
      alert(`Failed to save order: ${error}`)
      await loadEvents()
    } finally {
      setSaving(false)
    }
  }

  const handleToggleFeatured = async (eventId: string, isFeatured: boolean) => {
    try {
      const response = await fetch("/api/admin/events/featured/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, isFeatured }),
      })

      if (response.ok) {
        await loadEvents()
      } else {
        alert("Failed to update featured status")
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error)
      alert("Failed to update featured status")
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/check", {
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        setAuthError(true)
        setTimeout(() => router.push("/admin/login"), 1000)
        return
      }

      const data = await response.json()
      if (!data.authenticated) {
        setAuthError(true)
        setTimeout(() => router.push("/admin/login"), 1000)
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Auth check failed:", error)
      setAuthError(true)
      setTimeout(() => router.push("/admin/login"), 1000)
    } finally {
      setCheckingAuth(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
    }
  }, [isAuthenticated])

  const loadEvents = async () => {
    try {
      const timestamp = Date.now()
      const [featuredRes, allRes] = await Promise.all([
        fetch(`/api/events/featured?_t=${timestamp}`, { cache: "no-store" }),
        fetch(`/api/events/all?_t=${timestamp}`, { cache: "no-store" }),
      ])

      if (featuredRes.ok && allRes.ok) {
        const featured = await featuredRes.json()
        const all = await allRes.json()

        console.log(
          "[v0] Loaded featured events:",
          featured.map((e: Event) => ({ id: e.id, order: e.display_order, title: e.title })),
        )

        setFeaturedEvents(featured)
        setAvailableEvents(all.filter((e: Event) => !e.is_featured_homepage))
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeaturedEvents = featuredEvents.filter((event) => {
    const isRace = event.type === "race"
    const isRun = event.is_recurring || event.type !== "race"
    return (showRaces && isRace) || (showRuns && isRun)
  })

  const filteredAvailableEvents = availableEvents.filter((event) => {
    const isRace = event.type === "race"
    const isRun = event.is_recurring || event.type !== "race"
    return (showRaces && isRace) || (showRuns && isRun)
  })

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (authError || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You must be logged in to access this page. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Homepage Featured Events</h1>
            </div>
          </div>
          {saving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-2">Show:</span>
              <Button
                variant={showRuns ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRuns(!showRuns)}
                className={cn(
                  "gap-2 shadow-lg transition-all",
                  showRuns
                    ? "bg-slr-blue/80 hover:bg-slr-blue text-foreground"
                    : "bg-foreground/5 hover:bg-foreground/10 text-foreground/50 border-foreground/30",
                )}
              >
                <Activity className="h-4 w-4" />
                Weekly Runs
              </Button>
              <Button
                variant={showRaces ? "destructive" : "outline"}
                size="sm"
                onClick={() => setShowRaces(!showRaces)}
                className={cn(
                  "gap-2 shadow-lg transition-all",
                  showRaces
                    ? "bg-slr-red/80 hover:bg-slr-red text-white"
                    : "bg-foreground/5 hover:bg-foreground/10 text-foreground/50 border-foreground/30",
                )}
              >
                <Trophy className="h-4 w-4" />
                Races
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Events ({filteredFeaturedEvents.length})</CardTitle>
            <CardDescription>
              Use the up and down arrows to reorder events. These events will appear prominently on the homepage in this
              order. Recommended: 3-5 featured events for optimal display.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFeaturedEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No featured events match the current filter. {!showRuns && !showRaces && "Enable at least one filter."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeaturedEvents.map((event, index) => {
                  // Find the actual index in the full array for proper move operations
                  const actualIndex = featuredEvents.findIndex((e) => e.id === event.id)
                  return (
                    <FeaturedEventItem
                      key={event.id}
                      event={event}
                      index={actualIndex}
                      total={featuredEvents.length}
                      onMoveUp={() => moveUp(actualIndex)}
                      onMoveDown={() => moveDown(actualIndex)}
                      onRemove={() => handleToggleFeatured(event.id, false)}
                    />
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Events ({filteredAvailableEvents.length})</CardTitle>
            <CardDescription>Click "Feature" to add an event to the homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAvailableEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No available events match the current filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAvailableEvents.map((event) => (
                  <AvailableEventItem key={event.id} event={event} onToggle={(id) => handleToggleFeatured(id, true)} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
