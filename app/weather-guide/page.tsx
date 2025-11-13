"use client"

import { CloudRain, Thermometer, Wind, Shirt } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useEffect, useState } from "react"

interface CurrentWeather {
  temperature: number
  condition: string
  windSpeed: number
  precipitation: number
  humidity: number
}

interface GearRecommendation {
  category: string
  items: string[]
}

function CurrentWeatherSection() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const latitude = 41.8781
        const longitude = -87.6298

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Chicago`,
        )

        const data = await response.json()

        if (data.current) {
          const weatherCode = data.current.weather_code
          const condition = getWeatherCondition(weatherCode)

          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            condition,
            windSpeed: Math.round(data.current.wind_speed_10m),
            precipitation: data.current.precipitation || 0,
            humidity: data.current.relative_humidity_2m,
          })
        }
      } catch (error) {
        console.error("Error fetching current weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentWeather()
  }, [])

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear"
    if (code <= 3) return "Partly Cloudy"
    if (code <= 67) return "Rainy"
    if (code <= 77) return "Snowy"
    return "Cloudy"
  }

  const getGearRecommendations = (weather: CurrentWeather): GearRecommendation[] => {
    const recommendations: GearRecommendation[] = []

    // Temperature-based gear
    if (weather.temperature > 80) {
      recommendations.push({
        category: "Hot Weather Gear",
        items: [
          "Light-colored, moisture-wicking shirt",
          "Running shorts with liner",
          "Sweat-wicking headband or visor",
          "Sunglasses with UV protection",
          "Sunscreen (SPF 30+)",
          "Handheld water bottle or hydration vest",
        ],
      })
    } else if (weather.temperature >= 60) {
      recommendations.push({
        category: "Ideal Weather Gear",
        items: [
          "Moisture-wicking t-shirt or tank",
          "Running shorts or lightweight tights",
          "Optional: Light long-sleeve shirt",
          "Sunglasses (if sunny)",
        ],
      })
    } else if (weather.temperature >= 40) {
      recommendations.push({
        category: "Cool Weather Gear",
        items: [
          "Long-sleeve moisture-wicking base layer",
          "Running tights or pants",
          "Light gloves or mittens",
          "Headband or light beanie",
          "Optional: Light wind-breaking vest",
        ],
      })
    } else if (weather.temperature >= 20) {
      recommendations.push({
        category: "Cold Weather Gear",
        items: [
          "Thermal base layer (top and bottom)",
          "Insulating mid-layer (fleece or wool)",
          "Wind-blocking outer jacket",
          "Insulated gloves or mittens",
          "Warm hat or balaclava",
          "Neck gaiter or buff",
          "Thermal running tights",
        ],
      })
    } else {
      recommendations.push({
        category: "Extreme Cold Gear",
        items: [
          "Multiple layers: thermal base + insulating mid + windproof outer",
          "Heavy-duty insulated gloves",
          "Full balaclava or ski mask",
          "Thermal tights with windproof front panel",
          "Traction devices for shoes",
          "Petroleum jelly for exposed skin",
          "Consider moving workout indoors",
        ],
      })
    }

    // Wind-based additions
    if (weather.windSpeed > 20) {
      recommendations.push({
        category: "High Wind Additions",
        items: [
          "Wind-blocking jacket or vest",
          "Tight-fitting clothes to reduce drag",
          "Glasses or goggles to protect eyes",
          "Secure hat with chin strap",
        ],
      })
    } else if (weather.windSpeed > 10) {
      recommendations.push({
        category: "Moderate Wind Additions",
        items: ["Light windbreaker", "Buff or neck gaiter"],
      })
    }

    // Precipitation-based additions
    if (weather.precipitation > 0 || weather.condition === "Rainy") {
      recommendations.push({
        category: "Rain Gear",
        items: [
          "Water-resistant running jacket",
          "Hat with brim to keep rain off face",
          "Anti-chafe balm or Body Glide",
          "Moisture-wicking socks (avoid cotton)",
          "Waterproof phone case or pouch",
        ],
      })
    }

    // Humidity additions
    if (weather.humidity > 80) {
      recommendations.push({
        category: "High Humidity Tips",
        items: [
          "Extra breathable, moisture-wicking fabrics",
          "Anti-chafe protection on all friction points",
          "Sweat-wicking headband",
          "Bring extra water",
        ],
      })
    }

    return recommendations
  }

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-8 w-8 animate-pulse bg-gray-200 rounded mx-auto mb-4" />
            <p className="text-muted-foreground">Loading current weather...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!weather) {
    return null
  }

  const gearRecommendations = getGearRecommendations(weather)

  return (
    <ScrollReveal>
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Shirt className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">What to Wear Today</h2>
            </div>

            {/* Current Weather Display */}
            <Card className="mb-6 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Current Chicago Weather</CardTitle>
                <CardDescription>Live conditions for your run</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <Thermometer className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-2xl font-bold">{weather.temperature}°F</p>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                  </div>
                  <div className="space-y-1">
                    <Wind className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-2xl font-bold">{weather.windSpeed} mph</p>
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                  </div>
                  <div className="space-y-1">
                    <CloudRain className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-2xl font-bold">{weather.condition}</p>
                    <p className="text-xs text-muted-foreground">Conditions</p>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 w-6 mx-auto text-primary flex items-center justify-center text-xl">💧</div>
                    <p className="text-2xl font-bold">{weather.humidity}%</p>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gear Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Recommended Gear for Today</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {gearRecommendations.map((rec) => (
                  <Card key={rec.category} className="bg-white/80 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">{rec.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {rec.items.map((item, index) => (
                          <li key={index} className="flex gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-center mb-4">Want more detailed guidance for different conditions?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <a href="#temperature-guide">Temperature Guide</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#wind-guide">Wind Guide</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#rain-guide">Rain Guide</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}

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
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
            <h1 className="text-2xl font-bold">Weather Running Guide</h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
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

      {/* Current Weather Section */}
      <CurrentWeatherSection />

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
                          <li key={index} className="flex gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span>{tip}</span>
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
