/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // 'class' (instead of 'media') lets the user override the system theme manually —
  // see src/components/theme-toggle.tsx.
  darkMode: 'class',
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
