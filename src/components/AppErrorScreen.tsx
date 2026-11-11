"use client";

import type { CSSProperties } from "react";
import { APP_FONT_FAMILY } from "@/lib/typography";

const pageStyle: CSSProperties = {
  boxSizing: "border-box",
  display: "grid",
  flex: 1,
  placeItems: "center",
  width: "100%",
  padding: "24px 16px",
  backgroundColor: "#fff8f4",
  color: "#40262d",
  fontFamily: APP_FONT_FAMILY,
};

const cardStyle: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "24rem",
  padding: "24px",
  border: "1px solid #ecd9dd",
  borderRadius: "20px",
  backgroundColor: "#fffcf8",
};

const retryStyle: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: "44px",
  padding: "8px 16px",
  border: 0,
  borderRadius: "12px",
  backgroundColor: "#a53c55",
  color: "#fff",
  cursor: "pointer",
  font: "inherit",
  fontWeight: 700,
};

function retryLoading() {
  const url = new URL(window.location.href);
  url.searchParams.set("__kanako_reload", String(Date.now()));
  window.location.replace(url.href);
}

export function AppErrorScreen({ standalone = false }: { standalone?: boolean }) {
  return (
    <main style={{ ...pageStyle, minHeight: standalone ? "100vh" : undefined }}>
      <section aria-labelledby="app-error-heading" style={cardStyle}>
        <h1 id="app-error-heading" style={{ margin: 0, fontSize: "1.25rem", lineHeight: 1.5 }}>
          家計簿を表示できませんでした
        </h1>
        <p style={{ margin: "8px 0 16px", color: "#755d62", fontSize: "0.875rem", lineHeight: 1.6 }}>
          ページを読み込み直してください。
        </p>
        <button type="button" onClick={retryLoading} style={retryStyle}>
          もう一度読み込む
        </button>
      </section>
    </main>
  );
}
