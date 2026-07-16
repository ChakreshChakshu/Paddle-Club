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
        // Brand specific color palettes
        'palm-leaf': {
          50: '#f5f5ef',
          100: '#ebecdf',
          200: '#d7d9bf',
          300: '#c3c69f',
          400: '#afb380',
          500: '#9b9f60',
          600: '#7c804d',
          700: '#5d6039',
          800: '#3e4026',
          900: '#1f2013',
          950: '#16160d',
        },
        'silver': {
          50: '#f4f2f1',
          100: '#e8e5e3',
          200: '#d1cbc7',
          300: '#bab2ab',
          400: '#a3988f',
          500: '#8c7e73',
          600: '#70655c',
          700: '#544c45',
          800: '#38322e',
          900: '#1c1917',
          950: '#141210',
        },
        'olive-black': {
          50: '#f6f6ee',
          100: '#eeeedd',
          200: '#ddddbb',
          300: '#cccc99',
          400: '#bbbb77',
          500: '#aaaa55',
          600: '#888844',
          700: '#666633',
          800: '#444422',
          900: '#222211',
          950: '#18180c',
        },
        'neon-yellow': {
          50: '#ffffe5',
          100: '#ffffcc',
          200: '#ffff99',
          300: '#ffff66',
          400: '#ffff33',
          500: '#ffff00',
          600: '#cccc00',
          700: '#999900',
          800: '#666600',
          900: '#333300',
          950: '#242400',
        },
        // Aesthetic sports court and cafe branding colors mapped to the new palette
        brand: {
          court: {
            DEFAULT: '#9b9f60', // Palm Leaf 500
            light: '#c3c69f',   // Palm Leaf 300
            dark: '#5d6039',    // Palm Leaf 700
            lime: '#ffff33',    // Neon Yellow 400 (for pickleball ball accent)
          },
          cafe: {
            DEFAULT: '#8c7e73', // Silver 500
            light: '#bab2ab',   // Silver 300
            dark: '#544c45',    // Silver 700
            background: '#f6f6ee' // Olive Black 50 (warm background)
          },
          dark: {
            DEFAULT: '#18180c', // Olive Black 950
            card: '#222211',    // Olive Black 900
            border: '#444422'   // Olive Black 800
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Outfit', 'sans-serif']
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
