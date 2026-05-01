export type WeatherInfo = { labelKey: string }

export function describeWeather(code: number): WeatherInfo {
  if (code === 0) return { labelKey: 'weather.code.clear' }
  if (code === 1) return { labelKey: 'weather.code.mainlyClear' }
  if (code === 2) return { labelKey: 'weather.code.partlyCloudy' }
  if (code === 3) return { labelKey: 'weather.code.overcast' }
  if (code === 45 || code === 48) return { labelKey: 'weather.code.fog' }
  if (code >= 51 && code <= 57) return { labelKey: 'weather.code.drizzle' }
  if (code >= 61 && code <= 67) return { labelKey: 'weather.code.rain' }
  if (code >= 71 && code <= 77) return { labelKey: 'weather.code.snow' }
  if (code >= 80 && code <= 82) return { labelKey: 'weather.code.rainShowers' }
  if (code >= 85 && code <= 86) return { labelKey: 'weather.code.snowShowers' }
  if (code >= 95) return { labelKey: 'weather.code.thunderstorm' }
  return { labelKey: 'weather.code.unknown' }
}
