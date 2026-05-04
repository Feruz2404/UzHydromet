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
  sortOrder: number
  isActive: boolean
  // Optional i18n fallbacks (used by seeded leaders only when DB is empty)
  positionKey?: string
  dayKey?: string
  addressKey?: string
  websiteUrl?: string
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
  // Per-item override link, falls back to settings.officialNewsUrl when empty
  url?: string
  sortOrder?: number
  isActive?: boolean
}
