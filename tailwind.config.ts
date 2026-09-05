import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0d",
        paper: "#faf9f6",
        accent: {
          DEFAULT: "#ff4d2e", // signature editorial accent (like a masthead red-orange)
          soft: "#ffb199"
        },
        surface: {
          light: "#ffffff",
          dark: "#141416"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none"
          }
        }
      })
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
