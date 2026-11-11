"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const runningVersion = Number(process.env.NEXT_PUBLIC_KANAKO_BUILD_VERSION ?? 0);
const versionPath = `${process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? ""}/version.json`;
const checkInterval = 5 * 60 * 1000;

export function AppUpdateNotice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [availableVersion, setAvailableVersion] = useState(0);
  const [dismissedVersion, setDismissedVersion] = useState(0);

  useEffect(() => {
    if (!runningVersion) return;

    let request: AbortController | undefined;

    async function checkVersion() {
      if (document.hidden || request) return;

      const controller = new AbortController();
      request = controller;
      const timeout = window.setTimeout(() => controller.abort(), 10_000);

      try {
        const response = await fetch(`${versionPath}?check=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = await response.json();
        const version: unknown = data?.version;
        const isNewer = typeof version === "number" && Number.isSafeInteger(version) && version > runningVersion;
        if (!controller.signal.aborted && isNewer) {
          setAvailableVersion((previous) => Math.max(previous, version));
        }
      } catch {
        // オフラインなどで取得できない場合は、次の確認まで待つ。
      } finally {
        window.clearTimeout(timeout);
        request = undefined;
      }
    }

    void checkVersion();
    const interval = window.setInterval(checkVersion, checkInterval);
    window.addEventListener("focus", checkVersion);
    window.addEventListener("online", checkVersion);
    document.addEventListener("visibilitychange", checkVersion);

    return () => {
      window.clearInterval(interval);
      request?.abort();
      window.removeEventListener("focus", checkVersion);
      window.removeEventListener("online", checkVersion);
      document.removeEventListener("visibilitychange", checkVersion);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (availableVersion > dismissedVersion && dialog && !dialog.open) dialog.showModal();
  }, [availableVersion, dismissedVersion]);

  function dismissUpdate() {
    setDismissedVersion(availableVersion);
    dialogRef.current?.close();
  }

  function applyUpdate() {
    const url = new URL(window.location.href);
    url.searchParams.set("__kanako_update", `${availableVersion}.${Date.now()}`);
    window.location.replace(url.href);
  }

  if (!runningVersion) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="app-update-title"
      aria-describedby="app-update-description"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-[#eadccf] bg-[#fffaf5] p-5 text-[#3b2721] shadow-xl backdrop:bg-stone-900/50"
      onCancel={(event) => {
        event.preventDefault();
        dismissUpdate();
      }}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f4ded5] text-[#a13e34]">
          <RefreshCw size={19} aria-hidden="true" />
        </span>
        <h2 id="app-update-title" className="font-bold">新しいバージョンがあります</h2>
      </div>
      <p id="app-update-description" className="mt-3 text-sm leading-relaxed text-[#765b50]">
        更新すると、この画面を読み込み直します。入力中の内容は先に保存できます。
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          autoFocus
          className="min-h-11 rounded-xl border border-[#eadccf] bg-white px-2 text-sm font-semibold text-[#983e34] hover:bg-[#faede6]"
          onClick={dismissUpdate}
        >
          あとで
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl bg-[#a13e34] px-2 text-sm font-semibold text-white hover:bg-[#862e28]"
          onClick={applyUpdate}
        >
          今すぐ更新
        </button>
      </div>
    </dialog>
  );
}
