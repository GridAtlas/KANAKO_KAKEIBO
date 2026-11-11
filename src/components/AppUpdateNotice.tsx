"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Modal } from "./Modal";

const runningVersion = Number(process.env.NEXT_PUBLIC_KANAKO_BUILD_VERSION ?? 0);
const versionPath = `${process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? ""}/version.json`;
const checkInterval = 5 * 60 * 1000;

export function AppUpdateNotice() {
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

  function dismissUpdate() {
    setDismissedVersion(availableVersion);
  }

  function applyUpdate() {
    const url = new URL(window.location.href);
    url.searchParams.set("__kanako_update", `${availableVersion}.${Date.now()}`);
    window.location.replace(url.href);
  }

  if (availableVersion <= dismissedVersion) return null;

  return (
    <Modal
      labelledBy="app-update-title"
      describedBy="app-update-description"
      className="rounded-3xl p-5"
      onClose={dismissUpdate}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--blush)] text-[var(--accent)]">
          <RefreshCw size={19} aria-hidden="true" />
        </span>
        <h2 id="app-update-title" className="font-bold">新しいバージョンがあります</h2>
      </div>
      <p id="app-update-description" className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        更新すると、この画面を読み込み直します。入力中の内容は先に保存できます。
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-2 text-sm font-semibold text-[var(--accent)] hover:bg-[#fcf1f4]"
          onClick={dismissUpdate}
        >
          あとで
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl bg-[var(--accent)] px-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
          onClick={applyUpdate}
        >
          今すぐ更新
        </button>
      </div>
    </Modal>
  );
}
