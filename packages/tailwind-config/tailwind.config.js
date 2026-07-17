/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand specific color palettes
        'palm-leaf': {
          50: 'rgb(var(--color-cafe-bg) / <alpha-value>)',
          100: '#ebecdf',
          200: '#d7d9bf',
          300: 'rgb(var(--color-court-light) / <alpha-value>)',
          400: '#afb380',
          500: 'rgb(var(--color-court) / <alpha-value>)',
          600: '#7c804d',
          700: 'rgb(var(--color-court-dark) / <alpha-value>)',
          800: '#3e4026',
          900: '#1f2013',
          950: '#16160d',
        },
        'silver': {
          50: '#f4f2f1',
          100: '#e8e5e3',
          200: '#d1cbc7',
          300: 'rgb(var(--color-cafe-light) / <alpha-value>)',
          400: '#a3988f',
          500: 'rgb(var(--color-cafe) / <alpha-value>)',
          600: '#70655c',
          700: 'rgb(var(--color-cafe-dark) / <alpha-value>)',
          800: '#38322e',
          900: '#1c1917',
          950: '#141210',
        },
        'olive-black': {
          50: 'rgb(var(--color-cafe-bg) / <alpha-value>)',
          100: '#eeeedd',
          200: '#ddddbb',
          300: '#cccc99',
          400: '#bbbb77',
          500: '#aaaa55',
          600: '#888844',
          700: '#666633',
          800: 'rgb(var(--color-dark-border) / <alpha-value>)',
          900: 'rgb(var(--color-dark-card) / <alpha-value>)',
          950: 'rgb(var(--color-dark) / <alpha-value>)',
        },
        'neon-yellow': {
          50: '#ffffe5',
          100: '#ffffcc',
          200: '#ffff99',
          300: '#ffff66',
          400: 'rgb(var(--color-court-lime) / <alpha-value>)',
          500: '#ffff00',
          600: '#cccc00',
          700: '#999900',
          800: '#666600',
          900: '#333300',
          950: '#242400',
        },
        // Brand colors mapped to CSS variables
        brand: {
          court: {
            DEFAULT: 'rgb(var(--color-court) / <alpha-value>)',
            light: 'rgb(var(--color-court-light) / <alpha-value>)',
            dark: 'rgb(var(--color-court-dark) / <alpha-value>)',
            lime: 'rgb(var(--color-court-lime) / <alpha-value>)',
          },
          cafe: {
            DEFAULT: 'rgb(var(--color-cafe) / <alpha-value>)',
            light: 'rgb(var(--color-cafe-light) / <alpha-value>)',
            dark: 'rgb(var(--color-cafe-dark) / <alpha-value>)',
            background: 'rgb(var(--color-cafe-bg) / <alpha-value>)',
          },
          dark: {
            DEFAULT: 'rgb(var(--color-dark) / <alpha-value>)',
            card: 'rgb(var(--color-dark-card) / <alpha-value>)',
            border: 'rgb(var(--color-dark-border) / <alpha-value>)',
          },
        },
        // Accent colors mapped to CSS variables
        lime: {
          DEFAULT: 'rgb(var(--color-lime) / <alpha-value>)',
          light: 'rgb(var(--color-lime-light) / <alpha-value>)',
        },
        sky: {
          DEFAULT: 'rgb(var(--color-sky) / <alpha-value>)',
          light: 'rgb(var(--color-sky-light) / <alpha-value>)',
        },
        rose: {
          DEFAULT: 'rgb(var(--color-rose) / <alpha-value>)',
          light: 'rgb(var(--color-rose-light) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)',
          light: 'rgb(var(--color-amber-light) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'rgb(var(--color-blue) / <alpha-value>)',
          light: 'rgb(var(--color-blue-light) / <alpha-value>)',
        },
        neutral: {
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
          950: 'rgb(var(--color-neutral-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Outfit', 'sans-serif']
      },
      fontSize: {
        micro: ['var(--fs-micro)', { lineHeight: 'var(--lh-micro)' }],
        label: ['var(--fs-label)', { lineHeight: 'var(--lh-label)' }],
        caption: ['var(--fs-caption)', { lineHeight: 'var(--lh-caption)' }]
      },
      letterSpacing: {
        tight: 'var(--ls-tight)',
        normal: 'var(--ls-normal)',
        wide: 'var(--ls-wide)',
        caps: 'var(--ls-caps)',
        eyebrow: 'var(--ls-eyebrow)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
