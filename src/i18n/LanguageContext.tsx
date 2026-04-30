import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { en } from '../locales/en'
import { ru } from '../locales/ru'
import { uz } from '../locales/uz'
import type { Dictionary, Locale } from '../locales/types'

const dictionaries: Record<Locale, Dictionary> = { en, ru, uz }

type LanguageContextValue = {
  lang: Locale
  setLang: (l: Locale) => void
  t: (key: string, fallback?: string) => string
}

const Ctx = createContext<LanguageContextValue | null>(null)
const STORAGE_KEY = 'uzhydromet:lang'

function readInitial(): Locale {
  if (typeof window === 'undefined') return 'uz'
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'uz' || v === 'ru' || v === 'en') return v
  } catch {}
  return 'uz'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(readInitial)
  useEffect(() => {
    document.documentElement.lang = lang
    try { window.localStorage.setItem(STORAGE_KEY, lang) } catch {}
  }, [lang])
  const setLang = useCallback((l: Locale) => setLangState(l), [])
  const t = useCallback((key: string, fallback?: string): string => {
    const dict = dictionaries[lang]
    const v = dict[key]
    if (v !== undefined) return v
    if (fallback !== undefined) return fallback
    return key
  }, [lang])
  return <Ctx.Provider value= lang, setLang, t >{children}</Ctx.Provider>
}

export function useLanguage(): LanguageContextValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useLanguage must be inside LanguageProvider')
  return c
}
