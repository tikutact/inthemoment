import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });
const JOURNAL_PAGE_ID = process.env.NOTION_JOURNAL_PAGE_ID!;

export type Article = {
  id: string;
  title: string;
  slug: string;
  date: string;
  cover: string | null;
  category?: string;
  excerpt?: string;
};

export async function getArticles(): Promise<Article[]> {
  const response = await notion.blocks.children.list({
    block_id: JOURNAL_PAGE_ID,
  });

  const pages = (response.results as any[]).filter(
    (b) => b.type === "child_page" && !b.child_page.title.startsWith("📋")
  );

  const fullPages = await Promise.all(
    pages.map((b) => notion.pages.retrieve({ page_id: b.id }))
  );

  return fullPages.map((page: any, i) => ({
    id: pages[i].id,
    title: pages[i].child_page.title,
    slug: pages[i].id.replace(/-/g, ""),
    date: pages[i].created_time?.slice(0, 10) ?? "",
    cover: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
  }));
}

export async function getArticleBySlug(
  slug: string
): Promise<{ article: Article; markdown: string } | null> {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  const mdBlocks = await n2m.pageToMarkdown(article.id);
  const filtered = mdBlocks.filter((b) => !b.parent.includes("← 戻る"));
  const markdown = n2m.toMarkdownString(filtered).parent;

  return { article, markdown };
}
