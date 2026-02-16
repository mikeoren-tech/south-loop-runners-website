"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, FacebookIcon, Activity, Users, ArrowRight, MessageSquare, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WeatherWidget, type WeatherData } from "@/components/weather-widget"
import Link from "next/link"

import useSWR from "swr"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlipCard } from "@/components/flip-card"

const PACE_GROUPS = [
  "Under 7:00 min/mile",
  "7:00 - 7:59 min/mile",
  "8:00 - 8:59 min/mile",
  "9:00 - 9:59 min/mile",
  "10:00 - 10:59 min/mile",
  "11:00 - 11:59 min/mile",
  "12:00 - 12:59 min/mile",
  "13:00 - 13:59 min/mile",
  "14:00 - 14:59 min/mile",
  "15:00+ min/mile",
]

interface PaceInterest {
  pace: string
  timestamp: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function PaceInterestSection({ runId, hasSocial, collectRsvpNames }: { runId: string; hasSocial: boolean; collectRsvpNames: boolean }) {
  const [selectedPace, setSelectedPace] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attendingSocial, setAttendingSocial] = useState(false)
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false)
  const [rsvpName, setRsvpName] = useState("")
  const [isRsvpSubmitting, setIsRsvpSubmitting] = useState(false)

  const {
    data: paceInterests = [],
    mutate,
    error,
  } = useSWR<Array<{ pace: string; count: number }>>(`/api/events/pace-interests/${runId}`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    fallbackData: [],
    shouldRetryOnError: false,
    onError: (err) => {
      console.error(`Failed to fetch pace interests for ${runId}:`, err)
    },
  })

  const { data: socialData, mutate: mutateSocial } = useSWR(
    hasSocial ? `/api/events/social-rsvp/${runId}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      fallbackData: { socialCount: 0 },
    },
  )

  const { data: runRsvps = [], mutate: mutateRsvps } = useSWR<Array<{ id: number; name: string; pace: string | null; created_at: string }>>(
    collectRsvpNames ? `/api/events/run-rsvps/${runId}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      fallbackData: [],
      shouldRetryOnError: false,
    },
  )

  const isApiUnavailable = error && error.message?.includes("Unexpected token")

  const safePaceInterests = Array.isArray(paceInterests) ? paceInterests : []

  const paceCounts = PACE_GROUPS.reduce(
    (acc, pace) => {
      const interest = safePaceInterests.find((i) => i.pace === pace)
      acc[pace] = interest?.count || 0
      return acc
    },
    {} as Record<string, number>,
  )

  const totalInterested = safePaceInterests.reduce((sum, interest) => sum + interest.count, 0)

  const handleSubmit = async () => {
    if (!selectedPace || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/events/pace-interests/${runId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pace: selectedPace }),
      })

      if (response.ok) {
        await mutate()
        setSelectedPace("")
      }
    } catch (error) {
      console.error("Failed to submit interest:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRsvpSubmit = async () => {
    if (!rsvpName.trim() || isRsvpSubmitting) return

    setIsRsvpSubmitting(true)
    try {
      const response = await fetch(`/api/events/run-rsvps/${runId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rsvpName.trim(), pace: selectedPace || null }),
      })

      if (response.ok) {
        await mutateRsvps()
        setRsvpName("")
      }
    } catch (error) {
      console.error("Failed to submit RSVP:", error)
    } finally {
      setIsRsvpSubmitting(false)
    }
  }

  const handleSocialToggle = async (checked: boolean) => {
    if (isSocialSubmitting) return

    setIsSocialSubmitting(true)
    setAttendingSocial(checked)

    try {
      const response = await fetch(`/api/events/social-rsvp/${runId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attending: checked }),
      })

      if (response.ok) {
        await mutateSocial()
      }
    } catch (error) {
      console.error("Failed to update social RSVP:", error)
      setAttendingSocial(!checked)
    } finally {
      setIsSocialSubmitting(false)
    }
  }

  return (
    <div className="border-t pt-4 mt-4 space-y-3">
      {collectRsvpNames ? (
        // RSVP name collection UI
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UserPlus className="h-4 w-4" />
            <span>RSVP for This Run</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Planning to attend?{" "}
            <a
              href="https://discord.gg/U5u3DxmCQN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slr-red hover:underline font-medium inline-flex items-center gap-1"
            >
              Chat with runners on Discord
              <MessageSquare className="h-3 w-3 inline" />
            </a>
          </p>

          {Array.isArray(runRsvps) && runRsvps.length >= 25 ? (
            <div className="bg-muted/50 border border-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">RSVPs are full (25/25)</p>
              <p className="text-xs text-muted-foreground mt-1">This run has reached maximum capacity</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Input
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="First + last initial (e.g. Mike O.)"
                  className="flex-1 min-w-0"
                  maxLength={50}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleRsvpSubmit()
                    }
                  }}
                />
                <Button
                  onClick={handleRsvpSubmit}
                  disabled={!rsvpName.trim() || isRsvpSubmitting}
                  size="sm"
                  variant="default"
                  className="shrink-0"
                >
                  {isRsvpSubmitting ? "..." : "RSVP"}
                </Button>
              </div>

              <Select value={selectedPace} onValueChange={setSelectedPace}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your pace (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {PACE_GROUPS.map((pace) => (
                    <SelectItem key={pace} value={pace}>
                      {pace}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {hasSocial && (
            <div className="flex items-center gap-2">
              <Checkbox
                id={`social-${runId}`}
                checked={attendingSocial}
                onCheckedChange={handleSocialToggle}
                disabled={isSocialSubmitting}
              />
              <Label htmlFor={`social-${runId}`} className="text-sm cursor-pointer flex items-center gap-2">
                Also attending the social?
                {socialData?.socialCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {socialData.socialCount}
                  </Badge>
                )}
              </Label>
            </div>
          )}

          {Array.isArray(runRsvps) && runRsvps.length > 0 && (() => {
            // Group RSVPs by pace
            const grouped: Record<string, string[]> = {}
            runRsvps.forEach((rsvp) => {
              const paceKey = rsvp.pace || "TBD"
              if (!grouped[paceKey]) grouped[paceKey] = []
              grouped[paceKey].push(rsvp.name)
            })
            // Sort pace groups: named paces first (in PACE_GROUPS order), then TBD last
            const sortedKeys = Object.keys(grouped).sort((a, b) => {
              if (a === "TBD") return 1
              if (b === "TBD") return -1
              const aIndex = PACE_GROUPS.indexOf(a)
              const bIndex = PACE_GROUPS.indexOf(b)
              if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
              if (aIndex === -1) return 1
              if (bIndex === -1) return -1
              return aIndex - bIndex
            })
            return (
              <div className="space-y-2 border-t pt-3">
                <p className="text-sm font-medium">
                  {runRsvps.length} {runRsvps.length === 1 ? "runner" : "runners"} attending
                </p>
                <div className="space-y-1.5">
                  {sortedKeys.map((paceKey) => (
                    <div key={paceKey} className="text-sm">
                      <span className="font-medium text-muted-foreground">{paceKey}:</span>{" "}
                      <span>{grouped[paceKey].join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        // Original pace interest UI
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Show Your Interest</span>
            <span className="text-xs">(Official RSVP on Facebook/Strava)</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Planning to attend?{" "}
            <a
              href="https://discord.gg/U5u3DxmCQN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slr-red hover:underline font-medium inline-flex items-center gap-1"
            >
              Chat with runners on Discord
              <MessageSquare className="h-3 w-3 inline" />
            </a>
          </p>

          <div className="flex gap-2">
            <Select value={selectedPace} onValueChange={setSelectedPace}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select your pace" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PACE_GROUPS.map((pace) => (
                  <SelectItem key={pace} value={pace}>
                    {pace}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit} disabled={!selectedPace || isSubmitting} size="sm" variant="default">
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>

          <div className="flex gap-1">
            {hasSocial && (
              <div className="flex items-center gap-2 pl-1">
                <Checkbox
                  id={`social-${runId}`}
                  checked={attendingSocial}
                  onCheckedChange={handleSocialToggle}
                  disabled={isSocialSubmitting}
                />
                <Label htmlFor={`social-${runId}`} className="text-sm cursor-pointer flex items-center gap-2">
                  Also attending the social?
                  {socialData?.socialCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {socialData.socialCount}
                    </Badge>
                  )}
                </Label>
              </div>
            )}
          </div>

          {totalInterested > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {totalInterested} {totalInterested === 1 ? "runner" : "runners"} interested
              </p>
              <div className="space-y-1">
                {PACE_GROUPS.map((pace) => {
                  const count = paceCounts[pace]
                  if (!count || count === 0) return null
                  return (
                    <div key={pace} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{pace}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function getWeatherGuideLink(weather: WeatherData | null): { url: string; text: string } {
  if (!weather) {
    return { url: "/weather-guide", text: "View Weather Running Guide" }
  }

  const { temperature, windSpeed, precipitation } = weather

  let section = "temperature-guide"
  let condition = ""

  if (temperature > 80) {
    condition = "hot weather"
  } else if (temperature >= 60) {
    condition = "ideal conditions"
  } else if (temperature >= 40) {
    condition = "cool weather"
  } else if (temperature >= 20) {
    condition = "cold weather"
  } else {
    condition = "extreme cold"
  }

  const additionalConditions = []
  if (windSpeed > 20) {
    additionalConditions.push("high winds")
    section = "wind-guide"
  } else if (windSpeed > 10) {
    additionalConditions.push("windy")
  }

  if (precipitation > 50) {
    additionalConditions.push("rain")
    section = "rain-guide"
  }

  const fullCondition =
    additionalConditions.length > 0 ? `${condition} with ${additionalConditions.join(" and ")}` : condition

  return {
    url: `/weather-guide#${section}`,
    text: `Running tips for ${fullCondition}`,
  }
}

export function UpcomingRuns() {
  const [weatherData, setWeatherData] = useState<{ [key: string]: WeatherData | null }>({})

  const { data: featuredEvents = [], isLoading } = useSWR("/api/events/featured", fetcher, {
    fallbackData: [
      {
        id: "thursday-light-up",
        title: "Light Up the Lakefront",
        day_of_week: 4,
        time: "6:15 PM",
        location: "Agora Statues (Michigan Ave & Roosevelt)",
        distance: "30 minutes",
        pace: "Party Pace",
        description: "Thursday evening run along the lakefront. All paces welcome!",
        facebook_link: "https://www.facebook.com/groups/665701690539939",
        strava_link: "https://www.strava.com/clubs/943959",
        type: "weekly-run",
        has_post_run_social: true,
      },
      {
        id: "saturday-anchor",
        title: "Anchor Run",
        day_of_week: 6,
        time: "9:00 AM",
        location: "Agora Statues (Michigan Ave & Roosevelt)",
        distance: "6.5 miles",
        pace: "Pace Groups",
        description: "Saturday morning long run. Join us for our signature Anchor Run!",
        facebook_link: "https://www.facebook.com/groups/665701690539939",
        strava_link: "https://www.strava.com/clubs/943959",
        type: "weekly-run",
        has_post_run_social: false,
      },
      {
        id: "sunday-social",
        title: "Sunday Social Run",
        day_of_week: 0,
        time: "9:00 AM",
        location: "Agora Statues (Michigan Ave & Roosevelt)",
        distance: "30 minutes",
        pace: "11-12 min/mile",
        description:
          "30-minute 11-12/mile run followed by coffee in a South Loop café. Perfect way to start your Sunday!",
        facebook_link: "https://fb.me/e/6SQ3Vaigo",
        strava_link: "https://www.strava.com/clubs/943959/group_events/3421718402079309428",
        type: "weekly-run",
        has_post_run_social: true,
      },
    ],
  })

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek]
  }

  const getDayKey = (dayOfWeek: number) => {
    const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return dayKeys[dayOfWeek]
  }

  const getDayOfWeekFromDate = (dateString: string): number => {
    if (!dateString) return -1
    const chicagoOffset = "-06:00"
    const correctedDateString = `${dateString.split("T")[0]}T12:00:00${chicagoOffset}`
    const date = new Date(correctedDateString)
    return date.getDay()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const chicagoOffset = "-06:00"
    const correctedDateString = `${dateString.split("T")[0]}T12:00:00${chicagoOffset}`

    const date = new Date(correctedDateString)

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Chicago",
    })
  }

  const renderEventCard = (event: any, delay: number, className: string) => {
    const isWeeklyRun = event.type === "weekly-run"
    const isSpecialEvent = event.type === "special-event"
    const dayKey = isWeeklyRun
      ? getDayKey(event.day_of_week)
      : isSpecialEvent && event.date
        ? getDayKey(getDayOfWeekFromDate(event.date))
        : null

    const frontContent = (
      <Card className="h-full border-0 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {isWeeklyRun && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{getDayName(event.day_of_week)}s</span>
              </div>
            )}
            {isSpecialEvent && event.date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </div>

          {dayKey && (
            <WeatherWidget
              day={dayKey as any}
              onWeatherLoad={(weather) => setWeatherData((prev) => ({ ...prev, [dayKey]: weather }))}
            />
          )}

          <div className="flex flex-wrap gap-2">
            {event.distance && <Badge variant="outline">{event.distance}</Badge>}
            {event.pace && (
              <Badge variant="outline" className="border-slr-red text-slr-red">
                {event.pace}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-muted-foreground border-t pt-3">
              RSVP on the club pages / get the most up-to-date info
            </p>
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0" asChild>
                <a href={event.facebook_link} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                  Facebook
                  <span className="sr-only">Opens in new window</span>
                </a>
              </Button>
              <Button className="flex-1 bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white border-0" asChild>
                <a href={event.strava_link} target="_blank" rel="noopener noreferrer">
                  <Activity className="h-4 w-4 mr-2" aria-hidden="true" />
                  Strava
                  <span className="sr-only">Opens in new window</span>
                </a>
              </Button>
            </div>
          </div>

          <PaceInterestSection
            runId={event.id}
            hasSocial={
              event.has_post_run_social === 1 ||
              event.has_post_run_social === "1" ||
              event.has_post_run_social === true ||
              event.has_post_run_social === "true"
            }
            collectRsvpNames={
              event.collect_rsvp_names === 1 ||
              event.collect_rsvp_names === "1" ||
              event.collect_rsvp_names === true ||
              event.collect_rsvp_names === "true"
            }
          />
        </CardContent>
      </Card>
    )

    const backContent = event.route_map_iframe ? (
      <Card className="h-full border-0 rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{event.title} - Route Map</CardTitle>
          <CardDescription>Explore the running route</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-auto" dangerouslySetInnerHTML={{ __html: event.route_map_iframe }} />
        </CardContent>
      </Card>
    ) : null

    return (
      <ScrollReveal key={event.id} delay={delay} className={className}>
        <article className="glass-strong rounded-3xl shadow-soft hover-lift h-full border-0">
          <FlipCard front={frontContent} back={backContent} hasBack={!!event.route_map_iframe} />
        </article>
      </ScrollReveal>
    )
  }

  if (isLoading && featuredEvents.length === 0) {
    return (
      <section className="relative py-20 bg-[#f9fafb]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading weekly runs...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 overflow-hidden" aria-labelledby="runs-heading">
      <div
        className="absolute inset-0 z-0 -top-[180px]"
        style={{
          backgroundImage: "url(/images/weekly-runs-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "normal",
        }}
      />
      <div className="absolute inset-0 z-0 -top-[180px] bg-gradient-to-b from-transparent via-black/30 to-black/40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 backdrop-blur-md bg-black/30 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 id="runs-heading" className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white">
            Weekly Runs
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto text-balance">
            Join us for our regularly scheduled runs. All fitness levels welcome!{" "}
            <Link
              href="/weather-guide"
              className="inline-flex items-center gap-1.5 text-slr-blue hover:text-slr-blue-light transition-colors group font-medium"
            >
              Check our weather running guide
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>{" "}
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="relative overflow-hidden bg-slr-red/70 backdrop-blur-[10px] brightness-110 
                        border-2 border-white/40 
                        shadow-[0_8px_32px_0_rgba(0,0,0,0.25),inset_0_2px_8px_rgba(255,255,255,0.2)]
                        hover:bg-slr-red/90 hover:border-white/60 
                        hover:shadow-[0_12px_40px_0_rgba(217,42,49,0.5)]
                        hover:-translate-y-0.5
                        transition-all duration-300 text-white font-semibold
                        after:content-[''] after:absolute after:top-[-50%] after:left-[-50%] 
                        after:w-[200%] after:h-[200%] 
                        after:bg-gradient-to-br after:from-transparent after:via-white/10 after:to-transparent
                        after:rotate-45 after:transition-all after:duration-500
                        hover:after:left-[100%]"
            >
              <Link href="/calendar" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                View Calendar
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents[0] && renderEventCard(featuredEvents[0], 0, "")}
            {featuredEvents[1] && renderEventCard(featuredEvents[1], 100, "")}
            {featuredEvents[2] && renderEventCard(featuredEvents[2], 200, "")}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 -mb-1" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <linearGradient id="runsToAboutWave" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0.4)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
            </linearGradient>
          </defs>
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#runsToAboutWave)"
          />
        </svg>
      </div>
    </section>
  )
}
