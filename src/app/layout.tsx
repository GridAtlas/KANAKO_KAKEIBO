import type { Metadata, Viewport } from "next";
import { AppUpdateNotice } from "@/components/AppUpdateNotice";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const assetBasePath = process.env.NODE_ENV === "production" ? "/KANAKO_KAKEIBO" : "";

export const metadata: Metadata = {
  title: "かなこの家計簿",
  description:
    "毎日の予算と支出を記録して、ミニかなこと一緒にはなまるを集める家計簿。",
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
  themeColor: "#fff8f0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans text-stone-900 antialiased">
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col pb-24 [&>*:not(.wide-page)]:mx-auto [&>*:not(.wide-page)]:w-full [&>*:not(.wide-page)]:max-w-md">
          {children}
        </div>
        <BottomNav />
        <AppUpdateNotice />
      </body>
    </html>
  );
}
