/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",      // indigo-600 — main brand
        primaryDark: "#3730A3",  // indigo-800 — hover states
        accent: "#F59E0B",       // amber-500 — festival/ticket accent
        accentDark: "#B45309",
        ink: "#0F172A"           // near-black for dark navbar/hero
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      backgroundImage: {
        "fest-gradient": "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #F59E0B 150%)"
      }
    }
  },
  plugins: []
};