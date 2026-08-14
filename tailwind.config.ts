import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Override amber palette with pure crisp Beebox Yellow (#FFC107 / #FFD600)
        amber: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#FFC107", // PURE BRIGHT YELLOW (No orange!)
          600: "#EAB308", // BRIGHT GOLDEN YELLOW
          700: "#CA8A04",
          800: "#A16207",
          900: "#854D0E",
        },
        beebox: {
          yellow: {
            400: "#FACC15",
            500: "#FFC107",
            600: "#EAB308",
          },
          navy: {
            950: "#080D1A",
            900: "#0F172A",
            800: "#1E293B",
            700: "#334155",
          },
          amber: {
            400: "#FACC15",
            500: "#FFC107",
            600: "#EAB308",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
