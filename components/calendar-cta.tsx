import { Calendar, Bell, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function CalendarCTA() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-[#f9fafb]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div>
            <Card className="glass-strong border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-destructive/5 to-primary/5 p-8 md:p-12">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-balance">Never Miss an Event</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                      View all upcoming runs and races in one place. Get notifications when new events are added and
                      export to your personal calendar.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">Month & List Views</h3>
                      <p className="text-xs text-muted-foreground text-center">See events in calendar or list format</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bell className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">Event Notifications</h3>
                      <p className="text-xs text-muted-foreground text-center">Get notified about new events</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Download className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">Calendar Export</h3>
                      <p className="text-xs text-muted-foreground text-center">Add events to your calendar app</p>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all mt-6"
                  >
                    <Link href="/calendar">
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
