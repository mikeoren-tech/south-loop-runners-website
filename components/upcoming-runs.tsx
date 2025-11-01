import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

const weeklyRuns = [
  {
    id: "thursday-light-up",
    title: "Light Up the Lakefront",
    dayOfWeek: "Thursday",
    time: "6:15 PM",
    location: "Agora Statues (Michigan Ave & Roosevelt)",
    distance: "30 minutes",
    pace: "Variable Pace",
    description: "Thursday evening run along the lakefront. All paces welcome!",
    facebookLink: "https://www.facebook.com/groups/665701690539939",
    stravaLink: "https://www.strava.com/clubs/Southlooprunners",
  },
  {
    id: "saturday-anchor",
    title: "Anchor Run",
    dayOfWeek: "Saturday",
    time: "9:00 AM",
    location: "Agora Statues (Michigan Ave & Roosevelt)",
    distance: "6.5 miles",
    pace: "Steady",
    description: "Saturday morning long run. Join us for our signature Anchor Run!",
    facebookLink: "https://www.facebook.com/groups/665701690539939",
    stravaLink: "https://www.strava.com/clubs/Southlooprunners",
  },
]

export function UpcomingRuns() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Weekly Runs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Join us for our regularly scheduled runs. All fitness levels welcome!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {weeklyRuns.map((run) => (
            <Card key={run.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl mb-2">{run.title}</CardTitle>
                <CardDescription>{run.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{run.dayOfWeek}s</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{run.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{run.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{run.distance}</Badge>
                  <Badge variant="outline">{run.pace}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" variant="default" asChild>
                    <a href={run.facebookLink} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </Button>
                  <Button className="flex-1 bg-transparent" variant="outline" asChild>
                    <a href={run.stravaLink} target="_blank" rel="noopener noreferrer">
                      Strava
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </div>
    </section>
  )
}
