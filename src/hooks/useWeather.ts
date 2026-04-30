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

type HookState = {
  data: WeatherData | null
  loading: boolean
  error: string | null
  refresh: () => void
  lastFetched: Date | null
}

export function useWeather(latitude: number, longitude: number): HookState {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude +
        '&longitude=' + longitude +
        