"use client";

import { AppErrorScreen } from "@/components/AppErrorScreen";

export default function GlobalError() {
  return (
    <html lang="ja">
      <head>
        <title>かなこの家計簿</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0 }}>
        <AppErrorScreen standalone />
      </body>
    </html>
  );
}
