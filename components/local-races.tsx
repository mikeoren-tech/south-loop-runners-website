"use client"
import { WaveTransition } from "@/components/wave-transition"
import { Trophy } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { FeaturedRaces } from "@/components/featured-events"

export function LocalRaces() {
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

          <FeaturedRaces />
        </div>
      </div>
      <WaveTransition fillColor="rgba(249, 250, 251, 0.5)" />
    </section>
  )
}
