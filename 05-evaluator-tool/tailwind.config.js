/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          'blue-dark': '#1557b0',
          green: '#34a853',
          red: '#ea4335',
          yellow: '#fbbc04',
          gray: '#5f6368',
          'gray-light': '#f8f9fa',
          'gray-border': '#dadce0',
        },
      },
    },
  },
  plugins: [],
}
