/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Headline voice - reserved for hero-scale type (the hero H1 and the
        // oversized footer wordmark). Resolved through --font-headline in
        // index.css so the family is swappable from one place rather than
        // from every className that happens to use it.
        headline: ['var(--font-headline)'],
        // Also resolved through a CSS variable now, so `font-display` and
        // `font-headline` are retuned from index.css rather than from here.
        display: ['var(--font-display)'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Palette sampled from the portrait via k-means (see README).
        // #0B080C was 33% of the frame, #741B3A the maroon shirt, #EDC0AE the
        // warm highlight. The accent is lifted off the shirt because #741B3A
        // is too low-chroma to carry buttons and focus rings on near-black.

        // Foreground (text) - dark-first, so `fg` is light
        fg: '#F2ECEE',
        'fg-70': 'rgba(242,236,238,0.72)',
        'fg-45': 'rgba(242,236,238,0.50)',
        'fg-25': 'rgba(242,236,238,0.30)',
        bone: '#F5F0F2',

        // Surfaces
        surface: '#18121A',
        'surface-warm': '#120E14',
        line: 'rgba(242,236,238,0.10)',
        'line-strong': 'rgba(242,236,238,0.20)',

        coal: {
          950: '#08060A',
          900: '#0B080C',
          800: '#18121A',
          700: '#241C27',
          600: '#332A38',
        },

        // Primary accent - between crimson and signal red (hue 356)
        crimson: {
          light: '#F4737B', // accent TEXT on dark (AA at ~7:1)
          DEFAULT: '#DF3640', // borders, glows, indicators
          dark: '#96202B', // fills that carry `bone` text
        },

        // Secondary accent - the portrait's warm highlight
        steel: {
          light: '#F3D4C6',
          DEFAULT: '#EDC0AE',
          dark: '#B98974',
        },

        // Premium accent - reserved for hairline dividers and small "expensive"
        // details (ticker rails, footer seam). Used sparingly, never as a fill.
        gold: {
          light: '#F1DFA0',
          DEFAULT: '#D4AF37',
          dark: '#9C7A22',
        },
      },
      maxWidth: { content: '75rem' },
      // Retuned for Fraunces. The old values (-0.045em / -0.06em) were measured
      // against Space Grotesk, a geometric sans whose flat sidebearings tolerate
      // being pulled hard. A serif does not: its serifs *are* the sidebearing,
      // so the same negative tracking makes adjacent letters grow into each
      // other rather than simply sit closer.
      //
      // The wordmark still tracks tighter than section headings, because at
      // 15vw optical spacing genuinely does open up - just from a looser
      // starting point than a sans would need.
      letterSpacing: { tightest: '-0.015em', wordmark: '-0.03em' },
      boxShadow: {
        card: '0 1px 0 rgba(0,0,0,0.4), 0 16px 34px -18px rgba(0,0,0,0.75)',
        'card-hover': '0 1px 0 rgba(0,0,0,0.5), 0 26px 46px -18px rgba(0,0,0,0.85)',
        panel: '0 40px 80px -30px rgba(0,0,0,0.9)',
        glow: '0 0 0 1px rgba(223,54,64,0.30), 0 20px 60px -15px rgba(223,54,64,0.40)',
        // Work-card hover. Keeps the neutral depth shadow underneath and adds a
        // gold hairline plus a wide, low-opacity bloom, so the card reads as lit
        // rather than outlined. Gold not crimson: crimson is reserved for CTAs,
        // and a card that glows the same colour as the buttons implies it is one.
        'card-glow':
          '0 1px 0 rgba(0,0,0,0.5), 0 26px 46px -18px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.30), 0 22px 70px -22px rgba(212,175,55,0.38)',
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        blink: 'blink 1.1s step-end infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
};