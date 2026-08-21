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
        // Qog'oz va siyoh — taklifnoma dunyosidan olingan neytrallar
        paper: {
          DEFAULT: "#faf7f1",
          raised: "#ffffff",
          sunk: "#f2ece1",
        },
        ink: {
          DEFAULT: "#211d18",
          soft: "#5f574a",
          faint: "#8b8272",
        },
        line: {
          DEFAULT: "#e6decf",
          strong: "#d7ccb6",
        },
        // Asosiy urg'u — jez (brass)
        brass: {
          DEFAULT: "#a9762c",
          soft: "#f3e7d2",
          deep: "#8a5f21",
        },
        // Ikkinchi urg'u — anor; faqat ayrim joylarda
        anor: {
          DEFAULT: "#8c2f2a",
          soft: "#f6e3e1",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(33, 29, 24, .04), 0 12px 32px -24px rgba(33, 29, 24, .45)",
        lift: "0 2px 4px rgba(33, 29, 24, .05), 0 20px 40px -28px rgba(33, 29, 24, .5)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
