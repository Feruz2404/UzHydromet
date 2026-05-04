import { useState, type FormEvent } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const expected = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? 'admin'
    if (password === expected) {
      try { window.sessionStorage.setItem('uzhydromet:admin:auth', '1') } catch { /* ignore */ }
      onSuccess()
    } else {
      setError("Parol noto'g'ri")
    }
  }

  return (
    <div className="min-h-screen bg-brand-mist flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white border border-slate-100 shadow-card p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white flex items-center justify-center">
            <ShieldCheck size={18} />
          </span>
          <div>
            <div className="font-display font-extrabold text-brand-navy text-lg leading-tight">Admin panel</div>
            <div className="text-xs text-brand-muted">Kirish uchun parolni kiriting</div>
          </div>
        </div>
        <label htmlFor="admin-password" className="mt-6 block text-[11px] uppercase tracking-wider text-brand-muted font-semibold">Parol</label>
        <div className="mt-2 relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/20 transition"
          />
        </div>
        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
        <button type="submit" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep text-white font-semibold shadow-card hover:shadow-glow transition-all">Kirish</button>
        <p className="mt-4 text-[11px] text-brand-muted leading-relaxed">Parol <code>VITE_ADMIN_PASSWORD</code> env orqali sozlanadi. Standart qiymat <code>admin</code>.</p>
      </form>
    </div>
  )
}
