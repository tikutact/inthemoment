"use client";

import { useState } from "react";

type QaItem = { q: string; a: string };
type QaGroup = { category: string; items: QaItem[] };

const qaData: QaGroup[] = [
  {
    category: "料金・支払い",
    items: [
      {
        q: "支払い方法を教えてください。",
        a: "現金手渡しまたは銀行振込にてお願いしております。",
      },
      {
        q: "予約時に手付金は必要ですか？",
        a: "ご予約確定後、お見積り金額の半額を手付金としてお振込みいただいております。残金は撮影1週間前までにお振込みください。",
      },
      {
        q: "キャンセル料はかかりますか？",
        a: "撮影日の30日前以降のキャンセルは50%、7日前以降は100%のキャンセル料が発生します。",
      },
    ],
  },
  {
    category: "ロケーション・衣装",
    items: [
      {
        q: "撮影場所はどうやって決めますか？",
        a: "ご希望のイメージや雰囲気をヒアリングし、一緒に決めていきます。候補地に迷われている場合もお気軽にご相談ください。",
      },
      {
        q: "衣装はどこで用意しますか？",
        a: "衣装はお客様にてご用意いただいております。",
      },
      {
        q: "愛知県外でも撮影できますか？",
        a: "国内全域への出張撮影が可能です。交通費・宿泊費は別途ご負担いただきます。宿泊を伴う場合は+¥18,000となります。",
      },
    ],
  },
  {
    category: "天気・延期",
    items: [
      {
        q: "雨天の場合はどうなりますか？",
        a: "撮影日3日前に雨天の場合は延期が可能です。撮影日前日までにご連絡ください。",
      },
      {
        q: "延期は何回までできますか？",
        a: "天候による延期は1回まで無料で承っております。2回目以降はご相談となります。",
      },
    ],
  },
  {
    category: "納品・データ",
    items: [
      {
        q: "納品までどのくらいかかりますか？",
        a: "写真は撮影から約4週間、動画は約6週間を目安にお届けしています。繁忙期は多少前後する場合があります。",
      },
      {
        q: "データはどのように受け取れますか？",
        a: "オンラインにてデータをお渡しします。JPEG形式（最大解像度）でのお届けです。",
      },
      {
        q: "データの使用に制限はありますか？",
        a: "SNSへの投稿やアルバム制作などご自由にお使いいただけます。商用利用や第三者への譲渡はご遠慮ください。",
      },
    ],
  },
];

export default function QaAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-12 md:space-y-16">
      {qaData.map((group) => (
        <div key={group.category}>
          <p className="text-[9px] tracking-[0.5em] text-[#9a9088] mb-8">
            {group.category}
          </p>
          <div className="space-y-0">
            {group.items.map((item) => (
              <div key={item.q} className="border-t border-[#1e1c1a]/8">
                <button
                  type="button"
                  onClick={() => setOpen(open === item.q ? null : item.q)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[13px] font-light tracking-wide text-[#1e1c1a]">
                    {item.q}
                  </span>
                  <span className="text-[#9a9088] text-xs shrink-0 mt-0.5 transition-transform duration-300"
                    style={{ transform: open === item.q ? "rotate(45deg)" : "rotate(0deg)" }}>
                    ＋
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === item.q ? "400px" : "0px" }}
                >
                  <p className="text-[12px] leading-[2.6] tracking-wide text-[#6b6560] font-light pb-6">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-[#1e1c1a]/8" />
          </div>
        </div>
      ))}
    </div>
  );
}
