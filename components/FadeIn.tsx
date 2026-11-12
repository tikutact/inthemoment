"use client";

import { useEffect, useRef, useState } from "react";

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  rootMargin = "0px 0px -60px 0px",
  waitForImages = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: string;
  /** どこまで画面に入ったら出すか。既定は下端から60px手前（画面の最下部にあるものは出すのが遅れる） */
  rootMargin?: string;
  /** true なら、中の写真（画面の横幅内にあるもの）が読み込めてから出す。枠だけ先に出て写真がパッと出るのを防ぐ。最長3秒で諦めて出す */
  waitForImages?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (!waitForImages) { setVisible(true); return; }
        // 横に流れる帯の画面外の写真（lazy）は読み込まれないので、横幅内のものだけ待つ
        const imgs = [...el.querySelectorAll("img")].filter(
          (img) => !img.complete && img.getBoundingClientRect().left < window.innerWidth
        );
        if (imgs.length === 0) { setVisible(true); return; }
        let left = imgs.length;
        const done = () => { if (--left <= 0) show(); };
        const stop = () => { clearTimeout(timer); imgs.forEach((img) => { img.removeEventListener("load", done); img.removeEventListener("error", done); }); };
        const show = () => { stop(); setVisible(true); };
        const timer = setTimeout(show, 3000);
        cleanupImgs = stop;
        imgs.forEach((img) => { img.addEventListener("load", done); img.addEventListener("error", done); });
      },
      { threshold: 0.1, rootMargin }
    );
    let cleanupImgs: (() => void) | null = null;
    observer.observe(el);
    return () => { observer.disconnect(); cleanupImgs?.(); };
  }, [rootMargin, waitForImages]);

  return (
    <div
      ref={ref}
      data-fadein=""
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
