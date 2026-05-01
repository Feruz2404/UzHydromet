import { useCallback, useEffect, useState } from 'react'

export type WeatherData = {
  temperature: number
  apparent: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  weatherCode: number
  time: string
}

export type UseWeatherResult = {
  data: WeatherData | null
  loading: boolean
  error: string | null
  refresh: () => void
  lastFetched: Date | null
}

type CurrentField =
  | 'temperature_2m'
  | 'relative_humidity_2m'
  | 'apparent_temperature'
  | 'weather_code'
  | 'wind_speed_10m'
  | 'wind_direction_10m'
  | 'pressure_msl'
  | 'time'

type CurrentResponse = {
  current?: Partial<Record<CurrentField, number | string>>
}

function toNumber(v: unknown): number {
  return typeof v === 'number' ? v : 0
}

function toString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export function useWeather(latitude: number, longitude: number): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('latitude', String(latitude))
      params.set('longitude', String(longitude))
      params.set(
        'current',
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl'
      )
      params.set('timezone', 'Asia/Tashkent')
      const url = 'https://api.open-meteo.com/v1/forecast?' + params.toString()
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const parsed = (await res.json()) as CurrentResponse
      const c = parsed.current ?? {}
      const next: WeatherData = {
        temperature: toNumber(c.temperature_2m),
        apparent: toNumber(c.apparent_temperature),
        humidity: toNumber(c.relative_humidity_2m),
        windSpeed: toNumber(c.wind_speed_10m),
        windDirection: toNumber(c.wind_direction_10m),
        pressure: toNumber(c.pressure_msl),
        weatherCode: toNumber(c.weather_code),
        time: toString(c.time) || new Date().toISOString()
      }
      setData(next)
      setLastFetched(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [latitude, longitude])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh: fetchData, lastFetched }
}
