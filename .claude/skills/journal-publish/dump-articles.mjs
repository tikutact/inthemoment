// 全ジャーナル記事（公開＝content/journal ＋ 下書き＝vault）の本文をプレーンテキストで出力する
// 用途: 記事をまたいだ表現の重複チェック。実行後にgrepで言い回しを検索する
// 実行: node .claude/skills/journal-publish/dump-articles.mjs > /tmp/articles.txt
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SOURCES = [
  { dir: "/Users/suzukitakuto/Desktop/claude/inthemoment/content/journal", group: "公開" },
  { dir: join(homedir(), "journal-drafts/inthemoment-drafts"), group: "下書" },
];

for (const { dir, group } of SOURCES) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const raw = readFileSync(join(dir, f), "utf8");
    const m = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    const title = (raw.match(/^title:\s*"?(.+?)"?\s*$/m) || [, f])[1];
    const body = (m ? m[1] : raw)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 画像除去
      .replace(/^#+\s*/gm, "")               // 見出し記号除去
      .replace(/\n{2,}/g, "\n")              // 空行圧縮
      .trim();
    console.log(`\n===== [${group}] ${title} =====`);
    console.log(body);
  }
}
