import { useMemo, useState, type ReactNode } from 'react'
import { Plus, Pencil, Trash2, Save, X, GripVertical, Loader2 } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { ImageUpload } from './ImageUpload'
import { I18nField } from './I18nField'
import type { Leader, TranslationMap } from '../../types/admin'
import { CANONICAL_DAY_OPTIONS, stripPhonePrefix, stripEmailPrefix } from '../../i18n/contentResolver'

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
    websiteUrl: '',
    address: '',
    responsibilities: '',
    biography: '',
    positionTranslations: {},
    receptionDayTranslations: {},
    responsibilitiesTranslations: {},
    biographyTranslations: {},
    addressTranslations: {},
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
    setEditing({
      ...leader,
      websiteUrl: leader.websiteUrl ?? '',
      address: leader.address ?? '',
      responsibilities: leader.responsibilities ?? '',
      biography: leader.biography ?? '',
      positionTranslations: leader.positionTranslations ?? {},
      receptionDayTranslations: leader.receptionDayTranslations ?? {},
      responsibilitiesTranslations: leader.responsibilitiesTranslations ?? {},
      biographyTranslations: leader.biographyTranslations ?? {},
      addressTranslations: leader.addressTranslations ?? {}
    })
    setErrors({})
  }

  function cancel() {
    setEditing(null)
    setErrors({})
  }

  function setField<K extends keyof Leader>(k: K, v: Leader[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e))
  }

  function setI18n(field: 'position' | 'address' | 'responsibilities' | 'biography', next: { base: string; translations: TranslationMap }) {
    setEditing((e) => {
      if (!e) return e
      if (field === 'position') return { ...e, position: next.base, positionTranslations: next.translations }
      if (field === 'address') return { ...e, address: next.base, addressTranslations: next.translations }
      if (field === 'responsibilities') return { ...e, responsibilities: next.base, responsibilitiesTranslations: next.translations }
      return { ...e, biography: next.base, biographyTranslations: next.translations }
    })
  }

  function validate(l: Leader): boolean {
    const next: Errors = {}
    if (!l.fullName.trim()) next.fullName = 'Majburiy'
    if (!l.position.trim()) next.position = 'Majburiy (UZ tilida)'
    if (!l.phone.trim()) next.phone = 'Majburiy'
    const cleanEmail = stripEmailPrefix(l.email)
    if (cleanEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) next.email = 'Yaroqsiz email'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function save() {
    if (!editing || saving) return
    if (!validate(editing)) return
    const isNew = editing.id.startsWith('__new_') || !dbLeaders.some((l) => l.id === editing.id)
    setSaving(true)
    try {
      const patch: Partial<Leader> = {
        fullName: editing.fullName.trim(),
        position: editing.position.trim(),
        photoUrl: editing.photoUrl,
        receptionDay: editing.receptionDay,
        receptionTime: editing.receptionTime,
        phone: stripPhonePrefix(editing.phone),
        email: stripEmailPrefix(editing.email),
        websiteUrl: editing.websiteUrl ?? '',
        address: editing.address ?? '',
        responsibilities: editing.responsibilities ?? '',
        biography: editing.biography ?? '',
        positionTranslations: editing.positionTranslations ?? {},
        receptionDayTranslations: editing.receptionDayTranslations ?? {},
        responsibilitiesTranslations: editing.responsibilitiesTranslations ?? {},
        biographyTranslations: editing.biographyTranslations ?? {},
        addressTranslations: editing.addressTranslations ?? {},
        sortOrder: editing.sortOrder,
        isActive: editing.isActive
      }
      if (isNew) await createLeader(patch)
      else await updateLeader(editing.id, patch)
      showToast('success', isNew ? "Yangi rahbar qo'shildi" : 'Saqlandi')
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
          <p className="text-sm text-brand-muted">Qabul jadvali, kontaktlar, vazifalari va biografiya. Lavozim, manzil, vazifalar va biografiya UZ/RU/EN tillarida saqlanadi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={startCreate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition"><Plus size={14} /> Yangi rahbar</button>
        </div>
      </header>

      {!configured && (<div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-sm">Supabase env sozlanmagan. Saqlash uchun env o'zgaruvchilarni qo'shing.</div>)}
      {loading && configured && (<div className="rounded-xl bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Yuklanmoqda...</div>)}
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
              <ImageUpload label="Rasmi" kind="leader-photo" value={editing.photoUrl} onChange={(url) => setField('photoUrl', url)} onClear={() => setField('photoUrl', '')} helperText="Kvadrat rasm tavsiya etiladi." rounded="2xl" />
            </div>
            <Field label="F.I.Sh" error={errors.fullName}><input className="form-input" value={editing.fullName} onChange={(e) => setField('fullName', e.target.value)} /></Field>
            <div>
              <I18nField
                label="Lavozimi"
                base={editing.position}
                translations={editing.positionTranslations}
                onChange={(next) => setI18n('position', next)}
                placeholder="Masalan: Agentlik direktori"
                helperText="UZ majburiy. RU/EN bo'sh qoldirilsa, public sahifa UZ qiymatini ko'rsatadi."
                error={errors.position}
                required
              />
            </div>
            <Field label="Qabul kuni">
              <select className="form-input" value={editing.receptionDay} onChange={(e) => setField('receptionDay', e.target.value)}>
                <option value="">\u2014</option>
                {CANONICAL_DAY_OPTIONS.map((d) => (
                  <option key={d.key} value={d.uz}>{d.uz}</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-brand-muted">Saytda tanlangan til bo'yicha avtomatik tarjima qilinadi.</p>
            </Field>
            <Field label="Qabul vaqti"><input className="form-input" value={editing.receptionTime} placeholder="Masalan: 10:00 - 12:00" onChange={(e) => setField('receptionTime', e.target.value)} /></Field>
            <Field label="Telefon" error={errors.phone}><input className="form-input" value={editing.phone} placeholder="+998 71 123 45 67" onChange={(e) => setField('phone', e.target.value)} /></Field>
            <Field label="Email" error={errors.email}><input className="form-input" type="email" value={editing.email} placeholder="info@meteo.uz" onChange={(e) => setField('email', e.target.value)} /></Field>
            <Field label="Veb-sayt"><input className="form-input" value={editing.websiteUrl ?? ''} placeholder="https://meteo.uz" onChange={(e) => setField('websiteUrl', e.target.value)} /></Field>
            <div>
              <I18nField
                label="Manzil"
                base={editing.address ?? ''}
                translations={editing.addressTranslations}
                onChange={(next) => setI18n('address', next)}
                placeholder="Toshkent, ..."
              />
            </div>
            <div className="sm:col-span-2">
              <I18nField
                label="Vazifalari (mas'uliyatlari)"
                base={editing.responsibilities ?? ''}
                translations={editing.responsibilitiesTranslations}
                onChange={(next) => setI18n('responsibilities', next)}
                multiline
                rows={5}
                placeholder="Rahbarning asosiy vazifalari..."
                helperText="Public sahifada ochiladigan panel sifatida ko'rinadi. Bo'sh qoldirilsa, panel ko'rsatilmaydi."
              />
            </div>
            <div className="sm:col-span-2">
              <I18nField
                label="Biografiya"
                base={editing.biography ?? ''}
                translations={editing.biographyTranslations}
                onChange={(next) => setI18n('biography', next)}
                multiline
                rows={6}
                placeholder="Tarjimai hol matni: ta'lim, ish faoliyati, asosiy yutuqlar..."
                helperText="Public sahifada ochiladigan panel sifatida ko'rinadi. Bo'sh qoldirilsa, panel ko'rsatilmaydi."
              />
            </div>
            <Field label="Tartib raqami"><input className="form-input" type="number" value={editing.sortOrder} onChange={(e) => setField('sortOrder', Number(e.target.value || 0))} /></Field>
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
        {sorted.length === 0 && !loading && (<div className="p-10 text-center text-brand-muted">Rahbarlar bazada mavjud emas. "Yangi rahbar" tugmasi orqali qo'shing.</div>)}
        {sorted.map((l) => {
          const hasResp = Boolean(l.responsibilities && l.responsibilities.trim())
          const hasBio = Boolean(l.biography && l.biography.trim())
          const tx = l.positionTranslations ?? {}
          const i18nBadge = (tx.ru && tx.ru.trim()) || (tx.en && tx.en.trim())
          return (
            <div key={l.id} className="p-4 sm:p-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <GripVertical size={16} className="text-brand-muted shrink-0 hidden sm:block" aria-hidden="true" />
                <div className="h-12 w-12 rounded-xl bg-brand-mist border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {l.photoUrl ? <img src={l.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="font-display font-bold text-brand-deep text-sm">{(l.fullName.split(/\s+/).map((p) => p.charAt(0)).slice(0, 2).join('') || '\u2014').toUpperCase()}</span>}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-brand-navy break-words">{l.fullName || 'Nomsiz rahbar'}</div>
                  <div className="text-xs text-brand-muted leading-snug break-words">{l.position}</div>
                  <div className="text-[11px] text-brand-muted mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span>#{l.sortOrder}</span>
                    <span aria-hidden="true">{'\u2022'}</span>
                    <span>{l.isActive ? 'Faol' : 'Faol emas'}</span>
                    {i18nBadge ? (<><span aria-hidden="true">{'\u2022'}</span><span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">i18n</span></>) : null}
                    {hasResp && (<><span aria-hidden="true">{'\u2022'}</span><span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Vazifalari</span></>)}
                    {hasBio && (<><span aria-hidden="true">{'\u2022'}</span><span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Biografiya</span></>)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(l)} disabled={deletingId === l.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-brand-navy text-xs font-semibold hover:border-brand-primary hover:text-brand-deep transition disabled:opacity-60"><Pencil size={13} /> Tahrirlash</button>
                <button type="button" onClick={() => remove(l.id)} disabled={deletingId === l.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-red-600 text-xs font-semibold hover:border-red-300 transition disabled:opacity-60">
                  {deletingId === l.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  {deletingId === l.id ? "O'chirilmoqda" : "O'chirish"}
                </button>
              </div>
            </div>
          )
        })}
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
