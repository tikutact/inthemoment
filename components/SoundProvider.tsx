"use client";

import { useEffect } from "react";

const audioCtxRef = { current: null as AudioContext | null };

function getCtx() {
  if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
  return audioCtxRef.current;
}

function mkNoise(ctx: AudioContext, dur: number) {
  const size = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function playHover() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const n1 = ctx.createBufferSource();
  n1.buffer = mkNoise(ctx, 0.006);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass"; f1.frequency.value = 10000; f1.Q.value = 1.2;
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.35, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.006);
  n1.connect(f1); f1.connect(g1); g1.connect(ctx.destination);
  n1.start(now);

  const n2 = ctx.createBufferSource();
  n2.buffer = mkNoise(ctx, 0.03);
  const f2 = ctx.createBiquadFilter();
  f2.type = "bandpass"; f2.frequency.value = 4500; f2.Q.value = 2.0;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.20, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  n2.connect(f2); f2.connect(g2); g2.connect(ctx.destination);
  n2.start(now);

  const n3 = ctx.createBufferSource();
  n3.buffer = mkNoise(ctx, 0.02);
  const f3 = ctx.createBiquadFilter();
  f3.type = "bandpass"; f3.frequency.value = 1800; f3.Q.value = 1.5;
  const g3 = ctx.createGain();
  g3.gain.setValueAtTime(0.08, now);
  g3.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  n3.connect(f3); f3.connect(g3); g3.connect(ctx.destination);
  n3.start(now);
}

function playClick() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const n1 = ctx.createBufferSource();
  n1.buffer = mkNoise(ctx, 0.04);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass"; f1.frequency.value = 800; f1.Q.value = 1.0;
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.5, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  n1.connect(f1); f1.connect(g1); g1.connect(ctx.destination);
  n1.start(now);

  const n2 = ctx.createBufferSource();
  n2.buffer = mkNoise(ctx, 0.008);
  const f2 = ctx.createBiquadFilter();
  f2.type = "bandpass"; f2.frequency.value = 6000; f2.Q.value = 1.5;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.3, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
  n2.connect(f2); f2.connect(g2); g2.connect(ctx.destination);
  n2.start(now);
}

let currentLink: Element | null = null;

export default function SoundProvider() {
  useEffect(() => {
    const onMouseOver = (e: MouseEvent) => {
      const to = (e.target as Element)?.closest("a, button");
      if (!to || to === currentLink) return;
      currentLink = to;
      playHover();
    };
    const onMouseOut = (e: MouseEvent) => {
      const to = (e.relatedTarget as Element)?.closest("a, button");
      if (!to) currentLink = null;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("a, button")) playClick();
    };
    const onTouchStart = (e: TouchEvent) => {
      if ((e.touches[0]?.target as Element)?.closest("a, button")) playHover();
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick);
    document.addEventListener("touchstart", onTouchStart);
    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick);
      document.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return null;
}
