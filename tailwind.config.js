/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aurelion — Studio Ghibli / Frieren / Dungeonmeshi palette
        // Warm earthy tones, forest greens, parchment, ancient stone
        blades: {
          // Backgrounds
          bg:           '#0e1410',   // deep forest dark
          surface:      '#141d18',   // dark moss
          card:         '#1b2720',   // warm stone-green
          // Borders
          border:       '#2c3d32',   // mossy green
          'border-light': '#456050', // sage-moss
          // Text
          text:         '#e2d9c8',   // warm parchment-cream
          muted:        '#8a8a78',   // warm taupe-grey
          // Gold / Amber
          gold:         '#c9a84c',   // warm amber (kept)
          'gold-dim':   '#7a6428',   // dark amber
          'gold-light': '#e0c060',   // bright amber
          // Red / Danger
          red:          '#5e2218',   // deep rust
          'red-light':  '#c0522a',   // warm rust-orange
          // Greens (nature)
          forest:       '#2a5c3e',   // deep forest
          sage:         '#5f8a60',   // sage green
          'sage-light': '#8fb880',   // light sage
          // Blues (sky, mist)
          mist:         '#3a6478',   // misty blue
          'mist-light': '#6ea8be',   // light mist
          // Earth tones
          parchment:    '#c9b490',   // aged parchment
          stone:        '#6e6055',   // dark stone
          'stone-light': '#a09080',  // light stone
          // Old palette compat
          allied:       '#2a5c3e',
          friendly:     '#3a7a50',
          hostile:      '#7a4a20',
          war:          '#6e2010',
          spark:        '#2a4e6a',
          'spark-light': '#6ea8be',
          occult:       '#5a3a7a',
          'occult-light': '#b0a0d8',
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
