"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // null = 判定前。判定前は src を設定せず、モバイルがデスクトップ用動画を読み始めるのを防ぐ
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isMobile === null) return;
    const video = videoRef.current;
    if (!video) return;

    // ポジションを強制リセットしてロード開始
    video.load();

    const playTimer = setTimeout(() => {
      video.play().catch(() => {});
    }, 4000);

    return () => clearTimeout(playTimer);
  }, [isMobile]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="auto"
      className="w-full h-full object-cover"
      src={isMobile === null ? undefined : isMobile ? "/hero-mobile-2.mp4" : "/hero2.mp4"}
    />
  );
}
