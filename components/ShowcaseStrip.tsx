"use client";

import { useEffect, useRef } from "react";
import type { GalleryImage } from "@/app/gallery/images";

// photos: 一覧用サムネ（thumb）と元写真の寸法つき。eager: 先頭から何枚を遅延読み込みにしないか
export default function ShowcaseStrip({ photos, label, eager = 0 }: { photos: GalleryImage[]; label: string; eager?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastXRef = useRef(0);
  const velRef = useRef(0);
  const pausedUntilRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = window.innerWidth < 768 ? 0.08 : 0.14;
    const FRICTION = 0.95;     // 余韻の減衰（1に近いほど長く滑る）
    const SETTLE_MS = 900;     // 余韻が止まってから自動再開までの間
    let half = 0;
    const wrap = (p: number) => (half <= 0 ? p : ((p % half) + half) % half);
    const render = () => { track.style.transform = `translateX(-${posRef.current}px)`; };

    // 指ドラッグで横に送れる（縦スクロールは pan-y で温存）。動かしたらタップ扱いにしない
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      movedRef.current = false;
      lastXRef.current = e.clientX;
      velRef.current = 0;
      try { track.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      if (dx === 0) return;
      lastXRef.current = e.clientX;
      if (Math.abs(dx) > 2) movedRef.current = true;
      const delta = -dx; // ドラッグ方向に対する位置の動き
      posRef.current = wrap(posRef.current + delta);
      velRef.current = velRef.current * 0.6 + delta * 0.4; // 離したあとの余韻用に速度を記録
      render();
    };
    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try { track.releasePointerCapture(e.pointerId); } catch {}
      velRef.current = Math.max(-40, Math.min(40, velRef.current)); // 余韻の初速を上限
      pausedUntilRef.current = performance.now() + SETTLE_MS;
    };
    // ドラッグした場合はケースへの遷移（Linkのクリック）を抑止
    const onClickCapture = (e: MouseEvent) => {
      if (movedRef.current) { e.preventDefault(); e.stopPropagation(); movedRef.current = false; }
    };

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("click", onClickCapture, true);

    const start = () => {
      half = track.scrollWidth / 2;
      const tick = () => {
        const now = performance.now();
        if (draggingRef.current) {
          // ドラッグ中は pointermove が位置を動かす
        } else if (Math.abs(velRef.current) > 0.05) {
          // 余韻（慣性）でなめらかに滑って減速
          posRef.current = wrap(posRef.current + velRef.current);
          velRef.current *= FRICTION;
          render();
          if (Math.abs(velRef.current) <= 0.05) pausedUntilRef.current = now + SETTLE_MS;
        } else if (now >= pausedUntilRef.current) {
          // 自動スクロール
          posRef.current += speed;
          if (posRef.current >= half) posRef.current -= half;
          render();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    // 自動スクロールは「帯の中で最初に見えている写真」が読めてから始める（従来の見え方を保つ）。
    // 画面外の写真は loading="lazy" なので、全部の load を待つと始まらない。
    // 枠の大きさは width/height（元写真の比率）で読み込み前から決まっているので、scrollWidth はこの時点で正しい
    const viewW = track.parentElement?.clientWidth ?? window.innerWidth;
    const left0 = track.getBoundingClientRect().left;
    const imgs = [...track.querySelectorAll("img")].filter((img) => img.getBoundingClientRect().left - left0 < viewW);
    const total = imgs.length;
    if (total === 0) { start(); return cleanup; }

    let loaded = 0;
    let started = false;
    const onLoad = () => {
      loaded++;
      if (loaded === total && !started) { started = true; start(); }
    };
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      }
    });
    if (loaded === total && !started) { started = true; start(); }

    return cleanup;

    function cleanup() {
      cancelAnimationFrame(rafRef.current);
      imgs.forEach((img) => { img.removeEventListener("load", onLoad); img.removeEventListener("error", onLoad); });
      track!.removeEventListener("pointerdown", onDown);
      track!.removeEventListener("pointermove", onMove);
      track!.removeEventListener("pointerup", onUp);
      track!.removeEventListener("pointercancel", onUp);
      track!.removeEventListener("click", onClickCapture, true);
    }
  }, []);

  const doubled = [...photos, ...photos];

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-[3px]"
        style={{ width: "max-content", touchAction: "pan-y", cursor: "grab", willChange: "transform" }}
      >
        {doubled.map((p, j) => (
          <div key={j} className="relative shrink-0 h-28 md:h-44 overflow-hidden group/photo">
            <img
              src={p.thumb}
              alt={`${label} ${j + 1}`}
              width={p.width}
              height={p.height}
              loading={j < eager ? undefined : "lazy"}
              decoding="async"
              draggable={false}
              className="h-full w-auto object-cover select-none transition-transform duration-700 group-hover/photo:scale-105"
              // 枠の比率は元写真に固定（サムネの丸め誤差で帯の長さ＝ループ位置がずれないように）
              style={p.width && p.height ? { aspectRatio: `${p.width} / ${p.height}` } : undefined}
            />
            <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/25 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
