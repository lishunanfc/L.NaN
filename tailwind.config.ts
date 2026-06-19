import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', "sans-serif"],
      },
      colors: {
        sky: {
          warm: "#f5a623",
          soft: "#f7d794",
          lilac: "#d5c6e0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
