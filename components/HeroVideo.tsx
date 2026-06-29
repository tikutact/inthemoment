"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
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
      src={isMobile ? "/hero-mobile.mp4" : "/hero2.mp4"}
    />
  );
}
