import type { Metadata } from "next";
import { DM_Sans, Zen_Kaku_Gothic_New, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SoundProvider from "@/components/SoundProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "in the moment | 前撮り・フォトウェディング",
  description:
    "ポーズよりも余白を大切に。ふたりの「いま」を写真と映像に残す、愛知を拠点とする前撮りチーム。言葉になる前の感情を、光の粒のような記憶として。出張撮影可。",
  metadataBase: new URL("https://www.inthemoment.jp"),
  openGraph: {
    title: "in the moment | 前撮り・フォトウェディング",
    description:
      "ポーズよりも余白を大切に。ふたりの「いま」を写真と映像に残す、愛知を拠点とする前撮りチーム。言葉になる前の感情を、光の粒のような記憶として。出張撮影可。",
    url: "https://www.inthemoment.jp",
    siteName: "in the moment",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/ogp.jpg", width: 1200, height: 630, alt: "in the moment - 前撮り・フォトウェディング" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "in the moment | 前撮り・フォトウェディング",
    description:
      "ポーズよりも余白を大切に。ふたりの「いま」を写真と映像に残す、愛知を拠点とする前撮りチーム。言葉になる前の感情を、光の粒のような記憶として。出張撮影可。",
    images: ["/ogp.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${dmSans.variable} ${zenKaku.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <SoundProvider />
        {children}
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
