import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook } from "lucide-react"

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  )
}

export function JoinCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <Card className="max-w-6xl mx-auto glass-strong shadow-soft-lg border-0">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Join the Pack?</h2>
                  <p className="text-lg text-muted-foreground text-balance">
                    Whether you're new to running or a seasoned marathoner, there's a place for you in South Loop
                    Runners. Come run with us!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      size="lg"
                      className="relative z-30 gap-2 text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-social-facebook focus:ring-offset-2"
                      style={{ backgroundColor: '#1877F2' }}
                      asChild
                    >
                      <a
                        href="https://www.facebook.com/groups/665701690539939"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-5 w-5" aria-hidden="true" />
                        Join Our Facebook Group
                        <span className="sr-only">Opens in new window</span>
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      className="relative z-30 gap-2 text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-social-strava focus:ring-offset-2"
                      style={{ backgroundColor: '#FC4C02' }}
                      asChild
                    >
                      <a href="https://www.strava.com/clubs/943959" target="_blank" rel="noopener noreferrer">
                        <StravaIcon className="h-5 w-5" />
                        Join Our Strava Club
                        <span className="sr-only">Opens in new window</span>
                      </a>
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
