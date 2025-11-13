import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, ArrowRight } from "lucide-react"
import Link from "next/link"
import Shimmer from "@/components/ui/shimmer"

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  )
}

export function JoinCTA() {
  return (
    <section className="relative py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-slr-red/10 via-slr-blue/5 to-slr-red/5 p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-balance text-foreground">Ready to Join the Pack?</h2>
                  <p className="text-lg text-foreground/80 text-balance">
                    Whether you're new to running or a seasoned marathoner, there's a place for you in South Loop
                    Runners. Come run with us!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Shimmer shimmerDuration="3s">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-slr-blue hover:bg-slr-blue/90 text-slr-blue-dark shadow-lg hover:shadow-xl transition-all"
                        asChild
                      >
                        <a
                          href="httpshttps://www.facebook.com/groups/665701690539939"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                          aria-label="Join our Facebook group - opens in a new tab"
                        >
                          <Facebook className="h-5 w-5 mr-2" aria-hidden="true" />
                          Join Our Facebook Group
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </Shimmer>
                    <Shimmer shimmerDuration="3.5s">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-slr-red hover:bg-slr-red/90 text-white shadow-lg hover:shadow-xl transition-all"
                        asChild
                      >
                        <a
                          href="https://www.strava.com/clubs/943959"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                          aria-label="Join our Strava club - opens in a new tab"
                        >
                          <StravaIcon className="h-5 w-5 mr-2" />
                          Join Our Strava Club
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </Shimmer>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <Card className="w-full max-w-[300px] bg-foreground/10 border-foreground/20 rounded-lg shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">Club Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <iframe
                        title="Strava Club Statistics"
                        allowTransparency
                        frameBorder="0"
                        height="160"
                        scrolling="no"
                        src="https://www.strava.com/clubs/943959/latest-rides/f004bd56b781ef2add4c82f7e5115cf897c16808?show_rides=false"
                        width="100%"
                        className="w-full rounded-b-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
