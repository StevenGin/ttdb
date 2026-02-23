/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aurelion — Frieren: Beyond Journey's End palette
        // All colors reference CSS variables so dark/light themes work.
        // Variables are defined in style.css under :root (dark) and [data-theme="light"].
        blades: {
          bg:             'rgb(var(--c-blades-bg)           / <alpha-value>)',
          surface:        'rgb(var(--c-blades-surface)      / <alpha-value>)',
          card:           'rgb(var(--c-blades-card)         / <alpha-value>)',
          border:         'rgb(var(--c-blades-border)       / <alpha-value>)',
          'border-light': 'rgb(var(--c-blades-border-light) / <alpha-value>)',
          text:           'rgb(var(--c-blades-text)         / <alpha-value>)',
          muted:          'rgb(var(--c-blades-muted)        / <alpha-value>)',
          gold:           'rgb(var(--c-blades-gold)         / <alpha-value>)',
          'gold-dim':     'rgb(var(--c-blades-gold-dim)     / <alpha-value>)',
          'gold-light':   'rgb(var(--c-blades-gold-light)   / <alpha-value>)',
          red:            'rgb(var(--c-blades-red)          / <alpha-value>)',
          'red-light':    'rgb(var(--c-blades-red-light)    / <alpha-value>)',
          forest:         'rgb(var(--c-blades-forest)       / <alpha-value>)',
          sage:           'rgb(var(--c-blades-sage)         / <alpha-value>)',
          'sage-light':   'rgb(var(--c-blades-sage-light)   / <alpha-value>)',
          mist:           'rgb(var(--c-blades-mist)         / <alpha-value>)',
          'mist-light':   'rgb(var(--c-blades-mist-light)   / <alpha-value>)',
          parchment:      'rgb(var(--c-blades-parchment)    / <alpha-value>)',
          stone:          'rgb(var(--c-blades-stone)        / <alpha-value>)',
          'stone-light':  'rgb(var(--c-blades-stone-light)  / <alpha-value>)',
          silver:         'rgb(var(--c-blades-silver)       / <alpha-value>)',
          'silver-dim':   'rgb(var(--c-blades-silver-dim)   / <alpha-value>)',
          allied:         'rgb(var(--c-blades-allied)       / <alpha-value>)',
          friendly:       'rgb(var(--c-blades-friendly)     / <alpha-value>)',
          hostile:        'rgb(var(--c-blades-hostile)      / <alpha-value>)',
          war:            'rgb(var(--c-blades-war)          / <alpha-value>)',
          spark:          'rgb(var(--c-blades-spark)        / <alpha-value>)',
          'spark-light':  'rgb(var(--c-blades-spark-light)  / <alpha-value>)',
          occult:         'rgb(var(--c-blades-occult)       / <alpha-value>)',
          'occult-light': 'rgb(var(--c-blades-occult-light) / <alpha-value>)',
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
        'flicker': 'flicker 8s ease-in-out infinite',
        'sway': 'sway 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '48%':  { opacity: '1' },
          '50%':  { opacity: '0.85' },
          '52%':  { opacity: '1' },
          '78%':  { opacity: '1' },
          '80%':  { opacity: '0.9' },
          '82%':  { opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%':      { transform: 'rotate(1deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
