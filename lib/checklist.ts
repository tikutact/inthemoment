// markdown のタスクリスト（`- [ ] 項目`）を、記事内でタップできるチェックリストに変換する。
// marked の出力は `<li><input disabled="" type="checkbox"> 項目</li>` なので、
// disabled を外し、<label> で包んで行全体をタップ可能にする（JSなしでもチェックはできる）。
// 保存キーは項目テキストのハッシュ＝並べ替えても状態が保たれ、文言を直せばその項目だけリセットされる。

function hashKey(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

const TAGS = /<[^>]*>/g;

function box(label: string): string {
  const key = hashKey(label.replace(TAGS, ""));
  return `<label class="checklist-item"><input type="checkbox" data-ck="${key}"><span>${label}</span></label>`;
}

// 表のセル内の `[ ] 項目`（`<br>` 区切りで複数可）もチェックボックスにする
function markTableCells(html: string): string {
  return html.replace(/<td([^>]*)>([\s\S]*?)<\/td>/g, (cell, attrs: string, inner: string) => {
    if (!/\[[ xX]\]/.test(inner)) return cell;
    const rows = inner
      .split(/<br\s*\/?>/)
      .map((part) => {
        const t = part.trim();
        const m = t.match(/^\[[ xX]\]\s*([\s\S]*)$/);
        return m ? box(m[1].trim()) : t;
      })
      .join("");
    return `<td${attrs}>${rows}</td>`;
  });
}

export function markChecklists(html: string): string {
  return markTableCells(html).replace(/<ul>([\s\S]*?)<\/ul>/g, (block, inner: string) => {
    if (!inner.includes('type="checkbox"')) return block;

    const items = inner.replace(
      /<li>\s*<input([^>]*)>\s*([\s\S]*?)<\/li>/g,
      (li, attrs: string, text: string) => {
        if (!attrs.includes('type="checkbox"')) return li;
        return `<li>${box(text.trim())}</li>`;
      }
    );

    return `<ul class="checklist">${items}</ul>`;
  });
}
