/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aurelion — Frieren: Beyond Journey's End palette
        // Cool midnight blue, moon-silver, ancient amber, twilight slate
        blades: {
          // Backgrounds — deep twilight sky, Frieren's misty world
          bg:           '#0c0e1a',   // midnight slate-blue
          surface:      '#111428',   // deep twilight navy
          card:         '#181d32',   // indigo-charcoal
          // Borders — blue-slate, like ancient stonework
          border:       '#262c4a',   // slate border
          'border-light': '#44487a', // medium violet-slate
          // Text — moonlight and parchment
          text:         '#dde0f0',   // cool moonlight silver-white
          muted:        '#7880a0',   // lavender-gray dust
          // Gold / Amber — ancient rune magic, campfire warmth
          gold:         '#c4a865',   // ancient amber rune-gold
          'gold-dim':   '#6a5828',   // dark amber
          'gold-light': '#e0ca70',   // bright rune-gold
          // Red / Danger
          red:          '#5e1e28',   // dark crimson
          'red-light':  '#c04050',   // bright crimson
          // Blues — Frieren's world (replaces greens)
          forest:       '#1c2e5a',   // deep dusk-blue
          sage:         '#3c5a9a',   // muted cornflower-blue
          'sage-light': '#8090c0',   // periwinkle mist
          // Night mist
          mist:         '#3a4a78',   // night-mist blue
          'mist-light': '#6478b0',   // twilight blue
          // Stone & parchment — touched by moonlight
          parchment:    '#c0bed8',   // moon-parchment
          stone:        '#585878',   // blue-stone
          'stone-light': '#8888a8',  // light moon-stone
          // Silver — Frieren's signature
          silver:       '#c8cce8',   // Frieren's silver-hair light
          'silver-dim': '#787898',   // muted moonsilver
          // Compat palette — shifted to cooler tones
          allied:       '#1c3a60',
          friendly:     '#2a5090',
          hostile:      '#7a3820',
          war:          '#6e1020',
          spark:        '#2a3c7a',
          'spark-light': '#6474b8',
          occult:       '#4a2a7a',   // Frieren's ancient magic — deep purple
          'occult-light': '#a090d8',
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
