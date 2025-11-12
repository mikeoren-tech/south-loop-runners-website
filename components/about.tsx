import { Card, CardContent } from "@/components/ui/card"
import { Heart, Trophy, Users, Zap, MessageSquare } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WaveTransition } from "@/components/wave-transition"

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
    link: {
      text: "Member created AI coach",
      url: "https://gemini.google.com/gem/15qZeU56iHf5NOFxDh737EZMpVOV5qSfs?usp=sharing",
    },
  },
  {
    icon: Heart,
    title: "Social Events",
    description: "Post-run coffee, happy hours, and seasonal celebrations to build lasting friendships.",
  },
]

export function About() {
  return (
    <section className="relative py-20 bg-[#d9eef7]" id="about">
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">About Our Club</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              South Loop Runners is more than just a running club—we're a community of passionate runners who love
              exploring Chicago's beautiful lakefront and neighborhoods together.{" "}
              <a 
                href="https://discord.gg/sFtmQknX8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[slr-red] hover:underline font-medium inline-flex items-center gap-1"
              >
                Join our Discord
                <MessageSquare className="h-4 w-4 inline" />
              </a>{" "}
              to connect between runs!
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <Card className="glass-strong shadow-soft hover-lift border-0 h-full">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-destructive" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                          {feature.link && (
                            <a
                              href={feature.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-3 text-sm font-medium hover:underline text-[rgba(217,42,49,1)]"
                            >
                              {feature.link.text} →
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>

          <ScrollReveal delay={400}>
            <Card className="glass-strong shadow-soft-lg border-0">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-balance text-foreground">
                    Running in the Heart of Chicago
                  </h3>
                  <p className="text-lg opacity-90 text-balance text-foreground">
                    Based in the South Loop, we have unparalleled access to Grant Park, the Lakefront Trail, Museum
                    Campus, and countless scenic routes. Whether you're training for your first 5K or your tenth
                    marathon, you'll find your pace with us.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
