import { useState } from 'react'
import { Menu, X, CloudSun } from 'lucide-react'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'weather', label: 'Weather' },
  { id: 'services', label: 'Services' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'reception', label: 'Reception' },
  { id: 'location', label: 'Location' },
  { id: 'contact', label: 'Contact' }
]

export function Header() {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006BA6] to-[#003B5C] flex items-center justify-center text-white">
            <CloudSun size={20} />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[#003B5C]">UzGidromet</span>
            <span className="block text-xs text-slate-500">O&apos;zgidromet</span>
          </span>
        </a>
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="text-sm text-slate-600 hover:text-[#006BA6] transition">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 border border-slate-200 rounded-full px-1 py-0.5">
            <button className="px-2 py-0.5 rounded-full bg-[#006BA6] text-white">EN</button>
            <button className="px-2 py-0.5 rounded-full hover:bg-slate-100">RU</button>
            <button className="px-2 py-0.5 rounded-full hover:bg-slate-100">UZ</button>
          </div>
          <a href="#contact" className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-[#006BA6] text-white text-sm font-medium hover:bg-[#003B5C] transition">
            Contact
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-slate-700"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="px-2 py-2 rounded text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

