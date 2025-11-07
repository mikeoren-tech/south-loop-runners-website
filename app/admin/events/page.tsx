"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EventForm } from "@/components/event-form"
import { Plus, Calendar, MapPin, Edit, Trash2, Loader2, Star } from "lucide-react"
import type { Event } from "@/lib/db"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export default function EventsAdminPage() {
  const { data: events = [], mutate, isLoading } = useSWR<Event[]>("/api/events", fetcher)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingEvent) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${deletingEvent.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      await mutate()
      setDeletingEvent(null)
    } catch (error) {
      console.error("[v0] Error deleting event:", error)
      alert("Failed to delete event")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSuccess = async () => {
    await mutate()
    setIsCreateDialogOpen(false)
    setEditingEvent(null)
  }

  const weeklyRuns = events.filter((e) => e.event_type === "weekly_run")
  const races = events.filter((e) => e.event_type === "race")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Event Management</h1>
          <p className="text-muted-foreground">
            Manage weekly runs and races. Changes trigger email notifications to subscribers.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first event</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && events.length > 0 && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Weekly Runs ({weeklyRuns.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyRuns.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
                        {event.description && (
                          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                        )}
                      </div>
                      {event.is_featured === 1 && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-2 shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{formatDate(event.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.distance && <Badge variant="outline">{event.distance}</Badge>}
                      {event.pace && <Badge variant="outline">{event.pace}</Badge>}
                      {event.is_featured === 1 && (
                        <Badge variant="default">Featured (Order: {event.display_order})</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => setDeletingEvent(event)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Races ({races.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {races.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
                        {event.description && (
                          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                        )}
                      </div>
                      {event.is_featured === 1 && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-2 shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{formatDate(event.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.distance && <Badge variant="outline">{event.distance}</Badge>}
                      {event.registration_url && <Badge variant="default">Registration Open</Badge>}
                      {event.is_featured === 1 && (
                        <Badge variant="default">Featured (Order: {event.display_order})</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => setDeletingEvent(event)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm onSuccess={handleSuccess} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editingEvent !== null} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm event={editingEvent} onSuccess={handleSuccess} onCancel={() => setEditingEvent(null)} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingEvent !== null} onOpenChange={(open) => !open && setDeletingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingEvent?.title}"? This action cannot be undone and will send a
              cancellation email to all subscribers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
