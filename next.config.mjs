const isProd = process.env.NODE_ENV === "production";
const repoName = "KANAKO_KAKEIBO";
const basePath = isProd ? `/${repoName}` : "";
// クライアントのコードと静的な version.json に同じビルド番号を埋め込む。
const buildVersion = isProd
  ? (process.env.KANAKO_BUILD_VERSION ??= String(Date.now()))
  : "0";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  // GitHub Pages は /repo-name/ 配下で公開されるため basePath を付ける（dev は空）
  basePath,
  assetPrefix: isProd ? `/${repoName}/` : "",
  env: {
    NEXT_PUBLIC_KANAKO_BASE_PATH: basePath,
    NEXT_PUBLIC_KANAKO_BUILD_VERSION: buildVersion,
  },
  // Pages はディレクトリインデックス（末尾スラッシュ）で安定する
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
