import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";
import { articleLd, breadcrumb } from "@/lib/structured-data";
import { getArticleBySlug, getArticles } from "@/lib/notion";
import { notFound } from "next/navigation";
import { marked } from "marked";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

// markdown から meta description 用のプレーンテキストを作る
function extractDescription(markdown: string): string {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 画像
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // リンク→テキスト
    .replace(/[#*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 110 ? `${text.slice(0, 110)}…` : text;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticleBySlug(slug);
  if (!data) return {};

  const { article, markdown } = data;
  const description = extractDescription(markdown);
  return {
    title: article.title,
    description,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title: article.title,
      description,
      url: `/journal/${slug}`,
      siteName: "in the moment",
      locale: "ja_JP",
      type: "article",
      ...(article.cover ? { images: [{ url: article.cover }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getArticleBySlug(slug);
  if (!data) notFound();

  const { article, markdown } = data;
  // 読点改行はテキストノードのみ対象（タグ内の「、」を置換するとalt属性等が壊れる）
  const html = (marked.parse(markdown) as string).replace(/、(?![^<]*>)/g, '、<br class="comma-br">');

  return (
    <>
      <JsonLd data={articleLd(article)} />
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "JOURNAL", path: "/journal" },
          { name: article.title, path: `/journal/${slug}` },
        ])}
      />
      <Navigation />
      <article className="pt-24 md:pt-44 pb-16 md:pb-32 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-10 md:mb-16">
            <h1
              className="text-xl md:text-3xl font-light text-[#1e1c1a] leading-relaxed tracking-normal md:tracking-wide break-words text-center"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {article.title}
            </h1>
            {article.cover && (
              <img src={article.cover} alt="" className="w-full max-h-[75vh] object-contain mt-8" />
            )}
          </div>

          {/* 本文 */}
          <div
            className="prose-journal"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* in the moment について */}
          <div className="mt-16 md:mt-24 pt-10 border-t border-[#1e1c1a]/10">
            <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-5">PHOTOGRAPHER</p>
            <p
              className="text-base md:text-lg font-light text-[#1e1c1a] tracking-wide mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              in the moment
            </p>
            <p className="text-[10px] md:text-xs text-[#6b6560] leading-[2.2] tracking-wide font-light mb-6">
              愛知を拠点に、前撮り・フォトウェディングを行うフォトグラファー。<br />
              ポーズよりも余白を、ふたりの「いま」をそのままに残します。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/"
                className="text-[10px] md:text-xs tracking-[0.25em] text-[#6b6560] border border-[#6b6560]/30 px-5 py-3 hover:border-[#6b6560] transition-colors duration-300"
              >
                サービスを見る
              </a>
              <a
                href="https://lin.ee/OYalLp6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] md:text-xs tracking-[0.25em] text-[#6b6560] border border-[#6b6560]/30 px-5 py-3 hover:border-[#6b6560] transition-colors duration-300"
              >
                LINE でご相談
              </a>
            </div>
          </div>
        </div>
      </article>

      <footer className="py-8 px-6 border-t border-[#1e1c1a]/8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-[0.25em] font-light">in the moment</p>
          <p className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light">
            © 2026 in the moment. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

