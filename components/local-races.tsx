"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Calendar,
  MapPin,
  Trophy,
  Sparkles,
  Users,
  ExternalLink,
  UserPlus,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import useSWR from "swr"

const races = [
  {
    id: "f3-lake",
    title: "F³ Lake Half Marathon & 5K",
    tagline: "Run the Lakefront, Finish at Soldier Field",
    date: "January 2026",
    time: "10:00 AM",
    location: "Soldier Field",
    departFrom: "South Loop",
    distances: ["Half Marathon", "5K"],
    registrationUrl: "https://runsignup.com/Race/IL/Chicago/F3LakeHalfMarathon5k",
    highlights: [
      "Scenic lakefront course with stunning Chicago skyline views",
      "Finish line inside historic Soldier Field",
      "Post-race party at Weathermark Tavern (1503 S. Michigan Ave)",
      "Packet pickup at Fleet Feet South Loop",
      "16th annual event with strong community support",
    ],
    uniqueFeature: "Finish inside Soldier Field stadium",
    color: "primary",
  },
  {
    id: "miles-per-hour",
    title: "Miles Per Hour Run",
    tagline: "Run Through the Chicago Auto Show",
    date: "February 2026",
    time: "8:00 AM",
    location: "McCormick Place",
    departFrom: "South Loop",
    distances: ["1 Hour Challenge"],
    registrationUrl: "https://register.hakuapp.com/?event=e735b096f63aaf72e58d",
    highlights: [
      "Unique indoor running experience through the Chicago Auto Show",
      "Run as many miles as you can in one hour",
      "Loop through McCormick Place halls and auto show floor",
      "Perfect for winter training when weather is challenging",
      "See the latest cars while getting your miles in",
    ],
    uniqueFeature: "Only race where you run through an auto show",
    color: "destructive",
  },
]

type Attendee = {
  id: string
  name: string
  type: "racing" | "cheering"
  timestamp: number
}

const fetcher = async (url: string) => {
  console.log("[v0] Fetching RSVPs from:", url)
  try {
    const response = await fetch(url)
    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Fetch error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Fetched data:", data)
    return data
  } catch (error) {
    console.error("[v0] Fetch failed:", error)
    throw error
  }
}

function RaceCard({ race, index }: { race: (typeof races)[0]; index: number }) {
  const {
    data: attendees = [],
    mutate,
    isLoading,
    error,
  } = useSWR<Attendee[]>(`/api/rsvp/${race.id}`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    onError: (err) => {
      console.error("[v0] SWR error for race", race.id, ":", err)
    },
  })

  const [showForm, setShowForm] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastInitial, setLastInitial] = useState("")
  const [attendanceType, setAttendanceType] = useState<"racing" | "cheering">("racing")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastInitial.trim()) {
      return
    }

    const fullName = `${firstName.trim()} ${lastInitial.trim().toUpperCase()}.`

    setIsSubmitting(true)

    const newAttendee: Attendee = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: fullName,
      type: attendanceType,
      timestamp: Date.now(),
    }

    console.log("[v0] Submitting RSVP:", newAttendee)

    try {
      const response = await fetch(`/api/rsvp/${race.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAttendee),
      })

      console.log("[v0] POST response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] POST error:", errorText)
        throw new Error("Failed to add RSVP")
      }

      await mutate()

      setFirstName("")
      setLastInitial("")
      setAttendanceType("racing")
      setShowForm(false)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Failed to add RSVP:", error)
      alert("Failed to add your RSVP. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveAttendee = async (attendeeId: string) => {
    console.log("[v0] Removing attendee:", attendeeId)

    try {
      const response = await fetch(`/api/rsvp/${race.id}?attendeeId=${attendeeId}`, {
        method: "DELETE",
      })

      console.log("[v0] DELETE response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] DELETE error:", errorText)
        throw new Error("Failed to remove RSVP")
      }

      await mutate()
    } catch (error) {
      console.error("[v0] Failed to remove RSVP:", error)
      alert("Failed to remove RSVP. Please try again.")
    }
  }

  const racingCount = attendees.filter((a) => a.type === "racing").length
  const cheeringCount = attendees.filter((a) => a.type === "cheering").length

  return (
    <ScrollReveal key={race.id} delay={index * 150}>
      <Card className="border-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 text-balance">{race.title}</CardTitle>
              <CardDescription className="text-base font-medium text-foreground/70">{race.tagline}</CardDescription>
            </div>
            <Sparkles className="h-6 w-6 text-destructive shrink-0" />
          </div>

          <div className="flex flex-wrap gap-2">
            {race.distances.map((distance) => (
              <Badge key={distance} variant="outline" className="border-[#d92a31] text-[#d92a31]">
                {distance}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <span className="font-semibold">{race.date}</span>
                <span className="text-muted-foreground"> at {race.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <span className="font-semibold">{race.location}</span>
                <span className="text-muted-foreground"> • Departs from {race.departFrom}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">What Makes It Special</p>
                <p className="text-sm text-muted-foreground">{race.uniqueFeature}</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Race Highlights
            </h4>
            <ul className="space-y-2">
              {race.highlights.map((highlight, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1 shrink-0">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Who's Going? {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : `(${attendees.length})`}
              </h4>
              <div className="flex items-center gap-2">
                {showSuccess && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Added!</span>
                  </div>
                )}
                {!showForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="text-xs"
                    disabled={isSubmitting}
                  >
                    Add Me
                  </Button>
                )}
              </div>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`firstName-${race.id}`} className="text-xs font-medium mb-1.5 block">
                        First Name
                      </label>
                      <Input
                        id={`firstName-${race.id}`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                        className="h-9"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor={`lastInitial-${race.id}`} className="text-xs font-medium mb-1.5 block">
                        Last Initial
                      </label>
                      <Input
                        id={`lastInitial-${race.id}`}
                        value={lastInitial}
                        onChange={(e) => setLastInitial(e.target.value.slice(0, 1))}
                        placeholder="D"
                        maxLength={1}
                        required
                        className="h-9"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-2 block">I'm planning to:</label>
                    <RadioGroup
                      value={attendanceType}
                      onValueChange={(v) => setAttendanceType(v as "racing" | "cheering")}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="racing" id={`racing-${race.id}`} />
                          <label
                            htmlFor={`racing-${race.id}`}
                            className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                          >
                            <Trophy className="h-3.5 w-3.5 text-destructive" />
                            Race
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="cheering" id={`cheering-${race.id}`} />
                          <label
                            htmlFor={`cheering-${race.id}`}
                            className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                          >
                            <Users className="h-3.5 w-3.5 text-primary" />
                            Cheer
                          </label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add My Name"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowForm(false)
                      setFirstName("")
                      setLastInitial("")
                      setAttendanceType("racing")
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
                <p className="font-semibold">Error loading RSVPs:</p>
                <p className="mt-1">{error.message}</p>
                <p className="mt-1 text-muted-foreground">Check browser console for details</p>
              </div>
            )}

            {attendees.length > 0 && (
              <div className="space-y-3">
                {racingCount > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Trophy className="h-3 w-3 text-destructive" />
                      Racing ({racingCount})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {attendees
                        .filter((a) => a.type === "racing")
                        .map((attendee) => (
                          <Badge
                            key={attendee.id}
                            variant="destructive"
                            className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 pr-1"
                          >
                            {attendee.name}
                            <button
                              onClick={() => handleRemoveAttendee(attendee.id)}
                              className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5"
                              aria-label="Remove"
                              disabled={isSubmitting}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {cheeringCount > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-primary" />
                      Cheering ({cheeringCount})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {attendees
                        .filter((a) => a.type === "cheering")
                        .map((attendee) => (
                          <Badge
                            key={attendee.id}
                            variant="default"
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 pr-1"
                          >
                            {attendee.name}
                            <button
                              onClick={() => handleRemoveAttendee(attendee.id)}
                              className="ml-1.5 hover:bg-primary/20 rounded-full p-0.5"
                              aria-label="Remove"
                              disabled={isSubmitting}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {attendees.length === 0 && !showForm && !isLoading && !error && (
              <p className="text-xs text-muted-foreground italic text-center py-2">
                Be the first to let others know you're going!
              </p>
            )}
          </div>

          <Button
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            size="lg"
            asChild
          >
            <a href={race.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

export function LocalRaces() {
  return (
    <section className="py-20 bg-muted/30" id="races">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-foreground">Local Races</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Upcoming South Loop Races</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Join fellow South Loop Runners at these exciting local races. Both events depart from our neighborhood,
              making them perfect for our community!
            </p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {races.map((race, index) => (
              <RaceCard key={race.id} race={race} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
