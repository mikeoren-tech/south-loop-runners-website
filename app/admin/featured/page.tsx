"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Loader2, AlertCircle, GripVertical, Star, StarOff } from "lucide-react"
import Link from "next/link"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor, // Added TouchSensor for mobile support
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { format } from "date-fns"

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

function SortableEventItem({ event }: { event: Event }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: event.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

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
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
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
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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
      const [featuredRes, allRes] = await Promise.all([fetch("/api/events/featured"), fetch("/api/events/all")])

      if (featuredRes.ok && allRes.ok) {
        const featured = await featuredRes.json()
        const all = await allRes.json()

        setFeaturedEvents(featured)
        setAvailableEvents(all.filter((e: Event) => !e.is_featured_homepage))
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    console.log("[v0] Drag started:", event.active.id)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    console.log("[v0] Drag ended - active:", active.id, "over:", over?.id)

    if (over && active.id !== over.id) {
      console.log("[v0] Reordering items")
      setFeaturedEvents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        console.log("[v0] Moving from index", oldIndex, "to", newIndex)

        const newOrder = arrayMove(items, oldIndex, newIndex)

        // Save the new order to the backend
        saveOrder(newOrder.map((item) => item.id))

        return newOrder
      })
    } else {
      console.log("[v0] No reorder needed")
    }
  }

  const saveOrder = async (eventIds: string[]) => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/events/featured/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventIds }),
      })

      if (!response.ok) {
        alert("Failed to save order")
      }
    } catch (error) {
      console.error("Failed to save order:", error)
      alert("Failed to save order")
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
          <CardHeader>
            <CardTitle>Featured Events ({featuredEvents.length})</CardTitle>
            <CardDescription>
              Drag and drop to reorder. These events will appear prominently on the homepage in this order. Recommended:
              3-5 featured events for optimal display.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No featured events. Add events from the list below.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={featuredEvents.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {featuredEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-2">
                        <SortableEventItem event={event} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(event.id, false)}
                          title="Remove from featured"
                        >
                          <StarOff className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Events ({availableEvents.length})</CardTitle>
            <CardDescription>Click "Feature" to add an event to the homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : availableEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No available events. All events are featured or no events exist.
              </div>
            ) : (
              <div className="space-y-3">
                {availableEvents.map((event) => (
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
