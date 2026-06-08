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
        ceremony: {
          bg:      "#06080d",
          surface: "rgba(255,255,255,0.04)",
          muted:   "rgba(200,216,240,0.35)",
          glow:    "rgba(200,216,240,0.5)",
          vein:    "#9aaccb",
          accent:  "#c8d8f0",
          text:    "#e8ecf4",
          dim:     "rgba(200,216,240,0.55)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
