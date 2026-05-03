import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export function BackToTop() {
  const [show, setShow] = useState<boolean>(false)
  const { t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!show) return null
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#006BA6] text-white shadow-lg hover:bg-[#003B5C] transition flex items-center justify-center"
      aria-label={t('common.backToTop')}
    >
      <ArrowUp size={16} className="sm:hidden" />
      <ArrowUp size={18} className="hidden sm:block" />
    </button>
  )
}
