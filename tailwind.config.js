/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D17', // Deep dark blue background
        cardBg: '#151924', // Lighter dark card background
        primaryBlue: '#0052FF',
        primaryBlueHover: '#0043D2',
        successGreen: '#00C853',
        errorRed: '#FF3D00',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A4A8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
