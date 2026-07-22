import type { Metadata } from "next";
import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/structured-data";
import { getArticles } from "@/lib/notion";
import JournalTabs from "@/components/JournalTabs";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "JOURNAL - 前撮りのロケーション紹介・お役立ちコラム",
  description:
    "名古屋・愛知の前撮りに役立つ情報をお届けするジャーナル。おすすめのロケーション紹介、費用や準備のこと、撮影の記録などを綴っています。",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "JOURNAL", path: "/journal" },
        ])}
      />
      <Navigation />
      <section className="pt-24 md:pt-44 pb-16 md:pb-32 px-4 md:px-6 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-10 md:mb-16">JOURNAL</p>

          {articles.length === 0 ? (
            <p className="text-sm text-[#9a9088] tracking-wide">記事はまだありません。</p>
          ) : (
            <>
              <Suspense fallback={<div className="mb-10 md:mb-16 h-5" />}>
                <JournalTabs />
              </Suspense>
              <div
                id="journal-grid"
                data-filter="all"
                className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-14"
              >
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/journal/${article.slug}`}
                    data-category={article.category ?? ""}
                    className="block group"
                  >
                    {article.cover && (
                      <div className="w-full aspect-[4/3] overflow-hidden mb-3">
                        <img
                          src={article.cover}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xs md:text-sm font-light text-[#1e1c1a] tracking-wide leading-relaxed group-hover:text-[#6b6560] transition-colors break-words">
                        {article.title}
                      </h2>
                      <p className="mt-2.5 text-[8px] tracking-[0.3em] text-[#9a9088] group-hover:text-[#6b6560] transition-colors">
                        READ&nbsp;&nbsp;→
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

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
