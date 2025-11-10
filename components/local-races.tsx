"use client"

import type React from "react"
import { WaveTransition } from "@/components/wave-transition"
import { useState, useEffect } from "react"
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
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  Route,
  PartyPopper,
  Wind,
} from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import useSWR from "swr"
import Image from "next/image"

type Attendee = {
  id: string
  name: string
  type: "racing" | "cheering"
  timestamp: number
}

const getLocalStorageKey = (raceId: string) => `race-rsvp-${raceId}`

const getLocalAttendees = (raceId: string): Attendee[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(getLocalStorageKey(raceId))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const setLocalAttendees = (raceId: string, attendees: Attendee[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(getLocalStorageKey(raceId), JSON.stringify(attendees))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const attendeeFetcher = async (url: string): Promise<Attendee[]> => {
  try {
    const response = await fetch(url)
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("text/html")) {
      const raceId = url.split("/").pop() || ""
      return getLocalAttendees(raceId)
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    const raceId = url.split("/").pop() || ""
    return getLocalAttendees(raceId)
  }
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center gap-3 text-sm">
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">hrs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground">min</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground">sec</div>
        </div>
      </div>
    </div>
  )
}

function RaceCard({ race, index }: { race: any; index: number }) {
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const {
    data: attendees = [],
    mutate,
    isLoading,
    error,
  } = useSWR<Attendee[]>(`/api/rsvp/${race.id}`, attendeeFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    onError: () => {
      setUseLocalStorage(true)
    },
  })

  const [showForm, setShowForm] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastInitial, setLastInitial] = useState("")
  const [attendanceType, setAttendanceType] = useState<"racing" | "cheering">("racing")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const highlights = race.highlights
    ? typeof race.highlights === "string"
      ? JSON.parse(race.highlights)
      : race.highlights
    : []
  const distances = race.distances
    ? typeof race.distances === "string"
      ? JSON.parse(race.distances)
      : race.distances
    : []
  const keyFeatures = race.key_features
    ? typeof race.key_features === "string"
      ? JSON.parse(race.key_features)
      : race.key_features
    : []

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

    try {
      const response = await fetch(`/api/rsvp/${race.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAttendee),
      })

      const contentType = response.headers.get("content-type")

      if (contentType?.includes("text/html") || !response.ok) {
        const currentAttendees = getLocalAttendees(race.id)
        const updatedAttendees = [...currentAttendees, newAttendee]
        setLocalAttendees(race.id, updatedAttendees)
        setUseLocalStorage(true)
        await mutate(updatedAttendees, false)
      } else {
        await mutate()
      }

      setFirstName("")
      setLastInitial("")
      setAttendanceType("racing")
      setShowForm(false)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      const currentAttendees = getLocalAttendees(race.id)
      const updatedAttendees = [...currentAttendees, newAttendee]
      setLocalAttendees(race.id, updatedAttendees)
      setUseLocalStorage(true)
      await mutate(updatedAttendees, false)

      setFirstName("")
      setLastInitial("")
      setAttendanceType("racing")
      setShowForm(false)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveAttendee = async (attendeeId: string) => {
    try {
      const response = await fetch(`/api/rsvp/${race.id}?attendeeId=${attendeeId}`, {
        method: "DELETE",
      })

      const contentType = response.headers.get("content-type")

      if (contentType?.includes("text/html") || !response.ok) {
        const currentAttendees = getLocalAttendees(race.id)
        const updatedAttendees = currentAttendees.filter((a) => a.id !== attendeeId)
        setLocalAttendees(race.id, updatedAttendees)
        setUseLocalStorage(true)
        await mutate(updatedAttendees, false)
      } else {
        await mutate()
      }
    } catch (error) {
      const currentAttendees = getLocalAttendees(race.id)
      const updatedAttendees = currentAttendees.filter((a) => a.id !== attendeeId)
      setLocalAttendees(race.id, updatedAttendees)
      setUseLocalStorage(true)
      await mutate(updatedAttendees, false)
    }
  }

  const racingCount = attendees.filter((a) => a.type === "racing").length
  const cheeringCount = attendees.filter((a) => a.type === "cheering").length

  function formatDate(dateStringFromDB) {
    const chicagoOffset = '-06:00'; 
    const correctedDateString = `${dateStringFromDB.split('T')[0]}T12:00:00${chicagoOffset}`; 
  
    const date = new Date(correctedDateString); 
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Chicago" // The correct formatting option
  });
}

  const iconMap: Record<string, any> = {
    Flag: Flag,
    Route: Route,
    PartyPopper: PartyPopper,
    Trophy: Trophy,
    Wind: Wind,
    Sparkles: Sparkles,
  }

  return (
    <ScrollReveal key={race.id} delay={index * 150}>
      <article className="glass-strong rounded-3xl shadow-soft hover-lift border-0 h-full flex flex-col group">
        <Card className="h-full border-0 rounded-3xl overflow-hidden p-0">
          <div className="relative h-48 overflow-hidden rounded-t-3xl">
            <Image
              src={
                race.image_url && race.image_url !== ""
                  ? race.image_url
                  : `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(race.title + " race")}`
              }
              alt={`${race.title} - ${race.tagline || ""}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${race.accent_color || "from-blue-500 to-cyan-500"} opacity-60`}
            />
          </div>

          <CardHeader className="space-y-4 pb-4 pt-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl md:text-4xl font-bold text-balance leading-tight">{race.title}</CardTitle>
              {race.tagline && (
                <CardDescription className="text-base font-medium text-foreground/70">{race.tagline}</CardDescription>
              )}
            </div>

            <div className="space-y-3 p-4 bg-gradient-to-br from-primary/10 to-destructive/10 rounded-lg border-2 border-primary/20">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Race Day</div>
                  <div className="text-xl font-bold text-foreground">{formatDate(race.date)}</div>
                  <div className="text-sm text-muted-foreground">
                    {race.time} • {race.location}
                  </div>
                </div>
              </div>
            </div>

            {keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keyFeatures.map((feature: any, idx: number) => {
                  const IconComponent = iconMap[feature.icon] || Flag
                  return (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="px-3 py-1.5 border-2 hover:scale-105 transition-transform"
                    >
                      <IconComponent className={`h-4 w-4 mr-1.5 ${feature.color}`} />
                      <span className="font-medium">{feature.label}</span>
                    </Badge>
                  )
                })}
              </div>
            )}

            {distances.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {distances.map((distance: string) => (
                  <Badge key={distance} className="bg-destructive/90 text-white border-0 px-3 py-1">
                    {distance}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4 flex-1 flex flex-col pb-6">
            {race.unique_feature && (
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{race.unique_feature}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Time Until Race
              </div>
              <CountdownTimer targetDate={race.date} />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-expanded={showDetails}
                aria-label={`${showDetails ? "Hide" : "Show"} race details and highlights`}
              >
                <span className="font-semibold text-sm">Race Details & Highlights</span>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </button>

              {showDetails && (
                <div className="p-4 space-y-3 bg-muted/10">
                  {race.depart_from && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Departs from {race.depart_from}</span>
                    </div>
                  )}

                  {highlights.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="font-semibold text-sm mb-2">Highlights</h4>
                      <ul className="space-y-2">
                        {highlights.map((highlight: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1 shrink-0">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    South Loop Runners Going
                  </h4>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {racingCount} {isLoading && <Loader2 className="inline h-4 w-4 animate-spin ml-2" />}
                  </p>
                  {cheeringCount > 0 && (
                    <p className="text-xs text-muted-foreground">{cheeringCount} cheering from the sidelines</p>
                  )}
                  {race.has_post_run_social === true &&
                    race.post_run_social_count &&
                    race.post_run_social_count > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {race.post_run_social_count} attending post-race social
                      </p>
                    )}
                </div>
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
                      <UserPlus className="h-3 w-3 mr-1" />
                      Add Me
                    </Button>
                  )}
                </div>
              </div>

              {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <fieldset disabled={isSubmitting} className="space-y-3">
                    <legend className="sr-only">RSVP for {race.title}</legend>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`firstName-${race.id}`} className="text-xs font-medium mb-1.5 block">
                          First Name{" "}
                          <span className="text-destructive" aria-label="required">
                            *
                          </span>
                        </label>
                        <Input
                          id={`firstName-${race.id}`}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          required
                          className="h-9"
                          disabled={isSubmitting}
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label htmlFor={`lastInitial-${race.id}`} className="text-xs font-medium mb-1.5 block">
                          Last Initial{" "}
                          <span className="text-destructive" aria-label="required">
                            *
                          </span>
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
                          aria-required="true"
                        />
                      </div>
                    </div>

                    <div>
                      <label id={`attendance-label-${race.id}`} className="text-xs font-medium mb-2 block">
                        I'm planning to:{" "}
                        <span className="text-destructive" aria-label="required">
                          *
                        </span>
                      </label>
                      <RadioGroup
                        value={attendanceType}
                        onValueChange={(v) => setAttendanceType(v as "racing" | "cheering")}
                        disabled={isSubmitting}
                        aria-labelledby={`attendance-label-${race.id}`}
                        aria-required="true"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="racing" id={`racing-${race.id}`} />
                            <label
                              htmlFor={`racing-${race.id}`}
                              className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                            >
                              <Trophy className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                              Race
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="cheering" id={`cheering-${race.id}`} />
                            <label
                              htmlFor={`cheering-${race.id}`}
                              className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                            >
                              <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                              Cheer
                            </label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </fieldset>

                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-2" aria-hidden="true" />
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

              {attendees.length > 0 && (
                <div className="space-y-3">
                  {racingCount > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Trophy className="h-3 w-3 text-destructive" aria-hidden="true" />
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
                                className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1"
                                aria-label={`Remove ${attendee.name} from racing list`}
                                disabled={isSubmitting}
                              >
                                <X className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  {cheeringCount > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-primary" aria-hidden="true" />
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
                                className="ml-1.5 hover:bg-primary/20 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                                aria-label={`Remove ${attendee.name} from cheering list`}
                                disabled={isSubmitting}
                              >
                                <X className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {attendees.length === 0 && !showForm && !isLoading && (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  Be the first to let others know you're going!
                </p>
              )}
            </div>

            {race.registration_url && (
              <Button
                className="relative z-20 w-full backdrop-blur-md bg-destructive/80 hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                size="lg"
                asChild
              >
                <a href={race.registration_url} target="_blank" rel="noopener noreferrer">
                  Register Now
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Opens in new window</span>
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </article>
    </ScrollReveal>
  )
}

export function LocalRaces() {
  const { data: races = [], isLoading } = useSWR("/api/events/races", fetcher, {
    fallbackData: [
      {
        id: "f3-lake",
        title: "F³ Lake Half Marathon & 5K",
        tagline: "Run the Lakefront, Finish at Soldier Field",
        date: "2026-01-31",
        time: "10:00 AM",
        location: "Soldier Field",
        depart_from: "South Loop",
        distances: ["Half Marathon", "5K"],
        registration_url: "https://runsignup.com/Race/IL/Chicago/F3LakeHalfMarathon5k",
        highlights: [
          "Scenic lakefront course with stunning Chicago skyline views",
          "Finish line inside historic Soldier Field",
          "Post-race party at Weathermark Tavern (1503 S. Michigan Ave)",
          "Packet pickup at Fleet Fleet South Loop",
          "16th annual event with strong community support",
        ],
        unique_feature: "Finish inside Soldier Field stadium with post-race celebration",
        key_features: [
          { icon: "Flag", label: "Soldier Field Finish", color: "text-blue-600" },
          { icon: "Route", label: "Lakefront Route", color: "text-cyan-600" },
          { icon: "PartyPopper", label: "Post-Race Party", color: "text-purple-600" },
        ],
        accent_color: "from-blue-500 to-cyan-500",
        image_url: "/chicago-lakefront-running-soldier-field-skyline.jpg",
      },
      {
        id: "miles-per-hour",
        title: "Miles Per Hour Run",
        tagline: "Run Through the Chicago Auto Show",
        date: "2026-02-08",
        time: "8:00 AM",
        location: "McCormick Place",
        depart_from: "South Loop",
        distances: ["1 Hour Challenge"],
        registration_url: "https://register.hakuapp.com/?event=e735b096f63aaf72e58d",
        highlights: [
          "Unique indoor running experience through the Chicago Auto Show",
          "Run as many miles as you can in one hour",
          "Loop through McCormick Place halls and auto show floor",
          "Perfect for winter training when weather is challenging",
          "See the latest cars while getting your miles in",
        ],
        unique_feature: "Only race where you run through an auto show while seeing the latest vehicles",
        key_features: [
          { icon: "Trophy", label: "1-Hour Challenge", color: "text-orange-600" },
          { icon: "Wind", label: "Indoor Course", color: "text-green-600" },
          { icon: "Sparkles", label: "Auto Show Access", color: "text-red-600" },
        ],
        accent_color: "from-orange-500 to-red-500",
        image_url: "/mccormick-place-chicago-auto-show-indoor-running.jpg",
      },
    ],
  })

  if (isLoading && races.length === 0) {
    return (
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading upcoming races...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 bg-white" id="races" aria-labelledby="races-heading">
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-destructive" aria-hidden="true" />
              <span className="font-semibold text-foreground">Local Races</span>
            </div>
            <h2 id="races-heading" className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Upcoming South Loop Races
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Join fellow South Loop Runners at these exciting local races. Both events depart from our neighborhood,
              making them perfect for our community!
            </p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            {races.map((race: any, index: number) => (
              <RaceCard key={race.id} race={race} index={index} />
            ))}
          </div>
        </div>
      </div>
      <WaveTransition fillColor="rgba(249, 250, 251, 0.5)" />
    </section>
  )
}
