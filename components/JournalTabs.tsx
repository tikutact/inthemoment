"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const CATEGORIES = [
  { key: "all", label: "すべて" },
  { key: "location", label: "ロケーション" },
  { key: "knowledge", label: "知識" },
  { key: "prep", label: "準備" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

// 記事グリッドはサーバー描画（SEO保持）。ここはタブだけのクライアント島で、
// #journal-grid の data-filter を切り替え、実際の絞り込みは globals.css が行う。
export default function JournalTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams.get("category");
  const active: CategoryKey = CATEGORIES.some((c) => c.key === raw)
    ? (raw as CategoryKey)
    : "all";

  useEffect(() => {
    const grid = document.getElementById("journal-grid");
    if (grid) grid.dataset.filter = active;
  }, [active]);

  const select = (key: CategoryKey) => {
    const href = key === "all" ? pathname : `${pathname}?category=${key}`;
    router.replace(href, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10 md:mb-16">
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => select(c.key)}
          aria-pressed={active === c.key}
          className={`text-[11px] md:text-xs tracking-[0.2em] font-light pb-1 border-b transition-colors ${
            active === c.key
              ? "text-[#1e1c1a] border-[#1e1c1a]/40"
              : "text-[#9a9088] border-transparent hover:text-[#6b6560]"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
