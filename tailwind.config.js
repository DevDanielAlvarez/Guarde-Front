/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A84FF',
          dark: '#409CFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F5F7FA',
        },
        hairline: '#E3ECFB',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
};
