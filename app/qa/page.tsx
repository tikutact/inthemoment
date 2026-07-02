import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";
import QaAccordion from "@/components/QaAccordion";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Q&A - 前撮り・フォトウェディングのよくあるご質問",
  description:
    "in the momentの前撮り・フォトウェディングに関するよくあるご質問。料金・支払い、ロケーションや衣装、雨天時の延期、データの納品方法などにお答えします。",
  alternates: { canonical: "/qa" },
};

export default function QaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "Q&A", path: "/qa" },
        ])}
      />
      <Navigation />

      <section className="pt-24 md:pt-44 pb-16 md:pb-24 px-4 md:px-6">
        <FadeIn>
          <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-20 text-center">
            Q &amp; A
          </p>
          <QaAccordion />
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-[#1e1c1a]/8 mt-16">
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
