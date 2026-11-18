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

// かっこ・句読点のまわりの折り位置を約物の決まりに合わせる（2026-11-18）。
// BudouX は「（」の直後で区切ることがあり、「〜の前撮り（」と開きかっこが行末に残っていた。
// 開きかっこの直後・閉じかっこや句読点の直前では折らず、開きかっこの直前を折れる位置にする。
const OPEN = "（「『【〔［｛〈《"; // 全角のみ。半角の ( [ は英数字（f(x)・URL）の中に折り位置を作るので対象外
const CLOSE = "）」』】〕］｝〉》)\\]、。，．・：；！？";
const NO_BREAK_AFTER_OPEN = new RegExp(`([${OPEN}])<wbr>`, "g");
const NO_BREAK_BEFORE_CLOSE = new RegExp(`<wbr>([${CLOSE}])`, "g");
const BREAK_BEFORE_OPEN = new RegExp(`([^>${OPEN}])([${OPEN}])`, "g");

// WebKit（iPhoneのSafariを含む）は word-break: keep-all のとき「（」の直後で折ってしまう（<wbr>の有無に関係なく）。
// 開きかっこと次の1文字だけを nowrap で包み、かっこを後ろにくっつける。
// 文節ごと包むと「（0569-67-3700・9時〜16時・月曜休み）では、」のような長い文節がスマホ幅からはみ出したため、1文字に限る
const GLUE_OPEN = new RegExp(`([${OPEN}]+[^<${OPEN}]?)`, "g");
// 閉じかっこも同じ理由で行頭に出ることがある（「ご契約金額の50% ／ ）」）。直前の1文字とくっつける。
// GLUE_OPEN の後に掛ける。直前がタグ（>）のときは掛けない＝「（市）」のように中身が1文字だと閉じかっこは包まれない（実データでは起きない）
const CLOSE_BRACKETS = "）」』】〕］｝〉》";
const GLUE_CLOSE = new RegExp(`([^<>${OPEN}${CLOSE_BRACKETS}][${CLOSE_BRACKETS}]+)`, "g");

function fixPunctuation(s: string): string {
  return s
    .replace(NO_BREAK_AFTER_OPEN, "$1")
    .replace(NO_BREAK_BEFORE_CLOSE, "$1")
    .replace(BREAK_BEFORE_OPEN, "$1<wbr>$2")
    .replace(GLUE_OPEN, '<span class="nobr">$1</span>')
    .replace(GLUE_CLOSE, '<span class="nobr">$1</span>');
}

function breakText(text: string): string {
  if (!text.trim()) return text;
  return text
    .split(ENTITY)
    .map((part, i) => (i % 2 === 1 ? part : fixPunctuation(parser.parse(part).join("<wbr>"))))
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
