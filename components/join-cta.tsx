import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Join the Pack?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Whether you're new to running or a seasoned marathoner, there's a place for you in South Loop Runners.
                Come run with us!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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

              <div className="pt-6 border-t mt-8">
                <p className="text-sm text-muted-foreground mb-4">Have questions? Reach out to us!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <a href="mailto:info@southlooprunners.com" className="text-primary hover:underline">
                    info@southlooprunners.com
                  </a>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Chicago, IL - South Loop</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
