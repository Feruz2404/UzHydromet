import type { Leader, NewsItem, SiteSettings } from '../types/admin'

const SEED_TS = '2026-01-01T00:00:00.000Z'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'default',
  logoUrl: '',
  footerLogoUrl: '',
  agencyName: "O'zgidromet",
  shortDescription: 'Gidrometeorologiya xizmati agentligi',
  address: "Toshkent shahri, Yunusobod tumani, Osiyo ko'chasi, 72",
  phone: '55 503 1222 (100)',
  email: 'info@meteo.uz',
  workingHours: 'Dushanba - Juma, 09:00 - 18:00',
  officialSiteUrl: 'https://gov.uz/oz/hydromet',
  officialNewsUrl: 'https://gov.uz/oz/hydromet/news',
  updatedAt: SEED_TS
}

// Rahbarlar ro'yxati endi to'liq admin panel orqali boshqariladi.
// Static seed olib tashlandi: yangi yozuvlar Supabase `leaders` jadvalida saqlanadi.
export const DEFAULT_LEADERS: Leader[] = []

export const DEFAULT_NEWS: NewsItem[] = [
  { id: 'item1', titleKey: 'news.item1.title', dateKey: 'news.item1.date', summaryKey: 'news.item1.summary', tagKey: 'news.item1.tag', url: '' },
  { id: 'item2', titleKey: 'news.item2.title', dateKey: 'news.item2.date', summaryKey: 'news.item2.summary', tagKey: 'news.item2.tag', url: '' },
  { id: 'item3', titleKey: 'news.item3.title', dateKey: 'news.item3.date', summaryKey: 'news.item3.summary', tagKey: 'news.item3.tag', url: '' }
]
