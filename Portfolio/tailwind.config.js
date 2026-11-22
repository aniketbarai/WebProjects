/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: { xs: '480px' },
      fontFamily: {
        display: ['Space Grotesk Variable', 'Arial', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        body: ['Inter Variable', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'monospace'],
      },
    },
  },
  plugins: [],
};
