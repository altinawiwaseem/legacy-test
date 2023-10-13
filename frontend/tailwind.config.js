/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      zIndex: {
        100: "100",
      },
      fontSize: {
        sm: "0.8rem",
      },
      height: {
        128: "32rem",
        152: "38rem",
        184: "46rem",
        228: "52rem",
      },
      maxHeight: {
        152: "38rem",
        128: "32rem",
        228: "52rem",
      },
      boxShadow: {
        "6xl": "0 -2px 10px rgba(0, 0, 0, 1)",
      },
      colors: {
        // dark-mode
        "bg-xiketic": "#15141E",
        "input-space-cadet": "#202033",
        "nav-raisin-black": "#2B2B33",
        "nav-raisin-black-2": "#2C2C3A",
        "nav-raisin-black-3": "#353546",
        "nav-raisin-black-4": "#3D3D51",
        snow: "#FFFBFC",
        "text-ghost-white": "#F0EFF3",
        white: "rgb(255,255,255)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
