"use client"

import { useEffect, useState, useRef } from "react"
import { Cloud, CloudRain, Sun, Wind } from "lucide-react"
import { getChicagoWeather, getWeatherCondition } from "@/lib/weather"

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

  const onWeatherLoadRef = useRef(onWeatherLoad)

  useEffect(() => {
    onWeatherLoadRef.current = onWeatherLoad
  }, [onWeatherLoad])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getChicagoWeather()

        // Calculate target date based on Chicago time
        const dayMap: Record<string, number> = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
        }

        const now = new Date()
        const chicagoDateString = now.toLocaleDateString("en-US", { timeZone: "America/Chicago" })
        const chicagoDate = new Date(chicagoDateString)
        const currentDay = chicagoDate.getDay()

        const targetDay = dayMap[day]
        let daysUntilTarget = targetDay - currentDay
        if (daysUntilTarget < 0) daysUntilTarget += 7

        const targetDate = new Date(chicagoDate)
        targetDate.setDate(chicagoDate.getDate() + daysUntilTarget)

        const year = targetDate.getFullYear()
        const month = String(targetDate.getMonth() + 1).padStart(2, "0")
        const dateDay = String(targetDate.getDate()).padStart(2, "0")
        const dateStr = `${year}-${month}-${dateDay}`

        const isWeekend = targetDay === 0 || targetDay === 6
        const hour = isWeekend ? 9 : 18
        const targetTimeStr = `${dateStr}T${hour.toString().padStart(2, "0")}:00`

        if (data.hourly) {
          const hourIndex = data.hourly.time.findIndex((time: string) => time === targetTimeStr)

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
            if (onWeatherLoadRef.current) {
              onWeatherLoadRef.current(weatherData)
            }
          } else {
            console.warn(`[v0] No weather data found for ${targetTimeStr}`)
          }
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [day])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "Rainy":
      case "Rain Showers":
      case "Stormy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case "Snowy":
      case "Snow Showers":
        return <Cloud className="h-5 w-5 text-blue-200" />
      case "Cloudy":
      case "Partly Cloudy":
      case "Foggy":
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
