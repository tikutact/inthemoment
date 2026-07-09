// ジャーナル記事のデータソース。
// 記事は content/journal/*.md（frontmatter＋markdown本文）。Obsidianで編集→git push で公開。
// 旧: Notion API（@notionhq/client + notion-to-md）。2026-07 にリポジトリmarkdownへ移行。
// 公開関数のシグネチャは移行前後で不変（ページ・サイトマップは無改造）。
import { cache } from "react";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = join(process.cwd(), "content", "journal");

export type Article = {
  id: string;
  title: string;
  slug: string;
  date: string;
  dateModified?: string;
  cover: string | null;
  category?: string;
  excerpt?: string;
  draft?: boolean;
};

// draft: true の記事は本番では隠す。ローカル（npm run dev）では表示してプレビューできる。
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

type Parsed = { article: Article; markdown: string; order: number };

function parseFile(raw: string): Parsed {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("frontmatter がありません");
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim()) continue;
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (val.startsWith('"')) val = JSON.parse(val);
    meta[key] = val;
  }
  return {
    order: Number(meta.order ?? 0),
    markdown: m[2].trim(),
    article: {
      id: meta.slug,
      title: meta.title ?? "",
      slug: meta.slug,
      date: meta.date ?? "",
      dateModified: meta.dateModified || undefined,
      cover: meta.cover ? meta.cover : null,
      category: meta.category || undefined,
      excerpt: meta.excerpt || undefined,
      draft: meta.draft === "true",
    },
  };
}

function readAll(): Parsed[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFile(readFileSync(join(CONTENT_DIR, f), "utf8")))
    .sort((a, b) => a.order - b.order);
}

export const getArticles = cache(async (): Promise<Article[]> => {
  return readAll()
    .filter((p) => SHOW_DRAFTS || !p.article.draft)
    .map((p) => p.article);
});

export const getArticleBySlug = cache(
  async (slug: string): Promise<{ article: Article; markdown: string } | null> => {
    const found = readAll().find((p) => p.article.slug === slug);
    if (!found) return null;
    if (!SHOW_DRAFTS && found.article.draft) return null;
    return { article: found.article, markdown: found.markdown };
  }
);
