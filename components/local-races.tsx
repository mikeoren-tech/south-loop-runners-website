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

const races = [
  {
    id: "f3-lake",
    title: "F³ Lake Half Marathon & 5K",
    tagline: "Run the Lakefront, Finish at Soldier Field",
    date: "2026-01-17", // ISO format for countdown
    displayDate: "January 17, 2026",
    time: "10:00 AM",
    location: "Soldier Field",
    departFrom: "South Loop",
    distances: ["Half Marathon", "5K"],
    registrationUrl: "https://runsignup.com/Race/IL/Chicago/F3LakeHalfMarathon5k",
    registrationDeadline: "2026-01-10",
    registrationDeadlineDisplay: "January 10, 2026",
    status: "registration-open" as const,
    highlights: [
      "Scenic lakefront course with stunning Chicago skyline views",
      "Finish line inside historic Soldier Field",
      "Post-race party at Weathermark Tavern (1503 S. Michigan Ave)",
      "Packet pickup at Fleet Feet South Loop",
      "16th annual event with strong community support",
    ],
    uniqueFeature: "Finish inside Soldier Field stadium with post-race celebration",
    keyFeatures: [
      { icon: Flag, label: "Soldier Field Finish", color: "text-blue-600" },
      { icon: Route, label: "Lakefront Route", color: "text-cyan-600" },
      { icon: PartyPopper, label: "Post-Race Party", color: "text-purple-600" },
    ],
    accentColor: "from-blue-500 to-cyan-500",
    imageUrl: "/chicago-lakefront-running-soldier-field-skyline.jpg",
  },
  {
    id: "miles-per-hour",
    title: "Miles Per Hour Run",
    tagline: "Run Through the Chicago Auto Show",
    date: "2026-02-14",
    displayDate: "February 14, 2026",
    time: "8:00 AM",
    location: "McCormick Place",
    departFrom: "South Loop",
    distances: ["1 Hour Challenge"],
    registrationUrl: "https://register.hakuapp.com/?event=e735b096f63aaf72e58d",
    registrationDeadline: "2026-02-07",
    registrationDeadlineDisplay: "February 7, 2026",
    status: "upcoming" as const,
    highlights: [
      "Unique indoor running experience through the Chicago Auto Show",
      "Run as many miles as you can in one hour",
      "Loop through McCormick Place halls and auto show floor",
      "Perfect for winter training when weather is challenging",
      "See the latest cars while getting your miles in",
    ],
    uniqueFeature: "Only race where you run through an auto show while seeing the latest vehicles",
    keyFeatures: [
      { icon: Trophy, label: "1-Hour Challenge", color: "text-orange-600" },
      { icon: Wind, label: "Indoor Course", color: "text-green-600" },
      { icon: Sparkles, label: "Auto Show Access", color: "text-red-600" },
    ],
    accentColor: "from-orange-500 to-red-500",
    imageUrl: "/mccormick-place-chicago-auto-show-indoor-running.jpg",
  },
]

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

const fetcher = async (url: string): Promise<Attendee[]> => {
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

function RaceCard({ race, index }: { race: (typeof races)[0]; index: number }) {
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const {
    data: attendees = [],
    mutate,
    isLoading,
    error,
  } = useSWR<Attendee[]>(`/api/rsvp/${race.id}`, fetcher, {
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

  return (
    <ScrollReveal key={race.id} delay={index * 150}>
      <Card className="glass-strong shadow-soft hover-lift border-0 h-full flex flex-col overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={race.imageUrl || "/placeholder.svg"}
            alt={race.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${race.accentColor} opacity-60`} />
        </div>

        <CardHeader className="space-y-4 pb-4">
          <div className="space-y-2">
            <CardTitle className="text-3xl md:text-4xl font-bold text-balance leading-tight">{race.title}</CardTitle>
            <CardDescription className="text-base font-medium text-foreground/70">{race.tagline}</CardDescription>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-primary/10 to-destructive/10 rounded-lg border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Race Day</div>
                <div className="text-xl font-bold text-foreground">{race.displayDate}</div>
                <div className="text-sm text-muted-foreground">
                  {race.time} • {race.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {race.keyFeatures.map((feature, idx) => (
              <Badge key={idx} variant="outline" className="px-3 py-1.5 border-2 hover:scale-105 transition-transform">
                <feature.icon className={`h-4 w-4 mr-1.5 ${feature.color}`} />
                <span className="font-medium">{feature.label}</span>
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {race.distances.map((distance) => (
              <Badge key={distance} className="bg-destructive/90 text-white border-0 px-3 py-1">
                {distance}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{race.uniqueFeature}</p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Time Until Race
            </div>
            <CountdownTimer targetDate={race.date} />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="font-semibold text-sm">Race Details & Highlights</span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {showDetails && (
              <div className="p-4 space-y-3 bg-muted/10">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Departs from {race.departFrom}</span>
                </div>

                <div className="pt-2 border-t">
                  <h4 className="font-semibold text-sm mb-2">Highlights</h4>
                  <ul className="space-y-2">
                    {race.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
                <p className="text-xs text-muted-foreground">{cheeringCount} cheering from the sidelines</p>
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

            {attendees.length === 0 && !showForm && !isLoading && (
              <p className="text-xs text-muted-foreground italic text-center py-2">
                Be the first to let others know you're going!
              </p>
            )}
          </div>

          <Button
            className="relative z-20 w-full backdrop-blur-md bg-destructive/80 hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl transition-all"
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
    <section className="relative py-20 bg-white" id="races">
      <div className="relative z-10 container mx-auto px-4">
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
      <WaveTransition fillColor="rgba(249, 250, 251, 0.5)" />
    </section>
  )
}
