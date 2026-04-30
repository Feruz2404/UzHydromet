import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { contentRepository } from '../lib/repository'
import { defaultContent, type SiteContent } from '../data/defaultContent'

type ContentContextValue = {
  content: SiteContent
  setContent: (next: SiteContent) => void
  reset: () => void
}

const Ctx = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(defaultContent)
  useEffect(() => {
    let cancelled = false
    contentRepository.load().then((c) => { if (!cancelled) setContentState(c) }).catch(() => {})
    return () => { cancelled = true }
  }, [])
  const setContent = useCallback((next: SiteContent) => {
    setContentState(next)
    contentRepository.save(next).catch(() => {})
  }, [])
  const reset = useCallback(() => {
    setContentState(defaultContent)
    contentRepository.reset().catch(() => {})
  }, [])
  return <Ctx.Provider value= content, setContent, reset >{children}</Ctx.Provider>
}

export function useContent(): ContentContextValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent must be inside ContentProvider')
  return c
}
