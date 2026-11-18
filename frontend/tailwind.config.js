/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          950: '#0f0a07',
          900: '#1a110b',
          800: '#2b1d14',
          700: '#3e2a1d',
        },
        crema: {
          400: '#d4a373',
          500: '#c88a4b',
          600: '#a96d32',
        }
      }
    },
  },
  plugins: [],
}

