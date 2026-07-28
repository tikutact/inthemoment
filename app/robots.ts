import { MetadataRoute } from "next";

// robots.txt。全ページクロール許可＋サイトマップの場所を明示する。
// 除外したいページが出たら disallow に足す（現状は非公開にしたい経路が無い）。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.inthemoment.jp/sitemap.xml",
  };
}
