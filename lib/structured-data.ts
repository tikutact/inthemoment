// Schema.org JSON-LD ヘルパー（in the moment）
// URL は既存 metadataBase に合わせて www 付き絶対URLで統一する。

import type { PlanData } from "@/app/plan/data";
import type { Article } from "@/lib/notion";

export const SITE_URL = "https://www.inthemoment.jp";
const SITE_NAME = "in the moment";

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data);
}

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export type BreadcrumbItem = { name: string; path?: string };

export function breadcrumb(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

const organization = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
} as const;

// Notion 由来の記事データから BlogPosting を生成する（新記事にも自動で付く）
export function articleLd(article: Article): Record<string, unknown> {
  const url = `${SITE_URL}/journal/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    ...(article.cover ? { image: absoluteUrl(article.cover) } : {}),
    ...(article.date ? { datePublished: article.date } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    author: organization,
    publisher: {
      ...organization,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "ja",
  };
}

export function localBusinessLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    description: "愛知・東海三県を拠点とするウェディング前撮りフォトグラファー。",
    image: `${SITE_URL}/ogp.jpg`,
    email: "tikutact@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "大須2-11-18 UI大須ビル3F",
      addressLocality: "名古屋市中区",
      addressRegion: "愛知県",
      postalCode: "460-0011",
      addressCountry: "JP",
    },
    areaServed: [
      { "@type": "State", name: "愛知県" },
      { "@type": "State", name: "岐阜県" },
      { "@type": "State", name: "三重県" },
    ],
    priceRange: "¥100,000〜¥205,000",
    sameAs: ["https://www.instagram.com/in_the_moment_film/"],
  };
}

// プランデータ（app/plan/data.ts）から Service + Offer を自動生成する
export function serviceLd(plan: PlanData): Record<string, unknown> {
  const url = `${SITE_URL}/plan/${plan.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `ウェディング前撮り撮影（${plan.subtitle}）`,
    name: `${plan.name} プラン`,
    description: plan.description.replace(/\n/g, ""),
    url,
    provider: { ...organization, "@id": `${SITE_URL}/#localbusiness` },
    areaServed: [
      { "@type": "State", name: "愛知県" },
      { "@type": "State", name: "岐阜県" },
      { "@type": "State", name: "三重県" },
    ],
    offers: plan.tiers.map((tier) => ({
      "@type": "Offer",
      name: `${plan.name} ${tier.name}`,
      price: Number(tier.price.replace(/[^\d]/g, "")),
      priceCurrency: "JPY",
      url,
    })),
  };
}
