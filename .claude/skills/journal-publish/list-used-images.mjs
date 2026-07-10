// 全ジャーナル記事（公開＝content/journal ＋ 下書き＝vault）で使用済みの画像パス一覧を出力する
// 用途: 新記事の画像選定前に実行し、ここに出ないファイルから選ぶ
// 実行: node .claude/skills/journal-publish/list-used-images.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const REPO = "/Users/suzukitakuto/Desktop/claude/inthemoment";
const SOURCES = [
  { dir: join(REPO, "content/journal"), group: "公開" },
  { dir: join(homedir(), "journal-drafts/inthemoment-drafts"), group: "下書き" },
];

const used = new Map(); // path -> [記事名(用途)]
function record(path, label) {
  if (!used.has(path)) used.set(path, []);
  used.get(path).push(label);
}

for (const { dir, group } of SOURCES) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(dir, f), "utf8");
    const title = (raw.match(/^title:\s*"?(.+?)"?\s*$/m) || [, f])[1];
    // frontmatter cover:
    const cover = raw.match(/^cover:\s*(\S+)\s*$/m);
    if (cover) record(cover[1], `${title}（カバー・${group}）`);
    // 本文 ![](path)
    for (const m of raw.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      record(m[1], `${title}（本文・${group}）`);
    }
  }
}

// プランページ使用分（app/plan/data.ts）
const planData = readFileSync(join(REPO, "app/plan/data.ts"), "utf8");
for (const m of planData.matchAll(/"(\/gallery\/[^"]+)"/g)) {
  record(m[1], "プランページ");
}

const sorted = [...used.entries()].sort((a, b) => a[0].localeCompare(b[0]));
console.log(`使用済み画像: ${sorted.length}件\n`);
for (const [path, labels] of sorted) {
  console.log(path);
  for (const l of labels) console.log(`  - ${l}`);
}

// 同じ写真がファイル名一致で複数使用されていないか（basenameで検出）
const byName = new Map();
for (const [path, labels] of used) {
  const name = decodeURIComponent(path.split("/").pop());
  if (!byName.has(name)) byName.set(name, []);
  byName.get(name).push(...labels.map((l) => `${l} ← ${path}`));
}
const dups = [...byName.entries()].filter(([, labels]) => labels.length > 1);
console.log(`\n⚠️ 同じ写真の複数使用（ファイル名一致）: ${dups.length}件`);
for (const [name, labels] of dups.sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(name);
  for (const l of labels) console.log(`  - ${l}`);
}
