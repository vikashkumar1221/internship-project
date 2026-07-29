/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          darker: '#090a0f',
          dark: '#0f111a',
          card: '#161926',
          panel: '#1e2235',
          border: '#2a2f45',
          accent: '#6366f1', // Indigo
          neonPink: '#ec4899',
          neonCyan: '#06b6d4',
          neonGreen: '#10b981',
          gold: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s infinite alternate',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
