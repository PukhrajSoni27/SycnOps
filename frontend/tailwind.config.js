/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5',
          600: '#3949AB',
          700: '#303F9F',
          800: '#283593',
          900: '#1A237E',
        },
        secondary: {
          50: '#F5F0E6',
          100: '#E8E2D5',
          200: '#D4C9B5',
          300: '#C0B095',
          400: '#AC9775',
          500: '#987E55',
          600: '#846535',
          700: '#704C15',
          800: '#5C3300',
          900: '#481A00',
        }
      }
    },
  },
  plugins: [],
}
