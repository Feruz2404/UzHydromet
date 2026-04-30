export type WeatherInfo = { label: string }

export function describeWeather(code: number): WeatherInfo {
  if (code === 0) return { label: 'Clear sky' }
  if (code === 1) return { label: 'Mainly clear' }
  if (code === 2) return { label: 'Partly cloudy' }
  if (code === 3) return { label: 'Overcast' }
  if (code === 45 || code === 48) return { label: 'Fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle' }
  if (code >= 61 && code <= 67) return { label: 'Rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow' }
  if (code >= 80 && code <= 82) return { label: 'Rain showers' }
  if (code >= 85 && code <= 86) return { label: 'Snow showers' }
  if (code >= 95) return { label: 'Thunderstorm' }
  return { label: 'Unknown' }
}
