import { Calendar, Bell, Download, ArrowRight, Activity, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function CalendarCTA() {
  return (
    // Section uses bg-transparent
    <section className="relative py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div>
            {/* Card uses glassmorphic styles */}
            <Card className="rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Inner branded gradient container */}
              <div className="bg-gradient-to-br from-slr-blue/10 via-slr-red/5 to-slr-blue/5 p-8 md:p-12">
                <div className="text-center space-y-6">
                  {/* Main Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slr-blue/20 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-slr-blue" />
                  </div>

                  <div className="space-y-3">
                    {/* FIX: Ensure headline is dark/foreground color for legibility on light background */}
                    <h2 className="text-3xl md:text-4xl font-bold text-balance text-foreground">Never Miss an Event</h2>
                    <p className="text-lg text-foreground/80 max-w-2xl mx-auto text-balance">
                      View all upcoming runs and races in one place. Get notifications when new events are added and
                      export to your personal calendar.
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid sm:grid-cols-3 gap-4 pt-4 text-background">
                    {/* Feature 1: Run & Race Views */}
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-12 h-12 bg-slr-blue/10 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-slr-blue" />
                      </div>
                      <h3 className="font-semibold text-sm">Run & Race Views</h3>
                      {/* FIX: Use dark foreground color for legibility */}
                      <p className="text-xs text-background/70 text-center">See events in calendar or list format</p>
                    </div>

                    {/* Feature 2: Event Notifications */}
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-12 h-12 bg-slr-red/10 rounded-full flex items-center justify-center">
                        <Bell className="h-6 w-6 text-slr-red" />
                      </div>
                      <h3 className="font-semibold text-sm">Event Notifications</h3>
                      {/* FIX: Use dark foreground color for legibility */}
                      <p className="text-xs text-background/70 text-center">Get notified about new events</p>
                    </div>

                    {/* Feature 3: Calendar Export */}
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-12 h-12 bg-slr-blue/10 rounded-full flex items-center justify-center">
                        <Download className="h-6 w-6 text-slr-blue" />
                      </div>
                      <h3 className="font-semibold text-sm">Calendar Export</h3>
                      {/* FIX: Use dark foreground color for legibility */}
                      <p className="text-xs text-background/70 text-center">Add events to your calendar app</p>
                    </div>
                  </div>

                  {/* Main CTA Button */}
                  <Button
                    asChild
                    size="lg"
                    className="shimmer-button bg-slr-blue hover:bg-slr-blue/90 text-slr-blue-dark shadow-lg hover:shadow-xl transition-all mt-6"
                  >
                    <Link href="/calendar" className="flex items-center">
                      View Events Calendar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
