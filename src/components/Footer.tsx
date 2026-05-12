import { Cloud, Mail, MapPin, Phone, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'
import { useAdmin } from '../context/AdminContext'

export function Footer() {
  const { t } = useLanguage()
  const { settings } = useAdmin()
  const phone = settings?.phone || agency.phone
  const email = settings?.email || agency.email
  const address = settings?.address || agency.address

  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={t('brand.short')}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
              />
            ) : (
              <span className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
                <Cloud size={20} />
              </span>
            )}
            <div>
              <div className="font-display font-extrabold text-lg">{t('brand.short')}</div>
              <div className="text-[11px] text-white/60">{t('brand.tagline')}</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">{t('footer.tagline')}</p>
        </div>

        <div>
          <div className="text-sm font-semibold text-white/85">{t('footer.quickLinks')}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <a href="#about" className="hover:text-white">
                {t('nav.about')}
              </a>
            </li>
            <li>
              <a href="#weather" className="hover:text-white">
                {t('nav.weather')}
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-white">
                {t('nav.services')}
              </a>
            </li>
            <li>
              <a href="#leadership" className="hover:text-white">
                {t('nav.leadership')}
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white">
                {t('nav.reception')}
              </a>
            </li>
            <li>
              <a href="#location" className="hover:text-white">
                {t('nav.location')}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-white/85">{t('footer.contact')}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-brand-sky" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brand-sky" />
              <a href={`tel:${phone}`} className="hover:text-white">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brand-sky" />
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </li>
          </ul>
          <div className="mt-5">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-xs font-semibold text-white/80 hover:bg-white/15 transition"
            >
              <Lock size={12} />
              {t('footer.admin')}
            </Link>
            <p className="mt-2 text-[11px] text-white/55 max-w-xs">{t('footer.adminText')}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-white/55">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
