// 日本語の折り返しを文節単位にする。
// 2026-08-19: 読点ごとの強制改行（comma-br）を廃止し、これに置き換えた。
// 強制的に折るのではなく「折れてよい位置」だけを <wbr> で示す。実際に改行するのは
// 行があふれる時だけで、その手前のいちばん近い文節の切れ目で折れる。
// CSS 側の `word-break: keep-all`（文節以外では折らない）と対になっている。
import { loadJapaneseParser } from "./budoux/parser";

const parser = loadJapaneseParser();

// 中身を機械可読な文字列として扱う要素。ここに <wbr> を入れると意味が壊れる
const SKIP_TAGS = new Set(["pre", "code", "script", "style", "textarea"]);

// HTMLエンティティ（&amp; 等）は分割対象から外す。途中に <wbr> が入ると実体参照が壊れるため
const ENTITY = /(&[a-zA-Z][a-zA-Z0-9]*;|&#[0-9]+;|&#x[0-9a-fA-F]+;)/;

function breakText(text: string): string {
  if (!text.trim()) return text;
  return text
    .split(ENTITY)
    .map((part, i) => (i % 2 === 1 ? part : parser.parse(part).join("<wbr>")))
    .join("");
}

/** HTML のテキストノードだけに、文節の切れ目を示す <wbr> を挿入する */
export function insertPhraseBreaks(html: string): string {
  const tag = /<[^>]+>/g;
  let out = "";
  let cursor = 0;
  let skipDepth = 0;
  let m: RegExpExecArray | null;

  while ((m = tag.exec(html)) !== null) {
    const text = html.slice(cursor, m.index);
    out += skipDepth > 0 ? text : breakText(text);

    const name = /^<\/?([a-zA-Z][a-zA-Z0-9]*)/.exec(m[0])?.[1]?.toLowerCase();
    if (name && SKIP_TAGS.has(name)) {
      if (m[0].startsWith("</")) skipDepth = Math.max(0, skipDepth - 1);
      else if (!m[0].endsWith("/>")) skipDepth += 1;
    }

    out += m[0];
    cursor = tag.lastIndex;
  }

  const rest = html.slice(cursor);
  return out + (skipDepth > 0 ? rest : breakText(rest));
}

const ESCAPE: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

/** プレーンテキスト（記事タイトル・FAQ本文など）を、文節で折れるHTMLにする */
export function phraseHtml(text: string): string {
  return insertPhraseBreaks(text.replace(/[&<>"]/g, (c) => ESCAPE[c]));
}
