/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Trebuchet MS'", "Verdana", "sans-serif"],
      },
      colors: {
        canvas: "#f4f5f7",
        list: "#ebecf0",
        card: "#ffffff",
        ink: "#172b4d",
        muted: "#5e6c84"
      },
      boxShadow: {
        card: "0 1px 0 rgba(9,30,66,.25)",
        lift: "0 6px 12px rgba(9,30,66,.18)",
        list: "0 1px 2px rgba(9,30,66,.12)"
      }
    }
  },
  plugins: []
};
