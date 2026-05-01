import { CloudSun } from 'lucide-react'
import { agency } from '../data/defaultContent'
import { useLanguage } from '../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-[#003B5C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <CloudSun size={20} />
            </span>
            <div className="font-semibold">UzGidromet</div>
          </div>
          <p className="mt-3 text-sm text-white/70">
            {t('footer.tagline')}
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">{t('footer.quickLinks')}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><a href="#about" className="hover:text-white">{t('nav.about')}</a></li>
            <li><a href="#weather" className="hover:text-white">{t('nav.weather')}</a></li>
            <li><a href="#services" className="hover:text-white">{t('nav.services')}</a></li>
            <li><a href="#leadership" className="hover:text-white">{t('nav.leadership')}</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">{t('footer.contact')}</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>{agency.address}</li>
            <li>{agency.phone}</li>
            <li>{agency.email}</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">{t('footer.admin')}</div>
          <p className="mt-3 text-sm text-white/70">{t('footer.adminText')}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-white/60 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>{t('footer.copyright')}</div>
          <div>{agency.workingHours}</div>
        </div>
      </div>
    </footer>
  )
}
