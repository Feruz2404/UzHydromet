export const agency = {
  shortName: "O'zgidromet",
  altName: 'Hydrometeorological Service Agency',
  fullName: 'Hydrometeorological Service Agency of the Republic of Uzbekistan',
  address: "Toshkent shahri, Yunusobod tumani, Osiyo ko'chasi, 72",
  phone: '55 503 1222 (100)',
  email: 'info@meteo.uz',
  website: 'gov.uz/oz/hydromet',
  websiteUrl: 'https://gov.uz/oz/hydromet',
  mapEmbedUrl:
    "https://www.google.com/maps?q=Osiyo%20ko'chasi%2072%2C%20Yunusobod%2C%20Tashkent%2C%20Uzbekistan&output=embed",
  mapOpenUrl:
    "https://www.google.com/maps/search/?api=1&query=Osiyo%20ko'chasi%2072%2C%20Yunusobod%2C%20Tashkent%2C%20Uzbekistan",
  weather: {
    latitude: 41.2995,
    longitude: 69.2401
  }
} as const

export type Leader = {
  id: string
  name: string
  positionKey: string
  phone: string
  email: string
  emailPending: boolean
  website: string
  websiteUrl: string
  addressKey: string
  dayKey: string
  receptionTime: string
  responsibilitiesKey: string
  biographyKey: string
  showResponsibilities: boolean
  showBiography: boolean
  image?: string
}

export const leaders: Leader[] = [
  {
    id: 'director',
    name: "Xabibullayev Sherzod Xabibullaxo'jayevich",
    positionKey: 'leadership.director.position',
    phone: '55 503 1222 (100)',
    email: 'info@meteo.uz',
    emailPending: false,
    website: 'gov.uz/oz/hydromet',
    websiteUrl: 'https://gov.uz/oz/hydromet',
    addressKey: 'leadership.address.main',
    dayKey: 'reception.day.thursday',
    receptionTime: '11:00 - 13:00',
    responsibilitiesKey: 'leadership.director.responsibilities',
    biographyKey: 'leadership.director.biography',
    showResponsibilities: true,
    showBiography: true
  },
  {
    id: 'deputy',
    name: 'Karimov Ibratjon Alijonovich',
    positionKey: 'leadership.deputy.position',
    phone: '78 150-86-35',
    email: 'i.karimov@meteo.uz',
    emailPending: false,
    website: 'gov.uz/oz/hydromet',
    websiteUrl: 'https://gov.uz/oz/hydromet',
    addressKey: 'leadership.address.main',
    dayKey: 'reception.day.tuesday',
    receptionTime: '10:00 - 12:00',
    responsibilitiesKey: 'leadership.deputy.responsibilities',
    biographyKey: 'leadership.deputy.biography',
    showResponsibilities: true,
    showBiography: true
  },
  {
    id: 'advisorDigital',
    name: 'Vakant',
    positionKey: 'leadership.advisorDigital.position',
    phone: '55-503-21-20 (103)',
    email: 'sfi@meteo.uz',
    emailPending: false,
    website: 'gov.uz/oz/hydromet',
    websiteUrl: 'https://gov.uz/oz/hydromet',
    addressKey: 'leadership.address.main',
    dayKey: 'reception.day.wednesday',
    receptionTime: '10:00 - 12:00',
    responsibilitiesKey: 'leadership.advisorDigital.responsibilities',
    biographyKey: 'leadership.advisorDigital.biography',
    showResponsibilities: true,
    showBiography: false
  },
  {
    id: 'advisorPress',
    name: 'Tashxodjayeva Nigora Baxtiyor qizi',
    positionKey: 'leadership.advisorPress.position',
    phone: '55-503-21-20 (203)',
    email: 'is@meteo.uz',
    emailPending: false,
    website: 'gov.uz/oz/hydromet',
    websiteUrl: 'https://gov.uz/oz/hydromet',
    addressKey: 'leadership.address.main',
    dayKey: 'reception.day.friday',
    receptionTime: '10:00 - 13:00',
    responsibilitiesKey: 'leadership.advisorPress.responsibilities',
    biographyKey: 'leadership.advisorPress.biography',
    showResponsibilities: true,
    showBiography: true
  },
  {
    id: 'advisorEducation',
    name: 'Kulumbetov Qudratjon Mamasharifovich',
    positionKey: 'leadership.advisorEducation.position',
    phone: '55 503 1222',
    email: '',
    emailPending: true,
    website: 'gov.uz/oz/hydromet',
    websiteUrl: 'https://gov.uz/oz/hydromet',
    addressKey: 'leadership.address.main',
    dayKey: 'reception.day.thursday',
    receptionTime: '14:00 - 16:00',
    responsibilitiesKey: 'leadership.advisorEducation.responsibilities',
    biographyKey: 'leadership.advisorEducation.biography',
    showResponsibilities: false,
    showBiography: true
  }
]

export type HydrometArea = {
  id: string
  titleKey: string
  textKey: string
}

export const hydrometAreas: HydrometArea[] = [
  { id: 'meteo', titleKey: 'hydromet.area.meteo.title', textKey: 'hydromet.area.meteo.text' },
  { id: 'forecast', titleKey: 'hydromet.area.forecast.title', textKey: 'hydromet.area.forecast.text' },
  { id: 'hydro', titleKey: 'hydromet.area.hydro.title', textKey: 'hydromet.area.hydro.text' },
  { id: 'climate', titleKey: 'hydromet.area.climate.title', textKey: 'hydromet.area.climate.text' },
  { id: 'agro', titleKey: 'hydromet.area.agro.title', textKey: 'hydromet.area.agro.text' },
  { id: 'warnings', titleKey: 'hydromet.area.warnings.title', textKey: 'hydromet.area.warnings.text' },
  { id: 'digital', titleKey: 'hydromet.area.digital.title', textKey: 'hydromet.area.digital.text' }
]

export const hydrometImportance: Array<{ id: string; key: string }> = [
  { id: 'publicSafety', key: 'hydromet.importance.publicSafety' },
  { id: 'agriculture', key: 'hydromet.importance.agriculture' },
  { id: 'water', key: 'hydromet.importance.water' },
  { id: 'transport', key: 'hydromet.importance.transport' },
  { id: 'warnings', key: 'hydromet.importance.warnings' },
  { id: 'climate', key: 'hydromet.importance.climate' },
  { id: 'economic', key: 'hydromet.importance.economic' },
  { id: 'environment', key: 'hydromet.importance.environment' }
]

export type NewsItem = {
  titleKey: string
  dateKey: string
  summaryKey: string
  tagKey: string
}

export const news: NewsItem[] = [
  { titleKey: 'news.item1.title', dateKey: 'news.item1.date', summaryKey: 'news.item1.summary', tagKey: 'news.item1.tag' },
  { titleKey: 'news.item2.title', dateKey: 'news.item2.date', summaryKey: 'news.item2.summary', tagKey: 'news.item2.tag' },
  { titleKey: 'news.item3.title', dateKey: 'news.item3.date', summaryKey: 'news.item3.summary', tagKey: 'news.item3.tag' }
]
