import { planList, planNotes } from "@/app/plan/data";
import { getArticles } from "@/lib/notion";
import { SITE_URL as BASE } from "@/lib/structured-data";

// AI（ChatGPTなど）向けのサイト案内。料金はプランのデータ（app/plan/data.ts）から作るので、
// プランや注記を変えればここも自動で変わる。記事の一覧は sitemap と同じく1時間ごとに作り直す。
export const revalidate = 3600;

const SECTIONS = [
  { title: "前撮りの知識・準備", categories: ["knowledge", "prep"] },
  { title: "撮影したロケーション", categories: ["location"] },
];

export async function GET() {
  const articles = await getArticles();
  const link = (a: { title: string; slug: string }) => `- [${a.title}](${BASE}/journal/${a.slug})`;
  const known = SECTIONS.flatMap((s) => s.categories);
  const sections = [
    ...SECTIONS.map((s) => ({
      title: s.title,
      items: articles.filter((a) => s.categories.includes(a.category ?? "")),
    })),
    // 区分が書かれていない・新しい区分の記事も落とさない
    { title: "そのほかの記事", items: articles.filter((a) => !known.includes(a.category ?? "")) },
  ]
    .filter((s) => s.items.length > 0)
    .map((s) => `## ${s.title}\n\n${s.items.map(link).join("\n")}`)
    .join("\n\n");

  const planLines = planList
    .map((p) => {
      const tiers = p.tiers
        .map((t) => `  - ${t.name}: ${t.price}（${t.included.join("・")}）`)
        .join("\n");
      return `- [${p.name}（${p.subtitle}）](${BASE}/plan/${p.slug})\n${tiers}\n  - 納品の目安: ${p.delivery}`;
    })
    .join("\n");

  const body = `# in the moment

> 名古屋・愛知を拠点にした、ロケーション前撮り・フォトウェディングの撮影（写真・映像）。ポーズより余白を大切にした、ふたりの自然な時間を残す撮影です。岐阜・三重への出張、宿泊を伴う県外への出張撮影も承っています。

- 撮影エリア: 愛知県（名古屋市ほか）・岐阜県・三重県が中心。県外は出張で対応
- ご予約・お問い合わせ: LINE（https://lin.ee/OYalLp6）
- Instagram: https://www.instagram.com/in_the_moment_film/

## 料金プラン

${planLines}

${planNotes.map((n) => `- ${n}`).join("\n")}

## 主なページ

- [料金プラン一覧](${BASE}/plan)
- [撮影事例（ギャラリー）](${BASE}/gallery)
- [よくある質問](${BASE}/qa)
- [about](${BASE}/about)
- [利用規約](${BASE}/terms)

${sections}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
