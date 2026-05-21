import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";
import QaAccordion from "@/components/QaAccordion";

export default function QaPage() {
  return (
    <>
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
