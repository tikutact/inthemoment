// 全ジャーナル記事（✅公開中＋📝下書き）で使用済みの画像URL一覧を出力する
// 用途: 新記事の画像選定前に実行し、ここに出ないファイルから選ぶ
// 実行: node .claude/skills/journal-publish/list-used-images.mjs
import { readFileSync } from "node:fs";

const env = readFileSync("/Users/suzukitakuto/Desktop/claude/inthemoment/.env.local", "utf8");
const TOKEN = env.match(/NOTION_TOKEN=(.+)/)[1].trim();
const PARENTS = {
  "✅公開中": "37300e99-7dfa-818f-b4b3-f6a10726d5bf",
  "📝下書き": "37300e99-7dfa-8115-a982-c0721e0b3938",
};

async function notion(path) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${JSON.stringify(json)}`);
  return json;
}

async function allChildren(blockId) {
  let results = [];
  let cursor;
  do {
    const page = await notion(`blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`);
    results = results.concat(page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return results;
}

const used = new Map(); // url -> [記事名(用途)]
function record(url, label) {
  if (!used.has(url)) used.set(url, []);
  used.get(url).push(label);
}

for (const [group, parentId] of Object.entries(PARENTS)) {
  const children = await allChildren(parentId);
  for (const block of children) {
    if (block.type !== "child_page") continue;
    const title = block.child_page.title;
    const page = await notion(`pages/${block.id}`);
    if (page.cover?.external?.url) record(page.cover.external.url, `${title}（カバー・${group}）`);
    const blocks = await allChildren(block.id);
    for (const b of blocks) {
      const url = b.type === "image" ? (b.image.external?.url ?? b.image.file?.url) : null;
      if (url) record(url, `${title}（本文・${group}）`);
    }
  }
}

// プランページ使用分（ローカルのdata.tsから抽出）
const planData = readFileSync("/Users/suzukitakuto/Desktop/claude/inthemoment/app/plan/data.ts", "utf8");
for (const m of planData.matchAll(/"(\/gallery\/[^"]+)"/g)) {
  record(`https://www.inthemoment.jp${m[1]}`, "プランページ");
}

const sorted = [...used.entries()].sort((a, b) => a[0].localeCompare(b[0]));
console.log(`使用済み画像: ${sorted.length}件\n`);
for (const [url, labels] of sorted) {
  console.log(url);
  for (const l of labels) console.log(`  - ${l}`);
}

// 同一写真が別URLパスで使われているケースの検出（旧記事は /journal/yh/ 等の別パスを使用）
// ファイル名（basename）が同じ＝同じ写真とみなして重複を警告する
const byName = new Map();
for (const [url, labels] of used) {
  const name = decodeURIComponent(url.split("/").pop());
  if (!byName.has(name)) byName.set(name, []);
  byName.get(name).push(...labels.map((l) => `${l} ← ${url}`));
}
const dups = [...byName.entries()].filter(([, labels]) => labels.length > 1);
console.log(`\n⚠️ 同じ写真の複数使用（ファイル名一致）: ${dups.length}件`);
for (const [name, labels] of dups.sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(name);
  for (const l of labels) console.log(`  - ${l}`);
}
