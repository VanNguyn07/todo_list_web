/** @type {import('tailwindcss').Config} */
export default {
  important: '#admin-app',
  content: [
    "./index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-hover': '#1d4ed8',
        secondary: '#f3f4f6',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  corePlugins: {
    preflight: false, // Vẫn tắt preflight 
  },
  plugins: [],
}