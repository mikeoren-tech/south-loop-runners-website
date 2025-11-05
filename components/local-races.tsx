"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Sparkles, Users, ExternalLink, UserPlus } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Attendee = {
  firstName: string
  lastInitial: string
  raceId: string
}

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

function RaceCard({ race, index }: { race: (typeof races)[0]; index: number }) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [firstName, setFirstName] = useState("")
  const [lastInitial, setLastInitial] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [hasRSVPd, setHasRSVPd] = useState(false)

  // Load attendees from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`race-attendees-${race.id}`)
    if (stored) {
      const parsedAttendees = JSON.parse(stored)
      setAttendees(parsedAttendees)

      // Check if current user has already RSVP'd
      const userKey = localStorage.getItem(`user-rsvp-${race.id}`)
      setHasRSVPd(!!userKey)
    }
  }, [race.id])

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastInitial.trim()) return

    const newAttendee: Attendee = {
      firstName: firstName.trim(),
      lastInitial: lastInitial.trim().toUpperCase(),
      raceId: race.id,
    }

    const updatedAttendees = [...attendees, newAttendee]
    setAttendees(updatedAttendees)
    localStorage.setItem(`race-attendees-${race.id}`, JSON.stringify(updatedAttendees))
    localStorage.setItem(`user-rsvp-${race.id}`, JSON.stringify(newAttendee))

    setHasRSVPd(true)
    setShowForm(false)
    setFirstName("")
    setLastInitial("")
  }

  const handleRemoveRSVP = () => {
    const userRSVP = localStorage.getItem(`user-rsvp-${race.id}`)
    if (!userRSVP) return

    const user = JSON.parse(userRSVP)
    const updatedAttendees = attendees.filter(
      (a) => !(a.firstName === user.firstName && a.lastInitial === user.lastInitial),
    )

    setAttendees(updatedAttendees)
    localStorage.setItem(`race-attendees-${race.id}`, JSON.stringify(updatedAttendees))
    localStorage.removeItem(`user-rsvp-${race.id}`)
    setHasRSVPd(false)
  }

  return (
    <ScrollReveal delay={index * 150}>
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
          {/* Event Details */}
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

          {/* Unique Feature Callout */}
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">What Makes It Special</p>
                <p className="text-sm text-muted-foreground">{race.uniqueFeature}</p>
              </div>
            </div>
          </div>

          {/* Race Highlights */}
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

          {/* RSVP Section */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              Who's Going from South Loop Runners? ({attendees.length})
            </h4>

            {!hasRSVPd && !showForm && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowForm(true)}
                className="w-full border-2 border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                I'm Going! Add My Name
              </Button>
            )}

            {hasRSVPd && (
              <div className="space-y-2">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-primary">You're registered as going! 🎉</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveRSVP}
                  className="w-full text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove My RSVP
                </Button>
              </div>
            )}

            {showForm && (
              <form onSubmit={handleRSVP} className="space-y-3 bg-muted/50 p-4 rounded-lg border-2 border-primary/20">
                <p className="text-xs text-muted-foreground">Let others know you're going! No login required.</p>
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${race.id}`} className="text-xs font-semibold">
                    First Name
                  </Label>
                  <Input
                    id={`firstName-${race.id}`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastInitial-${race.id}`} className="text-xs font-semibold">
                    Last Initial
                  </Label>
                  <Input
                    id={`lastInitial-${race.id}`}
                    value={lastInitial}
                    onChange={(e) => setLastInitial(e.target.value.slice(0, 1))}
                    placeholder="D"
                    maxLength={1}
                    required
                    className="h-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="default" className="flex-1 bg-primary hover:bg-primary/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Me
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setShowForm(false)
                      setFirstName("")
                      setLastInitial("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {attendees.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Club members going:</p>
                <div className="flex flex-wrap gap-2">
                  {attendees.map((attendee, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {attendee.firstName} {attendee.lastInitial}.
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {attendees.length === 0 && !showForm && !hasRSVPd && (
              <p className="text-xs text-muted-foreground italic text-center py-2">
                Be the first to let others know you're going!
              </p>
            )}
          </div>

          {/* Registration Button */}
          <Button
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            size="lg"
            asChild
          >
            <a href={race.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register for Race
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

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {races.map((race, index) => (
              <RaceCard key={race.id} race={race} index={index} />
            ))}
          </div>

          {/* Call to Action */}
          <ScrollReveal delay={300}>
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-2">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-balance">Run Local, Run Together</h3>
                  <p className="text-lg text-muted-foreground text-balance">
                    These races showcase the best of Chicago running, starting right in our South Loop neighborhood.
                    Join your fellow club members and experience the energy of racing close to home!
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center pt-4">
                    <Button variant="outline" size="lg" asChild>
                      <a
                        href="https://www.facebook.com/groups/665701690539939"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Discuss on Facebook
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="https://www.strava.com/clubs/Southlooprunners" target="_blank" rel="noopener noreferrer">
                        Join on Strava
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
