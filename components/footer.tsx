import { Facebook, Instagram, MapPin } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

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
              <Image
                src="/south-loop-runners-logo.png"
                alt="South Loop Runners"
                width={200}
                height={150}
                className="h-auto"
              />
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
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/southlooprunners"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.strava.com/clubs/Southlooprunners"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <StravaIcon className="h-5 w-5" />
                <span className="sr-only">Strava</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Upcoming Runs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Join the Club
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Meet-up Location</h4>
            <div className="flex gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Agora Statues</p>
                <p>Michigan Ave & Roosevelt</p>
                <p>South Loop, Chicago, IL</p>
              </div>
            </div>
            <Button className="w-full" asChild>
              <a href="https://www.strava.com/clubs/Southlooprunners" target="_blank" rel="noopener noreferrer">
                Join Our Strava Club
              </a>
            </Button>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} South Loop Runners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
