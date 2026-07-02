import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/structured-data";
import { cases } from "../data";

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = cases.find((c) => c.id === id);
  if (!c) return {};
  const where = c.location ? `${c.location}での` : "";
  return {
    title: `${c.label} - ${c.location ?? ""} 前撮りギャラリー`,
    description: `${where}前撮り・フォトウェディング撮影事例「${c.label}」。in the momentが撮影した実際の写真をご覧いただけます。`,
    alternates: { canonical: `/gallery/${c.id}` },
  };
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases.find((c) => c.id === id);
  if (!c) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "GALLERY", path: "/gallery" },
          { name: c.label, path: `/gallery/${c.id}` },
        ])}
      />
      <Navigation />

      <section className="pt-24 md:pt-44 pb-16 md:pb-32 px-3 md:px-6">
        <FadeIn>
          <div className="flex items-baseline gap-4 mb-8 md:mb-16 max-w-5xl mx-auto">
            <p className="text-sm font-light tracking-[0.2em] text-[#1e1c1a]">
              {c.label}
            </p>
            {c.location && (
              <p className="text-[10px] tracking-[0.3em] text-[#9a9088]">
                {c.location}
              </p>
            )}
          </div>
        </FadeIn>

        <div className="[columns:2] md:[columns:4] px-3 md:px-6" style={{ columnGap: "10px" }}>
          {c.photos.map((src, j) => (
            <div key={j} className="mb-[10px] break-inside-avoid overflow-hidden">
              <img
                src={src}
                alt={`${c.label} ${j + 1}`}
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="pb-16 text-center">
        <Link
          href="/gallery"
          className="text-[9px] tracking-[0.4em] text-[#9a9088] hover:text-[#1e1c1a] transition-colors"
        >
          ← BACK TO GALLERY
        </Link>
      </div>

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
