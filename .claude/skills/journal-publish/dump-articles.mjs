// 全ジャーナル記事（✅公開中＋📝下書き）の本文をプレーンテキストで出力する
// 用途: 記事をまたいだ表現の重複チェック。実行後にgrepで言い回しを検索する
// 実行: node .claude/skills/journal-publish/dump-articles.mjs > /tmp/articles.txt
import { readFileSync } from "node:fs";
const env = readFileSync("/Users/suzukitakuto/Desktop/claude/inthemoment/.env.local", "utf8");
const TOKEN = env.match(/NOTION_TOKEN=(.+)/)[1].trim();
const PARENTS = {
  "公開": "37300e99-7dfa-818f-b4b3-f6a10726d5bf",
  "下書": "37300e99-7dfa-8115-a982-c0721e0b3938",
};

async function notion(path) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${JSON.stringify(json)}`);
  return json;
}
async function allChildren(id) {
  let out = [], cur;
  do {
    const p = await notion(`blocks/${id}/children?page_size=100${cur ? `&start_cursor=${cur}` : ""}`);
    out = out.concat(p.results);
    cur = p.has_more ? p.next_cursor : undefined;
  } while (cur);
  return out;
}
const text = (b) => (b[b.type]?.rich_text ?? []).map((r) => r.plain_text).join("");

for (const [group, pid] of Object.entries(PARENTS)) {
  for (const c of await allChildren(pid)) {
    if (c.type !== "child_page") continue;
    console.log(`\n===== [${group}] ${c.child_page.title} =====`);
    for (const b of await allChildren(c.id)) {
      const t = text(b);
      if (t) console.log(t);
    }
  }
}
