"use client";

import { useEffect, useRef } from "react";

export default function ShowcaseStrip({ photos, label }: { photos: string[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = window.innerWidth < 768 ? 0.065 : 0.15;
    let half = 0;

    const start = () => {
      half = track.scrollWidth / 2;
      const tick = () => {
        posRef.current += speed;
        if (posRef.current >= half) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const imgs = track.querySelectorAll("img");
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

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const doubled = [...photos, ...photos];

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-[3px]" style={{ width: "max-content" }}>
        {doubled.map((src, j) => (
          <div key={j} className="relative shrink-0 h-24 md:h-36 overflow-hidden group/photo">
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
