import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { Leader, NewsItem, SiteSettings, TranslationMap } from '../types/admin'
import { DEFAULT_LEADERS, DEFAULT_NEWS, DEFAULT_SITE_SETTINGS } from '../data/defaults'

const TOKEN_KEY = 'uzhydromet:admin:token'

// --- Raw DB row shapes ---
type SettingsRow = {
  id: string
  logo_url: string | null
  footer_logo_url: string | null
  agency_name: string | null
  short_description: string | null
  address: string | null
  phone: string | null
  email: string | null
  working_hours: string | null
  official_site_url: string | null
  official_news_url: string | null
  updated_at: string
}
type LeaderRow = {
  id: string
  full_name: string
  position: string | null
  photo_url: string | null
  reception_day: string | null
  reception_time: string | null
  phone: string | null
  email: string | null
  website_url: string | null
  address: string | null
  responsibilities: string | null
  biography: string | null
  position_translations: Record<string, unknown> | null
  reception_day_translations: Record<string, unknown> | null
  responsibilities_translations: Record<string, unknown> | null
  biography_translations: Record<string, unknown> | null
  address_translations: Record<string, unknown> | null
  sort_order: number | null
  is_active: boolean | null
  created_at: string
  updated_at: string
}
type NewsRow = {
  id: string
  title: string
  description: string | null
  badge: string | null
  year: string | null
  link_url: string | null
  title_translations: Record<string, unknown> | null
  description_translations: Record<string, unknown> | null
  badge_translations: Record<string, unknown> | null
  sort_order: number | null
  is_active: boolean | null
  created_at: string
  updated_at: string
}

// --- Translation helpers ---
function asTranslationMap(v: unknown): TranslationMap {
  if (!v || typeof v !== 'object') return {}
  const obj = v as Record<string, unknown>
  const out: TranslationMap = {}
  if (typeof obj.uz === 'string' && obj.uz.trim()) out.uz = obj.uz
  if (typeof obj.ru === 'string' && obj.ru.trim()) out.ru = obj.ru
  if (typeof obj.en === 'string' && obj.en.trim()) out.en = obj.en
  return out
}
function cleanTranslationMap(m: TranslationMap | undefined | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!m) return out
  if (m.uz && m.uz.trim()) out.uz = m.uz.trim()
  if (m.ru && m.ru.trim()) out.ru = m.ru.trim()
  if (m.en && m.en.trim()) out.en = m.en.trim()
  return out
}
function stripTel(v: string | null | undefined): string {
  return (v ?? '').toString().replace(/^tel:\s*/i, '').trim()
}
function stripMailto(v: string | null | undefined): string {
  return (v ?? '').toString().replace(/^mailto:\s*/i, '').trim()
}

// --- Mappers: DB row -> app type ---
function mapSettings(row: SettingsRow | null): SiteSettings | null {
  if (!row) return null
  return {
    id: row.id,
    logoUrl: row.logo_url ?? '',
    footerLogoUrl: row.footer_logo_url ?? '',
    agencyName: row.agency_name ?? '',
    shortDescription: row.short_description ?? '',
    address: row.address ?? '',
    phone: stripTel(row.phone),
    email: stripMailto(row.email),
    workingHours: row.working_hours ?? '',
    officialSiteUrl: row.official_site_url ?? '',
    officialNewsUrl: row.official_news_url ?? '',
    updatedAt: row.updated_at
  }
}
function mapLeader(row: LeaderRow): Leader {
  return {
    id: row.id,
    fullName: row.full_name,
    position: row.position ?? '',
    photoUrl: row.photo_url ?? '',
    receptionDay: row.reception_day ?? '',
    receptionTime: row.reception_time ?? '',
    phone: stripTel(row.phone),
    email: stripMailto(row.email),
    websiteUrl: row.website_url ?? '',
    address: row.address ?? '',
    responsibilities: row.responsibilities ?? '',
    biography: row.biography ?? '',
    positionTranslations: asTranslationMap(row.position_translations),
    receptionDayTranslations: asTranslationMap(row.reception_day_translations),
    responsibilitiesTranslations: asTranslationMap(row.responsibilities_translations),
    biographyTranslations: asTranslationMap(row.biography_translations),
    addressTranslations: asTranslationMap(row.address_translations),
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}
function mapNews(row: NewsRow): NewsItem {
  return {
    id: row.id,
    title: row.title,
    summary: row.description ?? '',
    date: row.year ?? '',
    tag: row.badge ?? '',
    url: row.link_url ?? '',
    titleTranslations: asTranslationMap(row.title_translations),
    descriptionTranslations: asTranslationMap(row.description_translations),
    badgeTranslations: asTranslationMap(row.badge_translations),
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true
  }
}

// --- Reverse mappers: app type -> DB patch (snake_case) ---
function toSettingsPatch(s: Partial<SiteSettings>): Record<string, unknown> {
  return {
    logo_url: s.logoUrl ?? null,
    footer_logo_url: s.footerLogoUrl ?? null,
    agency_name: s.agencyName ?? null,
    short_description: s.shortDescription ?? null,
    address: s.address ?? null,
    phone: s.phone !== undefined ? stripTel(s.phone) || null : null,
    email: s.email !== undefined ? stripMailto(s.email) || null : null,
    working_hours: s.workingHours ?? null,
    official_site_url: s.officialSiteUrl ?? null,
    official_news_url: s.officialNewsUrl ?? null
  }
}
function toLeaderPatch(l: Partial<Leader>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (l.fullName !== undefined) out.full_name = l.fullName
  if (l.position !== undefined) out.position = l.position
  if (l.photoUrl !== undefined) out.photo_url = l.photoUrl ? l.photoUrl : null
  if (l.receptionDay !== undefined) out.reception_day = l.receptionDay
  if (l.receptionTime !== undefined) out.reception_time = l.receptionTime
  if (l.phone !== undefined) out.phone = stripTel(l.phone)
  if (l.email !== undefined) out.email = stripMailto(l.email)
  if (l.websiteUrl !== undefined) out.website_url = l.websiteUrl ? l.websiteUrl : null
  if (l.address !== undefined) out.address = l.address ? l.address : null
  if (l.responsibilities !== undefined) out.responsibilities = l.responsibilities ? l.responsibilities : null
  if (l.biography !== undefined) out.biography = l.biography ? l.biography : null
  if (l.positionTranslations !== undefined) out.position_translations = cleanTranslationMap(l.positionTranslations)
  if (l.receptionDayTranslations !== undefined) out.reception_day_translations = cleanTranslationMap(l.receptionDayTranslations)
  if (l.responsibilitiesTranslations !== undefined) out.responsibilities_translations = cleanTranslationMap(l.responsibilitiesTranslations)
  if (l.biographyTranslations !== undefined) out.biography_translations = cleanTranslationMap(l.biographyTranslations)
  if (l.addressTranslations !== undefined) out.address_translations = cleanTranslationMap(l.addressTranslations)
  if (l.sortOrder !== undefined) out.sort_order = l.sortOrder
  if (l.isActive !== undefined) out.is_active = l.isActive
  return out
}
function toNewsPatch(n: Partial<NewsItem>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (n.title !== undefined) out.title = n.title
  if (n.summary !== undefined) out.description = n.summary ? n.summary : null
  if (n.tag !== undefined) out.badge = n.tag ? n.tag : null
  if (n.date !== undefined) out.year = n.date ? n.date : null
  if (n.url !== undefined) out.link_url = n.url ? n.url : null
  if (n.titleTranslations !== undefined) out.title_translations = cleanTranslationMap(n.titleTranslations)
  if (n.descriptionTranslations !== undefined) out.description_translations = cleanTranslationMap(n.descriptionTranslations)
  if (n.badgeTranslations !== undefined) out.badge_translations = cleanTranslationMap(n.badgeTranslations)
  if (n.sortOrder !== undefined) out.sort_order = n.sortOrder
  if (n.isActive !== undefined) out.is_active = n.isActive
  return out
}

async function loadFromSupabase(): Promise<{
  settings: SiteSettings | null
  leaders: Leader[]
  news: NewsItem[]
  configured: boolean
}> {
  if (!supabase) return { settings: null, leaders: [], news: [], configured: false }
  const [s, l, n] = await Promise.all([
    supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('leaders').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
    supabase.from('news').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
  ])
  // eslint-disable-next-line no-console
  if (s.error) console.warn('[admin] site_settings query failed (' + (s.error.code ?? '') + '): ' + s.error.message + '. Run the SQL migrations in supabase/migrations/.')
  // eslint-disable-next-line no-console
  if (l.error) console.warn('[admin] leaders query failed (' + (l.error.code ?? '') + '): ' + l.error.message + '. Run the SQL migrations in supabase/migrations/.')
  // eslint-disable-next-line no-console
  if (n.error) console.warn('[admin] news query failed (' + (n.error.code ?? '') + '): ' + n.error.message + '. Run the SQL migrations in supabase/migrations/.')
  return {
    settings: s.error ? null : mapSettings((s.data as SettingsRow | null) ?? null),
    leaders: l.error || !l.data ? [] : (l.data as LeaderRow[]).map(mapLeader),
    news: n.error || !n.data ? [] : (n.data as NewsRow[]).map(mapNews),
    configured: true
  }
}

async function adminFetch<T>(path: string, init: RequestInit, token: string | null): Promise<T> {
  if (!token) throw new Error("Admin sessiyasi tugadi. Qayta kiring.")
  const headers = new Headers(init.headers)
  if (init.body && !(init.body instanceof FormData)) headers.set('content-type', 'application/json')
  headers.set('x-admin-secret', token)
  const res = await fetch(path, { ...init, headers })
  let json: { ok?: boolean; data?: T; error?: string; details?: string } = {}
  try { json = (await res.json()) as typeof json } catch { /* non-JSON */ }
  if (!res.ok || json.ok === false) {
    const code = json.error ?? `HTTP ${res.status}`
    const msg = json.details ? `${code} \u2014 ${json.details}` : code
    throw new Error(msg)
  }
  return json.data as T
}

function readToken(): string | null {
  try { return window.sessionStorage.getItem(TOKEN_KEY) } catch { return null }
}
function writeToken(t: string | null): void {
  try {
    if (t) window.sessionStorage.setItem(TOKEN_KEY, t)
    else window.sessionStorage.removeItem(TOKEN_KEY)
  } catch { /* ignore */ }
}

type State = {
  dbSettings: SiteSettings | null
  dbLeaders: Leader[]
  dbNews: NewsItem[]
  loading: boolean
  error: string | null
  configured: boolean
  initialized: boolean
}

export type UploadKind = 'site-logo' | 'footer-logo' | 'leader-photo'

type AdminContextValue = {
  settings: SiteSettings
  leaders: Leader[]
  news: NewsItem[]
  activeLeaders: Leader[]
  dbSettings: SiteSettings | null
  dbLeaders: Leader[]
  dbNews: NewsItem[]
  loading: boolean
  initialized: boolean
  error: string | null
  configured: boolean
  refresh: () => Promise<void>
  selectedLeaderId: string | null
  setSelectedLeaderId: (id: string | null) => void
  adminToken: string | null
  setAdminToken: (token: string | null) => void
  saveSettings: (patch: Partial<SiteSettings>) => Promise<SiteSettings>
  createLeader: (input: Partial<Leader>) => Promise<Leader>
  updateLeader: (id: string, patch: Partial<Leader>) => Promise<Leader>
  deleteLeader: (id: string) => Promise<void>
  createNews: (input: Partial<NewsItem>) => Promise<NewsItem>
  updateNews: (id: string, patch: Partial<NewsItem>) => Promise<NewsItem>
  deleteNews: (id: string) => Promise<void>
  uploadImage: (file: File, kind: UploadKind) => Promise<{ url: string; path: string }>
}

const Ctx = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    dbSettings: null,
    dbLeaders: [],
    dbNews: [],
    loading: isSupabaseConfigured(),
    error: null,
    configured: isSupabaseConfigured(),
    initialized: !isSupabaseConfigured()
  })
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null)
  const [adminToken, setAdminTokenState] = useState<string | null>(readToken())

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setState((s) => ({ ...s, loading: false, configured: false, initialized: true }))
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await loadFromSupabase()
      setState({
        dbSettings: data.settings,
        dbLeaders: data.leaders,
        dbNews: data.news,
        loading: false,
        error: null,
        configured: data.configured,
        initialized: true
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown_error'
      setState((s) => ({ ...s, loading: false, error: msg, initialized: true }))
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const setAdminToken = useCallback((t: string | null) => {
    writeToken(t)
    setAdminTokenState(t)
  }, [])

  const saveSettings = useCallback(async (patch: Partial<SiteSettings>): Promise<SiteSettings> => {
    const row = await adminFetch<SettingsRow>('/api/admin/site-settings', {
      method: 'POST',
      body: JSON.stringify(toSettingsPatch(patch))
    }, adminToken)
    const mapped = mapSettings(row)
    if (!mapped) throw new Error('Server bo\'sh javob qaytardi')
    setState((s) => ({ ...s, dbSettings: mapped }))
    return mapped
  }, [adminToken])

  const createLeader = useCallback(async (input: Partial<Leader>): Promise<Leader> => {
    const row = await adminFetch<LeaderRow>('/api/admin/leaders', {
      method: 'POST',
      body: JSON.stringify(toLeaderPatch(input))
    }, adminToken)
    const mapped = mapLeader(row)
    setState((s) => ({
      ...s,
      dbLeaders: [...s.dbLeaders, mapped].sort((a, b) => a.sortOrder - b.sortOrder)
    }))
    return mapped
  }, [adminToken])

  const updateLeader = useCallback(async (id: string, patch: Partial<Leader>): Promise<Leader> => {
    const row = await adminFetch<LeaderRow>(`/api/admin/leaders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(toLeaderPatch(patch))
    }, adminToken)
    const mapped = mapLeader(row)
    setState((s) => ({
      ...s,
      dbLeaders: s.dbLeaders.map((l) => (l.id === id ? mapped : l)).sort((a, b) => a.sortOrder - b.sortOrder)
    }))
    return mapped
  }, [adminToken])

  const deleteLeader = useCallback(async (id: string): Promise<void> => {
    await adminFetch<{ id: string }>(`/api/admin/leaders/${encodeURIComponent(id)}`, { method: 'DELETE' }, adminToken)
    setState((s) => ({ ...s, dbLeaders: s.dbLeaders.filter((l) => l.id !== id) }))
  }, [adminToken])

  const createNews = useCallback(async (input: Partial<NewsItem>): Promise<NewsItem> => {
    const row = await adminFetch<NewsRow>('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify(toNewsPatch(input))
    }, adminToken)
    const mapped = mapNews(row)
    setState((s) => ({
      ...s,
      dbNews: [...s.dbNews, mapped].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    }))
    return mapped
  }, [adminToken])

  const updateNews = useCallback(async (id: string, patch: Partial<NewsItem>): Promise<NewsItem> => {
    const row = await adminFetch<NewsRow>(`/api/admin/news/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(toNewsPatch(patch))
    }, adminToken)
    const mapped = mapNews(row)
    setState((s) => ({
      ...s,
      dbNews: s.dbNews.map((n) => (n.id === id ? mapped : n)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    }))
    return mapped
  }, [adminToken])

  const deleteNews = useCallback(async (id: string): Promise<void> => {
    await adminFetch<{ id: string }>(`/api/admin/news/${encodeURIComponent(id)}`, { method: 'DELETE' }, adminToken)
    setState((s) => ({ ...s, dbNews: s.dbNews.filter((n) => n.id !== id) }))
  }, [adminToken])

  const uploadImage = useCallback(async (file: File, kind: UploadKind): Promise<{ url: string; path: string }> => {
    if (!adminToken) throw new Error("Admin sessiyasi tugadi. Qayta kiring.")
    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-secret': adminToken },
      body: fd
    })
    let json: { ok?: boolean; url?: string; path?: string; error?: string; details?: string; bucket?: string } = {}
    try { json = (await res.json()) as typeof json } catch { /* non-JSON */ }
    if (!res.ok || !json.ok || !json.url || !json.path) {
      const code = json.error ?? `HTTP ${res.status}`
      const detail = json.details ? `${code} \u2014 ${json.details}` : (json.bucket ? `${code} (${json.bucket})` : code)
      throw new Error(detail)
    }
    return { url: json.url, path: json.path }
  }, [adminToken])

  const settings = useMemo<SiteSettings>(() => state.dbSettings ?? DEFAULT_SITE_SETTINGS, [state.dbSettings])
  const leaders = useMemo<Leader[]>(() => (state.dbLeaders.length > 0 ? state.dbLeaders : DEFAULT_LEADERS), [state.dbLeaders])
  const news = useMemo<NewsItem[]>(() => (state.dbNews.length > 0 ? state.dbNews : DEFAULT_NEWS), [state.dbNews])
  const activeLeaders = useMemo<Leader[]>(
    () => [...leaders].filter((l) => l.isActive !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [leaders]
  )

  const value: AdminContextValue = useMemo(() => ({
    settings, leaders, news, activeLeaders,
    dbSettings: state.dbSettings,
    dbLeaders: state.dbLeaders,
    dbNews: state.dbNews,
    loading: state.loading,
    initialized: state.initialized,
    error: state.error,
    configured: state.configured,
    refresh,
    selectedLeaderId, setSelectedLeaderId,
    adminToken, setAdminToken,
    saveSettings, createLeader, updateLeader, deleteLeader,
    createNews, updateNews, deleteNews, uploadImage
  }), [
    settings, leaders, news, activeLeaders,
    state.dbSettings, state.dbLeaders, state.dbNews, state.loading, state.initialized, state.error, state.configured,
    refresh, selectedLeaderId,
    adminToken, setAdminToken,
    saveSettings, createLeader, updateLeader, deleteLeader,
    createNews, updateNews, deleteNews, uploadImage
  ])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAdmin(): AdminContextValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAdmin must be used inside AdminProvider')
  return c
}
