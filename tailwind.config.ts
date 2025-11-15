import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#10b981',
      }
    }
  },
  plugins: [],
} satisfies Config
