import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const assetBasePath = process.env.NODE_ENV === "production" ? "/KANAKO_KAKEIBO" : "";

export const metadata: Metadata = {
  title: "かなこの家計簿 ver0.2",
  description:
    "スマホで動く WEB 家計簿アプリ。カテゴリ自由設定、固定費自動計上、円グラフ可視化。",
  applicationName: "かなこの家計簿",
  manifest: `${assetBasePath}/manifest.webmanifest`,
  icons: {
    icon: [
      {
        url: `${assetBasePath}/favicon-32x32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${assetBasePath}/favicon-16x16.png`,
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: `${assetBasePath}/icons/kanako-icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: `${assetBasePath}/icons/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "かなこの家計簿",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f9a8d4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans bg-pink-50 text-stone-900 antialiased">
        <div className="mx-auto max-w-md min-h-screen flex flex-col relative pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
