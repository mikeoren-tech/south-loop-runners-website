"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import type { Event } from "@/lib/db"

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  event_type: z.enum(["weekly_run", "race"]),
  start_datetime: z.string().min(1, "Start date/time is required"),
  end_datetime: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  distance: z.string().optional(),
  pace: z.string().optional(),
  meeting_point: z.string().optional(),
  registration_url: z.string().url().optional().or(z.literal("")),
  image_url: z.string().url().optional().or(z.literal("")),
  is_featured: z.boolean().default(false),
  display_order: z.number().min(0).default(0),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  event?: Event
  onSuccess?: () => void
  onCancel?: () => void
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description || "",
          event_type: event.event_type,
          start_datetime: event.start_datetime.slice(0, 16), // Format for datetime-local input
          end_datetime: event.end_datetime?.slice(0, 16) || "",
          location: event.location,
          distance: event.distance || "",
          pace: event.pace || "",
          meeting_point: event.meeting_point || "",
          registration_url: event.registration_url || "",
          image_url: event.image_url || "",
          is_featured: Boolean(event.is_featured),
          display_order: event.display_order,
        }
      : {
          event_type: "weekly_run",
          is_featured: false,
          display_order: 0,
        },
  })

  const eventType = watch("event_type")
  const isFeatured = watch("is_featured")

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert datetime-local to ISO format for Chicago timezone
      const startDate = new Date(data.start_datetime)
      const isoStartDateTime = startDate.toISOString()

      let isoEndDateTime = null
      if (data.end_datetime) {
        const endDate = new Date(data.end_datetime)
        isoEndDateTime = endDate.toISOString()
      }

      const payload = {
        ...data,
        start_datetime: isoStartDateTime,
        end_datetime: isoEndDateTime,
        is_featured: data.is_featured ? 1 : 0,
      }

      const url = event ? `/api/events/${event.id}` : "/api/events"
      const method = event ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save event")
      }

      onSuccess?.()
    } catch (err) {
      console.error("[v0] Error saving event:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Basic information about the event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input id="title" {...register("title")} placeholder="Saturday Long Run" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Join us for our weekly long run along the lakefront..."
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Event Type <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={eventType}
              onValueChange={(value) => setValue("event_type", value as "weekly_run" | "race")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly_run" id="weekly_run" />
                <Label htmlFor="weekly_run" className="cursor-pointer">
                  Weekly Run
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="race" id="race" />
                <Label htmlFor="race" className="cursor-pointer">
                  Race
                </Label>
              </div>
            </RadioGroup>
            {errors.event_type && <p className="text-sm text-destructive">{errors.event_type.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
          <CardDescription>When the event takes place (Chicago timezone)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_datetime">
                Start Date & Time <span className="text-destructive">*</span>
              </Label>
              <Input id="start_datetime" type="datetime-local" {...register("start_datetime")} />
              {errors.start_datetime && <p className="text-sm text-destructive">{errors.start_datetime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_datetime">End Date & Time (Optional)</Label>
              <Input id="end_datetime" type="datetime-local" {...register("end_datetime")} />
              {errors.end_datetime && <p className="text-sm text-destructive">{errors.end_datetime.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Where participants should go</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input id="location" {...register("location")} placeholder="Lakefront Trail" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_point">Meeting Point</Label>
            <Input id="meeting_point" {...register("meeting_point")} placeholder="Buckingham Fountain" />
            {errors.meeting_point && <p className="text-sm text-destructive">{errors.meeting_point.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Run Details</CardTitle>
          <CardDescription>Information about the run itself</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance</Label>
              <Input id="distance" {...register("distance")} placeholder="5K, 10K, Half Marathon" />
              {errors.distance && <p className="text-sm text-destructive">{errors.distance.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pace">Pace</Label>
              <Input id="pace" {...register("pace")} placeholder="All paces, 8-10 min/mile" />
              {errors.pace && <p className="text-sm text-destructive">{errors.pace.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Links and images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registration_url">Registration URL</Label>
            <Input id="registration_url" type="url" {...register("registration_url")} placeholder="https://..." />
            {errors.registration_url && <p className="text-sm text-destructive">{errors.registration_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" type="url" {...register("image_url")} placeholder="https://..." />
            {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Display</CardTitle>
          <CardDescription>Control if this event appears on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_featured">Feature on Homepage</Label>
              <p className="text-sm text-muted-foreground">Show this event prominently on the homepage</p>
            </div>
            <Switch
              id="is_featured"
              checked={isFeatured}
              onCheckedChange={(checked) => setValue("is_featured", checked)}
            />
          </div>

          {isFeatured && (
            <div className="space-y-2">
              <Label htmlFor="display_order">
                Display Order <span className="text-destructive">*</span>
              </Label>
              <Input id="display_order" type="number" min="0" {...register("display_order", { valueAsNumber: true })} />
              <p className="text-sm text-muted-foreground">Lower numbers appear first (0, 1, 2...)</p>
              {errors.display_order && <p className="text-sm text-destructive">{errors.display_order.message}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">{error}</div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {event ? "Update Event" : "Create Event"}
            </>
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
