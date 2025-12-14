/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1C7ED6',
          dark: '#0C4A6E'
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 14px 45px rgba(17, 24, 39, 0.08)'
      }
    },
  },
  plugins: [],
}
