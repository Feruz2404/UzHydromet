import { useEffect, useState, type ReactNode } from 'react'
import { Save, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useLanguage } from '../../i18n/LanguageContext'
import type { NewsItem } from '../../types/admin'

export function NewsTab() {
  const { news, upsertNews, deleteNews, settings } = useAdmin()
  const { t } = useLanguage()
  const [drafts, setDrafts] = useState<NewsItem[]>(news)
  const [saved, setSaved] = useState<boolean>(false)

  useEffect(() => { setDrafts(news) }, [news])

  function setField(idx: number, patch: Partial<NewsItem>) {
    setDrafts((arr) => arr.map((n, i) => (i === idx ? { ...n, ...patch } : n)))
  }

  function save() {
    drafts.forEach((d) => upsertNews(d))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  function addItem() {
    const id = `news_${Date.now()}`
    setDrafts((arr) => [...arr, { id, title: '', summary: '', date: '', tag: '', url: '' }])
  }

  function remove(id: string) {
    if (window.confirm("Yangilik kartasini o'chirish?")) {
      deleteNews(id)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-navy">Yangiliklar</h2>
          <p className="text-sm text-brand-muted">"Batafsil" tugmasi olib boradigan link va karta matnini boshqaring. Bo'sh qoldirilsa, sayt sozlamalaridagi rasmiy yangiliklar URL'i ishlatiladi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition"><Plus size={14} /> Qo'shish</button>
          <button type="button" onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition"><Save size={14} /> Saqlash</button>
        </div>
      </header>

      {saved && <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">Saqlandi.</div>}

      {settings.officialNewsUrl && (
        <div className="rounded-xl bg-brand-mist border border-slate-100 px-4 py-3 text-sm text-brand-navy flex items-start gap-2">
          <ExternalLink size={14} className="mt-0.5 text-brand-deep" />
          <div>Default rasmiy yangiliklar URL'i: <a href={settings.officialNewsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-deep font-semibold break-all">{settings.officialNewsUrl}</a></div>
        </div>
      )}

      <div className="grid gap-4">
        {drafts.map((n, i) => (
          <div key={n.id} className="rounded-2xl bg-white border border-slate-100 shadow-card p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-brand-muted">ID: {n.id}</div>
              <button type="button" onClick={() => remove(n.id)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition"><Trash2 size={13} /> O'chirish</button>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <Field label="Sarlavha">
                <input className="form-input" placeholder={n.titleKey ? t(n.titleKey) : 'Sarlavha'} value={n.title ?? ''} onChange={(e) => setField(i, { title: e.target.value })} />
              </Field>
              <Field label="Tag">
                <input className="form-input" placeholder={n.tagKey ? t(n.tagKey) : 'E\u2019lon'} value={n.tag ?? ''} onChange={(e) => setField(i, { tag: e.target.value })} />
              </Field>
              <Field label="Sana">
                <input className="form-input" placeholder={n.dateKey ? t(n.dateKey) : '2026'} value={n.date ?? ''} onChange={(e) => setField(i, { date: e.target.value })} />
              </Field>
              <Field label="Batafsil link (ixtiyoriy)">
                <input className="form-input" placeholder="https://gov.uz/oz/hydromet/news/..." value={n.url ?? ''} onChange={(e) => setField(i, { url: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Qisqa matn">
                  <textarea rows={3} className="form-input resize-none" placeholder={n.summaryKey ? t(n.summaryKey) : ''} value={n.summary ?? ''} onChange={(e) => setField(i, { summary: e.target.value })} />
                </Field>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="text-sm">
      <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  )
}
