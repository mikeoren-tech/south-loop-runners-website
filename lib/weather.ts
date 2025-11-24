interface WeatherResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    wind_speed_10m: number[]
    weather_code: number[]
  }
}

let weatherCache: { data: WeatherResponse; timestamp: number } | null = null
let pendingRequest: Promise<WeatherResponse> | null = null
const CACHE_DURATION = 1000 * 60 * 15 // 15 minutes

export async function getChicagoWeather(): Promise<WeatherResponse> {
  // Check cache first
  if (weatherCache && Date.now() - weatherCache.timestamp < CACHE_DURATION) {
    return weatherCache.data
  }

  // Check pending request
  if (pendingRequest) {
    return pendingRequest
  }

  // Create new request
  const fetchWeather = async () => {
    try {
      const latitude = 41.8781
      const longitude = -87.6298

      // Fetch 14 days to be safe for "next week" lookups
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
          `&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code` +
          `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Chicago&forecast_days=14`,
      )

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.")
        }
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      weatherCache = { data, timestamp: Date.now() }
      return data
    } finally {
      pendingRequest = null
    }
  }

  pendingRequest = fetchWeather()
  return pendingRequest
}

export const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Clear"
  if (code <= 3) return "Partly Cloudy"
  if (code <= 48) return "Foggy"
  if (code <= 67) return "Rainy"
  if (code <= 77) return "Snowy"
  if (code <= 82) return "Rain Showers"
  if (code <= 86) return "Snow Showers"
  if (code <= 99) return "Stormy"
  return "Cloudy"
}
