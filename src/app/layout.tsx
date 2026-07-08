import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "かなこの家計簿VER0.2",
  description:
    "スマホで動く WEB 家計簿アプリ。カテゴリ自由設定、固定費自動計上、円グラフ可視化。",
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
