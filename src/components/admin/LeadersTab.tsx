import { useMemo, useState, type ReactNode } from 'react'
import { Plus, Pencil, Trash2, Save, X, RotateCcw, GripVertical } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { ImageUpload } from './ImageUpload'
import type { Leader } from '../../types/admin'

function emptyLeader(sortOrder: number): Leader {
  return {
    id: `leader_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
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

type Errors = Partial<Record<keyof Leader, string>>

export function LeadersTab() {
  const { leaders, upsertLeader, deleteLeader, resetLeaders } = useAdmin()
  const sorted = useMemo(() => [...leaders].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)), [leaders])
  const [editing, setEditing] = useState<Leader | null>(null)
  const [errors, setErrors] = useState<Errors>({})

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

  function save() {
    if (!editing) return
    if (!validate(editing)) return
    upsertLeader(editing)
    setEditing(null)
    setErrors({})
  }

  function remove(id: string) {
    if (window.confirm("Rahbarni o'chirishni xohlaysizmi? Bu amal public sahifadan ham olib tashlaydi.")) {
      deleteLeader(id)
    }
  }

  function reset() {
    if (window.confirm("Rahbarlar ro'yxatini standart holatga qaytarish?")) {
      resetLeaders()
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-navy">Rahbar xodimlar</h2>
          <p className="text-sm text-brand-muted">Qabul jadvali ma'lumotlari va kontaktlar.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition"><RotateCcw size={14} /> Standart</button>
          <button type="button" onClick={startCreate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition"><Plus size={14} /> Yangi rahbar</button>
        </div>
      </header>

      {editing && (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-extrabold text-brand-navy">{leaders.some((l) => l.id === editing.id) ? 'Rahbarni tahrirlash' : 'Yangi rahbar'}</h3>
            <button type="button" onClick={cancel} className="text-brand-muted hover:text-brand-navy" aria-label="Yopish"><X size={18} /></button>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <ImageUpload label="Rasmi" value={editing.photoUrl} onChange={(url) => setField('photoUrl', url)} onClear={() => setField('photoUrl', '')} helperText="Kvadrat rasm tavsiya etiladi." rounded="2xl" />
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
            <button type="button" onClick={cancel} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition">Bekor qilish</button>
            <button type="button" onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition"><Save size={14} /> Saqlash</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card divide-y divide-slate-100">
        {sorted.length === 0 && (
          <div className="p-10 text-center text-brand-muted">Rahbarlar mavjud emas. "Yangi rahbar" tugmasi orqali qo'shing.</div>
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
              <button type="button" onClick={() => startEdit(l)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition"><Pencil size={13} /> Tahrirlash</button>
              <button type="button" onClick={() => remove(l.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition"><Trash2 size={13} /> O'chirish</button>
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
