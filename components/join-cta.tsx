import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  )
}

export function JoinCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Join the Pack?</h2>
                <p className="text-lg text-muted-foreground text-balance">
                  Whether you're new to running or a seasoned marathoner, there's a place for you in South Loop Runners.
                  Come run with us!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="gap-2" asChild>
                    <a href="https://www.facebook.com/groups/665701690539939" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Join Our Facebook Group
                    </a>
                  </Button>
                  <Button size="lg" className="gap-2 bg-[#FC4C02] hover:bg-[#E34402] text-white" asChild>
                    <a href="https://www.strava.com/clubs/Southlooprunners" target="_blank" rel="noopener noreferrer">
                      <StravaIcon className="h-5 w-5" />
                      Join Our Strava Club
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <Card className="w-full max-w-[300px]">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <iframe
                      allowTransparency
                      frameBorder="0"
                      height="454"
                      scrolling="no"
                      src="https://www.strava.com/clubs/943959/latest-rides/f004bd56b781ef2add4c82f7e5115cf897c16808?show_rides=true"
                      width="100%"
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
