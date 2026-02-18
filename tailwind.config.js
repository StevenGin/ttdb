/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lancer cyberpunk palette
        lancer: {
          red: '#c62828',
          'red-light': '#ef5350',
          orange: '#e65100',
          yellow: '#f9a825',
          bg: '#0a0a0f',
          surface: '#111118',
          card: '#16161f',
          border: '#2a2a3a',
          'border-light': '#3a3a4a',
          text: '#d0d0e0',
          muted: '#6a6a8a',
          accent: '#00e5ff',
          'accent-dim': '#0097a7',
          'gm-purple': '#7b1fa2',
          'gm-purple-light': '#ce93d8',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        sans: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        display: ['"Rajdhani"', '"Impact"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-lancer':
          'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
