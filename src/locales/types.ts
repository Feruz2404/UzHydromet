export type Locale = 'uz' | 'ru' | 'en'
export const LOCALES: ReadonlyArray<Locale> = ['uz', 'ru', 'en'] as const
export type Dictionary = Record<string, string>
