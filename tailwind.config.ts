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
        beebox: {
          yellow: {
            300: "#FDE047",
            400: "#FACC15",
            500: "#F59E0B",
            600: "#D97706",
          },
          navy: {
            950: "#080D1A",
            900: "#0F172A",
            800: "#1E293B",
            700: "#334155",
          },
          amber: {
            400: "#FACC15",
            500: "#F59E0B",
            600: "#D97706",
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
