
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/weather-widget";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";

export default function WeatherPage() {
  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <ScrollReveal>
          <Card className="rounded-2xl border-foreground/30 bg-foreground/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-slr-blue/10 via-transparent to-slr-red/5 p-8">
              <CardTitle className="text-4xl font-bold text-center text-foreground">
                Weather Guide for Runners
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <WeatherWidget day="thursday" />
                <WeatherWidget day="saturday" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <Thermometer className="mr-2 text-slr-red" />
                  Temperature Guide
                </h3>
                <p className="text-foreground/80">
                  Dressing appropriately for the temperature is key to a comfortable run. Here are some general guidelines:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li><span className="font-semibold text-foreground">Above 60°F:</span> Shorts and a light, moisture-wicking shirt.</li>
                  <li><span className="font-semibold text-foreground">40-60°F:</span> Long-sleeved shirt or light jacket with shorts or tights.</li>
                  <li><span className="font-semibold text-foreground">20-40°F:</span> Insulated jacket, thermal tights, gloves, and a hat.</li>
                  <li><span className="font-semibold text-foreground">Below 20°F:</span> Multiple layers, including a base layer, mid-layer, and a windproof/waterproof outer layer. Protect extremities with warm socks, gloves, and a face covering.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <Wind className="mr-2 text-slr-blue" />
                  Wind Guide
                </h3>
                <p className="text-foreground/80">
                  Wind can make it feel much colder than the actual temperature. Plan your route to run into the wind on the way out and have a tailwind on the way back.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <Droplets className="mr-2 text-slr-blue" />
                  Rain Guide
                </h3>
                <p className="text-foreground/80">
                  A light rain can be refreshing, but heavy rain can be dangerous. Wear a waterproof jacket and be mindful of slippery surfaces.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <Sun className="mr-2 text-slr-red" />
                  Sun Protection
                </h3>
                <p className="text-foreground/80">
                  Protect your skin from the sun, even on cloudy days. Wear sunscreen, a hat, and sunglasses.
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
