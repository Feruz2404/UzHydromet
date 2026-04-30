import type { SiteContent } from '../data/defaultContent'
import { defaultContent } from '../data/defaultContent'

export interface ContentRepository {
  load(): Promise<SiteContent>
  save(content: SiteContent): Promise<void>
  reset(): Promise<void>
}

const STORAGE_KEY = 'uzhydromet:content:v1'

function mergeContent(base: SiteContent, override: Partial<SiteContent>): SiteContent {
  return {
    hero: Object.assign({}, base.hero, override.hero ?? {}),
    about: Object.assign({}, base.about, override.about ?? {}),
    services: override.services ?? base.services,
    leaders: override.leaders ?? base.leaders,
    contact: Object.assign({}, base.contact, override.contact ?? {}),
    news: override.news ?? base.news,
    footer: Object.assign({}, base.footer, override.footer ?? {})
  }
}

export class LocalContentRepository implements ContentRepository {
  async load(): Promise<SiteContent> {
    if (typeof window === 'undefined') return defaultContent
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultContent
      const parsed = JSON.parse(raw) as Partial<SiteContent>
      return mergeContent(defaultContent, parsed)
    } catch {
      return defaultContent
    }
  }
  async save(content: SiteContent): Promise<void> {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  }
  async reset(): Promise<void> {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export const contentRepository: ContentRepository = new LocalContentRepository()
