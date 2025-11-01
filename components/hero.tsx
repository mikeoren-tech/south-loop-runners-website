import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-8">
            <Image
              src="/south-loop-runners-logo.png"
              alt="South Loop Runners"
              width={500}
              height={375}
              className="w-full max-w-lg h-auto"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-gray-900">
            South Loop Runners
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 text-balance">
            Chicago's premier running community in the heart of the South Loop
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8" asChild>
              <a href="https://www.facebook.com/groups/665701690539939" target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-5 w-5" />
                View Upcoming Runs
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 bg-transparent"
              asChild
            >
              <a href="https://www.facebook.com/groups/665701690539939" target="_blank" rel="noopener noreferrer">
                <MapPin className="mr-2 h-5 w-5" />
                Join the Club
              </a>
            </Button>
          </div>
          <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gray-900">3x</div>
              <div className="text-gray-600">Weekly Runs</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gray-900">All</div>
              <div className="text-gray-600">Pace Levels</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  )
}
