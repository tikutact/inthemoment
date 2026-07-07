---
name: gallery-case-add
description: inthemomentのギャラリーに新ケース（case-XX）を追加する定常フロー。写真の受領からデプロイ・Search Console登録まで
---

# ギャラリー新ケース追加フロー

1. **写真を配置**: `public/gallery/case-XX/` にコピー（XXは連番の次）
2. **必ず1200pxにリサイズ**（元3〜4MB→200〜450KBになる。省略禁止）:
   ```bash
   find "public/gallery/case-XX" -name "*.jpg" | while read f; do sips -Z 1200 "$f" --out "$f" > /dev/null; done
   ```
3. **`app/gallery/data.ts` にケースを追加**（id / label / location。既存ケースの形式に合わせる）
   - 既存写真を差し替える場合は**上書きせず新しいファイル名**で追加してsrcを更新（Next.jsキャッシュ対策）
4. **ローカルで見た目を確認してユーザーのOKを取る**（見た目変更はいきなりpushしない）
5. **git commit → push origin main**（Vercel自動デプロイ。ローカル単独デプロイ禁止）
6. **sitemapは自動**: `sitemap.ts` がdata.tsからギャラリーURLを自動生成するので追加作業不要
7. **Search Console登録**: URL検査 → `/gallery/case-XX` のインデックス登録リクエスト

## 注意

- `/gallery` は全ケースの画像を一括ロードする既知の重さ問題がある。ケースが増えるほど悪化するので、ストリップに出す枚数は必要最小限を意識する
- ジャーナル記事でこのケースを使う予定がある場合、**記事を書く前にケースを先にデプロイ**しておくとNotion下書きでも画像が表示される
