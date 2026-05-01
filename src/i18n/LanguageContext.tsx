import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Dictionary, Lang } from './types'
import { uz } from './uz'
import { ru } from './ru'
import { en } from './en'

const dictionaries: Record<Lang, Dictionary> = { uz, ru, en }
const STORAGE_KEY = 'uzhydromet:lang'

export type LanguageContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, fallback?: string) => string
}

const Ctx = createContext<LanguageContextValue | null>(null)

function readInitial(): Lang {
  if (typeof window === 'undefined') return 'uz'
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'uz' || v === 'ru' || v === 'en') return v
  } catch (e) { /* ignore */ }
  return 'uz'
}

export function LanguageProvider(props: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial)
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang
    try { window.localStorage.setItem(STORAGE_KEY, lang) } catch (e) { /* ignore */ }
  }, [lang])
  const setLang = useCallback((l: Lang) => { setLangState(l) }, [])
  const t = useCallback((key: string, fallback?: string): string => {
    const dict = dictionaries[lang]
    const v = dict[key]
    if (typeof v === 'string') return v
    if (typeof fallback === 'string') return fallback
    return key
  }, [lang])
  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  )
  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
}

export function useLanguage(): LanguageContextValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useLanguage must be inside LanguageProvider')
  return c
}
