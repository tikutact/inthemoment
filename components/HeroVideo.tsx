"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = 0;
      video.play();
    }, 3400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload={isMobile ? "none" : "metadata"}
      className="w-full h-full object-cover"
      src={isMobile ? "/hero-mobile.mp4" : "/hero.mp4"}
    />
  );
}
