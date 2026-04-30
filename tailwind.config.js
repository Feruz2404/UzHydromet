/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F9FD',
          100: '#E1EEF8',
          200: '#BFDCEF',
          300: '#8EC4E2',
          400: '#4FA5D2',
          500: '#006BA6',
          600: '#005A8B',
          700: '#004870',
          800: '#003B5C',
          900: '#002A42'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        card: '0 4px 12px rgba(0,107,166,0.06), 0 16px 48px rgba(0,107,166,0.08)'
      }
    }
  },
  plugins: []
}
