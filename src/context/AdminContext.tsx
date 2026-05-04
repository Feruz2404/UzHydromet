import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Leader, NewsItem, SiteSettings } from '../types/admin'
import { DEFAULT_LEADERS, DEFAULT_NEWS, DEFAULT_SITE_SETTINGS } from '../data/defaults'

const STORAGE_KEY = 'uzhydromet:admin:v1'

type Persisted = {
  settings: SiteSettings
  leaders: Leader[]
  news: NewsItem[]
}

type AdminContextValue = {
  settings: SiteSettings
  leaders: Leader[]
  news: NewsItem[]
  activeLeaders: Leader[]
  selectedLeaderId: string | null
  setSelectedLeaderId: (id: string | null) => void
  updateSettings: (patch: Partial<SiteSettings>) => void
  resetSettings: () => void
  upsertLeader: (leader: Leader) => void
  deleteLeader: (id: string) => void
  resetLeaders: () => void
  upsertNews: (item: NewsItem) => void
  deleteNews: (id: string) => void
  resetNews: () => void
}

const Ctx = createContext<AdminContextValue | null>(null)

function readPersisted(): Persisted {
  if (typeof window === 'undefined') {
    return { settings: DEFAULT_SITE_SETTINGS, leaders: DEFAULT_LEADERS, news: DEFAULT_NEWS }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { settings: DEFAULT_SITE_SETTINGS, leaders: DEFAULT_LEADERS, news: DEFAULT_NEWS }
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      settings: { ...DEFAULT_SITE_SETTINGS, ...(parsed.settings ?? {}) },
      leaders: Array.isArray(parsed.leaders) && parsed.leaders.length > 0 ? parsed.leaders as Leader[] : DEFAULT_LEADERS,
      news: Array.isArray(parsed.news) && parsed.news.length > 0 ? parsed.news as NewsItem[] : DEFAULT_NEWS
    }
  } catch {
    return { settings: DEFAULT_SITE_SETTINGS, leaders: DEFAULT_LEADERS, news: DEFAULT_NEWS }
  }
}

function writePersisted(p: Persisted): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* storage may be full or disabled; ignore */
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(readPersisted)
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null)

  useEffect(() => {
    writePersisted(state)
  }, [state])

  // Cross-tab sync: when admin saves in one tab, reflect in others.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setState(readPersisted())
    }
    if (typeof window === 'undefined') return
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const updateSettings = useCallback((patch: Partial<SiteSettings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch, updatedAt: new Date().toISOString() } }))
  }, [])

  const resetSettings = useCallback(() => {
    setState((s) => ({ ...s, settings: { ...DEFAULT_SITE_SETTINGS, updatedAt: new Date().toISOString() } }))
  }, [])

  const upsertLeader = useCallback((leader: Leader) => {
    setState((s) => {
      const idx = s.leaders.findIndex((l) => l.id === leader.id)
      const stamped: Leader = { ...leader, updatedAt: new Date().toISOString() }
      if (idx === -1) {
        return { ...s, leaders: [...s.leaders, { ...stamped, createdAt: stamped.updatedAt }] }
      }
      const next = [...s.leaders]
      next[idx] = { ...next[idx], ...stamped }
      return { ...s, leaders: next }
    })
  }, [])

  const deleteLeader = useCallback((id: string) => {
    setState((s) => ({ ...s, leaders: s.leaders.filter((l) => l.id !== id) }))
  }, [])

  const resetLeaders = useCallback(() => {
    setState((s) => ({ ...s, leaders: DEFAULT_LEADERS }))
  }, [])

  const upsertNews = useCallback((item: NewsItem) => {
    setState((s) => {
      const idx = s.news.findIndex((n) => n.id === item.id)
      if (idx === -1) return { ...s, news: [...s.news, item] }
      const next = [...s.news]
      next[idx] = { ...next[idx], ...item }
      return { ...s, news: next }
    })
  }, [])

  const deleteNews = useCallback((id: string) => {
    setState((s) => ({ ...s, news: s.news.filter((n) => n.id !== id) }))
  }, [])

  const resetNews = useCallback(() => {
    setState((s) => ({ ...s, news: DEFAULT_NEWS }))
  }, [])

  const activeLeaders = useMemo(
    () => [...state.leaders].filter((l) => l.isActive !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [state.leaders]
  )

  const value: AdminContextValue = useMemo(() => ({
    settings: state.settings,
    leaders: state.leaders,
    news: state.news,
    activeLeaders,
    selectedLeaderId,
    setSelectedLeaderId,
    updateSettings,
    resetSettings,
    upsertLeader,
    deleteLeader,
    resetLeaders,
    upsertNews,
    deleteNews,
    resetNews
  }), [state, activeLeaders, selectedLeaderId, updateSettings, resetSettings, upsertLeader, deleteLeader, resetLeaders, upsertNews, deleteNews, resetNews])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAdmin(): AdminContextValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAdmin must be used inside AdminProvider')
  return c
}
