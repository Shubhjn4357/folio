/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#140614",
        secondary: "#aaa6c3",
        tertiary: "#2b1030",
        "black-100": "#250d1c",
        "black-200": "#25031a",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage:{
        hero:"url('/src/assets/galaxy.png')"
      }
    },
  },
  plugins: [],
};
