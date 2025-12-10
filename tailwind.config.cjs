/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FFF8E7",        // Cream white (light mode)
        secondary: "#8B6F47",      // Coffee brown
        tertiary: "#F2F2F2",       // Wheat/tan
        "black-100": "#F4E4D7",    // Light cream
        "black-200": "#FFE4C4",    // Bisque
        "white-100": "#3E2723",    // Dark brown for text in light mode
        "purple-neon": "#A0826D",  // Warm brown
        "pink-neon": "#D4A574",    // Sandy brown
        "blue-neon": "#C8AD7F",    // Tan
      },
      boxShadow: {
        card: "0px 35px 120px -15px #D2B48C",
        neon: "0 0 20px rgba(160, 130, 109, 0.5)",
        "neon-strong": "0 0 30px rgba(160, 130, 109, 0.8)",
      },
      screens: {
        xs: "450px",
        "2xl": "1536px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
