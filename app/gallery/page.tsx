import Link from "next/link";
import Navigation from "@/components/Navigation";
import ShowcaseStrip from "@/components/ShowcaseStrip";
import { cases } from "./data";

export default function ShowcasePage() {

  return (
    <>
      <Navigation />

      <section className="pt-24 md:pt-44 pb-16 md:pb-32">
        <p
          className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-12 md:mb-24 text-center"
          style={{
            opacity: 0,
            animation: "navFadeIn 0.8s ease forwards",
            animationDelay: "100ms",
          }}
        >
          GALLERY
        </p>

        {cases.length === 0 ? (
          <p className="text-center text-[11px] tracking-wide text-[#9a9088]">
            coming soon
          </p>
        ) : (
          <div className="space-y-0">
            {cases.map((c) => (
              <div key={c.id}>
                <Link href={`/gallery/${c.id}`} className="group block py-6 border-t border-[#1e1c1a]/8">
                  <div
                    className="px-6 flex items-baseline gap-4 mb-6"
                    style={{ opacity: 0, animation: "caseFadeIn 0.6s ease forwards", animationDelay: "200ms" }}
                  >
                    <p className="text-[11px] tracking-[0.2em] text-[#1e1c1a] font-light">
                      {c.label}
                    </p>
                    {c.location && (
                      <p className="text-[9px] tracking-[0.3em] text-[#9a9088]">
                        {c.location}
                      </p>
                    )}
                  </div>
                  <ShowcaseStrip photos={c.photos} label={c.label} />
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
          <p className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light">
            © 2026 in the moment. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
