/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Mona Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'dark-200': '#475467',
        'light-blue-100': '#c1d3f81a',
        'light-blue-200': '#a7bff14d',
        'badge-green': '#d5faf1',
        'badge-red': '#f9e3e2',
        'badge-yellow': '#fceed8',
        'badge-green-text': '#254d4a',
        'badge-red-text': '#752522',
        'badge-yellow-text': '#73321b',
      },
      boxShadow: {
        'inset-custom': 'inset 0 0 12px 0 rgba(36, 99, 235, 0.2)',
      },
    },
  },
  plugins: [],
};