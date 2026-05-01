import type { LucideIcon } from 'lucide-react'
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Snowflake } from 'lucide-react'

export type WeatherInfo = { labelKey: string }

export function describeWeather(code: number): WeatherInfo {
  if (code === 0) return { labelKey: 'weather.code.clear' }
  if (code === 1) return { labelKey: 'weather.code.mainlyClear' }
  if (code === 2) return { labelKey: 'weather.code.partlyCloudy' }
  if (code === 3) return { labelKey: 'weather.code.overcast' }
  if (code === 45 || code === 48) return { labelKey: 'weather.code.fog' }
  if (code >= 51 && code <= 57) return { labelKey: 'weather.code.drizzle' }
  if (code >= 80 && code <= 82) return { labelKey: 'weather.code.rainShowers' }
  if (code >= 61 && code <= 67) return { labelKey: 'weather.code.rain' }
  if (code === 85 || code === 86) return { labelKey: 'weather.code.snowShowers' }
  if (code >= 71 && code <= 77) return { labelKey: 'weather.code.snow' }
  if (code === 95 || code === 96 || code === 99) return { labelKey: 'weather.code.thunderstorm' }
  return { labelKey: 'weather.code.unknown' }
}

export function weatherIconFor(code: number): LucideIcon {
  if (code === 0) return Sun
  if (code === 1 || code === 2) return CloudSun
  if (code === 3) return Cloud
  if (code === 45 || code === 48) return CloudFog
  if (code >= 51 && code <= 57) return CloudDrizzle
  if (code >= 80 && code <= 82) return CloudRain
  if (code >= 61 && code <= 67) return CloudRain
  if (code === 85 || code === 86) return CloudSnow
  if (code >= 71 && code <= 77) return Snowflake
  if (code === 95 || code === 96 || code === 99) return CloudLightning
  return Cloud
}
