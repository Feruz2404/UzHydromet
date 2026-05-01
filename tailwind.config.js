/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          navy: '#0A2740',
          deep: '#0B4F7D',
          primary: '#0F6FA6',
          sky: '#38BDF8',
          cyan: '#22C7F0',
          ice: '#E0F2FE',
          mist: '#F4FAFD',
          ink: '#0F172A',
          muted: '#5B6B7A'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(11,79,125,0.18)',
        glow: '0 20px 60px -20px rgba(34,199,240,0.45)'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 20% 10%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(circle at 80% 0%, rgba(34,199,240,0.18), transparent 55%)',
        'weather-grad': 'linear-gradient(135deg, #0A2740 0%, #0B4F7D 45%, #0F6FA6 100%)'
      }
    }
  },
  plugins: []
}
