"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"
import { Clock, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollReveal } from "@/components/scroll-reveal"
import { LumaRsvpLink } from "@/components/luma-rsvp-link"

interface SocialEvent {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  registration_url: string | null
  collect_rsvp_names: number | boolean | null
  max_rsvp_limit: number | null
}

interface Rsvp {
  id: number
  name: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Dates are stored as YYYY-MM-DD; build a local date so the day doesn't shift by time zone
function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

// RSVPs kept on our site (same RSVP list the weekly runs use)
function SocialRsvpSection({ eventId, maxRsvpLimit }: { eventId: string; maxRsvpLimit: number | null }) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const { data, mutate } = useSWR<Rsvp[]>(`/api/events/run-rsvps/${eventId}`, fetcher, {
    refreshInterval: 10000,
    shouldRetryOnError: false,
  })
  const rsvps = Array.isArray(data) ? data : []
  const isFull = Boolean(maxRsvpLimit && rsvps.length >= maxRsvpLimit)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isSubmitting) return

    setIsSubmitting(true)
    setMessage("")
    try {
      const response = await fetch(`/api/events/run-rsvps/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (response.ok) {
        setName("")
        setMessage("You're on the list!")
      } else {
        const result = await response.json().catch(() => ({}))
        setMessage(result.error || "Couldn't save your RSVP. Please try again.")
      }
      await mutate()
    } catch (error) {
      console.error("Failed to submit social RSVP:", error)
      setMessage("Couldn't save your RSVP. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-auto space-y-3 border-t pt-4">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Users className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {rsvps.length}
        {maxRsvpLimit ? `/${maxRsvpLimit}` : ""} going
        {isFull && <span className="font-normal text-muted-foreground">· RSVPs full</span>}
      </p>

      {rsvps.length > 0 && (
        <p className="text-sm text-muted-foreground break-words">{rsvps.map((rsvp) => rsvp.name).join(", ")}</p>
      )}

      {!isFull && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First + last initial (e.g. Mike O.)"
            aria-label="Your name"
            className="flex-1 min-w-0"
            maxLength={50}
          />
          <Button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="shrink-0 bg-slr-red hover:bg-slr-red/90 text-white"
          >
            {isSubmitting ? "Saving..." : "RSVP"}
          </Button>
        </form>
      )}

      {message && (
        <p className="text-xs text-muted-foreground" role="status">
          {message}
        </p>
      )}
    </div>
  )
}

function SocialCard({ event, index }: { event: SocialEvent; index: number }) {
  const date = parseDate(event.date)
  const collectRsvps = Boolean(Number(event.collect_rsvp_names))

  return (
    <ScrollReveal
      delay={index * 100}
      className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]"
    >
      <Card className="h-full border rounded-3xl gap-4">
        <CardHeader className="flex items-start gap-4">
          <div className="shrink-0 w-16 rounded-2xl bg-slr-red text-white text-center py-2 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wide">
              {date.toLocaleDateString("en-US", { month: "short" })}
            </div>
            <div className="text-2xl font-bold leading-none mt-0.5">{date.getDate()}</div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <CardTitle className="text-xl mt-1 break-words">{event.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="grid gap-2 text-sm">
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="break-words">{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground whitespace-pre-line break-words">{event.description}</p>
          )}

          {event.registration_url ? (
            <Button asChild className="mt-auto w-full bg-slr-red hover:bg-slr-red/90 text-white">
              <LumaRsvpLink url={event.registration_url}>RSVP on Luma</LumaRsvpLink>
            </Button>
          ) : (
            collectRsvps && <SocialRsvpSection eventId={event.id} maxRsvpLimit={event.max_rsvp_limit} />
          )}
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

export function SocialEvents() {
  const { data } = useSWR<SocialEvent[]>("/api/events/socials", fetcher)
  const socials = Array.isArray(data) ? data : []

  // Only show the section when there's an upcoming social
  if (socials.length === 0) return null

  return (
    <section className="relative py-20 bg-white" id="socials" aria-labelledby="socials-heading">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 id="socials-heading" className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Socials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Dinners, happy hours and hangouts with the club. No running required.
          </p>
        </ScrollReveal>

        {/* Flex instead of grid so one or two socials stay centered */}
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
          {socials.map((event, index) => (
            <SocialCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
