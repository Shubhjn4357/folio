/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        // Light theme colors (default)
        primary: "#FFF8E7",           // Soft cream background
        surface: "#FFE4C4",           // Bisque surface
        elevated: "#F5DEB3",          // Wheat elevated surfaces

        // Dark theme colors (applied via dark: prefix)
        "dark-primary": "#0a0e27",    // Deep navy background
        "dark-surface": "#141b3d",    // Dark blue surface
        "dark-elevated": "#1e2749",   // Medium blue elevated

        // Text colors
        "text-primary": "#3E2723",    // Dark brown (light mode)
        "text-secondary": "#403321",  // Coffee brown (light mode)
        "text-muted": "#A89968",      // Muted brown

        "dark-text-primary": "#e8e9f0",   // Light gray (dark mode)
        "dark-text-secondary": "#a3a8c3", // Muted blue-gray (dark mode)
        "dark-text-muted": "#6b7088",     // Darker muted (dark mode)

        // Accent colors
        "accent-primary": "#D4A574",     // Sandy brown (light mode)
        "accent-secondary": "#C8AD7F",   // Tan (light mode)
        "accent-hover": "#B8956A",       // Darker tan (light mode)

        "dark-accent-primary": "#5b8dee",   // Bright blue (dark mode)
        "dark-accent-secondary": "#7c5cef", // Purple-blue (dark mode)
        "dark-accent-hover": "#7da3f2",     // Lighter blue (dark mode)

        // Legacy support (will be phased out)
        secondary: "#403321",
        tertiary: "#F2F2F2",
      },
      boxShadow: {
        // Light theme shadows
        card: "0px 35px 120px -15px rgba(210, 180, 140, 0.4)",
        soft: "0 4px 20px rgba(139, 111, 71, 0.15)",
        medium: "0 8px 30px rgba(139, 111, 71, 0.2)",
        strong: "0 12px 40px rgba(139, 111, 71, 0.3)",

        // Dark theme shadows (use with dark: prefix)
        "dark-card": "0px 35px 120px -15px rgba(91, 141, 238, 0.3)",
        "dark-soft": "0 4px 20px rgba(91, 141, 238, 0.2)",
        "dark-medium": "0 8px 30px rgba(91, 141, 238, 0.3)",
        "dark-strong": "0 12px 40px rgba(124, 92, 239, 0.4)",
=======
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        "neon-blue": "var(--neon-blue)",
        "neon-purple": "var(--neon-purple)",
        "neon-pink": "#ff0080",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        neon: "0 0 10px #bc13fe, 0 0 20px #bc13fe",
>>>>>>> 9d330505 (refactorise whole app)
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
