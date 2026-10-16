/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          header: '#2e2623', // Dark espresso brown from image header
          headerHover: '#3b312d',
          tan: '#dcc5b2', // Warm tan / sand accent button & logo
          tanHover: '#cfb59f',
          bg: '#faf8f5', // Warm clean eggshell / off-white
          section: '#f3eee8', // Warm sand lower section
          surface: '#ffffff',
          card: '#ffffff',
          panel: '#f5f0ea',
          border: '#e6ded5',
          borderDark: '#d4c9bd',
          text: '#231f1d', // Deep warm charcoal text
          muted: '#736a64', // Warm muted gray
          darkBtn: '#2b2421', // Dark button from hero
          darkBtnHover: '#3a312d',
          success: '#10b981',
          warning: '#d97706',
          danger: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(43, 36, 33, 0.04), 0 1px 2px 0 rgba(43, 36, 33, 0.02)',
        card: '0 4px 6px -1px rgba(43, 36, 33, 0.05), 0 2px 4px -1px rgba(43, 36, 33, 0.03)',
        elevated: '0 10px 20px -3px rgba(43, 36, 33, 0.08), 0 4px 6px -2px rgba(43, 36, 33, 0.04)'
      }
    },
  },
  plugins: [],
}
