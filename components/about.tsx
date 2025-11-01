import { Card, CardContent } from "@/components/ui/card"
import { Heart, Trophy, Users, Zap } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Inclusive Community",
    description: "Runners of all paces and experience levels are welcome. We believe in supporting each other.",
  },
  {
    icon: Zap,
    title: "Regular Runs",
    description: "Multiple runs per week including tempo runs, social runs, and long runs on weekends.",
  },
  {
    icon: Trophy,
    title: "Race Support",
    description: "Training plans, group race entries, and cheering squads for Chicago marathons and races.",
  },
  {
    icon: Heart,
    title: "Social Events",
    description: "Post-run coffee, happy hours, and seasonal celebrations to build lasting friendships.",
  },
]

export function About() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About Our Club</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              South Loop Runners is more than just a running club—we're a community of passionate runners who love
              exploring Chicago's beautiful lakefront and neighborhoods together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-balance">Running in the Heart of Chicago</h3>
                <p className="text-lg opacity-90 text-balance">
                  Based in the South Loop, we have unparalleled access to Grant Park, the Lakefront Trail, Museum
                  Campus, and countless scenic routes. Whether you're training for your first 5K or your tenth marathon,
                  you'll find your pace with us.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
