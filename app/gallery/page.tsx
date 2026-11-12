import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import ShowcaseStrip from "@/components/ShowcaseStrip";
import FadeIn from "@/components/FadeIn";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/structured-data";
import { cases } from "./data";
import { galleryImage } from "./images";

export const metadata: Metadata = pageMetadata({
  title: "GALLERY - 名古屋・愛知の前撮りギャラリー",
  description:
    "in the momentの前撮り・フォトウェディング撮影事例。愛知・名古屋を中心に、海辺や湿原、街中など、ふたりらしいロケーションで撮影した実際の写真をご覧いただけます。",
  path: "/gallery",
});

export default function ShowcasePage() {

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "GALLERY", path: "/gallery" },
        ])}
      />
      <Navigation />
      {/* JSが動かない閲覧でも写真が見えるように（FadeInは最初透明） */}
      <noscript>
        <style>{"[data-fadein]{opacity:1!important;transform:none!important}"}</style>
      </noscript>

      <section className="pt-24 md:pt-44 pb-16 md:pb-32">
        <h1
          className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-12 md:mb-24 text-center"
          style={{
            opacity: 0,
            animation: "navFadeIn 0.8s ease forwards",
            animationDelay: "100ms",
          }}
        >
          GALLERY
        </h1>

        {cases.length === 0 ? (
          <p className="text-center text-[11px] tracking-wide text-[#9a9088]">
            coming soon
          </p>
        ) : (
          <div className="space-y-0">
            {[...cases].reverse().map((c, i) => (
              <div key={c.id}>
                <Link href={`/gallery/${c.id}`} className="group block py-5 md:py-6 border-t border-[#1e1c1a]/8">
                  {/* 各ケースは画面に入った時にふわっと出す（見出し→表紙→帯の順に150msずつずらす。FadeInはサイト共通） */}
                  <FadeIn className="px-6 flex items-baseline gap-4 mb-4 md:mb-6" rootMargin="0px">
                    <p className="text-[11px] tracking-[0.2em] text-[#1e1c1a] font-light">
                      {c.label}
                    </p>
                    {c.location && (
                      <p className="text-[9px] tracking-[0.3em] text-[#9a9088]">
                        {c.location}
                      </p>
                    )}
                  </FadeIn>
                  {/* モバイルだけ：先頭写真を画面幅いっぱいに大きく見せ、その下に細い帯を流す（PCは帯だけ） */}
                  {(() => {
                    // cover が photos に無い（打ち間違い等）なら先頭に戻す。写真0枚のケースは表紙を出さない
                    const coverSrc = c.cover && c.photos.includes(c.cover) ? c.cover : c.photos[0];
                    if (!coverSrc) return null;
                    const cover = galleryImage(coverSrc);
                    return (
                      <FadeIn className="md:hidden mb-4 overflow-hidden" delay={150} rootMargin="0px" waitForImages>
                        {/* PCでは表紙を隠すだけでなく読み込ませない（1×1の透明画像に差し替え） */}
                        <picture>
                        <source media="(min-width: 768px)" srcSet="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                        <img
                          src={cover.src}
                          alt={`${c.label} 表紙`}
                          width={cover.width}
                          height={cover.height}
                          loading={i === 0 ? undefined : "lazy"}
                          fetchPriority={i === 0 ? "high" : undefined}
                          decoding="async"
                          draggable={false}
                          className="block mx-auto max-w-full w-auto select-none"
                          // 区切り線〜帯〜次の区切り線が1画面に収まるよう、写真を切らずに縮める（ナビ64px＋見出し・帯・余白・区切り線2本の計187pxを引く）。
                          // 高さ＝「横幅いっぱいにした時の高さ」と「画面に収まる上限」の小さいほう。縮んだ分は左右が余白になる。
                          // svh＝ブラウザのバーが出ている時の小さい画面基準。下限200pxは横向き等の低い画面で表紙が消えないため
                          style={{
                            ...(cover.width && cover.height ? { aspectRatio: `${cover.width} / ${cover.height}` } : {}),
                            height: cover.width && cover.height
                              ? `min(calc(100vw * ${cover.height} / ${cover.width}), max(calc(100svh - 64px - 187px), 200px))`
                              : "auto",
                          }}
                        />
                        </picture>
                      </FadeIn>
                    );
                  })()}
                  <FadeIn delay={300} rootMargin="0px" waitForImages>
                    <ShowcaseStrip photos={c.photos.map(galleryImage)} label={c.label} eager={i === 0 ? 6 : 0} />
                  </FadeIn>
                </Link>
              </div>
            ))}
            <div className="border-t border-[#1e1c1a]/8" />
          </div>
        )}
      </section>

      <footer className="py-8 px-6 border-t border-[#1e1c1a]/8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-[0.25em] font-light">in the moment</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/terms" className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light hover:text-[#6b6560] transition-colors">
              利用規約
            </a>
            <a href="/tokushoho" className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light hover:text-[#6b6560] transition-colors">
              特定商取引法に基づく表記
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
