"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export default function ConversionTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const a = el?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.href;
      if (href.includes("lin.ee") || href.includes("line.me")) {
        sendGAEvent("event", "line_click", {
          link_url: href,
          page_path: window.location.pathname,
        });
      } else if (href.includes("instagram.com")) {
        sendGAEvent("event", "instagram_click", {
          link_url: href,
          page_path: window.location.pathname,
        });
      }
    };
    // captureフェーズで拾う（遷移前に確実に送るため）
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
