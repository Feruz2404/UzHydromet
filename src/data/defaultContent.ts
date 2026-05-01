export const agency = {
  shortName: 'UzGidromet',
  altName: "O'zgidromet",
  fullName: 'Hydrometeorological Service Agency of the Republic of Uzbekistan',
  address: '72A Osiyo Street, Tashkent, Uzbekistan 100052',
  phone: '55 503 1222 (100)',
  email: 'info@meteo.uz',
  website: 'gov.uz/oz/hydromet',
  mapEmbedUrl:
    'https://www.google.com/maps?q=72A%20Osiyo%20Street%2C%20Tashkent%2C%20Uzbekistan%20100052&output=embed',
  mapOpenUrl:
    'https://www.google.com/maps/search/?api=1&query=72A%20Osiyo%20Street%2C%20Tashkent%2C%20Uzbekistan%20100052',
  weather: {
    latitude: 41.2995,
    longitude: 69.2401
  }
} as const

export type Leader = {
  name: string
  positionKey: string
  phone: string
  email: string
  dayKey: string
  receptionTime: string
  officeKey: string
  descriptionKey: string
}

export const leaders: Leader[] = [
  {
    name: "Xabibullayev Sherzod Xabibullaxo'jayevich",
    positionKey: 'leadership.director.position',
    phone: '55 503 1222 (100)',
    email: 'info@meteo.uz',
    dayKey: 'reception.day.thursday',
    receptionTime: '11:00 - 13:00',
    officeKey: 'leadership.director.office',
    descriptionKey: 'leadership.director.description'
  }
]

export type NewsItem = {
  titleKey: string
  dateKey: string
  summaryKey: string
  tagKey: string
}

export const news: NewsItem[] = [
  {
    titleKey: 'news.item1.title',
    dateKey: 'news.item1.date',
    summaryKey: 'news.item1.summary',
    tagKey: 'news.item1.tag'
  },
  {
    titleKey: 'news.item2.title',
    dateKey: 'news.item2.date',
    summaryKey: 'news.item2.summary',
    tagKey: 'news.item2.tag'
  },
  {
    titleKey: 'news.item3.title',
    dateKey: 'news.item3.date',
    summaryKey: 'news.item3.summary',
    tagKey: 'news.item3.tag'
  }
]
