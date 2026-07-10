---
name: journal-publish
description: in the momentジャーナル記事の下書き作成〜本番公開までの定常フロー。新規記事を書く時・記事を公開する時に必ずこの手順に従う
---

# ジャーナル記事の作成・公開フロー

記事は `content/journal/*.md`（リポジトリmarkdown。2026-07-09にNotion CMSを廃止）。**「書く」と「公開する」は別ステップ**で、公開はユーザー承認後のみ。承認前はvaultの下書きに留め、repoにcommitしない（＝サイトに出ない）。文体・内容・画像選定は `journal-writing` スキル準拠。

## Phase 1: 下書き作成（記事を書く時）

1. **下書きmdをvaultに作成**: `~/journal-drafts/inthemoment-drafts/<slug>.md`（Obsidianで編集）
   - frontmatter: `title` / `slug` / `order` / `date` / `dateModified`（任意）/ `cover`（root相対パス）/ `category`（`location`|`knowledge`|`prep`）
   - slug: 新記事はクリーンなslug（英字ハイフン）でよい。旧Notion記事のみ pageId 由来slugを保全（URL維持）
   - 本文: 標準markdown・**1文＝1段落・段落間は空行・見出しは `##`**（`journal-writing` 参照）
2. **画像**: 既存ケースの画像を **root相対 `/gallery/case-XX/....jpg`** で参照（スペースは `%20`）。新規画像が要る場合は `sips -Z 1200` でリサイズして `public/gallery/...` に置く
   - カバーは frontmatter `cover: /gallery/...`（ヒーロー画像）。カバーに使った画像は本文には入れない（重複禁止）
   - 使用済み画像の重複回避: `node .claude/skills/journal-publish/list-used-images.mjs`（公開＋下書き＋プランの使用済みパスを一覧）→ 出ていない画像から選ぶ
   - **Obsidianプレビュー**: 画像は vault の `gallery` フォルダsymlinkで解決済み。リーディングビュー（Cmd+E）で画像込みの仕上がりを確認できる
3. **表現の重複チェック**: `node .claude/skills/journal-publish/dump-articles.mjs > /tmp/articles.txt` で全記事本文を出し、自分が書いた特徴フレーズ（比喩・情景の締め）をgrep照合する
4. 下書きmdを読み返して誤字・変換ミスを確認 → **ユーザーにObsidianでのレビューを依頼してここで止まる**（repoにcommitしない）

## Phase 1.5: レビュー後の修正（指摘が入ったら）

- 下書きmdを直接編集 → Obsidianリーディングビューで再確認
- **指摘された箇所と同種の問題が記事内の他の場所にないかも読み戻しついでに探す**（「手紙の実例なし」指摘の際、冒頭の「これまでの撮影で〜」にも同じ問題が見つかった実例・2026-07-07）

## Phase 2: 公開（ユーザーが承認したら）

5. 下書きmdを **`content/journal/<slug>.md` へ移動**（vaultの symlink `inthemoment-published/` 経由でも可）
6. `git add content/journal/<slug>.md` ＋新規画像 → `git commit` → `git push origin main`（Vercel自動デプロイ・約40秒）。**ローカル単独デプロイ禁止**（AGENTS.md）。※記事を repo に置いたまま隠したい場合は frontmatter `draft: true`（本番非表示・`npm run dev` では表示）も使える
7. 本番URL `https://www.inthemoment.jp/journal/<slug>` が200になるのを確認（slug＝frontmatterの `slug`）
8. **Search Console登録**: URL検査 → `/journal/<slug>` のインデックス登録リクエスト（sitemapは自動収録なので送信は任意）
9. **メモリの公開記事リストを更新する**: `project_inthemoment.md` のJournal欄に記事名を追記（記録漏れの実績あり）
10. **growth-deskに記録する**: `cd ~/Desktop/claude/growth-desk && node growth.mjs articles && node growth.mjs sync` を実行し、`data/articles.json` の当該記事に `scRequested`（登録日）を書き込む（詳細はメモリ `project_growth_desk`）

## 参照

- 文体・コンテンツ柱の詳細: `journal-writing` スキル
- ギャラリーケース追加の手順: `gallery-case-add` スキル
