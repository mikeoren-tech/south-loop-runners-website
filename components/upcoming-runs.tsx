"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, FacebookIcon, Activity, Users } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WeatherWidget, type WeatherData } from "@/components/weather-widget"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const weeklyRuns = [
  {
    id: "thursday-light-up",
    title: "Light Up the Lakefront",
    dayOfWeek: "Thursday",
    time: "6:15 PM",
    location: "Agora Statues (Michigan Ave & Roosevelt)",
    distance: "30 minutes",
    pace: "Party Pace",
    description: "Thursday evening run along the lakefront. All paces welcome!",
    facebookLink: "https://www.facebook.com/groups/665701690539939",
    stravaLink: "https://www.strava.com/clubs/Southlooprunners",
  },
  {
    id: "saturday-anchor",
    title: "Anchor Run",
    dayOfWeek: "Saturday",
    time: "9:00 AM",
    location: "Agora Statues (Michigan Ave & Roosevelt)",
    distance: "6.5 miles",
    pace: "Pace Groups",
    description: "Saturday morning long run. Join us for our signature Anchor Run!",
    facebookLink: "https://www.facebook.com/groups/665701690539939",
    stravaLink: "https://www.strava.com/clubs/Southlooprunners",
  },
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function PaceInterestSection({ runId }: { runId: string }) {
  const [selectedPace, setSelectedPace] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: interests = [], mutate } = useSWR<PaceInterest[]>(`/api/run-interest/${runId}`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  // Count interests by pace group
  const paceCounts = PACE_GROUPS.reduce(
    (acc, pace) => {
      acc[pace] = interests.filter((i) => i.pace === pace).length
      return acc
    },
    {} as Record<string, number>,
  )

  const totalInterested = interests.length

  const handleSubmit = async () => {
    if (!selectedPace || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/run-interest/${runId}`, {
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

  return (
    <div className="border-t pt-4 mt-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Show Your Interest</span>
        <span className="text-xs">(Official RSVP on Facebook/Strava)</span>
      </div>

      <div className="flex gap-2">
        <Select value={selectedPace} onValueChange={setSelectedPace}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select your pace" />
          </SelectTrigger>
          <SelectContent>
            {PACE_GROUPS.map((pace) => (
              <SelectItem key={pace} value={pace}>
                {pace}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} disabled={!selectedPace || isSubmitting} size="sm">
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>

      {totalInterested > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {totalInterested} {totalInterested === 1 ? "runner" : "runners"} interested
          </p>
          <div className="space-y-1">
            {PACE_GROUPS.map((pace) => {
              const count = paceCounts[pace]
              if (count === 0) return null
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
    </div>
  )
}

function getWeatherGuideLink(weather: WeatherData | null): { url: string; text: string } {
  if (!weather) {
    return { url: "/weather-guide", text: "View Weather Running Guide" }
  }

  const { temperature, windSpeed, precipitation } = weather

  // Determine primary condition
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

  // Add wind or rain if significant
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
  const [thursdayWeather, setThursdayWeather] = useState<WeatherData | null>(null)
  const [saturdayWeather, setSaturdayWeather] = useState<WeatherData | null>(null)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Weekly Runs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Join us for our regularly scheduled runs. All fitness levels welcome!{" "}
            <Link href="/weather-guide" className="text-primary hover:underline font-medium">
              Check our weather running guide
            </Link>{" "}
            for tips on running in different conditions.
          </p>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {weeklyRuns.map((run, index) => {
              const isThursday = run.id === "thursday-light-up"
              const weather = isThursday ? thursdayWeather : saturdayWeather

              return (
                <ScrollReveal key={run.id} delay={index * 100}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">{run.title}</CardTitle>
                      <CardDescription>{run.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{run.dayOfWeek}s</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{run.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{run.location}</span>
                        </div>
                      </div>

                      <WeatherWidget
                        day={isThursday ? "thursday" : "saturday"}
                        onWeatherLoad={isThursday ? setThursdayWeather : setSaturdayWeather}
                      />

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{run.distance}</Badge>
                        <Badge variant="outline" className="border-[#d92a31] text-[#d92a31]">
                          {run.pace}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-center text-muted-foreground border-t pt-3">
                          RSVP on the club pages / get the most up-to-date info
                        </p>
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0" asChild>
                            <a href={run.facebookLink} target="_blank" rel="noopener noreferrer">
                              <FacebookIcon className="h-4 w-4 mr-2" />
                              Facebook
                            </a>
                          </Button>
                          <Button className="flex-1 bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white border-0" asChild>
                            <a href={run.stravaLink} target="_blank" rel="noopener noreferrer">
                              <Activity className="h-4 w-4 mr-2" />
                              Strava
                            </a>
                          </Button>
                        </div>
                      </div>

                      <PaceInterestSection runId={run.id} />
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={200}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Meetup Location</CardTitle>
                  <CardDescription>Agora Statues at Michigan Ave & Roosevelt</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2971.8!2d-87.6239!3d41.8681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca1b2e6e5e5%3A0x1234567890abcdef!2sV99G%2B7M%20Chicago%2C%20Illinois!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-b-lg"
                  />
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">The Agora Statues</CardTitle>
                  <CardDescription>South Loop Runners at our meetup spot</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full h-[300px]">
                    <Image
                      src="/images/design-mode/image.png"
                      alt="South Loop Runners group photo at the Agora Statues meetup location"
                      fill
                      className="object-cover rounded-b-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={300}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Club Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe
                  allowTransparency
                  frameBorder="0"
                  height="160"
                  scrolling="no"
                  src="https://www.strava.com/clubs/943959/latest-rides/f004bd56b781ef2add4c82f7e5115cf897c16808?show_rides=false"
                  width="100%"
                  className="w-full"
                />
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
