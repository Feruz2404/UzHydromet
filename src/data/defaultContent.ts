export const agency = {
  shortName: 'UzGidromet',
  altName: "O'zgidromet",
  fullName: 'Hydrometeorological Service Agency of the Republic of Uzbekistan',
  about:
    "O'zgidromet is a state agency responsible for meteorological, climate, hydrological, and agrometeorological observations in the Republic of Uzbekistan.",
  address: '72A Osiyo Street, Tashkent, Uzbekistan 100052',
  phone: '55 503 1222 (100)',
  email: 'info@meteo.uz',
  website: 'gov.uz/oz/hydromet',
  workingHours: 'Monday - Friday, 09:00 - 18:00',
  mapEmbedUrl:
    'https://www.google.com/maps?q=72A%20Osiyo%20Street%2C%20Tashkent%2C%20Uzbekistan%20100052&output=embed',
  mapOpenUrl:
    'https://www.google.com/maps/search/?api=1&query=72A%20Osiyo%20Street%2C%20Tashkent%2C%20Uzbekistan%20100052',
  weather: {
    city: 'Tashkent, Uzbekistan',
    latitude: 41.2995,
    longitude: 69.2401
  }
} as const

export type Leader = {
  name: string
  position: string
  phone: string
  email: string
  receptionDay: string
  receptionTime: string
  office: string
  description: string
}

export const leaders: Leader[] = [
  {
    name: "Xabibullayev Sherzod Xabibullaxo'jayevich",
    position: 'Agency Director',
    phone: '55 503 1222 (100)',
    email: 'info@meteo.uz',
    receptionDay: 'Thursday',
    receptionTime: '11:00 - 13:00',
    office: 'Information will be added',
    description:
      'Leads the Hydrometeorological Service Agency and oversees national hydrometeorological observations.'
  }
]

export type NewsItem = {
  title: string
  date: string
  summary: string
  tag: string
}

export const news: NewsItem[] = [
  {
    title: 'Weather Monitoring System',
    date: '2026',
    summary:
      'Modern monitoring infrastructure supports continuous weather observation across all regions.',
    tag: 'Announcement'
  },
  {
    title: 'Climate Observations',
    date: '2026',
    summary:
      'Long-term climate analysis efforts contribute to national planning and adaptation strategies.',
    tag: 'Update'
  },
  {
    title: 'Severe Weather Alerts',
    date: '2026',
    summary:
      'Public early warning channels keep citizens informed about dangerous weather events.',
    tag: 'Notice'
  }
]
