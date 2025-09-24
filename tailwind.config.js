/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // ✅ App Router
    "./lib/**/*.{js,ts,jsx,tsx}", // ✅ If lib/ exists
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

