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
        // Override amber palette with exact BEEBOX Logo Yellow (#F5C242)
        amber: {
          50: "#FFFDF0",
          100: "#FFF9D6",
          200: "#FFF1AD",
          300: "#FFE67D",
          400: "#F9D678",
          500: "#F5C242", // EXACT LOGO YELLOW
          600: "#E0B034", // DARKER GOLDEN YELLOW
          700: "#B88E23",
          800: "#8A6916",
          900: "#5C460C",
        },
        beebox: {
          yellow: {
            400: "#F9D678",
            500: "#F5C242",
            600: "#E0B034",
          },
          navy: {
            950: "#080D1A",
            900: "#0F172A",
            800: "#1E293B",
            700: "#334155",
          },
          amber: {
            400: "#F9D678",
            500: "#F5C242",
            600: "#E0B034",
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
