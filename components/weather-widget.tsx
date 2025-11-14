"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react'

export interface WeatherData {
  temperature: number
  condition: string
  windSpeed: number
  precipitation: number
}

interface WeatherWidgetProps {
  day: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"
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

        const dayMap: Record<string, number> = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
        }

        const targetDay = dayMap[day]
        const currentDay = new Date().getDay()
        let daysUntilTarget = targetDay - currentDay
        if (daysUntilTarget <= 0) daysUntilTarget += 7

        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + daysUntilTarget)
        const dateStr = targetDate.toISOString().split("T")[0]

        const isWeekend = targetDay === 0 || targetDay === 6
        const hour = isWeekend ? 9 : 18
        
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-5 w-5 animate-pulse bg-gray-200 rounded" />
        <span>Loading forecast...</span>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <div className="flex items-center gap-3 text-sm bg-muted/50 rounded-lg p-3">
      {getWeatherIcon(weather.condition)}
      <div className="flex flex-col">
        <span className="font-medium">
          {weather.temperature}°F • {weather.condition}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-2">
          <Wind className="h-3 w-3" />
          {weather.windSpeed} mph
          {weather.precipitation > 0 && ` • ${weather.precipitation}% rain`}
        </span>
      </div>
    </div>
  )
}
