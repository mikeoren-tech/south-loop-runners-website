import { Hero } from "@/components/hero"
import { LakeEffectCallout } from "@/components/lake-effect-callout"
import { UpcomingRuns } from "@/components/upcoming-runs"
import { About } from "@/components/about"
import { LocalRaces } from "@/components/local-races"
import { SocialEvents } from "@/components/social-events"
import { InstagramFeed } from "@/components/instagram-feed"
import { JoinCTA } from "@/components/join-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <div id="home">
        <Hero />
      </div>
      <div id="runs">
        <UpcomingRuns />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="races">
        <LocalRaces />
      </div>
      <SocialEvents />
      <div id="instagram">
        <InstagramFeed />
      </div>
      <div id="join">
        <JoinCTA />
      </div>
      <Footer />
    </main>
  )
}
