---
name: journal-publish
description: in the momentジャーナル記事の下書き作成〜本番公開までの定常フロー。新規記事を書く時・記事を公開する時に必ずこの手順に従う
---

# ジャーナル記事の作成・公開フロー

記事のライフサイクルは2段階。**「書く」と「公開する」は別ステップ**で、公開はユーザーの承認後のみ。

## Phase 1: 下書き作成（記事を書く時）

1. **記事はNotion「📝 下書き」ページの子ページとして作成する**
   - 下書きページID: `37300e99-7dfa-8115-a982-c0721e0b3938`
   - 本番「✅ 公開中」ページ（`37300e99-7dfa-818f-b4b3-f6a10726d5bf`）には**絶対に直接作らない**。サイトの `getJournalArticles()` は公開中の直下だけを読み込むが、誤って直下に作るとレビュー前に公開されてしまう
   - 記事先頭に「← 戻る」リンク（下書きページへ）を付ける。Notionナビ用で、サイト側には表示されない
   - **作成はこのスキルフォルダの `create-draft.mjs` を使う**。原本は書き換えず、**scratchpadにコピーして** `articles` 配列を差し替えて実行する（原本を書き換えるとgitが汚れる）。見出し（heading_2）・画像ブロック・カバーを一括作成できる
   - **Notion MCPの `API-post-page` / `API-patch-block-children` はparagraphとbulleted_list_itemしか作れない**ため、見出し・画像入り記事の作成には使えない（2026-07-07判明）
   - **JSONペイロードの手組み・curl直叩きでの作成は禁止**。`\uXXXX`エンコードが混入しやすい（ブラインドテストで実際に発生。結果的に文字化けしなかったが、過去に文字化け実績のある経路）。必ずcreate-draft.mjsのようにJSソース内に日本語リテラルで書いて `JSON.stringify` させる
2. **文体・内容**: `journal-writing` スキル準拠。固定キーワード「愛知/名古屋/前撮り/フォトウェディング」を自然に含める
3. **画像を先行デプロイする（毎回必須）** — Notionプレビューを効かせるため:
   - ロケーション記事: 対応する `app/gallery/case-XX/` が既にpush済みか確認する。未pushなら先に `gallery-case-add` スキルでケースを公開してから記事を書く
   - 知識・準備ガイド記事: 既存ケースの画像（`gallery/case-XX/*.jpg`）を流用してよい。新規画像が必要な場合は `sips -Z 1200` でリサイズし、画像だけを `git add` → commit → `git push origin main`（Vercel自動デプロイ）してから記事に貼る
   - `curl -o /dev/null -s -w "%{http_code}" https://www.inthemoment.jp/gallery/case-XX/...jpg` が200になるのを確認
   - 記事自体は下書きのままなので公開はされない。画像だけ本番にあるのは正常
4. **カバーを設定する**: ページのcoverプロパティに本番画像URL（`type: external`）を設定。カバーに使った画像は本文から削除（`journal-writing` の重複禁止ルール）
5. 保存後、`mcp__notion__API-get-block-children` で文字化け・誤字チェック
6. ユーザーにNotionでのレビューを依頼して**ここで止まる**

## Phase 2: 公開（ユーザーが承認したら）

7. `mcp__notion__API-move-page` で記事を「✅ 公開中」ページへ移動
8. 数分後（`revalidate: 60`）に本番URL `https://www.inthemoment.jp/journal/<slug>` を確認する（slug＝NotionページIDのハイフン除去）
9. **Search Console登録**: URL検査 → `/journal/<slug>` のインデックス登録リクエスト（sitemapは自動収録なので送信は任意）
10. **メモリの公開記事リストを更新する**: `project_inthemoment.md` のJournal欄に記事名を追記（メモリとNotionの実態がズレて記録漏れになった実績あり。2026-07-07に11本中3本が漏れていた）

## 参照

- 文体・コンテンツ柱の詳細: `journal-writing` スキル
- ギャラリーケース追加の手順: `gallery-case-add` スキル
