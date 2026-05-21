"use client";

import { useState, useEffect } from "react";

const items = Array.from({ length: 39 }, (_, i) => ({
  src: `/portfolio-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `in the moment 前撮りポートフォリオ ${i + 1}`,
}));

export default function PortfolioGrid() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <div
        className="px-8 md:px-40 lg:px-64 [columns:3] md:[columns:6]"
        style={{ columnGap: "3px" }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item.src)}
            className="block w-full mb-[3px] overflow-hidden cursor-pointer group break-inside-avoid"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-auto block transition-opacity duration-500 group-hover:opacity-80"
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center bg-black/85"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full h-full max-w-2xl max-h-[90svh] mx-4 flex items-center justify-center">
            <img
              src={selected}
              alt="in the moment 前撮りポートフォリオ"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-8 text-white/80 text-[10px] tracking-[0.4em] hover:text-white transition-colors"
          >
            CLOSE
          </button>
        </div>
      )}
    </>
  );
}
