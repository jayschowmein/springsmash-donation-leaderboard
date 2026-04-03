/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bubble: ["Fredoka", "system-ui", "sans-serif"],
        display: ["Fredoka", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"]
      },
      colors: {
        jungle: {
          950: "#051e12",
          900: "#0a2918",
          800: "#0f3d1f",
          700: "#145528",
          600: "#1a6b32",
          500: "#22a03d",
          400: "#4ade80",
          orange: "#f97316",
          "orange-dark": "#ea580c",
          "orange-light": "#fb923c"
        }
      },
      boxShadow: {
        "soft-card": "0 12px 32px rgba(0,0,0,0.4)",
        "bubble-text": "0 3px 0 0 #c2410c, 0 5px 8px rgba(0,0,0,0.35)",
        "bubble-sm": "0 2px 0 0 #c2410c, 0 3px 6px rgba(0,0,0,0.3)"
      }
    }
  },
  plugins: []
};
