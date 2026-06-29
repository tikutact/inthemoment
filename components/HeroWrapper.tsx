"use client";
import { useEffect, useRef } from "react";
import HeroVideo from "./HeroVideo";

export default function HeroWrapper() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = `${window.innerHeight}px`;
    }
  }, []);

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-xl md:rounded-none bg-[#e8e3dc] h-[100svh] md:h-auto md:aspect-[16/9]"
    >
      <HeroVideo />
    </div>
  );
}
