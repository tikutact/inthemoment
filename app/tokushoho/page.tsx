import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - in the moment",
  description:
    "in the moment（前撮り・フォトウェディング撮影サービス）の特定商取引法に基づく表記です。",
  alternates: { canonical: "/tokushoho" },
};

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "事業者名", value: "in the moment" },
  {
    label: "運営統括責任者",
    value: "ご請求をいただいた場合、遅滞なく開示いたします。",
  },
  {
    label: "所在地",
    value: "ご請求をいただいた場合、遅滞なく開示いたします。",
  },
  {
    label: "電話番号",
    value: "ご請求をいただいた場合、遅滞なく開示いたします。",
  },
  { label: "メールアドレス", value: "tikutact@gmail.com" },
  {
    label: "販売価格",
    value: (
      <>
        各プランのページ（<a href="/plan" className="underline underline-offset-4 hover:text-[#6b6560]">料金プラン</a>）に記載の金額（すべて税込）。
      </>
    ),
  },
  {
    label: "商品代金以外の必要料金",
    value: "ロケーション移動費・衣装費・ヘアメイク会場費等の実費が別途発生する場合があります。",
  },
  { label: "お支払い方法", value: "現金手渡しまたは銀行振込" },
  {
    label: "お支払い時期",
    value: "ご予約確定時にお見積り金額の50%を手付金としてお支払いいただきます。残金は撮影日の1週間前までにお支払いください。",
  },
  {
    label: "サービス提供時期",
    value: "撮影後約1〜1.5ヶ月（プランにより異なります）",
  },
  {
    label: "キャンセル・返品について",
    value: (
      <>
        キャンセルポリシーの詳細は<a href="/terms" className="underline underline-offset-4 hover:text-[#6b6560]">利用規約</a>第3条をご確認ください。撮影・編集済みデータという性質上、納品後の返品はお受けできません。
      </>
    ),
  },
];

export default function TokushohoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "特定商取引法に基づく表記", path: "/tokushoho" },
        ])}
      />
      <Navigation />

      <section className="pt-24 md:pt-44 pb-16 md:pb-32 px-4 md:px-6">
        <div style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards" }}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 md:mb-16 text-center">
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-6">LEGAL</p>
              <h1
                className="text-lg md:text-2xl font-light text-[#1e1c1a] tracking-wide"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                特定商取引法に基づく表記
              </h1>
            </div>

            <dl>
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-1 md:gap-6 py-5 ${i === 0 ? "" : "border-t border-[#1e1c1a]/10"}`}
                >
                  <dt className="text-[11px] md:text-xs tracking-[0.1em] text-[#9a9088] font-light">{row.label}</dt>
                  <dd className="text-xs md:text-sm leading-[1.9] md:leading-[2.1] tracking-wide text-[#6b6560] font-light">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-16 pt-8 border-t border-[#1e1c1a]/10 text-center">
              <p className="text-[10px] text-[#9a9088] tracking-[0.15em] font-light">in the moment　|　www.inthemoment.jp</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#1e1c1a]/8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-[0.25em] font-light">in the moment</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/terms" className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light hover:text-[#6b6560] transition-colors">
              利用規約
            </a>
            <a href="/tokushoho" className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light hover:text-[#6b6560] transition-colors">
              特定商取引法に基づく表記
            </a>
            <p className="text-[10px] text-[#9a9088] tracking-[0.2em] font-light">
              © 2026 in the moment. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
