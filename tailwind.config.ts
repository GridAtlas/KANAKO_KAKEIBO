import type { Config } from "tailwindcss";

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
      `text-${c}-600`,
      `text-${c}-700`,
      `border-${c}-200`,
      `ring-${c}-300`,
    ]),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "Meiryo",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
