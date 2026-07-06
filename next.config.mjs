/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repoName = "KANAKO_KAKEIBO";

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  // GitHub Pages は /repo-name/ 配下で公開されるため basePath を付ける（dev は空）
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  // Pages はディレクトリインデックス（末尾スラッシュ）で安定する
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
