import { Facebook, Instagram, MapPin } from "lucide-react"
import Image from "next/image"

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <div className="mb-4">
              <Image src="/slr-logo.jpg" alt="South Loop Runners logo" width={200} height={150} className="h-auto" />
            </div>
            <h3 className="font-bold text-lg mb-4">South Loop Runners</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chicago's premier running community, bringing together runners of all levels to explore the city and push
              their limits.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/groups/665701690539939"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-label="Visit our Facebook group"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/southlooprunners"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.strava.com/clubs/943959"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-label="Join our Strava club"
              >
                <StravaIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#runs"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  Upcoming Runs
                </a>
              </li>
              <li>
                <a
                  href="/calendar"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  Events Calendar
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/weather-guide"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  Weather Running Guide
                </a>
              </li>
              <li>
                <a
                  href="#join"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                >
                  Join the Club
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="font-semibold mb-4">Meet-up Location</h4>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
              <address className="not-italic">
                <p className="font-medium">Agora Statues</p>
                <p>Michigan Ave & Roosevelt</p>
                <p>South Loop, Chicago, IL</p>
              </address>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} South Loop Runners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
