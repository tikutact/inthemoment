"use client";

import { useEffect, useState } from "react";

// 記事本文（dangerouslySetInnerHTML）内のチェックボックスに、進捗の保存と表示を足す。
// チェックの切り替え自体は <label> のネイティブ挙動＝JSなしでも動く。ここは保存とリセットだけ。

type Props = { slug: string };

export default function JournalChecklist({ slug }: Props) {
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);

  const storageKey = `itm:checklist:${slug}`;

  useEffect(() => {
    const boxes = Array.from(
      document.querySelectorAll<HTMLInputElement>(".prose-journal input[data-ck]")
    );
    if (boxes.length === 0) return;

    let saved: Record<string, boolean> = {};
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      saved = {};
    }

    const count = () => setDone(boxes.filter((b) => b.checked).length);

    for (const box of boxes) {
      const key = box.dataset.ck;
      if (key && saved[key]) box.checked = true;
    }
    setTotal(boxes.length);
    count();

    const onChange = (e: Event) => {
      const box = e.target as HTMLInputElement;
      const key = box.dataset?.ck;
      if (!key) return;
      const next = { ...saved };
      if (box.checked) next[key] = true;
      else delete next[key];
      saved = next;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // プライベートブラウズ等で保存できなくても、チェック自体は動かす
      }
      count();
    };

    for (const box of boxes) box.addEventListener("change", onChange);
    return () => {
      for (const box of boxes) box.removeEventListener("change", onChange);
    };
  }, [storageKey]);

  const reset = () => {
    const boxes = document.querySelectorAll<HTMLInputElement>(".prose-journal input[data-ck]");
    for (const box of boxes) box.checked = false;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // 同上
    }
    setDone(0);
  };

  if (total === 0) return null;

  return (
    <div
      className="mt-4 flex items-center justify-center gap-5"
      style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards" }}
    >
      <p className="text-[10px] tracking-[0.2em] text-[#9a9088] font-light">
        {done} / {total} チェック済み
      </p>
      {done > 0 && (
        <button
          type="button"
          onClick={reset}
          className="text-[10px] tracking-[0.2em] text-[#9a9088] font-light underline underline-offset-4 hover:text-[#6b6560] transition-colors duration-300"
        >
          リセット
        </button>
      )}
    </div>
  );
}
