/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          500: '#4f6ef7',
          600: '#3b55e6',
          700: '#2d44d4',
          900: '#1a2b8c',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        resume: ['Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        paper: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.10)',
        float: '0 4px 24px rgba(79,110,247,0.18)',
      },
    },
  },
  plugins: [],
}
