import { APP_FONT_FAMILY } from "./typography";

export function loadRecoveryScript(basePath: string): string {
  return `
(function () {
  var assetPrefix = window.location.origin + ${JSON.stringify(`${basePath}/_next/static/`)};
  var chunkError = /ChunkLoadError|Loading (?:CSS )?chunk .* failed|Failed to fetch dynamically imported module|Importing a module script failed/i;
  var recovering = false;

  function showRecovery() {
    if (recovering) return;
    recovering = true;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountRecovery, { once: true });
    } else {
      mountRecovery();
    }
  }

  function mountRecovery() {
    var panel = document.createElement("div");
    panel.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;box-sizing:border-box;background:#fff8f4;color:#40262d;font-size:16px";
    panel.style.fontFamily = ${JSON.stringify(APP_FONT_FAMILY)};
    panel.innerHTML =
      '<section role="alertdialog" aria-modal="true" aria-labelledby="kanako-load-title" aria-describedby="kanako-load-message" style="box-sizing:border-box;width:100%;max-width:360px;padding:24px;border:1px solid #ecd9dd;border-radius:20px;background:#fffcf8">' +
      '<h1 id="kanako-load-title" style="margin:0;font-size:20px">家計簿を読み込めませんでした</h1>' +
      '<p id="kanako-load-message" style="margin:12px 0 20px;line-height:1.5">通信を確認して、もう一度開いてください。</p>' +
      '<a style="display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:12px;background:#a53c55;color:white;font-weight:bold;text-decoration:none">もう一度読み込む</a>' +
      '</section>';

    var retry = panel.querySelector("a");
    var url = new URL(window.location.href);
    url.searchParams.set("__kanako_reopen", String(Date.now()));
    retry.href = url.href;
    retry.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.replace(retry.href);
    });
    panel.addEventListener("keydown", function (event) {
      if (event.key === "Tab") event.preventDefault();
    });

    function attachPanel() {
      if (document.body && !panel.isConnected) {
        document.body.appendChild(panel);
        retry.focus();
      }
    }

    attachPanel();
    // Next may replace the body with its own error screen after the failed request.
    new MutationObserver(attachPanel).observe(document, { childList: true, subtree: true });
  }

  window.addEventListener("error", function (event) {
    var target = event.target;
    if (target && target.tagName === "SCRIPT" && target.src.indexOf(assetPrefix) === 0) {
      showRecovery();
    } else if (chunkError.test(event.message || "")) {
      showRecovery();
    }
  }, true);

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    if (reason && chunkError.test((reason.name || "") + " " + (reason.message || reason))) {
      showRecovery();
    }
  });
})();
`;
}
