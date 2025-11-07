"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import type { WeatherData } from "@/components/weather-widget"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WaveTransition } from "@/components/wave-transition"
import { FeaturedWeeklyRuns } from "@/components/featured-events"

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
    stravaLink: "https://www.strava.com/clubs/943959",
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
    stravaLink: "https://www.strava.com/clubs/943959",
  },
  {
    id: "sunday-social",
    title: "Sunday Social Run",
    dayOfWeek: "Sunday",
    time: "9:00 AM",
    location: "Agora Statues (Michigan Ave & Roosevelt)",
    distance: "30 minutes",
    pace: "11-12 min/mile",
    description: "30-minute 11-12/mile run followed by coffee in a South Loop café. Perfect way to start your Sunday!",
    facebookLink: "https://fb.me/e/6SQ3Vaigo",
    stravaLink: "https://www.strava.com/clubs/943959/group_events/3421718402079309428",
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
  const [sundayWeather, setSundayWeather] = useState<WeatherData | null>(null)

  return (
    <section className="relative py-20 bg-[#f9fafb]" aria-labelledby="runs-heading">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 id="runs-heading" className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Weekly Runs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Join us for our regularly scheduled runs. All fitness levels welcome!{" "}
            <Link href="/weather-guide" className="text-primary hover:underline font-medium">
              Check our weather running guide
            </Link>{" "}
            for tips on running in different conditions.
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/calendar">
                View Events Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto">
          <FeaturedWeeklyRuns />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[minmax(200px,auto)] mt-8">
            {/* Agora Statues Image */}
            <ScrollReveal delay={100} className="md:col-span-3 lg:col-span-6 md:row-span-1">
              <Card className="glass rounded-3xl shadow-soft hover-scale h-full border-0 p-0">
                <div className="relative w-full h-full min-h-[250px] overflow-hidden rounded-3xl">
                  <Image
                    src="/images/design-mode/image.png"
                    alt="South Loop Runners group photo at the Agora Statues meetup location"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </ScrollReveal>

            {/* Map */}
            <ScrollReveal delay={150} className="md:col-span-3 lg:col-span-6 md:row-span-1">
              <Card className="glass rounded-3xl shadow-soft hover-scale h-full border-0 p-0 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2971.8!2d-87.6239!3d41.8681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca1b2e6e5e5%3A0x1234567890abcdef!2sV99G%2B7M%20Chicago%2C%20Illinois!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "250px", borderRadius: "24px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-3xl"
                  title="Map showing Agora Statues meetup location at Michigan Ave & Roosevelt"
                />
              </Card>
            </ScrollReveal>

            {/* Strava Activities */}
            <ScrollReveal delay={200} className="md:col-span-6 lg:col-span-12 md:row-span-1">
              <Card className="glass rounded-3xl shadow-soft hover-lift h-full border-0 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    allowTransparency
                    frameBorder="0"
                    height="454"
                    scrolling="no"
                    src="https://www.strava.com/clubs/943959/latest-rides/f004bd56b781ef2add4c82f7e5115cf897c16808?show_rides=true"
                    width="100%"
                    className="w-full"
                    title="South Loop Runners Strava Club Recent Activities"
                  />
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <WaveTransition fillColor="#d9eef7" />
    </section>
  )
}
