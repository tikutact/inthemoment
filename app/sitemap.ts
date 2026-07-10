import { MetadataRoute } from "next";
import { getArticles } from "@/lib/notion";
import { cases } from "@/app/gallery/data";

// sitemap.ts はデフォルトでビルド時にキャッシュされるため、
// Notionの新記事を反映するには revalidate が必要
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.inthemoment.jp";
  const articles = await getArticles();

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/journal/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ギャラリーケース（data.ts に追加すれば自動で載る）
  const caseUrls: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${base}/gallery/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan/photo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan/photo-movie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan/movie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/qa`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/journal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...caseUrls,
    ...articleUrls,
  ];
}
