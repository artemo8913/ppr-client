import type { Config } from "tailwindcss";

export enum QuarterColors {
  FIRST_QUARTER = "rgba(0,26,255,0.5)",
  SECOND_QARTER = "rgba(1,129,16,0.5)",
  THIRD_QARTER = "rgba(6,180,154,0.5)",
  FOURTH_QARTER = "rgba(255,132,0,0.5)",
  FIRST_QUARTER_TRANSPARENT = "rgba(0,26,255,0.2)",
  SECOND_QARTER_TRANSPARENT = "rgba(1,129,16,0.2)",
  THIRD_QARTER_TRANSPARENT = "rgba(6,180,154,0.2)",
  FOURTH_QARTER_TRANSPARENT = "rgba(255,132,0,0.2)",
}

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
