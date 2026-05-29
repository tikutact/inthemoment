"use client";

import Link from "next/link";
import Navigation from "./Navigation";
import FadeIn from "./FadeIn";
import { SiLine } from "react-icons/si";
import type { PlanData } from "@/app/plan/data";

export default function PlanDetail({ plan }: { plan: PlanData }) {
  return (
    <>
      <Navigation />

      {/* PLAN HEADER */}
      {plan.heroImage ? (
        <>
          <section className="relative w-full" style={{ height: "45vh", minHeight: "220px" }}>
            <img src={plan.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center" style={{ paddingTop: "64px" }}>
              <div className="flex items-center gap-6 md:gap-10 mb-3">
                <div className="hidden md:block w-24 h-[1px] bg-white/50" />
                <p className="text-xl md:text-3xl font-light tracking-[0.3em]">{plan.name}</p>
                <div className="hidden md:block w-24 h-[1px] bg-white/50" />
              </div>
            </div>
          </section>
          <section className="py-10 md:py-16 px-6 text-center">
            <p className="text-xs md:text-sm text-[#6b6560] leading-[2.4] tracking-wide whitespace-pre-line max-w-md mx-auto">
              {plan.description}
            </p>
          </section>
        </>
      ) : (
        <section className="pt-44 pb-24 px-6 text-center">
          <FadeIn>
            <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-4">PLAN</p>
            <p className="text-4xl md:text-5xl font-light tracking-[0.15em] text-[#1e1c1a] mb-3">
              {plan.name}
            </p>
            <p className="text-sm text-[#6b6560] leading-[2.4] tracking-wide whitespace-pre-line max-w-md mx-auto mt-6">
              {plan.description}
            </p>
          </FadeIn>
        </section>
      )}

      {/* SAMPLE MOVIE */}
      {plan.youtubeUrl && (
        <section className="py-14 md:py-20 px-4 md:px-6 text-center">
          <FadeIn>
            <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-10">SAMPLE MOVIE</p>
            <div className="max-w-2xl mx-auto aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${plan.youtubeUrl.split("/").pop()}`}
                title="Sample Movie"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </FadeIn>
        </section>
      )}

      {/* TIERS */}
      <section className="py-14 md:py-24 px-4 md:px-6 bg-[#f3f0eb]">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            {plan.tierImage ? (
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
                <img src={plan.tierImage} alt="" className="w-full aspect-[3/4] object-cover" />
                <div className="space-y-16 pt-2">
                  {plan.tiers.map((tier) => (
                    <div key={tier.name} className="flex gap-6">
                      <div className="w-[2px] bg-[#1e1c1a]/20 shrink-0 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-light tracking-[0.15em] text-[#1e1c1a] mb-5">{tier.name}</p>
                        <p className="text-2xl font-light tracking-wider text-[#1e1c1a] mb-6" style={{ fontFamily: "var(--font-serif)" }}>{tier.price}</p>
                        <ul className="space-y-3">
                          {tier.included.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-[#6b6560] font-light tracking-wide">
                              <span className="text-[#9a9088] shrink-0 mt-0.5">◆</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto space-y-16">
                {plan.tiers.map((tier) => (
                  <div key={tier.name} className="flex gap-6">
                    <div className="w-[2px] bg-[#1e1c1a]/20 shrink-0 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-light tracking-[0.15em] text-[#1e1c1a] mb-5">{tier.name}</p>
                      <p className="text-2xl font-light tracking-wider text-[#1e1c1a] mb-6" style={{ fontFamily: "var(--font-serif)" }}>{tier.price}</p>
                      <ul className="space-y-3">
                        {tier.included.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-[#6b6560] font-light tracking-wide">
                            <span className="text-[#9a9088] shrink-0 mt-0.5">◆</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* FLOW */}
      <section className="py-14 md:py-24 px-4 md:px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            {plan.midImage ? (
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
                <img src={plan.midImage} alt="" className="w-full aspect-[3/4] object-cover" />
                <div>
                  <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-12">当日の流れ</p>
                  <ol className="space-y-0">
                    {plan.flow.map((step, i) => (
                      <li key={i} className="flex gap-8 pb-8 relative">
                        <div className="flex flex-col items-center">
                          <div className="w-[1px] h-2 bg-[#1e1c1a]/15" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1e1c1a]/30 shrink-0" />
                          {i < plan.flow.length - 1 && (
                            <div className="w-[1px] flex-1 bg-[#1e1c1a]/15 mt-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-[10px] tracking-[0.3em] text-[#9a9088] mb-1">{step.time}</p>
                          <p className="text-sm text-[#1e1c1a] font-light tracking-wide">{step.label}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-12 text-center">当日の流れ</p>
                <ol className="space-y-0">
                  {plan.flow.map((step, i) => (
                    <li key={i} className="flex gap-8 pb-8 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-[1px] h-2 bg-[#1e1c1a]/15" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1e1c1a]/30 shrink-0" />
                        {i < plan.flow.length - 1 && (
                          <div className="w-[1px] flex-1 bg-[#1e1c1a]/15 mt-1" />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className="text-[10px] tracking-[0.3em] text-[#9a9088] mb-1">{step.time}</p>
                        <p className="text-sm text-[#1e1c1a] font-light tracking-wide">{step.label}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </FadeIn>
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

      {/* BACK */}
      <div className="pb-16 text-center">
        <Link
          href="/#plan"
          className="text-[9px] tracking-[0.4em] text-[#9a9088] hover:text-[#1e1c1a] transition-colors"
        >
          ← BACK TO PLAN
        </Link>
      </div>

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
