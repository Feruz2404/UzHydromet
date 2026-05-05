import { useEffect, useState, type ReactNode } from 'react'
import { Save, ExternalLink, Plus, Trash2, Loader2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { I18nField } from './I18nField'
import type { NewsItem, TranslationMap } from '../../types/admin'

type Toast = { kind: 'success' | 'error'; message: string } | null

export function NewsTab() {
  const { dbNews, createNews, updateNews, deleteNews, settings, loading, configured } = useAdmin()
  const [drafts, setDrafts] = useState<NewsItem[]>(dbNews)
  const [saving, setSaving] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  useEffect(() => { setDrafts(dbNews) }, [dbNews])

  function showToast(kind: 'success' | 'error', message: string) {
    setToast({ kind, message })
    window.setTimeout(() => setToast(null), 3000)
  }

  function setField(idx: number, patch: Partial<NewsItem>) {
    setDrafts((arr) => arr.map((n, i) => (i === idx ? { ...n, ...patch } : n)))
  }

  function setI18nTitle(idx: number, next: { base: string; translations: TranslationMap }) {
    setField(idx, { title: next.base, titleTranslations: next.translations })
  }
  function setI18nSummary(idx: number, next: { base: string; translations: TranslationMap }) {
    setField(idx, { summary: next.base, descriptionTranslations: next.translations })
  }
  function setI18nTag(idx: number, next: { base: string; translations: TranslationMap }) {
    setField(idx, { tag: next.base, badgeTranslations: next.translations })
  }

  async function save() {
    if (saving) return
    setSaving(true)
    try {
      const dbIds = new Set(dbNews.map((n) => n.id))
      for (const d of drafts) {
        if (!d.title || !d.title.trim()) continue
        if (dbIds.has(d.id)) {
          await updateNews(d.id, d)
        } else {
          await createNews(d)
        }
      }
      showToast('success', 'Saqlandi')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown_error'
      showToast('error', `Saqlashda xatolik: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  function addItem() {
    const tempId = `__new_${Date.now()}`
    setDrafts((arr) => [
      ...arr,
      {
        id: tempId,
        title: '',
        summary: '',
        date: '',
        tag: '',
        url: '',
        titleTranslations: {},
        descriptionTranslations: {},
        badgeTranslations: {},
        sortOrder: arr.length,
        isActive: true
      }
    ])
  }

  async function remove(id: string) {
    if (!window.confirm("Yangilik kartasini o'chirish?")) return
    if (!dbNews.some((n) => n.id === id)) {
      setDrafts((arr) => arr.filter((n) => n.id !== id))
      return
    }
    setDeletingId(id)
    try {
      await deleteNews(id)
      showToast('success', "O'chirildi")
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown_error'
      showToast('error', `O'chirishda xatolik: ${msg}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-navy">Yangiliklar</h2>
          <p className="text-sm text-brand-muted">Sarlavha, qisqa matn va tag UZ/RU/EN tillarida saqlanadi. Bo'sh qoldirilgan tillar UZ qiymatiga qaytadi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addItem} disabled={saving} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition disabled:opacity-60"><Plus size={14} /> Qo'shish</button>
          <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition disabled:opacity-70">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </header>

      {!configured && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-sm">Supabase env sozlanmagan. Saqlash uchun env o'zgaruvchilarni qo'shing.</div>
      )}
      {loading && configured && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Yuklanmoqda...</div>
      )}
      {toast?.kind === 'success' && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">{toast.message}</div>
      )}
      {toast?.kind === 'error' && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-2 text-sm">{toast.message}</div>
      )}

      {settings.officialNewsUrl && (
        <div className="rounded-xl bg-brand-mist border border-slate-100 px-4 py-3 text-sm text-brand-navy flex items-start gap-2">
          <ExternalLink size={14} className="mt-0.5 text-brand-deep" />
          <div>Default rasmiy yangiliklar URL'i: <a href={settings.officialNewsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-deep font-semibold break-all">{settings.officialNewsUrl}</a></div>
        </div>
      )}

      {drafts.length === 0 && !loading && (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-10 text-center text-brand-muted">Yangiliklar bazada mavjud emas. "Qo'shish" tugmasi orqali yarating.</div>
      )}

      <div className="grid gap-4">
        {drafts.map((n, i) => (
          <div key={n.id} className="rounded-2xl bg-white border border-slate-100 shadow-card p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-brand-muted">{n.id.startsWith('__new_') ? 'Yangi (saqlanmagan)' : `ID: ${n.id}`}</div>
              <button type="button" onClick={() => remove(n.id)} disabled={deletingId === n.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition disabled:opacity-60">
                {deletingId === n.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                {deletingId === n.id ? "O'chirilmoqda" : "O'chirish"}
              </button>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <I18nField
                  label="Sarlavha"
                  base={n.title ?? ''}
                  translations={n.titleTranslations}
                  onChange={(next) => setI18nTitle(i, next)}
                  placeholder="Yangilik sarlavhasi"
                  required
                />
              </div>
              <div>
                <I18nField
                  label="Tag (badge)"
                  base={n.tag ?? ''}
                  translations={n.badgeTranslations}
                  onChange={(next) => setI18nTag(i, next)}
                  placeholder="E\u2019lon"
                />
              </div>
              <Field label="Yil / sana">
                <input className="form-input" placeholder="2026" value={n.date ?? ''} onChange={(e) => setField(i, { date: e.target.value })} />
              </Field>
              <Field label="Batafsil link (ixtiyoriy)">
                <input className="form-input" placeholder="https://gov.uz/oz/hydromet/news/..." value={n.url ?? ''} onChange={(e) => setField(i, { url: e.target.value })} />
              </Field>
              <Field label="Tartib raqami">
                <input className="form-input" type="number" value={n.sortOrder ?? 0} onChange={(e) => setField(i, { sortOrder: Number(e.target.value || 0) })} />
              </Field>
              <Field label="Holati">
                <label className="inline-flex items-center gap-2 mt-2 text-sm text-brand-navy">
                  <input type="checkbox" checked={n.isActive !== false} onChange={(e) => setField(i, { isActive: e.target.checked })} className="w-4 h-4 accent-brand-primary" />
                  Faol (saytda ko'rsatilsin)
                </label>
              </Field>
              <div className="sm:col-span-2">
                <I18nField
                  label="Qisqa matn (description)"
                  base={n.summary ?? ''}
                  translations={n.descriptionTranslations}
                  onChange={(next) => setI18nSummary(i, next)}
                  multiline
                  rows={3}
                />
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
