/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blades in the Dark — gas-lamp gothic palette
        blades: {
          bg:           '#0c0b12',
          surface:      '#111020',
          card:         '#17162a',
          border:       '#2e2b45',
          'border-light': '#423e5e',
          text:         '#ccc8e8',
          muted:        '#6a6480',
          gold:         '#c9a84c',
          'gold-dim':   '#8a6e2a',
          'gold-light': '#e8c96a',
          red:          '#7c1b1b',
          'red-light':  '#ef4444',
          allied:       '#14532d',
          friendly:     '#15803d',
          hostile:      '#92400e',
          war:          '#7f1d1d',
          spark:        '#1e3a6e',
          'spark-light': '#93c5fd',
          occult:       '#4c1d95',
          'occult-light': '#c4b5fd',
        },
      },
      fontFamily: {
        serif:   ['"Playfair Display"', '"Georgia"', 'serif'],
        sans:    ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        mono:    ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        display: ['"Cinzel"', '"Trajan Pro"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '48%':  { opacity: '1' },
          '50%':  { opacity: '0.8' },
          '52%':  { opacity: '1' },
          '78%':  { opacity: '1' },
          '80%':  { opacity: '0.85' },
          '82%':  { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
