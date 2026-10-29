/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030d0b',
          surface: '#061814',
          emerald: '#10b981',
          neon: '#34d399',
          teal: '#2dd4bf',
          glow: '#059669',
          border: 'rgba(52, 211, 153, 0.18)',
          glass: 'rgba(6, 24, 20, 0.78)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(52, 211, 153, 0.25)',
        'glow-md': '0 0 30px rgba(52, 211, 153, 0.35)',
        'glow-lg': '0 0 50px rgba(16, 185, 129, 0.45)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'ripple-wave': 'ripple-wave 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'ripple-wave': {
          '0%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(3.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
