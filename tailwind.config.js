/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'geist': ['var(--font-geist-sans)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#f26e0c',
          hover: '#d45e05',
        },
        dark: {
          bg: '#121212',
          surface: '#1a1a1a',
          border: '#333333',
          text: '#ffffff',
          'text-secondary': '#ffffff94',
          'text-muted': '#ffffff60',
        }
      }
    },
  },
  plugins: [],
}
