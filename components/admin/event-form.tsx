"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface EventFormProps {
  event?: any
  onClose: () => void
}

export function EventForm({ event, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "special-event",
    is_recurring: false,
    date: "",
    time: "",
    day_of_week: "",
    location: "",
    distance: "",
    pace: "",
    facebook_link: "",
    strava_link: "",
    registration_url: "",
    display_order: "",
  })
  const [loading, setLoading] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "special-event",
        is_recurring: Boolean(event.is_recurring),
        date: event.date || "",
        time: event.time || "",
        day_of_week: event.day_of_week?.toString() || "",
        location: event.location || "",
        distance: event.distance || "",
        pace: event.pace || "",
        facebook_link: event.facebook_link || "",
        strava_link: event.strava_link || "",
        registration_url: event.registration_url || "",
        display_order: event.display_order?.toString() || "",
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = event ? `/api/admin/events/${event.id}` : "/api/admin/events"

      const method = event ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sendEmail }),
      })

      if (response.ok) {
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save event")
      }
    } catch (error) {
      alert("Failed to save event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Event Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Event Type*</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly-run">Weekly Run</SelectItem>
                  <SelectItem value="special-event">Special Event</SelectItem>
                  <SelectItem value="race">Race</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked as boolean })}
              />
              <Label htmlFor="recurring">Recurring Event</Label>
            </div>

            {formData.is_recurring ? (
              <div>
                <Label htmlFor="day_of_week">Day of Week*</Label>
                <Select
                  value={formData.day_of_week}
                  onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="date">Date*</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            )}

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 6:15 PM"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Agora Statues"
              />
            </div>

            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="e.g., 6.5 miles"
              />
            </div>

            <div>
              <Label htmlFor="pace">Pace</Label>
              <Input
                id="pace"
                value={formData.pace}
                onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
                placeholder="e.g., Party Pace"
              />
            </div>

            {formData.is_recurring && (
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  placeholder="1, 2, 3..."
                />
              </div>
            )}

            <div className="col-span-2">
              <Label htmlFor="facebook_link">Facebook Link</Label>
              <Input
                id="facebook_link"
                type="url"
                value={formData.facebook_link}
                onChange={(e) => setFormData({ ...formData, facebook_link: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="strava_link">Strava Link</Label>
              <Input
                id="strava_link"
                type="url"
                value={formData.strava_link}
                onChange={(e) => setFormData({ ...formData, strava_link: e.target.value })}
              />
            </div>

            {formData.type === "race" && (
              <div className="col-span-2">
                <Label htmlFor="registration_url">Registration URL</Label>
                <Input
                  id="registration_url"
                  type="url"
                  value={formData.registration_url}
                  onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked as boolean)}
            />
            <Label htmlFor="sendEmail">Send notification email to subscribers</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
