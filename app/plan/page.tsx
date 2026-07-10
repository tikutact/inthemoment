import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";
import JsonLd from "@/components/JsonLd";
import { SiLine } from "react-icons/si";
import { breadcrumb } from "@/lib/structured-data";
import { plans } from "./data";

export const metadata: Metadata = {
  title: "PLAN - 前撮り・フォトウェディングの料金プラン一覧",
  description:
    "in the momentの前撮り・フォトウェディング料金プラン一覧。PHOTO（¥100,000〜）・PHOTO + MOVIE（¥150,000〜）・MOVIE（¥100,000〜）の3プラン。撮影4時間・カラーグレーディング込み、表示価格はすべて税込です。",
  alternates: { canonical: "/plan" },
};

const planList = [plans.photo, plans["photo-movie"], plans.movie];

const notes = [
  "土日祝日は +¥10,000",
  "交通費別途（大須観音駅起算）",
  "宿泊を伴う出張は +¥18,000",
  "カット数は最低保証枚数",
  "表示価格はすべて税込",
];

export default function PlanIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "PLAN", path: "/plan" },
        ])}
      />
      <Navigation />

      <section className="pt-28 md:pt-44 pb-20 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-6 text-center">
              PLAN
            </p>
            <p className="text-xs text-[#6b6560] leading-[2.4] tracking-wide text-center mb-24">
              写真のみ・写真＋映像・映像のみ。
              <br className="md:hidden" />
              3つのプランからお選びいただけます。
            </p>
          </FadeIn>

          <div className="grid grid-cols-3 gap-3 md:gap-0">
            {planList.map((plan, i) => (
              <FadeIn key={plan.slug} delay={i * 150}>
                <Link
                  href={`/plan/${plan.slug}`}
                  className={`block group ${
                    i === 0
                      ? "md:pr-12"
                      : i === 1
                        ? "md:px-6 md:border-x border-[#1e1c1a]/8"
                        : "md:pl-12"
                  }`}
                >
                  <div className="w-full aspect-[3/4] overflow-hidden mb-6 md:mb-10">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80"
                    />
                  </div>
                  <p className="text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.5em] text-[#1e1c1a] mb-1 md:mb-2">
                    {plan.name}
                  </p>
                  <p className="text-[9px] md:text-[10px] text-[#9a9088] tracking-wide mb-5 md:mb-8">
                    {plan.subtitle}
                  </p>
                  {plan.tiers.map((tier) => (
                    <div key={tier.name} className="py-4 md:py-5 border-b border-[#1e1c1a]/8">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-0.5">
                        <span className="text-[8px] md:text-[10px] text-[#9a9088] tracking-wide">
                          {tier.name}
                        </span>
                        <span className="text-xs md:text-lg font-light tracking-wider">
                          {tier.price}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-[8px] md:text-[10px] text-[#9a9088] tracking-wide mt-4 md:mt-5">
                    <span>{plan.duration}</span>
                    <span>{plan.cuts !== "—" ? plan.cuts : ""}</span>
                  </div>
                  {plan.youtubeUrl && (
                    <p className="mt-3 md:mt-5 text-[9px] md:text-xs text-[#6b6560] leading-5 md:leading-7 tracking-wide">
                      ※ オープニングムービー含む（約2分）
                    </p>
                  )}
                  <p className="mt-5 md:mt-8 text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.3em] text-[#9a9088] group-hover:text-[#1e1c1a] transition-colors">
                    詳細を見る →
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="mt-20 pt-10 border-t border-[#1e1c1a]/8 space-y-3">
              {notes.map((note) => (
                <p key={note} className="text-xs text-[#6b6560] tracking-wide leading-7">
                  {note}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <FadeIn>
          <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-8">RESERVATION</p>
          <p className="text-sm text-[#6b6560] font-light tracking-wide mb-12">
            ご予約・お問い合わせはLINEから
          </p>
          <a
            href="https://lin.ee/OYalLp6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 md:px-12 py-4 bg-[#1e1c1a] text-white text-[9px] tracking-[0.4em] font-light hover:opacity-60 transition-opacity"
          >
            <SiLine className="text-sm" />
            LINE でお問い合わせ
          </a>
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
