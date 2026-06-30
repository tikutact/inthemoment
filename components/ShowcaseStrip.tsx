"use client";

import { useEffect, useRef } from "react";

export default function ShowcaseStrip({ photos, label }: { photos: string[]; label: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const speed = window.innerWidth < 768 ? 0.4 : 0.6;
    let half = 0;

    // 指やマウスで触ったら自動を一時停止し、操作が落ち着いたら現在位置から再開
    const pause = () => {
      pausedRef.current = true;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        posRef.current = half > 0 ? scroller.scrollLeft % half : scroller.scrollLeft;
        pausedRef.current = false;
      }, 1800);
    };
    scroller.addEventListener("pointerdown", pause);
    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("wheel", pause, { passive: true });

    const start = () => {
      half = scroller.scrollWidth / 2;
      const tick = () => {
        if (!pausedRef.current) {
          posRef.current += speed;
          if (half > 0 && posRef.current >= half) posRef.current -= half;
          scroller.scrollLeft = posRef.current;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const imgs = scroller.querySelectorAll("img");
    const total = imgs.length;
    if (total === 0) { start(); return; }

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === total) start();
    };
    imgs.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        loaded++;
      } else {
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      }
    });
    if (loaded === total) start();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      scroller.removeEventListener("pointerdown", pause);
      scroller.removeEventListener("touchstart", pause);
      scroller.removeEventListener("wheel", pause);
    };
  }, []);

  const doubled = [...photos, ...photos];

  return (
    <div ref={scrollerRef} className="overflow-x-auto overflow-y-hidden no-scrollbar">
      <div className="flex gap-[3px]" style={{ width: "max-content" }}>
        {doubled.map((src, j) => (
          <div key={j} className="relative shrink-0 h-40 md:h-44 overflow-hidden group/photo">
            <img
              src={src}
              alt={`${label} ${j + 1}`}
              className="h-full w-auto object-cover transition-transform duration-700 group-hover/photo:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/25 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
