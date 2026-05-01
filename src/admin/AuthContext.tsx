import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type AuthState = {
  authenticated: boolean
  username: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const Ctx = createContext<AuthState | null>(null)
const STORAGE_KEY = 'uzhydromet:auth'
const DEMO_USER = 'admin'
const DEMO_PASS = 'admin'

type Stored = { username: string }

function readStored(): Stored | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    if (parsed && typeof parsed.username === 'string') return parsed
    return null
  } catch (e) {
    return null
  }
}

export function AuthProvider(props: { children: ReactNode }) {
  const initial = readStored()
  const [username, setUsername] = useState<string | null>(initial ? initial.username : null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (username) {
        const stored: Stored = { username }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) { /* ignore */ }
  }, [username])
  const login = useCallback((u: string, p: string): boolean => {
    if (u === DEMO_USER && p === DEMO_PASS) {
      setUsername(u)
      return true
    }
    return false
  }, [])
  const logout = useCallback((): void => { setUsername(null) }, [])
  const value = useMemo<AuthState>(
    () => ({ authenticated: !!username, username, login, logout }),
    [username, login, logout]
  )
  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
}

export function useAuth(): AuthState {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth must be inside AuthProvider')
  return c
}
