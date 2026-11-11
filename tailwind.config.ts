import type { Config } from "tailwindcss";
import { APP_FONT_FAMILY } from "./src/lib/typography";

const CATEGORY_COLORS = [
  "rose", "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia",
  "pink", "slate",
];

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    // カテゴリ色は動的 class になるので safelist で明示
    ...CATEGORY_COLORS.flatMap((c) => [
      `bg-${c}-50`,
      `bg-${c}-100`,
      `bg-${c}-500`,
      `text-${c}-600`,
      `text-${c}-700`,
      `border-${c}-200`,
      `border-${c}-300`,
      `ring-${c}-300`,
    ]),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: APP_FONT_FAMILY,
      },
    },
  },
  plugins: [],
};

export default config;
