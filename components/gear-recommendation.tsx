"use client"

import React from "react"

import { Shirt, Wind, Droplets, Sun, Snowflake, ThermometerSun, ThermometerSnowflake } from "lucide-react"
import type { WeatherData } from "@/components/weather-widget"

interface GearRecommendationProps {
  weather: WeatherData | null
}

interface GearItem {
  name: string
  icon: React.ReactNode
  description: string
}

function getGearRecommendations(weather: WeatherData | null): GearItem[] {
  if (!weather) return []

  const { temperature, windSpeed, precipitation, condition } = weather
  const gear: GearItem[] = []

  // Temperature-based recommendations
  if (temperature >= 70) {
    // Hot weather (70°F+)
    gear.push({
      name: "Singlet/Tank",
      icon: <Shirt className="h-5 w-5" />,
      description: "Light, breathable top",
    })
    gear.push({
      name: "Shorts",
      icon: <span className="text-lg">🩳</span>,
      description: "Light running shorts",
    })
    gear.push({
      name: "Sunglasses",
      icon: <Sun className="h-5 w-5" />,
      description: "UV protection",
    })
    gear.push({
      name: "Sunscreen",
      icon: <ThermometerSun className="h-5 w-5" />,
      description: "SPF 30+ recommended",
    })
  } else if (temperature >= 55) {
    // Mild weather (55-69°F)
    gear.push({
      name: "T-Shirt",
      icon: <Shirt className="h-5 w-5" />,
      description: "Short sleeve tech shirt",
    })
    gear.push({
      name: "Shorts",
      icon: <span className="text-lg">🩳</span>,
      description: "Running shorts",
    })
  } else if (temperature >= 40) {
    // Cool weather (40-54°F)
    gear.push({
      name: "Long Sleeve",
      icon: <Shirt className="h-5 w-5" />,
      description: "Light long sleeve top",
    })
    gear.push({
      name: "Shorts or Tights",
      icon: <span className="text-lg">🩳</span>,
      description: "Choose based on preference",
    })
    gear.push({
      name: "Light Gloves",
      icon: <span className="text-lg">🧤</span>,
      description: "Optional for warmth",
    })
  } else if (temperature >= 25) {
    // Cold weather (25-39°F)
    gear.push({
      name: "Base Layer",
      icon: <Shirt className="h-5 w-5" />,
      description: "Moisture-wicking base",
    })
    gear.push({
      name: "Mid Layer",
      icon: <Shirt className="h-5 w-5" />,
      description: "Fleece or thermal top",
    })
    gear.push({
      name: "Tights",
      icon: <span className="text-lg">👖</span>,
      description: "Running tights/pants",
    })
    gear.push({
      name: "Gloves & Hat",
      icon: <span className="text-lg">🧤</span>,
      description: "Keep extremities warm",
    })
  } else {
    // Very cold weather (below 25°F)
    gear.push({
      name: "Base Layer",
      icon: <ThermometerSnowflake className="h-5 w-5" />,
      description: "Thermal base layer",
    })
    gear.push({
      name: "Insulated Jacket",
      icon: <Snowflake className="h-5 w-5" />,
      description: "Wind-resistant outer",
    })
    gear.push({
      name: "Thermal Tights",
      icon: <span className="text-lg">👖</span>,
      description: "Fleece-lined tights",
    })
    gear.push({
      name: "Gloves & Beanie",
      icon: <span className="text-lg">🧣</span>,
      description: "Heavy insulation",
    })
    gear.push({
      name: "Neck Gaiter",
      icon: <span className="text-lg">🧣</span>,
      description: "Face/neck protection",
    })
  }

  // Wind adjustments
  if (windSpeed > 15) {
    gear.push({
      name: "Wind Jacket",
      icon: <Wind className="h-5 w-5" />,
      description: "Windproof outer layer",
    })
  }

  // Rain adjustments
  if (precipitation > 30 || condition === "Rainy" || condition === "Rain Showers") {
    gear.push({
      name: "Rain Jacket",
      icon: <Droplets className="h-5 w-5" />,
      description: "Water-resistant shell",
    })
    gear.push({
      name: "Hat with Brim",
      icon: <span className="text-lg">🧢</span>,
      description: "Keep rain off face",
    })
  }

  // Snow adjustments
  if (condition === "Snowy" || condition === "Snow Showers") {
    gear.push({
      name: "Trail Shoes",
      icon: <span className="text-lg">👟</span>,
      description: "Better traction on snow",
    })
  }

  return gear
}

export function GearRecommendation({ weather }: GearRecommendationProps) {
  const gear = getGearRecommendations(weather)

  if (!weather || gear.length === 0) {
    return null
  }

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
        <Shirt className="h-3.5 w-3.5" />
        What to Wear
      </p>
      <div className="flex flex-wrap gap-1.5">
        {gear.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1 text-xs"
            title={item.description}
          >
            <span className="text-muted-foreground">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </div>
      {gear.length > 5 && (
        <p className="text-xs text-muted-foreground mt-1.5">+{gear.length - 5} more items</p>
      )}
    </div>
  )
}
