import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "利用規約 - in the moment",
  description:
    "in the momentが提供する前撮り・フォトウェディング撮影サービスの利用規約。お申し込み・キャンセルポリシー・著作権・データ納品等の条件を掲載しています。",
  alternates: { canonical: "/terms" },
};

const h2Class =
  "text-sm md:text-base font-light text-[#1e1c1a] tracking-wide pt-8 md:pt-10 mt-8 md:mt-10 border-t border-[#1e1c1a]/10 first:pt-0 first:mt-0 first:border-t-0";
const pClass = "text-xs md:text-sm leading-[2.1] md:leading-[2.4] tracking-wide text-[#6b6560] font-light mt-4";
const ulClass = "mt-4 space-y-2";
const liClass = "text-xs md:text-sm leading-[2] md:leading-[2.2] tracking-wide text-[#6b6560] font-light pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[#9a9088]";
const noteClass = "text-[11px] md:text-xs leading-[1.9] tracking-wide text-[#9a9088] font-light mt-2 pl-4 relative before:content-['※'] before:absolute before:left-0";

const planRows = [
  { plan: "PHOTO Standard", content: "撮影時間4時間・お写真100カット・カラーグレーディング", price: "¥100,000", delivery: "撮影後約1ヶ月" },
  { plan: "PHOTO Hairmake", content: "撮影時間4時間・お写真100カット・カラーグレーディング・ヘアメイク（当日アテンド付き）", price: "¥155,000", delivery: "撮影後約1ヶ月" },
  { plan: "PHOTO+MOVIE Standard", content: "撮影時間4時間・お写真100カット・オープニングムービー約2分・カラーグレーディング・動画編集", price: "¥150,000", delivery: "撮影後約1.5ヶ月" },
  { plan: "PHOTO+MOVIE Hairmake", content: "撮影時間4時間・お写真100カット・オープニングムービー約2分・カラーグレーディング・動画編集・ヘアメイク（当日アテンド付き）", price: "¥205,000", delivery: "撮影後約1.5ヶ月" },
  { plan: "MOVIE Standard", content: "撮影時間4時間・オープニングムービー約2分・動画編集・カラーグレーディング", price: "¥100,000", delivery: "撮影後約1ヶ月" },
  { plan: "MOVIE Hairmake", content: "撮影時間4時間・オープニングムービー約2分・動画編集・カラーグレーディング・ヘアメイク（当日アテンド付き）", price: "¥155,000", delivery: "撮影後約1ヶ月" },
];

const cancelRows = [
  { period: "撮影日の31日前まで", fee: "無料" },
  { period: "撮影日の30日前〜8日前", fee: "ご契約金額の 50%" },
  { period: "撮影日の7日前〜前日", fee: "ご契約金額の 100%" },
  { period: "撮影当日・無断キャンセル", fee: "ご契約金額の 100%" },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "利用規約", path: "/terms" },
        ])}
      />
      <Navigation />

      <section className="pt-24 md:pt-44 pb-16 md:pb-32 px-4 md:px-6">
        <div style={{ opacity: 0, animation: "caseFadeIn 0.8s ease forwards" }}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 md:mb-16 text-center">
              <p className="text-[9px] tracking-[0.6em] text-[#9a9088] mb-6">TERMS</p>
              <h1
                className="text-xl md:text-2xl font-light text-[#1e1c1a] tracking-wide"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                利用規約
              </h1>
              <p className="text-[10px] text-[#9a9088] tracking-[0.15em] font-light mt-4">制定日：2026年6月</p>
            </div>

            <p className={pClass}>
              本利用規約（以下「本規約」）は、in the moment（以下「当方」）が提供する前撮り・フォトウェディング撮影サービス（以下「本サービス」）の利用に関する条件を定めるものです。本サービスをご利用いただくことで、本規約に同意いただいたものとみなします。
            </p>

            <h2 className={h2Class}>第1条　サービス内容</h2>
            <p className={pClass}>当方は、以下のプランに基づく前撮り・フォトウェディング撮影サービスを提供します。</p>
            {/* モバイル：カード表示 */}
            <div className="mt-4 md:hidden">
              {planRows.map((row) => (
                <div key={row.plan} className="py-4 border-t border-[#1e1c1a]/10 first:border-t-0">
                  <p className="text-xs text-[#1e1c1a] font-light mb-1.5">{row.plan}</p>
                  <p className="text-xs text-[#6b6560] font-light leading-[1.8] mb-2">{row.content}</p>
                  <div className="flex items-baseline justify-between text-xs text-[#6b6560] font-light">
                    <span>{row.price}</span>
                    <span>{row.delivery}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* PC：表テーブル */}
            <div className="mt-4 hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="text-[10px] font-light tracking-[0.15em] text-[#9a9088] pb-2">プラン</th>
                    <th className="text-[10px] font-light tracking-[0.15em] text-[#9a9088] pb-2">内容</th>
                    <th className="text-[10px] font-light tracking-[0.15em] text-[#9a9088] pb-2">料金</th>
                    <th className="text-[10px] font-light tracking-[0.15em] text-[#9a9088] pb-2">納品目安</th>
                  </tr>
                </thead>
                <tbody>
                  {planRows.map((row) => (
                    <tr key={row.plan} className="border-t border-[#1e1c1a]/10">
                      <td className="text-xs text-[#1e1c1a] font-light py-3 pr-4 align-top whitespace-nowrap">{row.plan}</td>
                      <td className="text-xs text-[#6b6560] font-light py-3 pr-4 align-top leading-[1.8]">{row.content}</td>
                      <td className="text-xs text-[#6b6560] font-light py-3 pr-4 align-top whitespace-nowrap">{row.price}</td>
                      <td className="text-xs text-[#6b6560] font-light py-3 align-top whitespace-nowrap">{row.delivery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={noteClass}>上記料金はすべて税込価格です。</p>
            <p className={noteClass}>ロケーション移動費・衣装費・ヘアメイク会場費等の実費が別途発生する場合があります。</p>

            <h2 className={h2Class}>第2条　お申し込みと予約確定</h2>
            <p className={pClass}>ご予約は、当方所定の申込フォームまたはLINEにてお申し込みいただき、以下の条件を満たした時点で確定とします。</p>
            <ul className={ulClass}>
              <li className={liClass}>撮影契約書へのご署名</li>
              <li className={liClass}>お申し込み金（総額の50%）のお支払い</li>
            </ul>
            <p className={pClass}>残金は撮影日の1週間前までにお支払いください。</p>

            <h2 className={h2Class}>第3条　キャンセルポリシー</h2>
            <p className={pClass}>お客様都合によるキャンセルの場合、以下のキャンセル料が発生します。</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="text-[10px] font-light tracking-[0.15em] text-[#9a9088] pb-2">キャンセル時期</th>
                    <th className="text-[10px] font-light tracking-[0.15em] text-[#9a9088] pb-2">キャンセル料</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelRows.map((row) => (
                    <tr key={row.period} className="border-t border-[#1e1c1a]/10">
                      <td className="text-xs text-[#6b6560] font-light py-3 pr-4 align-top">{row.period}</td>
                      <td className="text-xs text-[#6b6560] font-light py-3 align-top">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={noteClass}>天候・自然災害・その他不可抗力によるキャンセルの場合は、別途協議のうえ対応いたします。</p>
            <p className={noteClass}>当方都合によるキャンセルの場合は、いただいた料金を全額返金いたします。</p>

            <h2 className={h2Class}>第4条　著作権・肖像権</h2>
            <p className={pClass}>撮影により生成されたすべての写真・映像データの著作権は当方に帰属します。お客様には、個人的な使用に限り、データを利用する権利を許諾します。</p>
            <ul className={ulClass}>
              <li className={liClass}>お客様によるSNS・ブログへの個人的な掲載は自由に行えます。</li>
              <li className={liClass}>当方のポートフォリオ・SNS・ウェブサイトへの掲載については、撮影契約書にてお客様の同意を確認します。</li>
              <li className={liClass}>お客様が撮影データを第三者へ販売・譲渡・商業利用することは禁止します。</li>
            </ul>

            <h2 className={h2Class}>第5条　データ納品</h2>
            <p className={pClass}>納品物はギガファイル便を通じてデジタルデータにてお渡しします。ダウンロードURLはメールまたはLINEにてお送りします。</p>
            <ul className={ulClass}>
              <li className={liClass}>納品データのバックアップ管理はお客様自身の責任において行ってください。</li>
              <li className={liClass}>納品後3ヶ月を超えた場合、当方のデータ保管義務は消滅します。</li>
              <li className={liClass}>セレクト枚数を超えるカット・RAWデータの提供は行っておりません。</li>
            </ul>

            <h2 className={h2Class}>第6条　日程変更（リスケジュール）</h2>
            <p className={pClass}>お客様都合による撮影日の変更は、以下の条件にて対応いたします。</p>
            <ul className={ulClass}>
              <li className={liClass}>1回目のリスケジュールは無料です。撮影日の3日前までにご連絡ください。</li>
              <li className={liClass}>2回目以降のリスケジュールは別途協議とします。</li>
              <li className={liClass}>撮影日の2日前以降のご連絡によるリスケジュールは、キャンセルポリシーが適用される場合があります。</li>
              <li className={liClass}>天候・体調等のやむを得ない事情の場合は、柔軟に対応いたします。まずはご連絡ください。</li>
            </ul>

            <h2 className={h2Class}>第7条　撮影に関する注意事項</h2>
            <ul className={ulClass}>
              <li className={liClass}><span className="text-[#1e1c1a]">天候判断：</span>悪天候が予想される場合、撮影前日に当方よりご連絡のうえ、双方で実施可否を判断します。中止の場合はリスケジュールにて対応します。</li>
              <li className={liClass}><span className="text-[#1e1c1a]">遅刻・時間超過：</span>お客様のご都合による遅刻が生じた場合、撮影終了時間は変更せず、撮影時間が短縮されます。</li>
              <li className={liClass}><span className="text-[#1e1c1a]">撮影指示書：</span>撮影指示書（Pinterest・Instagram等の参考画像リストを含む）のご提出はお受けしておりません。ご希望のイメージは撮影前のヒアリングにてお伝えください。実際の撮影進行はフォトグラファーの判断・裁量に基づいて行います。</li>
              <li className={liClass}><span className="text-[#1e1c1a]">納品後の修正：</span>撮影・編集は当方のスタイル・世界観に基づいて行います。納品後の再編集・カット差し替え・修正対応は承っておりません。</li>
              <li className={liClass}><span className="text-[#1e1c1a]">撮影場所の許可申請：</span>ロケーション選定および撮影許可の申請は当方が行います。許可申請に費用が発生する場合は、実費をご負担いただきます。</li>
            </ul>

            <h2 className={h2Class}>第8条　SNSおよびインターネット上での誹謗中傷の禁止</h2>
            <div className="mt-4 border-l-2 border-[#1e1c1a] pl-4 py-1">
              <p className="text-xs md:text-sm leading-[2] tracking-wide text-[#1e1c1a] font-light">
                お客様は、本サービスに関連して、当方・当方のスタッフ・作品・サービス内容を貶める投稿、事実に反する虚偽の情報、または名誉・信用を毀損する内容をSNS・口コミサイト・その他インターネット上において投稿・公開することを禁止します。
              </p>
            </div>
            <p className={pClass}>当方は小規模の個人事業として運営しており、根拠のない誹謗中傷は事業の継続に直接的な影響を及ぼします。万が一、上記に該当する投稿が確認された場合、当方は以下の対応を取る権利を有します。</p>
            <ul className={ulClass}>
              <li className={liClass}>当該投稿の削除要請</li>
              <li className={liClass}>プラットフォームへの通報・申告</li>
              <li className={liClass}>弁護士を通じた内容証明の送付</li>
              <li className={liClass}>名誉毀損・業務妨害等を理由とする法的措置</li>
            </ul>
            <p className={pClass}>なお、サービスに関するご不満・ご意見については、投稿前に当方へ直接ご連絡いただくことを強くお願いいたします。誠実に対応いたします。</p>

            <h2 className={h2Class}>第9条　免責事項</h2>
            <ul className={ulClass}>
              <li className={liClass}>天候・ロケーション状況・お客様の体調等、当方の責によらない事情によりご希望通りの撮影ができない場合があります。</li>
              <li className={liClass}>機材トラブル等、当方の責に帰す事由でデータが損失した場合は、撮影料金の返金をもって賠償の上限とします。</li>
              <li className={liClass}>撮影中の事故・怪我については、当方の重大な過失によるものを除き、当方は責任を負いかねます。</li>
            </ul>

            <h2 className={h2Class}>第10条　規約の変更</h2>
            <p className={pClass}>当方は、必要に応じて本規約を変更することがあります。変更後の規約はウェブサイト（www.inthemoment.jp）に掲載した時点で効力を持ちます。</p>

            <h2 className={h2Class}>第11条　準拠法・管轄</h2>
            <p className={pClass}>本規約は日本法に準拠し、紛争が生じた場合は名古屋地方裁判所を第一審の専属的合意管轄裁判所とします。</p>

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
