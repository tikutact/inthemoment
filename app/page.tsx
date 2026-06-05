import Link from "next/link";
import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";
import SplashScreen from "@/components/SplashScreen";
import HeroVideo from "@/components/HeroVideo";
import { SiLine, SiInstagram } from "react-icons/si";
import { getArticles } from "@/lib/notion";

export const revalidate = 60;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://inthemoment.jp",
  name: "in the moment",
  url: "https://inthemoment.jp",
  description: "愛知・東海三県を拠点とするウェディング前撮りフォトグラファー。",
  areaServed: { "@type": "State", name: "愛知県" },
  sameAs: ["https://www.instagram.com/in_the_moment_film/"],
};

const photoPlan = [
  { duration: "4 h", price: "¥100,000", cuts: "100 cuts" },
];

const photoMoviePlan = [
  { duration: "4 h", price: "¥150,000", cuts: "100 cuts" },
];

const moviePlan = [
  { duration: "4 h", price: "¥100,000", cuts: "約2分" },
];

export default async function Home() {
  const articles = await getArticles();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplashScreen />
      <Navigation />

      {/* HERO */}
      <section className="w-full flex flex-col items-center bg-[#faf7f2] pt-32 md:pt-24 pb-10 md:pb-16 px-4 md:px-5">
        <div className="w-full max-w-3xl"
          style={{ animation: "heroFadeIn 1.2s ease forwards", animationDelay: "3.4s", opacity: 0 }}
        >
          <div className="w-full bg-[#e8e3dc]" style={{ aspectRatio: "4/3" }}>
            <HeroVideo />
          </div>
        </div>
      </section>

      {/* CONCEPT */}
      <section id="concept" className="pt-72 pb-20 md:py-60 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* 左：写真 */}
            <FadeIn direction="left">
              <div className="w-full aspect-[3/4] bg-[#e8e3dc] overflow-hidden">
                <img src="/concept.jpg" alt="" className="w-full h-full object-cover" />
              </div>
            </FadeIn>

            {/* 右：テキスト */}
            <FadeIn direction="right" delay={100}>
              <div>
                <p
                  className="text-xl md:text-2xl font-light text-[#1e1c1a] leading-relaxed mb-10"
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                >
                  {"\"before words,"}<br />{"memories like grains of light.\""}
                </p>
                <p className="text-xs md:text-[11px] leading-[2.4] md:leading-[2.8] tracking-wide text-[#6b6560] font-light">
                  What we hope to capture is not simply a beautiful photograph,
                  but the warmth you felt in that very instant—
                  the unspoken look in your eyes,
                  the quiet flutter of emotion moving deep within you.
                  {"\n\n"}
                  The breeze brushing your cheeks,
                  the weight of your hands gently overlapping,
                  the small reasons you smile when you meet each other's eyes—
                  each is a fragment of a story worth preserving.
                  {"\n\n"}
                  We value space over perfection.
                  Just be yourselves, as you are.
                </p>
              </div>
            </FadeIn>
          </div>
      </section>

      {/* PLAN */}
      <section id="plan" className="py-20 md:py-60 px-6 bg-[#f3f0eb]">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-24 text-center">
                PLAN
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-0">
              {/* PHOTO */}
              <FadeIn delay={0}>
              <Link href="/plan/photo" className="block md:pr-12 mb-20 md:mb-0 group">
                <div className="w-full aspect-[3/4] overflow-hidden mb-10">
                  <img src="/plan1.jpg" alt="PHOTO" className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80" />
                </div>
                <p className="text-[9px] tracking-[0.5em] text-[#1e1c1a] mb-10">
                  PHOTO
                </p>
                {photoPlan.map((item, i) => (
                  <div key={i} className="py-5 border-b border-[#1e1c1a]/8">
                    <div className="flex justify-end items-baseline mb-1">
                      <span className="text-lg font-light tracking-wider">{item.price}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#9a9088] tracking-wide">
                      <span>{item.duration}</span>
                      <span>{item.cuts}</span>
                    </div>
                  </div>
                ))}
                <p className="mt-8 text-[9px] tracking-[0.3em] text-[#9a9088] group-hover:text-[#1e1c1a] transition-colors">
                  詳細を見る →
                </p>
              </Link>
              </FadeIn>

              {/* PHOTO + MOVIE */}
              <FadeIn delay={150}>
              <Link href="/plan/photo-movie" className="block md:px-6 md:border-x border-[#1e1c1a]/8 mb-20 md:mb-0 group">
                <div className="w-full aspect-[3/4] overflow-hidden mb-10">
                  <img src="/plan2.jpg" alt="PHOTO + MOVIE" className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80" />
                </div>
                <p className="text-[9px] tracking-[0.5em] text-[#1e1c1a] mb-10">
                  PHOTO + MOVIE
                </p>
                {photoMoviePlan.map((item, i) => (
                  <div key={i} className="py-5 border-b border-[#1e1c1a]/8">
                    <div className="flex justify-end items-baseline mb-1">
                      <span className="text-lg font-light tracking-wider">{item.price}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#9a9088] tracking-wide">
                      <span>{item.duration}</span>
                      <span>{item.cuts}</span>
                    </div>
                  </div>
                ))}
                <p className="mt-5 text-xs text-[#6b6560] leading-7 tracking-wide">
                  ※ オープニングムービー含む（約2分）
                </p>
                <p className="mt-4 text-[9px] tracking-[0.3em] text-[#9a9088] group-hover:text-[#1e1c1a] transition-colors">
                  詳細を見る →
                </p>
              </Link>
              </FadeIn>

              {/* MOVIE */}
              <FadeIn delay={300}>
              <Link href="/plan/movie" className="block md:pl-12 group">
                <div className="w-full aspect-[3/4] overflow-hidden mb-10">
                  <img src="/plan3.jpg" alt="MOVIE" className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80" />
                </div>
                <p className="text-[9px] tracking-[0.5em] text-[#1e1c1a] mb-10">
                  MOVIE
                </p>
                {moviePlan.map((item, i) => (
                  <div key={i} className="py-5 border-b border-[#1e1c1a]/8">
                    <div className="flex justify-end items-baseline mb-1">
                      <span className="text-lg font-light tracking-wider">{item.price}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#9a9088] tracking-wide">
                      <span>{item.duration}</span>
                      <span>{item.cuts}</span>
                    </div>
                  </div>
                ))}
                <p className="mt-5 text-xs text-[#6b6560] leading-7 tracking-wide">
                  ※ オープニングムービー含む（約2分）
                </p>
                <p className="mt-4 text-[9px] tracking-[0.3em] text-[#9a9088] group-hover:text-[#1e1c1a] transition-colors">
                  詳細を見る →
                </p>
              </Link>
              </FadeIn>
            </div>

            <FadeIn delay={400}>
            <div className="mt-20 pt-10 border-t border-[#1e1c1a]/8 space-y-3">
              {[
                "土日祝日は +¥10,000",
                "交通費別途（大須観音駅起算）",
                "宿泊を伴う出張は +¥18,000",
                "カット数は最低保証枚数",
                "表示価格はすべて税込",
              ].map((note) => (
                <p key={note} className="text-xs text-[#6b6560] tracking-wide leading-7">
                  ※ {note}
                </p>
              ))}
            </div>
            </FadeIn>
          </div>
      </section>

      {/* JOURNAL */}
      {articles.length > 0 && (
        <section className="py-20 md:py-60 px-6 bg-[#f3f0eb]">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-16 md:mb-20">JOURNAL</p>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 mb-14 md:mb-20">
              {articles.slice(0, 2).map((article, i) => (
                <FadeIn key={article.id} delay={i * 150}>
                  <Link href={`/journal/${article.slug}`} className="block group">
                    {article.cover && (
                      <div className="w-full aspect-[4/3] overflow-hidden mb-5">
                        <img
                          src={article.cover}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div>
                      {article.date && (
                        <p className="text-[9px] tracking-[0.2em] text-[#9a9088] mb-2">{article.date}</p>
                      )}
                      <h2 className="text-sm font-light text-[#1e1c1a] tracking-wide leading-relaxed group-hover:text-[#6b6560] transition-colors">
                        {article.title}
                      </h2>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <FadeIn>
              <Link
                href="/journal"
                className="text-[9px] tracking-[0.4em] text-[#9a9088] hover:text-[#1e1c1a] transition-colors"
              >
                すべて見る →
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* INSTAGRAM */}
      <section className="py-20 md:py-60 px-6">
        <FadeIn>
          <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-12 text-center">INSTAGRAM</p>
        </FadeIn>
        <FadeIn>
        <a
          href="https://www.instagram.com/in_the_moment_film/"
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-[2px]">
            {[
              "/instagram/DSCF2772.jpg",
              "/instagram/A7C04414.jpg",
              "/instagram/20251124-rie-tomo6109.jpg",
              "/instagram/20251124-rie-tomo6524.jpg",
              "/instagram/20251124-rie-tomo6014.jpg",
              "/instagram/DSCF4461.jpg",
              "/instagram/DSCF4108.jpg",
              "/instagram/DSCF3036.jpg",
              "/instagram/DSCF3957.jpg",
            ].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden group">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
                />
              </div>
            ))}
          </div>
        </a>
        </FadeIn>
      </section>

      {/* RESERVATION */}
      <section id="reservation" className="py-20 md:py-60 px-6 text-center">
        <FadeIn>
          <p className="text-3xl md:text-4xl font-light text-[#1e1c1a] mb-20">
            in the moment
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://lin.ee/OYalLp6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 md:px-12 py-4 bg-[#1e1c1a] text-white text-[9px] tracking-[0.4em] font-light hover:opacity-60 transition-opacity"
            >
              <SiLine className="text-sm" />
              LINE でお問い合わせ
            </a>
            <a
              href="https://www.instagram.com/in_the_moment_film/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 md:px-12 py-4 border border-[#1e1c1a]/20 text-[#1e1c1a] text-[9px] tracking-[0.4em] font-light hover:border-[#1e1c1a] transition-colors"
            >
              <SiInstagram className="text-sm" />
              INSTAGRAM
            </a>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
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
