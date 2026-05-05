import type { Lang } from './types'

export type TranslationMap = Partial<Record<Lang, string>>

/** Read a translation from a JSONB-backed map; tolerates missing/invalid shapes. */
export function pickTranslation(map: TranslationMap | null | undefined, lang: Lang): string {
  if (!map || typeof map !== 'object') return ''
  const v = (map as Record<string, unknown>)[lang]
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * Resolve a translatable text in priority order:
 *  1. translations[lang] (admin-supplied per-language value)
 *  2. t(staticKey)        (only relevant for seeded fallback rows)
 *  3. base                (the UZ-entered value)
 */
export function resolveText(
  base: string | null | undefined,
  translations: TranslationMap | null | undefined,
  staticKey: string | null | undefined,
  lang: Lang,
  t: (key: string, fallback?: string) => string
): string {
  const pick = pickTranslation(translations, lang)
  if (pick) return pick
  if (staticKey) {
    const k = t(staticKey)
    if (k && k !== staticKey) return k
  }
  return (base ?? '').toString().trim()
}

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

/** Map of normalized Uzbek day names to a canonical key. */
const UZ_DAY_KEY: Record<string, DayKey> = {
  dushanba: 'monday',
  seshanba: 'tuesday', seshamba: 'tuesday',
  chorshanba: 'wednesday',
  payshanba: 'thursday',
  juma: 'friday',
  shanba: 'saturday',
  yakshanba: 'sunday'
}

const DAY_TRANSLATIONS: Record<Lang, Record<DayKey, string>> = {
  uz: {
    monday: 'Dushanba', tuesday: 'Seshanba', wednesday: 'Chorshanba',
    thursday: 'Payshanba', friday: 'Juma', saturday: 'Shanba', sunday: 'Yakshanba'
  },
  ru: {
    monday: '\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a',
    tuesday: '\u0412\u0442\u043e\u0440\u043d\u0438\u043a',
    wednesday: '\u0421\u0440\u0435\u0434\u0430',
    thursday: '\u0427\u0435\u0442\u0432\u0435\u0440\u0433',
    friday: '\u041f\u044f\u0442\u043d\u0438\u0446\u0430',
    saturday: '\u0421\u0443\u0431\u0431\u043e\u0442\u0430',
    sunday: '\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435'
  },
  en: {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
  }
}

export const CANONICAL_DAY_OPTIONS: ReadonlyArray<{ key: DayKey; uz: string }> = [
  { key: 'monday', uz: 'Dushanba' },
  { key: 'tuesday', uz: 'Seshanba' },
  { key: 'wednesday', uz: 'Chorshanba' },
  { key: 'thursday', uz: 'Payshanba' },
  { key: 'friday', uz: 'Juma' },
  { key: 'saturday', uz: 'Shanba' },
  { key: 'sunday', uz: 'Yakshanba' }
]

/**
 * Resolve the reception day with explicit-translation precedence and an automatic
 * Uzbek-day-name fallback (handles admin-entered values like "Payshanba").
 */
export function resolveDay(
  base: string | null | undefined,
  translations: TranslationMap | null | undefined,
  staticKey: string | null | undefined,
  lang: Lang,
  t: (key: string, fallback?: string) => string
): string {
  const pick = pickTranslation(translations, lang)
  if (pick) return pick
  if (staticKey) {
    const k = t(staticKey)
    if (k && k !== staticKey) return k
  }
  const raw = (base ?? '').toString().trim()
  if (!raw) return ''
  const normalized = raw.toLowerCase().replace(/[\s.,'`\u2018\u2019]/g, '')
  const key = UZ_DAY_KEY[normalized]
  if (key) return DAY_TRANSLATIONS[lang][key]
  return raw
}

/** Strip stray protocol prefixes that may have been entered as part of a contact value. */
export function stripPhonePrefix(value: string | null | undefined): string {
  return (value ?? '').toString().replace(/^tel:\s*/i, '').trim()
}
export function stripEmailPrefix(value: string | null | undefined): string {
  return (value ?? '').toString().replace(/^mailto:\s*/i, '').trim()
}
export function stripUrlPrefix(value: string | null | undefined): string {
  return (value ?? '').toString().replace(/^https?:\/\//i, '').trim()
}
