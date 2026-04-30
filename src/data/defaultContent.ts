import type { Locale } from '../locales/types'

export type LocalizedString = Record<Locale, string>

export type Service = {
  id: string
  icon: string
  title: LocalizedString
  text: LocalizedString
}

export type Leader = {
  id: string
  name: string
  position: LocalizedString
  phone: string
  email: string
  receptionDay: LocalizedString
  receptionTime: string
  office: LocalizedString
  description: LocalizedString
}

export type NewsItem = {
  id: string
  title: LocalizedString
  date: string
  summary: LocalizedString
  tag: LocalizedString
}

export type SiteContent = {
  hero: { title: LocalizedString; subtitle: LocalizedString }
  about: { body: LocalizedString }
  services: Service[]
  leaders: Leader[]
  contact: {
    address: string
    phone: string
    email: string
    website: string
    workingHours: LocalizedString
    mapEmbedUrl: string
    mapOpenUrl: string
    weather: { latitude: number; longitude: number }
  }
  news: NewsItem[]
  footer: { description: LocalizedString }
}

export const defaultContent: SiteContent = {
  hero: {
    title: {
      uz: 'O‘zbekiston Respublikasi Gidrometeorologiya xizmati agentligi',
      ru: 'Агентство гидрометеорологической службы Республики Узбекистан',
      en: 'Hydrometeorological Service Agency of the Republic of Uzbekistan'
    },
    subtitle: {
      uz: 'Ob-havo, iqlim, gidrologiya va agrometeorologik kuzatuvlar bo‘yicha ishonchli ma’lumot markazi.',
      ru: 'Надёжный информационный центр по погоде, климату, гидрологии и агрометеорологии.',
      en: 'A reliable information centre for weather, climate, hydrology and agrometeorological observations.'
    }
  },
  about: {
    body: {
      uz: 'O‘zgidromet O‘zbekiston bo‘ylab ob-havo, iqlim, daryo va atrof-muhit kuzatuvlari uchun rasmiy davlat agentligi hisoblanadi.',
      ru: 'Узгидромет — официальное государственное агентство по наблюдению за погодой, климатом, реками и окружающей средой в Узбекистане.',
      en: 'UzGidromet is the official government agency responsible for monitoring weather, climate, rivers and the environment across Uzbekistan.'
    }
  },
  services: [
    { id: 'meteo', icon: 'Cloud', title: { uz: 'Meteorologiya', ru: 'Метеорология', en: 'Meteorology' }, text: { uz: 'Kunlik va haftalik prognozlar.', ru: 'Ежедневные и недельные прогнозы.', en: 'Daily and weekly forecasts.' } },
    { id: 'hydro', icon: 'Waves', title: { uz: 'Gidrologiya', ru: 'Гидрология', en: 'Hydrology' }, text: { uz: 'Daryolar va suv omborlari kuzatuvi.', ru: 'Наблюдение за реками и водохранилищами.', en: 'River and reservoir monitoring.' } },
    { id: 'agro', icon: 'Sprout', title: { uz: 'Agrometeorologiya', ru: 'Агрометеорология', en: 'Agrometeorology' }, text: { uz: 'Qishloq xo‘jaligi uchun ma’lumot.', ru: 'Данные для сельского хозяйства.', en: 'Insights for agriculture.' } },
    { id: 'climate', icon: 'BarChart3', title: { uz: 'Iqlim monitoringi', ru: 'Климатический мониторинг', en: 'Climate monitoring' }, text: { uz: 'Uzoq muddatli kuzatuvlar.', ru: 'Долгосрочные наблюдения.', en: 'Long-term observations.' } },
    { id: 'env', icon: 'Trees', title: { uz: 'Atrof-muhit', ru: 'Экология', en: 'Environment' }, text: { uz: 'Havo va suv sifatini nazorati.', ru: 'Контроль качества воздуха и воды.', en: 'Air and water quality monitoring.' } },
    { id: 'aviation', icon: 'Plane', title: { uz: 'Aviameteorologiya', ru: 'Авиаметеорология', en: 'Aviation meteorology' }, text: { uz: 'Aviatsiya uchun xizmat.', ru: 'Сервисы для авиации.', en: 'Services for aviation.' } },
    { id: 'digital', icon: 'Cpu', title: { uz: 'Raqamli prognoz', ru: 'Цифровой прогноз', en: 'Digital forecasting' }, text: { uz: 'Raqamli modellar.', ru: 'Численные модели.', en: 'Numerical models.' } },
    { id: 'alerts', icon: 'Siren', title: { uz: 'Ogohlantirishlar', ru: 'Предупреждения', en: 'Severe weather alerts' }, text: { uz: 'Tezkor xabardor qilish.', ru: 'Оперативные уведомления.', en: 'Rapid alert dispatch.' } }
  ],
  leaders: [
    {
      id: 'director',
      name: 'Xabibullayev Sherzod Xabibullaxo‘jayevich',
      position: {
        uz: 'Agentlik direktori',
        ru: 'Директор агентства',
        en: 'Agency Director'
      },
      phone: '+998 55 503 12 22',
      email: 'info@meteo.uz',
      receptionDay: { uz: 'Payshanba', ru: 'Четверг', en: 'Thursday' },
      receptionTime: '11:00–13:00',
      office: { uz: 'Toshkent, Osiyo ko‘chasi 72A', ru: 'Ташкент, ул. Осиё 72А', en: '72A Osiyo Street, Tashkent' },
      description: { uz: 'Agentlik direktori, gidrometeorologiya xizmatining strategik rahbari.', ru: 'Директор агентства, стратегическое руководство.', en: 'Agency Director leading the strategic operations of the hydrometeorological service.' }
    }
  ],
  contact: {
    address: '72A Osiyo Street, Tashkent 100052',
    phone: '+998 55 503 12 22',
    email: 'info@meteo.uz',
    website: 'gov.uz/oz/hydromet',
    workingHours: { uz: 'Du–Ju 09:00–18:00', ru: 'Пн–Пт 09:00–18:00', en: 'Mon–Fri 09:00–18:00' },
    mapEmbedUrl: 'https://www.google.com/maps?q=72A%20Osiyo%20Street%2C%20Tashkent%2C%20Uzbekistan%20100052&output=embed',
    mapOpenUrl: 'https://www.google.com/maps/search/?api=1&query=72A%20Osiyo%20Street%2C%20Tashkent%2C%20Uzbekistan%20100052',
    weather: { latitude: 41.2995, longitude: 69.2401 }
  },
  news: [
    { id: 'n1', title: { uz: 'Yangi monitoring stansiyasi ishga tushdi', ru: 'Запущена новая станция', en: 'New monitoring station launched' }, date: '2026-04-12', summary: { uz: 'Toshkent viloyatida yangi avtomatik stansiya ishga tushirildi.', ru: 'В Ташкентской области запущена новая станция.', en: 'A new automatic station has been launched in the Tashkent region.' }, tag: { uz: 'Infratuzilma', ru: 'Инфраструктура', en: 'Infrastructure' } },
    { id: 'n2', title: { uz: '2026-yil iqlim hisoboti', ru: 'Климатический отчёт 2026', en: '2026 climate report' }, date: '2026-03-30', summary: { uz: 'Yillik iqlim ko‘rsatkichlari e’lon qilindi.', ru: 'Опубликованы годовые показатели.', en: 'Annual climate metrics have been published.' }, tag: { uz: 'Iqlim', ru: 'Климат', en: 'Climate' } },
    { id: 'n3', title: { uz: 'Bahorgi ogohlantirish tizimi', ru: 'Весенняя система предупреждений', en: 'Spring alert system' }, date: '2026-03-15', summary: { uz: 'Tezkor SMS-ogohlantirish ishga tushirildi.', ru: 'Запущены SMS-уведомления.', en: 'Rapid SMS alerts are now active.' }, tag: { uz: 'Xizmatlar', ru: 'Сервисы', en: 'Services' } }
  ],
  footer: {
    description: {
      uz: 'O‘zbekiston Respublikasi Gidrometeorologiya xizmati agentligi.',
      ru: 'Агентство гидрометеорологической службы РУ.',
      en: 'Hydrometeorological Service Agency of the Republic of Uzbekistan.'
    }
  }
}
