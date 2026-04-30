import { CloudSun } from 'lucide-react'
import { agency } from '../data/defaultContent'

export function Footer() {
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
            Hydrometeorological Service Agency of the Republic of Uzbekistan.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#weather" className="hover:text-white">Weather</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#leadership" className="hover:text-white">Leadership</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>{agency.address}</li>
            <li>{agency.phone}</li>
            <li>{agency.email}</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Admin</div>
          <p className="mt-3 text-sm text-white/70">An admin panel for content management will be available soon.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-white/60 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>&copy; 2026 Hydrometeorological Service Agency of the Republic of Uzbekistan. All rights reserved.</div>
          <div>{agency.workingHours}</div>
        </div>
      </div>
    </footer>
  )
}

