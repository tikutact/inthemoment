// inthemoment ジャーナル下書き3本を Notion 📝下書き に作成する
// 実行: node create-drafts.mjs （cwd: どこでも可。ENVは .env.local から読む）
import { readFileSync } from "node:fs";

const env = readFileSync("/Users/suzukitakuto/Desktop/claude/inthemoment/.env.local", "utf8");
const TOKEN = env.match(/NOTION_TOKEN=(.+)/)[1].trim();
const DRAFT_PARENT = "37300e99-7dfa-8115-a982-c0721e0b3938"; // 📝 下書き
const BASE = "https://www.inthemoment.jp";
const BACK_URL = "https://www.notion.so/37300e997dfa8115a982c0721e0b3938";

// 行の種類: "## " => heading_2 / "img:" => image / "" => 空段落 / それ以外 => paragraph
// リンクは [テキスト](URL) を1つだけ含む行に対応
function toBlock(line) {
  if (line.startsWith("## ")) {
    return { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] } };
  }
  if (line.startsWith("img:")) {
    return { object: "block", type: "image", image: { type: "external", external: { url: BASE + line.slice(4) } } };
  }
  const m = line.match(/^(.*)\[(.+?)\]\((.+?)\)(.*)$/);
  if (m) {
    const rich = [];
    if (m[1]) rich.push({ type: "text", text: { content: m[1] } });
    rich.push({ type: "text", text: { content: m[2], link: { url: m[3] } } });
    if (m[4]) rich.push({ type: "text", text: { content: m[4] } });
    return { object: "block", type: "paragraph", paragraph: { rich_text: rich } };
  }
  return { object: "block", type: "paragraph", paragraph: { rich_text: line === "" ? [] : [{ type: "text", text: { content: line } }] } };
}

const articles = [
  {
    title: "ロケーション前撮りとスタジオ撮影",
    cover: "/gallery/case-03/DSCF4569.jpg",
    lines: [
      `[← 戻る](${BACK_URL})`,
      "前撮りを調べはじめると、最初に出てくるのがこの選択です。",
      "スタジオで撮るか、ロケーションで撮るか。",
      "名古屋・愛知にはどちらの選択肢もあり、それぞれに良さがあります。",
      "in the momentはロケーション撮影を中心にしていますが、できるだけ公平に、両方の違いを書いてみます。",
      "",
      "## スタジオ撮影の良さ",
      "",
      "天候に左右されない。それがスタジオのいちばんの強みです。",
      "雨でも風でも、予定どおりに撮影が進みます。",
      "空調があるので、真夏や真冬でも快適に過ごせます。",
      "照明が整っているぶん、仕上がりのイメージがぶれにくいのも特徴です。",
      "",
      "## ロケーション撮影の良さ",
      "",
      "ロケーションの魅力は、その日、その場所にしかない光で撮れることです。",
      "海の風、夕方の斜めの光、雨上がりの湿った空気。",
      "同じ場所でも、同じ写真は二度と撮れません。",
      "ふたりの思い出の場所や、好きな景色を選べるのも大きな違いです。",
      "写真の背景が、セットではなく本物であること。",
      "それは、何年後かに見返したときの記憶の残り方を変えます。",
      "",
      "img:/gallery/case-01/DSCF2727.jpg",
      "## 迷ったら、残したい一枚から",
      "",
      "きちんとした一枚を確実に残したいなら、スタジオが向いています。",
      "ふたりの空気ごと残したいなら、ロケーションをおすすめします。",
      "アルバムの表紙になる一枚か、日常の延長にある一枚か。",
      "手元に残したい写真を想像すると、自然と答えが見えてきます。",
      "",
      "## in the momentの場合",
      "",
      "私たちは、愛知を拠点にロケーション前撮りを中心としています。",
      "ポーズよりも余白を、作り込みよりも呼吸を大切にした撮影です。",
      "撮影時間は4時間。ロケーションは2か所まわることができます。",
      "悪天候の場合は、日程の変更にも柔軟に対応しています。",
      "",
      "img:/gallery/case-04/DSCF2909.jpg",
      "前撮りもフォトウェディングも、一生に一度きりのもの。",
      "だからこそ、ふたりに合った撮り方を選んでください。",
      "迷ったときは、いつでも気軽にご相談ください。",
      "",
      "名古屋・愛知を中心に前撮り・フォトウェディングのご相談はLINEからどうぞ。→ https://lin.ee/OYalLp6",
    ],
  },
  {
    title: "式を挙げない、という選択",
    cover: "/gallery/case-02/DSCF3957.jpg",
    lines: [
      `[← 戻る](${BACK_URL})`,
      "結婚式を挙げない。",
      "そう決めるふたりが、いま増えています。",
      "入籍だけで済ませるつもりだったけれど、写真だけは残しておきたい。",
      "そんな声から選ばれているのが、フォトウェディングです。",
      "",
      "## 式はしない。でも、何も残らないのは少しさみしい",
      "",
      "結婚式を挙げない理由は、ふたりの数だけあります。",
      "費用を抑えたい、大勢の前に立つのが苦手、準備の時間が取れない。",
      "どれも、まっとうな理由です。",
      "ただ、数年後にふと、あのとき何か残しておけばよかったと思う方が多いのも事実で。",
      "ドレスを着る機会は、自分たちでつくらない限り、訪れません。",
      "",
      "## フォトウェディングでできること",
      "",
      "フォトウェディングは、挙式のかわりに、写真でふたりの節目を残すものです。",
      "ウェディングドレスも、和装も、思い入れのある私服も。",
      "ふたりらしい姿で、好きな場所で撮ることができます。",
      "ご両親への報告やお披露目として、写真を贈る方もいます。",
      "前撮りとの違いは、[前撮りとフォトウェディングの違い](https://www.inthemoment.jp/journal/37900e997dfa81319560c0ee78781743)の記事にまとめています。",
      "",
      "img:/gallery/case-02/20251124-rie-tomo5955.jpg",
      "## 費用について",
      "",
      "名古屋・愛知でのフォトウェディングは、式を挙げる場合に比べて費用を大きく抑えられます。",
      "in the momentの場合、写真のみのプランで¥100,000から。",
      "撮影時間は4時間、80カットをカラーグレーディングしてお届けします。",
      "",
      "## ふたりだけの結婚式として",
      "",
      "式を挙げないことは、何かを諦めることではありません。",
      "形式ではなく、ふたりの時間を選ぶということ。",
      "撮影の日は、ふたりにとっての小さな結婚式になります。",
      "ドレスを着て、好きな場所を歩いて、笑って。",
      "その数時間が、これからのふたりの原点として残っていきます。",
      "",
      "img:/gallery/case-01/A7C04388.jpg",
      "名古屋・愛知を中心に前撮り・フォトウェディングのご相談はLINEからどうぞ。→ https://lin.ee/OYalLp6",
    ],
  },
  {
    title: "前撮り当日の流れ",
    cover: "/gallery/case-01/DSCF2631.jpg",
    lines: [
      `[← 戻る](${BACK_URL})`,
      "前撮りの当日は、朝から始まります。",
      "はじめての撮影は、わからないことだらけで緊張するもの。",
      "この記事では、in the momentの撮影当日の流れを、時間を追ってご紹介します。",
      "名古屋・愛知でロケーション前撮りやフォトウェディングを検討しているふたりの、イメージづくりになれば。",
      "",
      "## 8:30 集合・ご挨拶",
      "",
      "当日は、朝8時半ごろに集合することが多いです。",
      "まずはゆっくりご挨拶をして、当日の流れとルートを一緒に確認します。",
      "",
      "## 9:30 ヘアメイク・スタイリングの確認",
      "",
      "ヘアメイクの仕上がりを確認して、衣装のスタイリングを整えます。",
      "気になるところがあれば、ここで遠慮なく伝えてください。",
      "鏡の前の時間も、当日の楽しみのひとつです。",
      "",
      "## 10:00 撮影スタート",
      "",
      "ひとつめのロケーションで撮影が始まります。",
      "最初は、歩いたり、話したり、ふたりのペースをつかむところから。",
      "カメラに慣れてきたころに、自然な表情が出はじめます。",
      "ポーズの指定は最小限に、ふたりの呼吸に合わせて撮っていきます。",
      "",
      "img:/gallery/case-04/DSCF2921.jpg",
      "## 12:00 移動・休憩",
      "",
      "お昼をはさんで、次のロケーションへ移動します。",
      "飲み物と軽食を用意しておくと、午後が楽になります。",
      "",
      "## 12:30 ふたつめのロケーションへ",
      "",
      "光の向きが変わって、午前とは違う空気の写真になります。",
      "同じ日でも、場所と時間が変わるだけで、写真の表情は驚くほど変わります。",
      "",
      "img:/gallery/case-03/A7C05586.jpg",
      "## 撮影後、納品まで",
      "",
      "撮影したデータは、一枚ずつカラーグレーディングを行います。",
      "写真のみのプランで約4週間、ムービーを含むプランで約6週間ほどでお届けします。",
      "届いた写真を見ながら、撮影の日をもう一度ふたりで歩き直す。",
      "その時間まで含めて、前撮りだと思っています。",
      "",
      "当日の持ち物や事前の準備については、[前撮り、準備すること](https://www.inthemoment.jp/journal/37700e997dfa810d9d36ea000937db77)の記事にまとめています。",
      "わからないことは、いつでも聞いてください。",
      "",
      "名古屋・愛知を中心に前撮り・フォトウェディングのご相談はLINEからどうぞ。→ https://lin.ee/OYalLp6",
    ],
  },
];

async function notion(path, method, body) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${JSON.stringify(json)}`);
  return json;
}

for (const a of articles) {
  const page = await notion("pages", "POST", {
    parent: { page_id: DRAFT_PARENT },
    cover: { type: "external", external: { url: BASE + a.cover } },
    properties: { title: { title: [{ type: "text", text: { content: a.title } }] } },
    children: a.lines.map(toBlock),
  });
  console.log(`created: ${a.title} -> ${page.id}`);
}
