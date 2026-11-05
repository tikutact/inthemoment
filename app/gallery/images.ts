import sizes from "./photo-sizes.json";

// ギャラリー写真の表示用情報。寸法とサムネは scripts/gallery-thumbs.mjs が作る（npm run gallery:thumbs）
// 寸法表に無い写真（サムネ未作成）は、従来どおり元写真をそのまま表示する
const table: Record<string, number[]> = sizes;

export type GalleryImage = {
  src: string;
  width?: number;
  height?: number;
  /** 一覧の帯で使う小さい画像（高さ480px）。無ければ src */
  thumb: string;
  /** サムネの幅（srcset 用）。サムネが無ければ undefined */
  thumbWidth?: number;
};

export const THUMB_HEIGHT = 480;

export function galleryImage(src: string): GalleryImage {
  const size = table[src];
  if (!size) return { src, thumb: src };
  const [width, height] = size;
  const thumb = src.replace(/\/([^/]+)\.jpe?g$/i, "/thumb/$1.webp");
  const thumbHeight = Math.min(THUMB_HEIGHT, height);
  return { src, width, height, thumb, thumbWidth: Math.round((width * thumbHeight) / height) };
}
