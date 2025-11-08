"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, Clock, MapPin, RotateCcw, Loader2 } from "lucide-react"
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
}

interface EventListProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: () => void
}

export function EventList({ events, onEdit, onDelete }: EventListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [resetting, setResetting] = useState<string | null>(null)

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    setDeleting(eventId)
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete()
      } else {
        alert("Failed to delete event")
      }
    } catch (error) {
      alert("Failed to delete event")
    } finally {
      setDeleting(null)
    }
  }

  const handleResetPaceInterests = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Reset all pace group counts for "${eventTitle}"? This will set all counts to 0.`)) return

    setResetting(eventId)
    try {
      const response = await fetch(`/api/admin/events/reset-pace-interests/${eventId}`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || "Pace group counts reset successfully!")
      } else {
        alert("Failed to reset pace group counts")
      }
    } catch (error) {
      console.error("[v0] Error resetting pace interests:", error)
      alert("Failed to reset pace group counts")
    } finally {
      setResetting(null)
    }
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

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">No events found. Click "Add Event" to create one.</div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{event.title}</h3>
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetPaceInterests(event.id, event.title)}
              disabled={resetting === event.id}
              title="Reset pace group counts"
            >
              {resetting === event.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} disabled={deleting === event.id}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
