import { useMemo, useState, type ReactNode } from 'react'
import { Plus, Pencil, Trash2, Save, X, GripVertical, Loader2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { ImageUpload } from './ImageUpload'
import type { Leader } from '../../types/admin'

type Errors = Partial<Record<keyof Leader, string>>
type Toast = { kind: 'success' | 'error'; message: string } | null

function emptyLeader(sortOrder: number): Leader {
  return {
    id: `__new_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    fullName: '',
    position: '',
    photoUrl: '',
    receptionDay: '',
    receptionTime: '',
    phone: '',
    email: '',
    sortOrder,
    isActive: true
  }
}

export function LeadersTab() {
  const { dbLeaders, createLeader, updateLeader, deleteLeader, loading, configured } = useAdmin()
  const sorted = useMemo(
    () => [...dbLeaders].sort((a, b) => a.sortOrder - b.sortOrder),
    [dbLeaders]
  )
  const [editing, setEditing] = useState<Leader | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  function showToast(kind: 'success' | 'error', message: string) {
    setToast({ kind, message })
    window.setTimeout(() => setToast(null), 3000)
  }

  function startCreate() {
    const nextOrder = (sorted[sorted.length - 1]?.sortOrder ?? 0) + 1
    setEditing(emptyLeader(nextOrder))
    setErrors({})
  }

  function startEdit(leader: Leader) {
    setEditing({ ...leader })
    setErrors({})
  }

  function cancel() {
    setEditing(null)
    setErrors({})
  }

  function setField<K extends keyof Leader>(k: K, v: Leader[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e))
  }

  function validate(l: Leader): boolean {
    const next: Errors = {}
    if (!l.fullName.trim()) next.fullName = 'Majburiy'
    if (!l.position.trim()) next.position = 'Majburiy'
    if (!l.phone.trim()) next.phone = 'Majburiy'
    if (l.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(l.email)) next.email = "Yaroqsiz email"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function save() {
    if (!editing || saving) return
    if (!validate(editing)) return
    const isNew = editing.id.startsWith('__new_') || !dbLeaders.some((l) => l.id === editing.id)
    setSaving(true)
    try {
      if (isNew) {
        await createLeader({
          fullName: editing.fullName,
          position: editing.position,
          photoUrl: editing.photoUrl,
          receptionDay: editing.receptionDay,
          receptionTime: editing.receptionTime,
          phone: editing.phone,
          email: editing.email,
          sortOrder: editing.sortOrder,
          isActive: editing.isActive
        })
      } else {
        await updateLeader(editing.id, editing)
      }
      showToast('success', isNew ? 'Yangi rahbar qo\'shildi' : 'Saqlandi')
      setEditing(null)
      setErrors({})
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown_error'
      showToast('error', `Saqlashda xatolik: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Rahbarni o'chirishni xohlaysizmi? Bu amal public sahifadan ham olib tashlaydi.")) return
    setDeletingId(id)
    try {
      await deleteLeader(id)
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
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-navy">Rahbar xodimlar</h2>
          <p className="text-sm text-brand-muted">Qabul jadvali ma'lumotlari va kontaktlar. Supabase bazasida saqlanadi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={startCreate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition"><Plus size={14} /> Yangi rahbar</button>
        </div>
      </header>

      {!configured && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-sm">Supabase env sozlanmagan. Saqlash uchun env o'zgaruvchilarni qo'shing.</div>
      )}
      {loading && configured && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Yuklanmoqda...</div>
      )}
      {toast?.kind === 'success' && <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">{toast.message}</div>}
      {toast?.kind === 'error' && <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-2 text-sm">{toast.message}</div>}

      {editing && (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-extrabold text-brand-navy">{dbLeaders.some((l) => l.id === editing.id) ? 'Rahbarni tahrirlash' : 'Yangi rahbar'}</h3>
            <button type="button" onClick={cancel} className="text-brand-muted hover:text-brand-navy" aria-label="Yopish"><X size={18} /></button>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <ImageUpload label="Rasmi" bucket="leader-photos" value={editing.photoUrl} onChange={(url) => setField('photoUrl', url)} onClear={() => setField('photoUrl', '')} helperText="Kvadrat rasm tavsiya etiladi." rounded="2xl" />
            </div>
            <Field label="F.I.Sh" error={errors.fullName}>
              <input className="form-input" value={editing.fullName} onChange={(e) => setField('fullName', e.target.value)} />
            </Field>
            <Field label="Lavozimi" error={errors.position}>
              <input className="form-input" value={editing.position} onChange={(e) => setField('position', e.target.value)} />
            </Field>
            <Field label="Qabul kuni">
              <input className="form-input" value={editing.receptionDay} placeholder="Masalan: Payshanba" onChange={(e) => setField('receptionDay', e.target.value)} />
            </Field>
            <Field label="Qabul vaqti">
              <input className="form-input" value={editing.receptionTime} placeholder="Masalan: 10:00 - 12:00" onChange={(e) => setField('receptionTime', e.target.value)} />
            </Field>
            <Field label="Telefon" error={errors.phone}>
              <input className="form-input" value={editing.phone} onChange={(e) => setField('phone', e.target.value)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className="form-input" type="email" value={editing.email} onChange={(e) => setField('email', e.target.value)} />
            </Field>
            <Field label="Tartib raqami">
              <input className="form-input" type="number" value={editing.sortOrder} onChange={(e) => setField('sortOrder', Number(e.target.value || 0))} />
            </Field>
            <Field label="Holati">
              <label className="inline-flex items-center gap-2 mt-2 text-sm text-brand-navy">
                <input type="checkbox" checked={editing.isActive} onChange={(e) => setField('isActive', e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                Faol (saytda ko'rsatilsin)
              </label>
            </Field>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={cancel} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition disabled:opacity-60">Bekor qilish</button>
            <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition disabled:opacity-70">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card divide-y divide-slate-100">
        {sorted.length === 0 && !loading && (
          <div className="p-10 text-center text-brand-muted">Rahbarlar bazada mavjud emas. "Yangi rahbar" tugmasi orqali qo'shing.</div>
        )}
        {sorted.map((l) => (
          <div key={l.id} className="p-4 sm:p-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <GripVertical size={16} className="text-brand-muted shrink-0 hidden sm:block" aria-hidden="true" />
              <div className="h-12 w-12 rounded-xl bg-brand-mist border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                {l.photoUrl ? (
                  <img src={l.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-brand-deep text-sm">{(l.fullName.split(/\s+/).map((p) => p.charAt(0)).slice(0, 2).join('') || '\u2014').toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-brand-navy break-words">{l.fullName || 'Nomsiz rahbar'}</div>
                <div className="text-xs text-brand-muted leading-snug break-words">{l.position}</div>
                <div className="text-[11px] text-brand-muted mt-0.5">#{l.sortOrder} {'\u2022'} {l.isActive ? 'Faol' : 'Faol emas'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(l)} disabled={deletingId === l.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition disabled:opacity-60"><Pencil size={13} /> Tahrirlash</button>
              <button type="button" onClick={() => remove(l.id)} disabled={deletingId === l.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition disabled:opacity-60">
                {deletingId === l.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                {deletingId === l.id ? 'O\'chirilmoqda' : "O'chirish"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="text-sm">
      <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</label>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
