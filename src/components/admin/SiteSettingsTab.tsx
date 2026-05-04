import { useEffect, useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { ImageUpload } from './ImageUpload'
import type { SiteSettings } from '../../types/admin'

type Errors = Partial<Record<keyof SiteSettings, string>>

export function SiteSettingsTab() {
  const { settings, updateSettings, resetSettings } = useAdmin()
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [errors, setErrors] = useState<Errors>({})
  const [saved, setSaved] = useState<boolean>(false)

  useEffect(() => { setDraft(settings) }, [settings])

  function setField<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
  }

  function validate(): boolean {
    const next: Errors = {}
    if (!draft.agencyName.trim()) next.agencyName = 'Majburiy'
    if (!draft.address.trim()) next.address = 'Majburiy'
    if (!draft.phone.trim()) next.phone = 'Majburiy'
    if (!draft.email.trim()) next.email = 'Majburiy'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email)) next.email = "Yaroqsiz email"
    if (draft.officialSiteUrl && !/^https?:\/\//.test(draft.officialSiteUrl)) next.officialSiteUrl = 'http(s):// bilan boshlansin'
    if (draft.officialNewsUrl && !/^https?:\/\//.test(draft.officialNewsUrl)) next.officialNewsUrl = 'http(s):// bilan boshlansin'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function save() {
    if (!validate()) return
    updateSettings(draft)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  function reset() {
    if (window.confirm("Sozlamalarni standart holatga qaytarish? Joriy o'zgarishlar yo'qoladi.")) {
      resetSettings()
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-navy">Sayt sozlamalari</h2>
          <p className="text-sm text-brand-muted">Logo, agentlik nomi va aloqa ma'lumotlarini boshqaring.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-brand-navy text-sm font-semibold hover:border-brand-primary hover:text-brand-deep transition"><RotateCcw size={14} /> Standart holat</button>
          <button type="button" onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white text-sm font-semibold shadow-card hover:shadow-glow transition"><Save size={14} /> Saqlash</button>
        </div>
      </header>

      {saved && <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-sm">Saqlandi. O'zgarishlar saytda darhol ko'rinadi.</div>}

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 sm:p-6 grid sm:grid-cols-2 gap-5">
        <ImageUpload label="Sayt logosi" value={draft.logoUrl} onChange={(url) => setField('logoUrl', url)} onClear={() => setField('logoUrl', '')} helperText="PNG yoki SVG, <2MB. Header'da chiqadi." />
        <ImageUpload label="Footer logosi" value={draft.footerLogoUrl} onChange={(url) => setField('footerLogoUrl', url)} onClear={() => setField('footerLogoUrl', '')} helperText="Optional. Footer uchun alohida logo." />
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 sm:p-6 grid sm:grid-cols-2 gap-5">
        <Field label="Agentlik nomi" error={errors.agencyName}>
          <input className="form-input" value={draft.agencyName} onChange={(e) => setField('agencyName', e.target.value)} />
        </Field>
        <Field label="Qisqa tavsif">
          <input className="form-input" value={draft.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} />
        </Field>
        <Field label="Telefon" error={errors.phone}>
          <input className="form-input" value={draft.phone} onChange={(e) => setField('phone', e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className="form-input" type="email" value={draft.email} onChange={(e) => setField('email', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Manzil" error={errors.address}>
            <input className="form-input" value={draft.address} onChange={(e) => setField('address', e.target.value)} />
          </Field>
        </div>
        <Field label="Ish vaqti">
          <input className="form-input" value={draft.workingHours} onChange={(e) => setField('workingHours', e.target.value)} />
        </Field>
        <Field label="Rasmiy sayt linki" error={errors.officialSiteUrl}>
          <input className="form-input" value={draft.officialSiteUrl} onChange={(e) => setField('officialSiteUrl', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Rasmiy yangiliklar URL" error={errors.officialNewsUrl}>
            <input className="form-input" value={draft.officialNewsUrl} onChange={(e) => setField('officialNewsUrl', e.target.value)} />
          </Field>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="text-sm">
      <label className="block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">{label}</label>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
