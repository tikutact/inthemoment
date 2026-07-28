// 記事の目次。本文の `## 見出し` から自動生成する（記事mdに目次を手書きしない）。
// 見出しを足す・消す・並べ替えると目次も自動で追随する。

export type TocItem = { id: string; text: string };

// 見出しテキストから markdown の装飾を落とす（目次には素のテキストだけ出す）
function plain(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // リンク → テキスト
    .replace(/[*_`]/g, "")
    .trim();
}

// 本文markdownから h2 を順に拾う。id は出現順の連番（日本語見出しはURLで%エンコードされ読めなくなるため）
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inCode = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) items.push({ id: `section-${items.length + 1}`, text: plain(m[1]) });
  }
  return items;
}

// marked が出力した <h2> に、目次と同じ順で id を振る（アンカーの飛び先）
export function addHeadingIds(html: string, items: TocItem[]): string {
  let i = 0;
  return html.replace(/<h2>/g, () => (i < items.length ? `<h2 id="${items[i++].id}">` : "<h2>"));
}
