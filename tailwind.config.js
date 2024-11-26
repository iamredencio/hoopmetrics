/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nba-blue': '#1D428A',
        'nba-red': '#C8102E',
        'stats-dark': '#1a1a2e',
        'stats-darker': '#151515',
        'nba-gold': '#FFD700',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}