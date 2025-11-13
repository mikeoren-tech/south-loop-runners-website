"use client"

import type React from "react"
import { WaveTransition } from "@/components/wave-transition"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import Shimmer from "@/components/ui/shimmer";

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
      <Card className="h-full rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-slr-red/40 hover:-translate-y-1 group">
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <CardTitle className="text-3xl font-bold text-white text-balance">{race.title}</CardTitle>
            {race.tagline && (
              <CardDescription className="text-white/90 font-medium">{race.tagline}</CardDescription>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3 p-4 bg-foreground/10 rounded-lg border border-foreground/20">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slr-blue shrink-0" />
              <div>
                <div className="text-xs text-foreground/70 uppercase tracking-wide">Race Day</div>
                <div className="text-xl font-bold text-foreground">{formatDate(race.date)}</div>
                <div className="text-sm text-foreground/80">
                  {race.time} • {race.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {distances.map((distance: string) => (
              <Badge key={distance} className="bg-slr-red text-white border-0">
                {distance}
              </Badge>
            ))}
            {keyFeatures.map((feature: any, idx: number) => {
              const IconComponent = iconMap[feature.icon] || Flag;
              return (
                <Badge key={idx} variant="outline" className="border-slr-blue text-slr-blue">
                  <IconComponent className="h-4 w-4 mr-1.5" />
                  {feature.label}
                </Badge>
              );
            })}
          </div>

          <div className="border-t border-foreground/20 pt-4">
             <CountdownTimer targetDate={race.date} />
          </div>

          <div className="border-t border-foreground/20 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-slr-blue" />
                  SLR Members Attending
                </h4>
                <p className="text-2xl font-bold text-slr-blue mt-1">
                  {racingCount} {isLoading && <Loader2 className="inline h-4 w-4 animate-spin ml-2" />}
                </p>
                {cheeringCount > 0 && (
                  <p className="text-xs text-foreground/70">{cheeringCount} cheering</p>
                )}
              </div>
              {!showForm && (
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)} disabled={isSubmitting}>
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add Me
                </Button>
              )}
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-foreground/10 rounded-lg border border-foreground/20">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-background/20 border-foreground/30"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Last Initial"
                    value={lastInitial}
                    onChange={(e) => setLastInitial(e.target.value)}
                    className="bg-background/20 border-foreground/30 w-24"
                    required
                    maxLength={1}
                  />
                </div>
                <RadioGroup
                  value={attendanceType}
                  onValueChange={(value: "racing" | "cheering") => setAttendanceType(value)}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="racing" id={`racing-${race.id}`} />
                    <Label htmlFor={`racing-${race.id}`}>Racing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cheering" id={`cheering-${race.id}`} />
                    <Label htmlFor={`cheering-${race.id}`}>Cheering</Label>
                  </div>
                </RadioGroup>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                  </Button>
                </div>
              </form>
            )}

            {showSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4"/>
                <p>You've been added to the list!</p>
              </div>
            )}

            {attendees.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {attendees.sort((a, b) => b.timestamp - a.timestamp).map((attendee) => (
                    <div key={attendee.id} className="flex justify-between items-center bg-foreground/10 p-2 rounded-md">
                      <div>
                        <span className="font-semibold">{attendee.name}</span>
                        <Badge variant="outline" className={`ml-2 text-xs ${attendee.type === 'racing' ? 'border-slr-blue text-slr-blue' : 'border-slr-red text-slr-red'}`}>
                          {attendee.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-50 hover:opacity-100" onClick={() => handleRemoveAttendee(attendee.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {race.registration_url && (
            <Shimmer shimmerDuration="5s">
              <Button
                className="w-full bg-slr-red hover:bg-slr-red/90 text-white shadow-lg"
                size="lg"
                asChild
              >
                <a
                  href={race.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  aria-label={`Register for ${race.title} - opens in a new tab`}
                >
                  Register Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Shimmer>
          )}
        </div>
      </Card>
    </ScrollReveal>
  );
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
