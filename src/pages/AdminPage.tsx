import { useEffect, useState } from 'react'
import { Settings, Users, Newspaper, LogOut, ArrowLeft, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminLogin } from '../components/admin/AdminLogin'
import { SiteSettingsTab } from '../components/admin/SiteSettingsTab'
import { LeadersTab } from '../components/admin/LeadersTab'
import { NewsTab } from '../components/admin/NewsTab'
import { useAdmin } from '../context/AdminContext'

type Tab = 'settings' | 'leaders' | 'news'

function readAuth(): boolean {
  try {
    return window.sessionStorage.getItem('uzhydromet:admin:auth') === '1'
  } catch {
    return false
  }
}

export default function AdminPage() {
  const { settings } = useAdmin()
  const [authed, setAuthed] = useState<boolean>(readAuth)
  const [tab, setTab] = useState<Tab>('settings')

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Admin - ${settings.agencyName}`
    }
  }, [settings.agencyName])

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  function logout() {
    try { window.sessionStorage.removeItem('uzhydromet:admin:auth') } catch { /* ignore */ }
    setAuthed(false)
  }

  return (
    <div className="min-h-screen bg-brand-mist">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="inline-flex items-center gap-1.5 text-brand-muted hover:text-brand-navy text-sm font-semibold"><ArrowLeft size={16} /> Saytga qaytish</Link>
          </div>
          <div className="flex items-center gap-2">
            <a href={settings.officialSiteUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition"><Globe size={14} /> Rasmiy sayt</a>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition"><LogOut size={14} /> Chiqish</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={<Settings size={14} />}>Sayt sozlamalari</TabButton>
          <TabButton active={tab === 'leaders'} onClick={() => setTab('leaders')} icon={<Users size={14} />}>Rahbarlar</TabButton>
          <TabButton active={tab === 'news'} onClick={() => setTab('news')} icon={<Newspaper size={14} />}>Yangiliklar</TabButton>
        </div>
        {tab === 'settings' && <SiteSettingsTab />}
        {tab === 'leaders' && <LeadersTab />}
        {tab === 'news' && <NewsTab />}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  const cls = active
    ? 'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card'
    : 'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition'
  return (
    <button type="button" onClick={onClick} className={cls}>{icon} {children}</button>
  )
}
