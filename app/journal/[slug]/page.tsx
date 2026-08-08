import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";
import { articleLd, breadcrumb, faqLd } from "@/lib/structured-data";
import JournalChecklist from "@/components/JournalChecklist";
import { getArticleBySlug, getArticles } from "@/lib/notion";
import { extractToc, addHeadingIds } from "@/lib/toc";
import { markChecklists } from "@/lib/checklist";
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
    .replace(/^[-*]\s*\[[ xX]\]\s*/gm, "") // チェックリストの「[ ]」記法
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
  const toc = extractToc(markdown);
  // 読点改行はテキストノードのみ対象（タグ内の「、」を置換するとalt属性等が壊れる）
  const html = markChecklists(
    addHeadingIds(marked.parse(markdown) as string, toc)
  ).replace(/、(?![^<]*>)/g, '、<br class="comma-br">');

  return (
    <>
      <JsonLd data={articleLd(article)} />
      {article.faq && <JsonLd data={faqLd(article.faq)} />}
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
              style={{ fontFamily: "var(--font-serif)", opacity: 0, animation: "caseFadeIn 0.8s ease forwards" }}
            >
              {article.title}
            </h1>
            {article.cover && (
              <img
                src={article.cover}
                alt=""
                className="w-full max-h-[75vh] object-contain mt-8"
                style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards", animationDelay: "150ms" }}
              />
            )}
          </div>

          {/* 目次（本文の ## 見出しから自動生成） */}
          {toc.length >= 2 && (
            <nav
              aria-label="目次"
              className="journal-toc"
              style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards", animationDelay: "300ms" }}
            >
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-5">CONTENTS</p>
              <ul>
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* その日の撮影ムービー（frontmatter movie: がある記事のみ） */}
          {article.movie && (
            <section
              className="mt-12 md:mt-16"
              style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards", animationDelay: "375ms" }}
            >
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-6 text-center">MOVIE</p>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${article.movie.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] ?? ""}`}
                  title={`${article.title} のムービー`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </section>
          )}

          {/* 本文 */}
          <div
            className="prose-journal"
            style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards", animationDelay: "450ms" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* チェックリストがある記事だけ、進捗表示とリセット */}
          <JournalChecklist slug={slug} />

          {/* よくある質問（frontmatter faq: がある記事のみ） */}
          {article.faq && (
            <section
              className="mt-16 md:mt-24"
              style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards", animationDelay: "600ms" }}
            >
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-8">Q &amp; A</p>
              <div>
                {article.faq.map((item) => (
                  <div key={item.q} className="border-t border-[#1e1c1a]/8 py-6">
                    <p className="text-[13px] font-light tracking-wide text-[#1e1c1a] mb-3">
                      {item.q}
                    </p>
                    <p className="text-[12px] leading-[2.6] tracking-wide text-[#6b6560] font-light">
                      {item.a}
                    </p>
                  </div>
                ))}
                <div className="border-t border-[#1e1c1a]/8" />
              </div>
            </section>
          )}

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
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light hover:text-[#6b6560] transition-colors">
              利用規約
            </a>
            <p className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light">
              © 2026 in the moment. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

