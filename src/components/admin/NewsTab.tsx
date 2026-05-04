import { useEffect, useState, type ReactNode } from 'react'
import { Save, ExternalLink, Plus, Trash2, Loader2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import type { NewsItem } from '../../types/admin'

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
    setDrafts((arr) => [...arr, { id: tempId, title: '', summary: '', date: '', tag: '', url: '', sortOrder: arr.length, isActive: true }])
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
          <p className="text-sm text-brand-muted">"Batafsil" tugmasi olib boradigan link va karta matnini boshqaring. Bo'sh qoldirilsa, sayt sozlamalaridagi rasmiy yangiliklar URL'i ishlatiladi.</p>
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
      {toast?.kind === 'success' && <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">{toast.message}</div>}
      {toast?.kind === 'error' && <div className="rounded-xl bg-red-50 border border-red-200 text-red-800