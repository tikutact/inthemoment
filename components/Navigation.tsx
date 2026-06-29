"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const planDropdown = [
  { label: "PHOTO", href: "/plan/photo" },
  { label: "PHOTO + MOVIE", href: "/plan/photo-movie" },
  { label: "MOVIE", href: "/plan/movie" },
];

const navLinkClass =
  "relative group text-[9px] tracking-[0.4em] text-[#1e1c1a] font-light";

function NavUnderline({ white = false }: { white?: boolean }) {
  return (
    <span className={`absolute -bottom-0.5 left-0 w-full h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${white ? "bg-white" : "bg-[#1e1c1a]"}`} />
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePlanOpen, setMobilePlanOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPlanPage = pathname.startsWith("/plan/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/" + href;
    }
  };

  const delay = (d: string) => isHome ? d : "0s";
  const mobileHero = isHome && !scrolled && !menuOpen;
  const desktopHero = isHome && !scrolled;
  const navColor = desktopHero ? "white" : "#1e1c1a";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
        style={{
          backgroundColor: (scrolled || isPlanPage || menuOpen) ? "rgba(250,247,242,0.96)" : "transparent",
          borderBottom: (scrolled || isPlanPage) ? "1px solid rgba(0,0,0,0.06)" : "none",
        }}
      >
        {/* デスクトップ */}
        <div className="hidden md:grid max-w-5xl mx-auto px-8 w-full h-20 grid-cols-3 items-center">
          {/* 左 */}
          <nav className="flex items-center gap-8">
            <Link href="/about" className={navLinkClass}
              style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.0s"), opacity: 0, color: navColor }}>
              ABOUT
              <NavUnderline white={desktopHero} />
            </Link>

            <div className="relative flex items-center"
              onMouseEnter={() => setPlanOpen(true)}
              onMouseLeave={() => setPlanOpen(false)}
              style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.15s"), opacity: 0 }}>
              <button type="button" onClick={() => handleNav("#plan")} className={navLinkClass} style={{ cursor: "pointer", color: navColor }}>
                PLAN
                <NavUnderline white={desktopHero} />
              </button>
              <div className="absolute top-full left-0 pt-4 transition-all duration-200"
                style={{ opacity: planOpen ? 1 : 0, pointerEvents: planOpen ? "auto" : "none", transform: planOpen ? "translateY(0)" : "translateY(-4px)" }}>
                <div className="py-3 px-0 min-w-[160px]"
                  style={{ backgroundColor: "rgba(250,247,242,0.97)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {planDropdown.map((p) => (
                    <Link key={p.href} href={p.href}
                      className="relative group block px-5 py-2.5 text-[9px] tracking-[0.4em] text-[#1e1c1a] font-light whitespace-nowrap">
                      {p.label}
                      <span className="absolute bottom-1.5 left-5 right-5 h-px bg-[#1e1c1a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <button type="button" onClick={() => handleNav("#reservation")} className={navLinkClass}
              style={{ cursor: "pointer", animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.3s"), opacity: 0, color: navColor }}>
              RESERVATION
              <NavUnderline white={desktopHero} />
            </button>
          </nav>

          {/* 中央：ロゴ */}
          <Link href="/" className="flex justify-center"
            style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.1s"), opacity: 0 }}>
            <img src="/logo.svg" alt="in the moment" className="h-16 w-auto transition-all duration-500"
              style={{ filter: desktopHero ? "invert(1)" : "none" }} />
          </Link>

          {/* 右 */}
          <div className="flex items-center justify-end gap-8">
            <Link href="/gallery" className={navLinkClass}
              style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.1s"), opacity: 0, color: navColor }}>
              GALLERY<NavUnderline white={desktopHero} />
            </Link>
            <Link href="/journal" className={navLinkClass}
              style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.15s"), opacity: 0, color: navColor }}>
              JOURNAL<NavUnderline white={desktopHero} />
            </Link>
            <Link href="/qa" className={navLinkClass}
              style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.2s"), opacity: 0, color: navColor }}>
              Q&amp;A<NavUnderline white={desktopHero} />
            </Link>
            <a href="https://www.instagram.com/in_the_moment_film/" target="_blank" rel="noopener noreferrer"
              className={navLinkClass}
              style={{ animation: "navFadeIn 0.8s ease forwards", animationDelay: delay("3.3s"), opacity: 0, color: navColor }}>
              INSTAGRAM<NavUnderline white={desktopHero} />
            </a>
          </div>
        </div>

        {/* モバイル */}
        <div className="flex md:hidden items-center justify-between px-5 h-16">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <img src="/logo.svg" alt="in the moment" className="h-12 w-auto transition-all duration-500"
              style={{ filter: mobileHero ? "invert(1)" : "none" }} />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            aria-label="メニュー"
          >
            <span className="block w-5 h-px transition-all duration-300"
              style={{ backgroundColor: mobileHero ? "white" : "#1e1c1a", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span className="block w-5 h-px transition-all duration-300"
              style={{ backgroundColor: mobileHero ? "white" : "#1e1c1a", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-px transition-all duration-300"
              style={{ backgroundColor: mobileHero ? "white" : "#1e1c1a", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </header>

      {/* モバイルメニューオーバーレイ */}
      <div
        className="fixed inset-0 z-40 bg-[#faf7f2] flex flex-col items-center justify-center transition-all duration-300 md:hidden"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        <nav className="flex flex-col items-center gap-10">
          <Link href="/about" onClick={() => setMenuOpen(false)}
            className="text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
            ABOUT
          </Link>

          <div className="flex flex-col items-center gap-4">
            <button type="button" onClick={() => setMobilePlanOpen(!mobilePlanOpen)}
              className="flex items-center gap-2 text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
              <span className="w-3 shrink-0" />
              PLAN
              <span className="text-[#9a9088] text-[8px] transition-transform duration-300 w-3 shrink-0"
                style={{ transform: mobilePlanOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {mobilePlanOpen && (
              <div className="flex flex-col items-center gap-4">
                {planDropdown.map((p) => (
                  <Link key={p.href} href={p.href} onClick={() => setMenuOpen(false)}
                    className="text-[10px] tracking-[0.4em] text-[#6b6560] font-light">
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/gallery" onClick={() => setMenuOpen(false)}
            className="text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
            GALLERY
          </Link>

          <Link href="/journal" onClick={() => setMenuOpen(false)}
            className="text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
            JOURNAL
          </Link>

          <Link href="/qa" onClick={() => setMenuOpen(false)}
            className="text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
            Q&amp;A
          </Link>

          <button type="button" onClick={() => { handleNav("#reservation"); }}
            className="text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
            RESERVATION
          </button>

          <a href="https://www.instagram.com/in_the_moment_film/" target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-[11px] tracking-[0.5em] text-[#1e1c1a] font-light">
            INSTAGRAM
          </a>
        </nav>
      </div>
    </>
  );
}
