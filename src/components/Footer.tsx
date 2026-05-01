import { CloudSun, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="relative bg-gradient-to-br from-brand-navy via-brand-deep to-brand-navy text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-brand-sky/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-brand-cyan/10 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14 grid md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-brand-sky">
              <CloudSun size={22} />
            </span>
            <div className="min-w-0">
              <div className="font-display font-extrabold text-lg leading-tight truncate">{t('brand.short')}</div>
              <div className="text-[11px] text-white/70 truncate">{t('brand.tagline')}</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-sm">{t('footer.tagline')}</p>
        </div>

        <div className="md:col-span-3">
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/60">{t('footer.quickLinks')}</div>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li><a href="#about" className="hover:text-brand-sky transition">{t('nav.about')}</a></li>
            <li><a href="#weather" className="hover:text-brand-sky transition">{t('nav.weather')}</a></li>
            <li><a href="#services" className="hover:text-brand-sky transition">{t('nav.services')}</a></li>
            <li><a href="#leadership" className="hover:text-brand-sky transition">{t('nav.leadership')}</a></li>
            <li><a href="#reception" className="hover:text-brand-sky transition">{t('nav.reception')}</a></li>
          </ul>
        </div>

        <div className="md:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/60">{t('footer.contact')}</div>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 text-brand-sky flex-shrink-0" />
              <span className="break-words">{agency.address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 text-brand-sky flex-shrink-0" />
              <span className="break-words">{agency.phone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 text-brand-sky flex-shrink-0" />
              <span className="break-all">{agency.email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={16} className="mt-0.5 text-brand-sky flex-shrink-0" />
              <span>{t('agency.workingHours')}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-white/60 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>{t('footer.copyright')}</div>
          <div className="text-white/55">{t('footer.admin')}: {t('footer.adminText')}</div>
        </div>
      </div>
    </footer>
  )
}
