import { useCallback, useEffect, useState } from 'react'

export type WeatherData = {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  weatherCode: number
  time: string
}

type OpenMeteoResponse = {
  current?: {
    time?: string
    temperature_2m?: number
    apparent_temperature?: number
    relative_humidity_2m?: number
    wind_speed_10m?: number
    wind_direction_10m?: number
    pressure_msl?: number
    weather_code?: number
  }
}

export function useWeather(latitude: number, longitude: number) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=' +
        latitude +
        '&longitude=' +
        longitude +
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&timezone=Asia%2FTashkent'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch weather data')
      const json = (await res.json()) as OpenMeteoResponse
      const c = json.current
      if (!c) throw new Error('No weather data available')
      setData({
        temperature: c.temperature_2m ?? 0,
        apparentTemperature: c.apparent_temperature ?? 0,
        humidity: c.relative_humidity_2m ?? 0,
        windSpeed: c.wind_speed_10m ?? 0,
        windDirection: c.wind_direction_10m ?? 0,
        pressure: c.pressure_msl ?? 0,
        weatherCode: c.weather_code ?? 0,
        time: c.time ?? new Date().toISOString()
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [latitude, longitude])

  useEffect(() => {
    void fetchWeather()
  }, [fetchWeather])

  return { data, loading, error, refresh: fetchWeather }
}
