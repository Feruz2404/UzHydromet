import { useEffect, useState } from 'react'

const listenerOptions: AddEventListenerOptions = { passive: true }

export function useScrollSpy(ids: string[], offset: number = 100): string {
  const initial = ids.length > 0 ? ids[0] : ''
  const [active, setActive] = useState<string>(initial)
  const idsKey = ids.join('|')
  useEffect(() => {
    function onScroll(): void {
      const y = window.scrollY + offset
      let current = ids.length > 0 ? ids[0] : ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, listenerOptions)
    return () => window.removeEventListener('scroll', onScroll)
  }, [idsKey, offset])
  return active
}
