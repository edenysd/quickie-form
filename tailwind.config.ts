import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  important: "#root",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
