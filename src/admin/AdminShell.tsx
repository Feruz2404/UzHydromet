import { useState, type ReactNode } from 'react'
import { LogIn, LogOut, Eye, Edit3 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { AdminEditors } from './AdminEditors'

function LoginScreen() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const [u, setU] = useState<string>('')
  const [p, setP] = useState<string>('')
  const [err, setErr] = useState<boolean>(false)
  function onU(e: React.ChangeEvent<HTMLInputElement>): void { setU(e.target.value) }
  function onP(e: React.ChangeEvent<HTMLInputElement>): void { setP(e.target.value) }
  function submit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const ok = login(u, p)
    setErr(!ok)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white border border-slate-100 shadow-card p-7 grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-ink-900">{t('admin.login.title', 'Admin sign in')}</h1>
          <LanguageSwitcher compact />
        </div>
        <p className="text-xs text-slate-500">{t('admin.login.hint', 'Demo credentials: admin / admin')}</p>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{t('admin.login.user', 'Username')}</span>
          <input value={u} onChange={onU} type="text" autoComplete="username" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{t('admin.login.pass', 'Password')}</span>
          <input value={p} onChange={onP} type="password" autoComplete="current-password" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
        </label>
        {err ? <span className="text-xs text-red-600">{t('admin.login.err', 'Invalid credentials')}</span> : null}
        <button type="submit" className="btn-primary justify-center">
          <LogIn size={16} />
          <span>{t('admin.login.submit', 'Sign in')}</span>
        </button>
      </form>
    </div>
  )
}

type TabId = 'overview' | 'edit'
type Tab = { id: TabId; key: string; fallback: string; icon: ReactNode }

const tabs: Tab[] = [
  { id: 'overview', key: 'admin.tab.overview', fallback: 'Overview', icon: <Eye size={16} /> },
  { id: 'edit', key: 'admin.tab.edit', fallback: 'Content', icon: <Edit3 size={16} /> }
]

function Overview() {
  const { t } = useLanguage()
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-ink-900">{t('admin.overview.title', 'Welcome to the admin panel')}</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('admin.overview.text', 'Edit hero, about, services, leadership, contact, news, and footer content per language. Changes save to local storage and can be synced to Supabase.')}</p>
      </div>
      <a href="/" className="btn-secondary w-fit">{t('admin.overview.backToSite', 'Open public site')}</a>
    </div>
  )
}

export function AdminShell() {
  const { authenticated, username, logout } = useAuth()
  const { t } = useLanguage()
  const [tab, setTab] = useState<TabId>('overview')
  if (!authenticated) return <LoginScreen />
  function pick(id: TabId): void { setTab(id) }
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-slate-200">
        <div className="container-page h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">U</span>
            <span className="font-semibold text-ink-900">{t('admin.title', 'UzGidromet Admin')}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <span className="text-sm text-slate-600 hidden sm:inline">{username}</span>
            <button type="button" onClick={logout} className="btn-secondary">
              <LogOut size={16} />
              <span>{t('admin.logout', 'Sign out')}</span>
            </button>
          </div>
        </div>
      </header>
      <div className="container-page py-6 grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <nav className="grid gap-1">
            {tabs.map((it) => {
              const isActive = it.id === tab
              const cls = isActive
                ? 'inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 text-brand-700 font-semibold text-sm'
                : 'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-sm'
              return (
                <button key={it.id} type="button" onClick={() => pick(it.id)} className={cls}>
                  {it.icon}
                  <span>{t(it.key, it.fallback)}</span>
                </button>
              )
            })}
          </nav>
        </aside>
        <main className="lg:col-span-9">
          {tab === 'overview' ? <Overview /> : <AdminEditors />}
        </main>
      </div>
    </div>
  )
}
