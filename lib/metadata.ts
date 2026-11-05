import type { Metadata } from "next";

// ページごとの title / description を、検索用（<title> / meta description）と
// シェア用（og:* / twitter:*）の両方に同じ文言で出すための共通関数。
// Next の metadata は浅いマージなので、ページが openGraph を持たないと layout の（トップの）ものがそのまま使われる。
// 参照: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md「Merging」

export const SITE_NAME = "in the moment";
export const DEFAULT_OG_IMAGE = { url: "/ogp.jpg", width: 1200, height: 630, alt: "in the moment - 前撮り・フォトウェディング" };

type PageMetaInput = {
  /** ページの title（layout のテンプレートで「 | in the moment」が付く前の文字列） */
  title: string;
  description: string;
  /** canonical と og:url に使うパス（例 "/plan"） */
  path: string;
  /** シェア用の見出し。省略時は <title> と同じ「title | in the moment」 */
  socialTitle?: string;
  /** シェア画像。省略時はサイト共通の /ogp.jpg */
  image?: string;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, socialTitle, image, type = "website" }: PageMetaInput): Metadata {
  const shareTitle = socialTitle ?? `${title} | ${SITE_NAME}`;
  const images = image ? [{ url: image }] : [DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}
