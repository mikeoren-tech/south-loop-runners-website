import { Hero } from "@/components/hero"
import { UpcomingRuns } from "@/components/upcoming-runs"
import { About } from "@/components/about"
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
