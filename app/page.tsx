import { Hero } from "@/components/hero"
import { UpcomingRuns } from "@/components/upcoming-runs"
import { About } from "@/components/about"
import { LocalRaces } from "@/components/local-races"
import { InstagramFeed } from "@/components/instagram-feed"
import { JoinCTA } from "@/components/join-cta"
import { Footer } from "@/components/footer"
import { AnnouncementBanner } from "@/components/announcement-banner"

export const runtime = "edge"

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBanner />
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
