// ギャラリー写真の「一覧用サムネイル」と「寸法表」を作る（何度実行しても同じ結果になる）
//
//   npm run gallery:thumbs
//
// - 入力: public/gallery/case-XX/*.jpg（長辺1200pxの掲載写真）
// - 出力1: public/gallery/case-XX/thumb/<元の名前>.webp（高さ480px）
//          /gallery 一覧の帯は高さ160px（md:176px）なので、3倍密度の画面でも足りる高さにしてある
// - 出力2: app/gallery/photo-sizes.json（元写真の幅・高さ）
//          <img width height> に入れて、読み込み前から枠の大きさを決める（遅延読み込みとずれ防止のため）
//
// 既にあるサムネは作り直さない（写真の差し替えは新しいファイル名で行う運用: gallery-case-add スキル）。
// npm run build の前（prebuild）にも走るので、サムネを作り忘れてもデプロイ時に補われる。
// sharp は next が同梱しているもの（next の optionalDependencies）を使う。
// 読み込めない環境では何もせず終わる（その場合、ページは元写真をそのまま表示する: app/gallery/images.ts）。
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const GALLERY = path.join(ROOT, "public/gallery");
const SIZES = path.join(ROOT, "app/gallery/photo-sizes.json");
const THUMB_HEIGHT = 480; // app/gallery/images.ts と揃える

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("[gallery-thumbs] sharp を読み込めないためスキップします（元写真で表示されます）");
  process.exit(0);
}

const sizes = {};
let made = 0;
const cases = fs.readdirSync(GALLERY, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
for (const c of cases) {
  const dir = path.join(GALLERY, c);
  const thumbDir = path.join(dir, "thumb");
  const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f)).sort();
  if (files.length === 0) continue;
  fs.mkdirSync(thumbDir, { recursive: true });
  for (const f of files) {
    const src = path.join(dir, f);
    const meta = await sharp(src).rotate().metadata();
    // EXIF の向きを反映した見た目の寸法（rotate() 後の autoOrient 値）
    const w = meta.autoOrient?.width ?? meta.width;
    const h = meta.autoOrient?.height ?? meta.height;
    sizes[`/gallery/${c}/${f}`] = [w, h];
    const out = path.join(thumbDir, f.replace(/\.jpe?g$/i, ".webp"));
    if (fs.existsSync(out)) continue;
    await sharp(src).rotate().resize({ height: Math.min(THUMB_HEIGHT, h) }).webp({ quality: 78 }).toFile(out);
    made++;
  }
}

const json = JSON.stringify(sizes, null, 0).replace(/\],"/g, '],\n"').replace(/^\{/, "{\n").replace(/\}$/, "\n}") + "\n";
if (!fs.existsSync(SIZES) || fs.readFileSync(SIZES, "utf8") !== json) fs.writeFileSync(SIZES, json);
console.log(`[gallery-thumbs] ${Object.keys(sizes).length} 枚の寸法を記録、サムネを ${made} 枚作成`);
