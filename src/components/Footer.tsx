import { Phone, Mail, MapPin, Globe } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../store/contentStore'

export function Footer() {
  const { lang, t } = useLanguage()
  const { content } = useContent()
  const c = content.contact
  const year = new Date().getFullYear()
  return (
    <footer className="bg-brand-800 text-white">
      <div className="container-page py-12 grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-bold">U</span>
            <span className="font-semibold text-lg tracking-tight">{t('app.shortName', 'UzGidromet')}</span>
          </div>
          <p className="mt-3 text-sm text-white/75 max-w-md leading-relaxed">{content.footer.description[lang]}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">{t('footer.contactTitle', 'Contact')}</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> <span>{c.address}</span></li>
            <li className="flex items-center gap-2"><Phone size={14} /> <span>{c.phone}</span></li>
            <li className="flex items-center gap-2"><Mail size={14} /> <span>{c.email}</span></li>
            <li className="flex items-center gap-2"><Globe size={14} /> <span>{c.website}</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">{t('footer.linksTitle', 'Quick links')}</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li><a href="#about" className="hover:text-white">{t('nav.about', 'About')}</a></li>
            <li><a href="#services" className="hover:text-white">{t('nav.services', 'Services')}</a></li>
            <li><a href="#leadership" className="hover:text-white">{t('nav.leadership', 'Leadership')}</a></li>
            <li><a href="#news" className="hover:text-white">{t('nav.news', 'News')}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
          <span>\u00A9 {year} {t('footer.copy', 'Hydrometeorological Service Agency of the Republic of Uzbekistan')}</span>
          <span>{c.workingHours[lang]}</span>
        </div>
      </div>
    </footer>
  )
}
