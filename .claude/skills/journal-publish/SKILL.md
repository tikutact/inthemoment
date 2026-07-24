---
name: journal-publish
description: in the momentジャーナル記事の下書き作成〜本番公開までの定常フロー。新規記事を書く時・記事を公開する時に必ずこの手順に従う
---

# ジャーナル記事の作成・公開フロー

記事は `content/journal/*.md`（リポジトリmarkdown。2026-07-09にNotion CMSを廃止）。**「書く」と「公開する」は別ステップ**で、公開はユーザー承認後のみ。承認前はvaultの下書きに留め、repoにcommitしない（＝サイトに出ない）。文体・内容・画像選定は `journal-writing` スキル準拠。

> **クラウド/iPhoneセッション（claude.ai/code）の場合**: 本文の下書き作成が主。既存ギャラリー画像を流用するテキスト記事なら content/journal に書いてpush→公開まで届くが、新規画像の`sips`・`~/journal-drafts`への配置・Search Console登録・growth-desk記録はMacローカルの自動化依存で実行不可。原則 iPhone=下書き生成／仕上げ・公開はMac。詳細は memory `project_iphone_claude_code`。

## Phase 1: 下書き作成（記事を書く時）

1. **下書きmdをvaultに作成**: `~/journal-drafts/inthemoment-drafts/<slug>.md`（Obsidianで編集）
   - frontmatter: `title` / `slug` / `order` / `date` / `dateModified`（任意）/ `cover`（root相対パス）/ `category`（`location`|`knowledge`|`prep`）
   - slug: 新記事はクリーンなslug（英字ハイフン）でよい。旧Notion記事のみ pageId 由来slugを保全（URL維持）
   - 本文: 標準markdown・**1文＝1段落・段落間は空行・見出しは `##`**（`journal-writing` 参照）
2. **画像**: 既存ケースの画像を **root相対 `/gallery/case-XX/....jpg`** で参照（スペースは `%20`）。新規画像が要る場合は `sips -Z 1200` でリサイズして `public/gallery/...` に置く
   - カバーは frontmatter `cover: /gallery/...`（ヒーロー画像）。カバーに使った画像は本文には入れない（重複禁止）
   - **下書きにはObsidianプレビュー用ヘッダーを必ず入れる（2026-07-11ルール化）**: Obsidianはfrontmatterの`cover`を画像描画しないため、本文の先頭に次の2行を置く（このヘッダーだけはカバー画像の本文使用OK＝公開時に削除するため）:
     ```
     <!-- ↓Obsidianプレビュー用ヘッダー（公開時はこのコメントと画像行を削除。本番はfrontmatterのcoverが自動でヘッダー表示される） -->
     ![](/gallery/case-XX/....jpg)   ← coverと同じパス
     ```
   - **画像選びは「記事に一番合うか」を最優先。他記事との被りは許容**（いい記事になるなら重複は問題ない・2026-07-14ユーザー判断で緩和）。`node .claude/skills/journal-publish/list-used-images.mjs`（公開＋下書き＋プランの使用済みパスを一覧）は参考情報として実行し、同等の候補が並んだら未使用を優先する程度でよい。※同一記事内でのカバー画像の本文再掲だけは引き続き禁止（上記のとおりページ上で二重表示になる）
   - **Obsidianプレビュー**: 画像は vault の `gallery` フォルダsymlinkで解決済み。リーディングビュー（Cmd+E）で画像込みの仕上がりを確認できる
3. **表現の重複チェック**: `node .claude/skills/journal-publish/dump-articles.mjs > /tmp/articles.txt` で全記事本文を出し、自分が書いた特徴フレーズ（比喩・情景の締め）をgrep照合する
4. 下書きmdを読み返して誤字・変換ミスを確認 → **ユーザーにObsidianでのレビューを依頼してここで止まる**（repoにcommitしない）
   - **下書きの置き場は必ず `~/journal-drafts/inthemoment-drafts/`（vault）**。ユーザーのチェックはObsidianで行う運用（2026-07-11ルール化）。repoの`content/journal/`に`draft: true`でステージしてlocalhostプレビューを案内する形は取らない — 書き終えたらvaultへ、が既定

## Phase 1.5: レビュー後の修正（指摘が入ったら）

- 下書きmdを直接編集 → Obsidianリーディングビューで再確認
- **指摘された箇所と同種の問題が記事内の他の場所にないかも読み戻しついでに探す**（「手紙の実例なし」指摘の際、冒頭の「これまでの撮影で〜」にも同じ問題が見つかった実例・2026-07-07）

## Phase 2: 公開（ユーザーが承認したら）

5. 下書きmdを **`content/journal/<slug>.md` へ移動**（vaultの symlink `inthemoment-published/` 経由でも可）
   - **公開反映したら、vaultの下書き `~/journal-drafts/inthemoment-drafts/<slug>.md` を必ず削除する（2026-07-24ルール化）**。`cp`で反映した場合や既公開記事のリライトでも同じ。削除前に `diff -q` でrepo側と同一内容であることを確認してから消す。下書きフォルダは「公開待ちの記事だけが並ぶ」状態を常に保つ
   - **移動時に冒頭のObsidianプレビュー用ヘッダー（コメント行＋cover画像行）を削除する**。残すと本番でカバーが二重表示になる。commit前に `head` で本文が導入文から始まることを確認
   - **frontmatter `date` を公開日（サイトに追加した日）に更新する**。一覧・ホームの並びは `date` の新しい順（同日は `order` の大きい順）＝2026-07-23に order 順から変更。draft を外すのもこのタイミング
6. `git add content/journal/<slug>.md` ＋新規画像 → `git commit` → `git push origin main`（Vercel自動デプロイ・約40秒）。**ローカル単独デプロイ禁止**（AGENTS.md）。※記事を repo に置いたまま隠したい場合は frontmatter `draft: true`（本番非表示・`npm run dev` では表示）も使える
7. 本番URL `https://www.inthemoment.jp/journal/<slug>` が200になるのを確認（slug＝frontmatterの `slug`）
8. **Search Console登録**: URL検査 → `/journal/<slug>` のインデックス登録リクエスト（sitemapは自動収録なので送信は任意）
   - **最優先ルート＝コマンド1本（2026-07-08作成・9本一括の実績あり）**: `cd ~/sb-auto && node sc-inspect.mjs <記事フルURL>`（検査→リクエストまで一気通貫。SCプロパティはURLのoriginから自動導出＝3サイト共通で使える）。まれに`net::ERR_ABORTED`で落ちる→その1本だけ再実行。詳細はメモリ `feedback_searchconsole_workflow`
   - **CDPブラウザは`~/sb-auto/brave-profile`専用プロフィールのBrave（9222）が標準（2026-07-23〜）**。同プロフィールはGoogleログイン済み＝前準備なしで通る。メインブラウザをCDP起動し直す旧方式は使わない。未ログインに戻っているとSCのaboutページに飛ばされて`TimeoutError`になる→その時はユーザーに専用Braveでの再ログインを依頼
   - sc-inspect.mjsが使えない時のみ、以下のclaude-in-chromeブラウザ操作にフォールバック（2026-07-14に実績あり・判断不要でなぞるだけにしてある）:
   1. **必ずユーザーの実ブラウザセッションで行う**（claude-in-chrome拡張＝実Chrome、またはBrave CDP）。素のPlaywright等のクリーンな自動化ブラウザはGoogleログインがbot検知で詰むので不可
   2. `tabs_context_mcp`（createIfEmpty:true）→ そのタブで `https://search.google.com/search-console?resource_id=https%3A%2F%2Fwww.inthemoment.jp%2F` に navigate（プロパティのサマリーが開く）。※`/inspect?...&id=<URL>` の直リンクは404になる形式なので使わない
   3. 上部の検索バーは**座標クリックせず、`find`で「上部のURL検査の検索入力欄」を探して ref 指定でクリック**（座標クリックだとフォーカスが入らないことがある）→ 記事のフルURLを type → Return → 8秒 wait
   4. 検査結果画面で「インデックス登録をリクエスト」リンクをクリック → 20秒ほど wait → screenshot
   5. **成功判定＝「URL を優先クロールキューに追加しました」の緑トースト**（またはリンクが「✓ インデックス登録をリクエスト済み」表示に変わる）。これが出るまで完了と言わない
   6. **落とし穴**: 検索バーへの入力が入らないままReturnすると「公開 URL がインデックスに登録可能かどうかをテストする」モーダル（1〜2分かかる公開URLテスト）が誤発火する。その場合はモーダルの「キャンセル」を押し、手順3のfind→refクリックからやり直す
   7. 複数記事あるときは手順3〜5を記事ごとに繰り返す（1日数十件までは問題なく通る）
9. **メモリの公開記事リストを更新する**: `project_inthemoment.md` のJournal欄に記事名を追記（記録漏れの実績あり）
10. **growth-deskに記録する**: `cd ~/Desktop/claude/growth-desk && node growth.mjs articles && node growth.mjs sync` を実行し、`data/articles.json` の当該記事に `scRequested`（登録日）を書き込む（詳細はメモリ `project_growth_desk`）

## 参照

- 文体・コンテンツ柱の詳細: `journal-writing` スキル
- ギャラリーケース追加の手順: `gallery-case-add` スキル
