import type { Lang } from '../i18n/types'

/** Per-language translation map persisted as JSONB on the server. */
export type TranslationMap = Partial<Record<Lang, string>>

export type SiteSettings = {
  id: string
  logoUrl?: string
  footerLogoUrl?: string
  agencyName: string
  shortDescription: string
  address: string
  phone: string
  email: string
  workingHours: string
  officialSiteUrl: string
  officialNewsUrl: string
  updatedAt: string
}

export type Leader = {
  id: string
  fullName: string
  position: string
  photoUrl?: string
  receptionDay: string
  receptionTime: string
  phone: string
  email: string
  // Direct DB-backed contact / content fields (admin-managed)
  websiteUrl?: string
  address?: string
  responsibilities?: string
  biography?: string
  // Per-language translations for free-text fields. Optional; when missing,
  // the public site falls back to the base UZ value (or the static key for seeded rows).
  positionTranslations?: TranslationMap
  receptionDayTranslations?: TranslationMap
  responsibilitiesTranslations?: TranslationMap
  biographyTranslations?: TranslationMap
  addressTranslations?: TranslationMap
  sortOrder: number
  isActive: boolean
  // Optional i18n fallbacks (used by seeded leaders only when DB is empty)
  positionKey?: string
  dayKey?: string
  addressKey?: string
  responsibilitiesKey?: string
  biographyKey?: string
  showResponsibilities?: boolean
  showBiography?: boolean
  createdAt?: string
  updatedAt?: string
}

export type NewsItem = {
  id: string
  // Either translation keys (for seeded items shown when DB is empty)
  titleKey?: string
  dateKey?: string
  summaryKey?: string
  tagKey?: string
  // Or direct values (for DB-backed items)
  title?: string
  date?: string
  summary?: string
  tag?: string
  // Per-language translations (DB-backed)
  titleTranslations?: TranslationMap
  descriptionTranslations?: TranslationMap
  badgeTranslations?: TranslationMap
  // Per-item override link, falls back to settings.officialNewsUrl when empty
  url?: string
  sortOrder?: number
  isActive?: boolean
}
