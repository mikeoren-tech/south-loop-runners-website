import { CloudRain, Thermometer, Wind } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"

const temperatureGuidance = [
  {
    range: "Above 80°F (27°C)",
    title: "Hot Weather Running",
    months: "June - August",
    tips: [
      "Run early morning or late evening to avoid peak heat",
      "Slow your pace by 20-30 seconds per mile",
      "Hydrate before, during, and after your run",
      "Wear light-colored, moisture-wicking clothing",
      "Consider running in shaded areas or near the lakefront",
      "Watch for signs of heat exhaustion: dizziness, nausea, excessive fatigue",
    ],
    color: "bg-red-50 border-red-200",
  },
  {
    range: "60-80°F (16-27°C)",
    title: "Ideal Running Weather",
    months: "May, September",
    tips: [
      "Perfect conditions for maintaining your normal pace",
      "Still bring water for runs over 45 minutes",
      "Wear breathable, moisture-wicking fabrics",
      "Great weather for tempo runs and speed work",
    ],
    color: "bg-green-50 border-green-200",
  },
  {
    range: "40-60°F (4-16°C)",
    title: "Cool Weather Running",
    months: "April, October, November",
    tips: [
      "Layer up - you'll warm up after 10-15 minutes",
      "Wear gloves and a headband to protect extremities",
      "You can maintain or even improve your pace",
      "Perfect for long runs and marathon training",
      "Dress as if it's 15-20°F warmer than actual temperature",
    ],
    color: "bg-blue-50 border-blue-200",
  },
  {
    range: "20-40°F (-7 to 4°C)",
    title: "Cold Weather Running",
    months: "December, January, February, March",
    tips: [
      "Wear multiple layers: base layer, insulating layer, wind-breaking outer layer",
      "Cover all exposed skin - use a buff or balaclava",
      "Slow your pace by 10-20 seconds per mile",
      "Warm up indoors before heading out",
      "Watch for ice on sidewalks and paths",
      "Consider traction devices for icy conditions",
    ],
    color: "bg-cyan-50 border-cyan-200",
  },
  {
    range: "Below 20°F (-7°C)",
    title: "Extreme Cold Running",
    months: "January, February (coldest days)",
    tips: [
      "Consider moving your run indoors if below 0°F with wind chill",
      "Wear windproof outer layers and insulated gloves",
      "Use petroleum jelly on exposed skin to prevent frostbite",
      "Slow your pace significantly - focus on effort, not speed",
      "Shorten your run duration",
      "Breathe through a buff or scarf to warm the air",
    ],
    color: "bg-purple-50 border-purple-200",
  },
]

const windGuidance = [
  {
    speed: "0-10 mph",
    impact: "Minimal impact on pace",
    note: "Typical for most days",
    tips: ["Normal running conditions", "No adjustments needed"],
  },
  {
    speed: "10-20 mph",
    impact: "Moderate impact - add 5-10 seconds per mile",
    note: "Common in spring (March-April) and fall (October-November)",
    tips: [
      "Run into the wind first, return with tailwind",
      "Lower your gaze and lean slightly forward into headwinds",
      "Use buildings and trees as windbreaks when possible",
    ],
  },
  {
    speed: "20+ mph",
    impact: "Significant impact - add 15-30 seconds per mile",
    note: "Frequent in winter months and during storms",
    tips: [
      "Focus on effort rather than pace",
      "Consider shortening your route",
      "Run in more protected areas",
      "Be extra cautious of debris and falling branches",
    ],
  },
]

const rainGuidance = [
  {
    type: "Light Rain",
    frequency: "Common in April-May and September-October",
    tips: [
      "Wear a lightweight, water-resistant jacket",
      "Use a hat with a brim to keep rain out of your eyes",
      "Apply anti-chafe balm to prevent blisters",
      "Wear moisture-wicking socks",
      "Minimal pace adjustment needed",
    ],
  },
  {
    type: "Heavy Rain",
    frequency: "Most common during spring and summer thunderstorms",
    tips: [
      "Slow your pace by 10-20 seconds per mile for safety",
      "Watch for puddles and slippery surfaces",
      "Avoid metal surfaces and standing water",
      "Consider shortening your route",
      "Change out of wet clothes immediately after running",
    ],
  },
  {
    type: "Thunderstorms",
    frequency: "Peak season: June-August, often in late afternoon/evening",
    tips: [
      "Do not run - lightning is extremely dangerous",
      "Move your run indoors or wait for the storm to pass",
      "If caught outside, seek shelter immediately",
      "Avoid open areas, tall trees, and metal objects",
    ],
  },
]

export default function WeatherGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
       <header 
        className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10"
      >
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
          <ChevronLeft className="h-5 w-5 text-slr-blue" />
          <Image
              src="/slr-logo.png"
              alt="South Loop Runners"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>
          <h1 className="text-2xl font-bold">Weather Guide</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Chicago Weather Running Guide</h2>
            <p className="text-lg text-muted-foreground">
              Master running in Chicago's diverse weather conditions. From hot summer humidity to frigid winter winds,
              learn how to adjust your pace and gear for optimal performance year-round.
            </p>
          </div>
        </div>
      </section>

      {/* Temperature Guidance */}
      <ScrollReveal>
        <section id="temperature-guide" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Thermometer className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Temperature-Based Running Guide</h2>
              </div>
              <div className="space-y-6">
                {temperatureGuidance.map((guide) => (
                  <Card key={guide.range} className={`border-2 ${guide.color}`}>
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                      <CardDescription className="text-base font-semibold">
                        {guide.range} • Typical: {guide.months}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.tips.map((tip, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Wind Guidance */}
      <ScrollReveal>
        <section id="wind-guide" className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Wind className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Running in Wind</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {windGuidance.map((guide) => (
                  <Card key={guide.speed}>
                    <CardHeader>
                      <CardTitle className="text-lg">{guide.speed}</CardTitle>
                      <CardDescription className="font-semibold text-sm">{guide.impact}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">{guide.note}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.tips.map((tip, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Rain Guidance */}
      <ScrollReveal>
        <section id="rain-guide" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <CloudRain className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Running in Rain</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {rainGuidance.map((guide) => (
                  <Card key={guide.type}>
                    <CardHeader>
                      <CardTitle className="text-lg">{guide.type}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-2">{guide.frequency}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.tips.map((tip, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pace Adjustment Summary */}
      <ScrollReveal>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Quick Pace Adjustment Reference</h2>
              <Card className="bg-primary/5">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Slow Down When:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-destructive">•</span>
                          <span>Temperature above 80°F: -20-30 sec/mile</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-destructive">•</span>
                          <span>Temperature below 20°F: -10-20 sec/mile</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-destructive">•</span>
                          <span>Wind 10-20 mph: -5-10 sec/mile</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-destructive">•</span>
                          <span>Wind 20+ mph: -15-30 sec/mile</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-destructive">•</span>
                          <span>Heavy rain: -10-20 sec/mile</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-destructive">•</span>
                          <span>High humidity (80%+): -10-15 sec/mile</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Optimal Conditions:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>Temperature: 40-60°F (4-16°C)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>Wind: Less than 10 mph</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>Humidity: 40-60%</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>Overcast or partly cloudy</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>No precipitation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Remember:</strong> These are general guidelines. Listen to your body and adjust based on
                      your fitness level, acclimatization, and how you feel on any given day. When in doubt, slow down
                      and prioritize safety over pace.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Run in Any Weather?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join South Loop Runners and experience Chicago's weather with a supportive community by your side.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://www.facebook.com/groups/665701690539939" target="_blank" rel="noopener noreferrer">
                Join on Facebook
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
