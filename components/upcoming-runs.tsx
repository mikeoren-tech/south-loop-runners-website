"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WeatherWidget, type WeatherData } from "@/components/weather-widget"
import Link from "next/link"

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
              const guideLink = getWeatherGuideLink(weather)

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

                      {weather && (
                        <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                          <Link href={guideLink.url}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            {guideLink.text}
                          </Link>
                        </Button>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{run.distance}</Badge>
                        <Badge variant="outline" className="border-[#d92a31] text-[#d92a31]">
                          {run.pace}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" variant="default" asChild>
                          <a href={run.facebookLink} target="_blank" rel="noopener noreferrer">
                            Facebook
                          </a>
                        </Button>
                        <Button className="flex-1 bg-transparent" variant="outline" asChild>
                          <a href={run.stravaLink} target="_blank" rel="noopener noreferrer">
                            Strava
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>

          <ScrollReveal delay={200}>
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
