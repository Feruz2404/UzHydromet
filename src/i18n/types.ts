export type Lang = 'uz' | 'ru' | 'en'

export const langs: ReadonlyArray<Lang> = ['uz', 'ru', 'en']

export type Dictionary = Readonly<Record<string, string>>
