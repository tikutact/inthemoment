import type { Metadata } from "next";

export type Tier = {
  name: string;
  price: string;
  included: string[];
};

export type PlanData = {
  slug: string;
  name: string;
  subtitle: string;
  duration: string;
  cuts: string;
  image: string;
  heroImage?: string;
  tierImage?: string;
  midImage?: string;
  youtubeUrl?: string;
  description: string;
  tiers: Tier[];
  flow: { time: string; label: string }[];
};

export function planMetadata(plan: PlanData): Metadata {
  return {
    title: `${plan.name} プラン（${plan.subtitle}）- 名古屋・愛知の前撮り料金`,
    description: `${plan.description.replace(/\n/g, "")}料金は${plan.tiers[0].price}〜（税込）。プラン内容と当日の流れをご案内します。`,
    alternates: { canonical: `/plan/${plan.slug}` },
  };
}

export const plans: Record<string, PlanData> = {
  photo: {
    slug: "photo",
    name: "PHOTO",
    subtitle: "写真のみ",
    duration: "4 h",
    cuts: "80 cuts",
    image: "/plan1-1200.jpg",
    heroImage: "/plan/photo-hero.jpg",
    tierImage: "/gallery/case-01/DSCF2631.jpg",
    midImage: "/gallery/case-03/DSCF4569.jpg",
    description:
      "ふたりの「いま」を、静止した光として残す。\nポーズよりも余白を、\n作り込みよりも呼吸を大切にした撮影です。",
    tiers: [
      {
        name: "Standard Plan",
        price: "¥100,000",
        included: [
          "撮影時間 4時間",
          "お写真 80カット",
          "撮影後のカラーグレーディング",
        ],
      },
      {
        name: "Hairmake Plan",
        price: "¥155,000",
        included: [
          "撮影時間 4時間",
          "お写真 80カット",
          "撮影後のカラーグレーディング",
          "ヘアメイク（当日アテンド付き）",
        ],
      },
    ],
    flow: [
      { time: "08:30", label: "集合・ご挨拶" },
      { time: "09:30", label: "ヘアメイク仕上げ確認・スタイリング調整" },
      { time: "10:00", label: "撮影スタート（ロケーション①）" },
      { time: "12:00", label: "移動・休憩" },
      { time: "12:30", label: "撮影（ロケーション②）" },
      { time: "〜4週間後", label: "データ納品" },
    ],
  },

  "photo-movie": {
    slug: "photo-movie",
    name: "PHOTO + MOVIE",
    subtitle: "写真＋映像",
    duration: "4 h",
    cuts: "80 cuts",
    image: "/plan2-1200.jpg",
    heroImage: "/plan/photo-movie-hero.jpg",
    tierImage: "/gallery/case-02/DSCF3957.jpg",
    midImage: "/gallery/case-02/20251124-rie-tomo6014.jpg",
    youtubeUrl: "https://youtu.be/q1lzqqLZfPc",
    description:
      "写真と映像、両方でふたりの記憶を包む。\n式当日に流すオープニングムービーと、\n静止した一瞬としての写真を同日に撮影します。",
    tiers: [
      {
        name: "Standard Plan",
        price: "¥150,000",
        included: [
          "撮影時間 4時間",
          "お写真 80カット",
          "オープニングムービー 約2分",
          "撮影後のカラーグレーディング・動画編集",
        ],
      },
      {
        name: "Hairmake Plan",
        price: "¥205,000",
        included: [
          "撮影時間 4時間",
          "お写真 80カット",
          "オープニングムービー 約2分",
          "撮影後のカラーグレーディング・動画編集",
          "ヘアメイク（当日アテンド付き）",
        ],
      },
    ],
    flow: [
      { time: "08:30", label: "集合・ご挨拶" },
      { time: "09:30", label: "ヘアメイク仕上げ確認・スタイリング調整" },
      { time: "10:00", label: "撮影スタート（写真＋動画同時進行）" },
      { time: "12:00", label: "移動・休憩" },
      { time: "12:30", label: "撮影（ロケーション②）" },
      { time: "〜6週間後", label: "写真・ムービーデータ納品" },
    ],
  },

  movie: {
    slug: "movie",
    name: "MOVIE",
    subtitle: "映像のみ",
    duration: "4 h",
    cuts: "—",
    image: "/plan3-1200.jpg",
    heroImage: "/plan/movie-hero.jpg",
    tierImage: "/gallery/case-01/DSCF2825.jpg",
    midImage: "/gallery/case-01/DSCF2727.jpg",
    youtubeUrl: "https://youtu.be/q1lzqqLZfPc",
    description:
      "動く記憶として、ふたりの時間を編む。\n式当日に流すオープニングムービーを、\n前撮りの空気感ごと映像に残します。",
    tiers: [
      {
        name: "Standard Plan",
        price: "¥100,000",
        included: [
          "撮影時間 4時間",
          "オープニングムービー 約2分",
          "撮影後の動画編集・カラーグレーディング",
        ],
      },
      {
        name: "Hairmake Plan",
        price: "¥155,000",
        included: [
          "撮影時間 4時間",
          "オープニングムービー 約2分",
          "撮影後の動画編集・カラーグレーディング",
          "ヘアメイク（当日アテンド付き）",
        ],
      },
    ],
    flow: [
      { time: "08:30", label: "集合・ご挨拶" },
      { time: "09:30", label: "ヘアメイク仕上げ確認・スタイリング調整" },
      { time: "10:00", label: "撮影スタート" },
      { time: "12:00", label: "移動・休憩" },
      { time: "12:30", label: "撮影（ロケーション②）" },
      { time: "〜6週間後", label: "ムービーデータ納品" },
    ],
  },
};
