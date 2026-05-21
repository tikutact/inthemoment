"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const inTimer = setTimeout(() => setFadeIn(true), 100);
    const outTimer = setTimeout(() => setFadingOut(true), 2200);
    const hideTimer = setTimeout(() => setVisible(false), 3300);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#faf7f2] transition-opacity duration-1000"
      style={{ opacity: fadingOut ? 0 : 1, pointerEvents: fadingOut ? "none" : "auto" }}
    >
      <img
        src="/logo.svg"
        alt="in the moment"
        className="h-20 w-auto"
        style={{
          opacity: fadeIn ? 1 : 0,
          filter: fadeIn ? "blur(0px)" : "blur(8px)",
          transition: "opacity 1.2s ease, filter 1.4s ease",
        }}
      />
    </div>
  );
}
