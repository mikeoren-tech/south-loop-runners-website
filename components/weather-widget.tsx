"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, Wind } from "lucide-react"

export interface WeatherData {
  temperature: number
  condition: string
  windSpeed: number
  precipitation: number
}

interface WeatherWidgetProps {
  day: "thursday" | "saturday"
  onWeatherLoad?: (weather: WeatherData) => void
}

export function WeatherWidget({ day, onWeatherLoad }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Chicago coordinates
        const latitude = 41.8781
        const longitude = -87.6298

        // Calculate the next occurrence of the target day
        const now = new Date()
        const targetDay = day === "thursday" ? 4 : 6 // Thursday = 4, Saturday = 6
        const currentDay = now.getDay()
        let daysUntilTarget = targetDay - currentDay
        if (daysUntilTarget <= 0) daysUntilTarget += 7

        const targetDate = new Date(now)
        targetDate.setDate(now.getDate() + daysUntilTarget)
        const dateStr = targetDate.toISOString().split("T")[0]

        // Use Open-Meteo API (free, no API key required)
        const hour = day === "thursday" ? 18 : 9 // 6 PM or 9 AM
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Chicago&start_date=${dateStr}&end_date=${dateStr}`,
        )

        const data = await response.json()

        if (data.hourly) {
          const hourIndex = data.hourly.time.findIndex((time: string) => {
            const timeHour = new Date(time).getHours()
            return timeHour === hour
          })

          if (hourIndex !== -1) {
            const weatherCode = data.hourly.weather_code[hourIndex]
            const condition = getWeatherCondition(weatherCode)

            const weatherData = {
              temperature: Math.round(data.hourly.temperature_2m[hourIndex]),
              condition,
              windSpeed: Math.round(data.hourly.wind_speed_10m[hourIndex]),
              precipitation: data.hourly.precipitation_probability[hourIndex],
            }

            setWeather(weatherData)
            if (onWeatherLoad) {
              onWeatherLoad(weatherData)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [day, onWeatherLoad])

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear"
    if (code <= 3) return "Partly Cloudy"
    if (code <= 67) return "Rainy"
    if (code <= 77) return "Snowy"
    return "Cloudy"
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "Rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case "Cloudy":
      case "Partly Cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-foreground/70 animate-pulse">
        <div className="h-6 w-6 bg-foreground/20 rounded-full" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-foreground/20 rounded" />
          <div className="h-3 w-20 bg-foreground/20 rounded" />
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-sm bg-foreground/10 border border-foreground/20 rounded-lg p-3 backdrop-blur-sm transition-all hover:bg-foreground/20">
      <div className="transform transition-transform duration-300 group-hover:scale-110">
        {getWeatherIcon(weather.condition)}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">
          {weather.temperature}°F • {weather.condition}
        </span>
        <span className="text-xs text-foreground/80 flex items-center gap-2">
          <Wind className="h-3 w-3" />
          {weather.windSpeed} mph
          {weather.precipitation > 0 && ` • ${weather.precipitation}% rain`}
        </span>
      </div>
    </div>
  );
}
