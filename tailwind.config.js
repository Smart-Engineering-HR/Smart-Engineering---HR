/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        // تمت إضافة ألوان الزمرد (Emerald) لدعم زر الإرسال الاحترافي
        emerald: {
          600: "#059669",
          700: "#047857",
          800: "#065f46",
        },
      },
    },
  },
  plugins: [],
}