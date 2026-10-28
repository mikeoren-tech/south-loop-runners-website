"use client"

import useSWR from "swr"
import { Clock, MapPin, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

interface SocialEvent {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  registration_url: string | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Dates are stored as YYYY-MM-DD; build a local date so the day doesn't shift by time zone
function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function SocialCard({ event, index }: { event: SocialEvent; index: number }) {
  const date = parseDate(event.date)

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

          {event.registration_url && (
            <Button asChild className="mt-auto w-full bg-slr-red hover:bg-slr-red/90 text-white">
              <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                RSVP on Luma
                <ArrowUpRight className="h-4 w-4 ml-1" aria-hidden="true" />
                <span className="sr-only">(opens in new window)</span>
              </a>
            </Button>
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
