import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const listenerOptions: AddEventListenerOptions = { passive: true }
const scrollOptions: ScrollToOptions = { top: 0, behavior: 'smooth' }

export function BackToTop() {
  const [visible, setVisible] = useState<boolean>(false)
  useEffect(() => {
    function onScroll(): void { setVisible(window.scrollY > 400) }
    onScroll()
    window.addEventListener('scroll', onScroll, listenerOptions)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  function scrollTop(): void { window.scrollTo(scrollOptions) }
  if (!visible) return null
  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg w-12 h-12 flex items-center justify-center transition"
    >
      <ArrowUp size={20} />
    </button>
  )
}
