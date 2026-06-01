import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";

export default function AboutPage() {
  return (
    <>
      <Navigation />

      <section className="pt-24 md:pt-44 pb-16 md:pb-32 px-4 md:px-6">
        <FadeIn>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* 1列 */}
            <div className="grid grid-cols-2 gap-1 md:gap-2">
              <img src="/gallery/case-01/DSCF2803.jpg" alt="" className="w-full aspect-[3/4] object-cover" />
              <img src="/gallery/case-02/20251124-rie-tomo5965.jpg" alt="" className="w-full aspect-[3/4] object-cover" />
              <img src="/gallery/case-03/DSCF4512.jpg" alt="" className="w-full aspect-[3/4] object-cover" />
              <img src="/gallery/case-04/DSCF3036.jpg" alt="" className="w-full aspect-[3/4] object-cover" />
            </div>

            {/* テキスト */}
            <div className="pt-2">
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-6 md:mb-10">ABOUT</p>

              <p
                className="text-sm md:text-lg font-light text-[#1e1c1a] leading-relaxed mb-6 md:mb-12"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {"\"言葉になる前の感情を、"}<br /><span style={{whiteSpace:"nowrap"}}>{"光の粒のような記憶として。\""}</span>
              </p>

              <div className="space-y-5 md:space-y-8 text-xs md:text-sm leading-[2.2] md:leading-[2.6] tracking-wide text-[#6b6560] font-light">
                <p>私たちが写したいのは、ただ美しい写真ではなく、<br className="block md:hidden" />ふたりが「その瞬間」に感じていた温度や、<br className="block md:hidden" />言葉にしないまなざし、<br className="hidden md:block" />胸の奥でふわりと揺れた気持ちです。</p>
                <p>風が頬を撫でたこと、手をそっと重ねた感触、<br className="block md:hidden" />ふと見つめ合って笑った理由さえ、<br className="block md:hidden" />写真に残したい物語の一部です。</p>
                <p>in the moment は、ポーズよりも余白を大切にします。<br className="block md:hidden" />飾らなくていいし、うまく笑わなくても大丈夫。<br className="block md:hidden" />ふたりがふたりであることを、そのまま。</p>
                <p>言葉になる前の感情、光の粒のような記憶、<br />「いま」という奇跡を、写真にします。</p>
              </div>

              <div className="mt-8 md:mt-14 pt-6 md:pt-10 border-t border-[#1e1c1a]/10">
                <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-4 md:mb-6">CONTACT</p>
                <a
                  href="https://lin.ee/OYalLp6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[10px] md:text-xs tracking-[0.25em] text-[#6b6560] border border-[#6b6560]/30 px-5 py-3 hover:border-[#6b6560] transition-colors duration-300"
                >
                  LINE でお問い合わせ
                </a>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-[#1e1c1a]/8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-[0.25em] font-light">in the moment</p>
          <p className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light">
            © 2026 in the moment. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
