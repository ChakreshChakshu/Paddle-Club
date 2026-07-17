/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ────────────────────────────────────────────────────────────
        // NEW PALETTE  (all Tailwind classes reference CSS vars so a
        // single globals.css change cascades everywhere)
        // ────────────────────────────────────────────────────────────

        // Explicit hex tokens — use when you need a literal value
        forest: {
          black:  '#010D00',   // #010D00  near-black — page bg
          deep:   '#05260A',   // #05260A  dark forest — card surfaces
          mid:    '#16261C',   // #16261C  mid forest  — primary accent
          sage:   '#7D8C82',   // #7D8C82  sage        — muted / secondary
          cream:  '#F2EBDC',   // #F2EBDC  warm cream  — text / light bg
        },

        // ── Brand tokens (resolved via CSS vars → updatable at runtime) ──
        brand: {
          court: {
            DEFAULT: 'rgb(var(--color-court) / <alpha-value>)',       // #16261C
            light:   'rgb(var(--color-court-light) / <alpha-value>)', // #7D8C82
            dark:    'rgb(var(--color-court-dark) / <alpha-value>)',   // #05260A
            lime:    'rgb(var(--color-court-lime) / <alpha-value>)',   // #7D8C82
          },
          cafe: {
            DEFAULT:    'rgb(var(--color-cafe) / <alpha-value>)',      // #7D8C82
            light:      'rgb(var(--color-cafe-light) / <alpha-value>)',
            dark:       'rgb(var(--color-cafe-dark) / <alpha-value>)', // #16261C
            background: 'rgb(var(--color-cafe-bg) / <alpha-value>)',   // #F2EBDC
          },
          dark: {
            DEFAULT: 'rgb(var(--color-dark) / <alpha-value>)',        // #010D00
            card:    'rgb(var(--color-dark-card) / <alpha-value>)',    // #05260A
            border:  'rgb(var(--color-dark-border) / <alpha-value>)',  // #16261C
          },
        },

        // ── Palette scale helpers ──
        'palm-leaf': {
          50:  'rgb(var(--color-cafe-bg) / <alpha-value>)',
          100: '#e8ede9',
          200: '#c9d6cb',
          300: 'rgb(var(--color-court-light) / <alpha-value>)',
          400: '#8fa697',
          500: 'rgb(var(--color-court) / <alpha-value>)',
          600: '#36503e',
          700: 'rgb(var(--color-court-dark) / <alpha-value>)',
          800: '#16261C',
          900: '#0b1810',
          950: '#010D00',
        },
        'silver': {
          50:  '#f4f3f1',
          100: '#e5e3df',
          200: '#cbc8c2',
          300: 'rgb(var(--color-cafe-light) / <alpha-value>)',
          400: '#9aa39c',
          500: 'rgb(var(--color-cafe) / <alpha-value>)',
          600: '#5f6e65',
          700: 'rgb(var(--color-cafe-dark) / <alpha-value>)',
          800: '#1e2b22',
          900: '#101710',
          950: '#010D00',
        },
        'olive-black': {
          50:  'rgb(var(--color-cafe-bg) / <alpha-value>)',
          100: '#e4ebe5',
          200: '#bccfbf',
          300: '#7D8C82',
          400: '#4a5e51',
          500: '#16261C',
          600: '#0f1e15',
          700: '#09150e',
          800: 'rgb(var(--color-dark-border) / <alpha-value>)',
          900: 'rgb(var(--color-dark-card) / <alpha-value>)',
          950: 'rgb(var(--color-dark) / <alpha-value>)',
        },

        // Accent colours
        lime: {
          DEFAULT: 'rgb(var(--color-lime) / <alpha-value>)',
          light:   'rgb(var(--color-lime-light) / <alpha-value>)',
        },
        sky: {
          DEFAULT: 'rgb(var(--color-sky) / <alpha-value>)',
          light:   'rgb(var(--color-sky-light) / <alpha-value>)',
        },
        rose: {
          DEFAULT: 'rgb(var(--color-rose) / <alpha-value>)',
          light:   'rgb(var(--color-rose-light) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)',
          light:   'rgb(var(--color-amber-light) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'rgb(var(--color-blue) / <alpha-value>)',
          light:   'rgb(var(--color-blue-light) / <alpha-value>)',
        },
        neutral: {
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
          950: 'rgb(var(--color-neutral-950) / <alpha-value>)',
        },
      },

      fontFamily: {
        sans:    ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Outfit', 'sans-serif'],
      },

      fontSize: {
        micro:   ['var(--fs-micro)',   { lineHeight: 'var(--lh-micro)' }],
        label:   ['var(--fs-label)',   { lineHeight: 'var(--lh-label)' }],
        caption: ['var(--fs-caption)', { lineHeight: 'var(--lh-caption)' }],
      },

      letterSpacing: {
        tight:   'var(--ls-tight)',
        normal:  'var(--ls-normal)',
        wide:    'var(--ls-wide)',
        caps:    'var(--ls-caps)',
        eyebrow: 'var(--ls-eyebrow)',
      },

      animation: {
        'fade-in':  'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
