---
name: journal-publish
description: in the momentジャーナル記事の下書き作成〜本番公開までの定常フロー。新規記事を書く時・記事を公開する時に必ずこの手順に従う
---

# ジャーナル記事の作成・公開フロー

記事は `content/journal/*.md`（リポジトリmarkdown。2026-07-09にNotion CMSを廃止）。**「書く」と「公開する」は別ステップ**で、公開はユーザー承認後のみ。承認前はvaultの下書きに留め、repoにcommitしない（＝サイトに出ない）。文体・内容・画像選定は `journal-writing` スキル準拠。

> **クラウド/iPhoneセッション（claude.ai/code）の場合**: 本文の下書き作成が主。既存ギャラリー画像を流用するテキスト記事なら content/journal に書いてpush→公開まで届くが、新規画像の`sips`・`~/journal-drafts`への配置・Search Console登録・growth-desk記録はMacローカルの自動化依存で実行不可。原則 iPhone=下書き生成／仕上げ・公開はMac。詳細は memory `project_iphone_claude_code`。

## Phase 1: 下書き作成（記事を書く時）

1. **下書きmdをvaultに作成**: `~/journal-drafts/inthemoment-drafts/<slug>.md`（Obsidianで編集）
   - frontmatter: `title` / `slug` / `order` / `date` / `dateModified`（任意）/ `cover`（root相対パス）/ `category`（`location`|`knowledge`|`prep`）/ `movie:`（任意・YouTube URL。目次と本文の間にMOVIEセクションが出る）/ `faq:`（任意・知識・質問型記事とロケーションガイド。書式と方針は `journal-writing` スキルの「FAQ」セクション参照。閉じ `---` を落とさないこと）
   - slug: 新記事はクリーンなslug（英字ハイフン）でよい。旧Notion記事のみ pageId 由来slugを保全（URL維持）
   - 本文: 標準markdown・**1文＝1段落・段落間は空行・見出しは `##`**（`journal-writing` 参照）
2. **画像**: 既存ケースの画像を **root相対 `/gallery/case-XX/....jpg`** で参照（スペースは `%20`）。新規画像が要る場合は `sips -Z 1200` でリサイズして `public/gallery/...` に置く
   - カバーは frontmatter `cover: /gallery/...`（ヒーロー画像）。カバーに使った画像は本文には入れない（重複禁止）
   - **下書きにはObsidianプレビュー用ヘッダーを必ず入れる（2026-07-11ルール化）**: Obsidianはfrontmatterの`cover`を画像描画しないため、本文の先頭に次の2行を置く（このヘッダーだけはカバー画像の本文使用OK＝公開時に削除するため）:
     ```
     <!-- ↓Obsidianプレビュー用ヘッダー（公開時はこのコメントと画像行を削除。本番はfrontmatterのcoverが自動でヘッダー表示される） -->
     ![](/gallery/case-XX/....jpg)   ← coverと同じパス
     ```
   - **プレビュー用ヘッダーの直後にObsidianプレビュー用の目次も必ず入れる（2026-07-31ルール化）**: 本番は `lib/toc.ts` が `##` 見出しから目次を自動生成するが、Obsidianでは見えないため下書きに再現しておく（ヘッダーと同じく公開時に削除する前提）:
     ```
     <!-- ↓Obsidianプレビュー用の目次（公開時はこのコメントごと削除。本番は##見出しから自動生成される・md手書きは二重表示になる） -->
     **CONTENTS**

     - 見出しA   ← 本文の ## 見出しをそのまま並べる
     - 見出しB
     ```
     見出しを増減・改題したらこの目次も手で追随させる（下書き内だけの話・本番は自動）
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
   - **移動時に冒頭のObsidianプレビュー用ヘッダー（コメント行＋cover画像行）とプレビュー用の目次（コメント行＋CONTENTSブロック）を削除する**。残すと本番でカバー・目次が二重表示になる
   - **⚠ この除去を正規表現の DOTALL（`re.S` / `/s`）でやらない（2026-08-19ルール化）**。目次ブロックを `re.sub(r"...\*\*CONTENTS\*\*\n\n(?:- .*\n)+", "", body, flags=re.S)` で消そうとして、**`.` が改行にマッチして本文を丸ごと飲み込み、frontmatterだけのファイルが生成された**（笠松みなと公園の公開時に実際に発生）。見出しの存在チェックで気づいたが、そのままpushしていれば空記事が本番に出ていた
     - 正しいやり方＝**行単位で削る**。「コメント行が来たら、そこから `**CONTENTS**` と続く `- ` 行までを読み飛ばす」というループで書く。複数行にまたがる除去に貪欲な正規表現を使わない
     - `sed`/`awk` で見出しや目次を数える時も**多バイト文字で誤判定する**（`[^-[:space:]]` がUTF-8のバイトに当たって範囲が壊れた実例あり）。**照合はPythonで書く**
   - **生成したファイルは中身を数えてから commit する（省略禁止）**。「エラーが出なかった＝正しく生成された」ではない。最低限この4点:
     ```bash
     grep -c '^## ' content/journal/<slug>.md      # 見出し数が下書きと一致するか
     grep -c '^!\[' content/journal/<slug>.md      # 画像数が一致するか（プレビュー用ヘッダーを引いた数）
     sed -n '/^---$/,$p' content/journal/<slug>.md | head -30   # 本文が導入文から始まるか
     ```
     加えて**字数の収支**を見る（元の下書き○字 → 生成○字、差分は除去したヘッダー・目次ぶんとして説明がつくか）。説明のつかない減り方をしていたら生成に失敗している
   - **相互リンクの相手が未公開なら、リンクを外して公開する**。2本1組の記事（1撮影を2ロケ地に分割した場合など）を時間差で出すと、先に出したほうから404へのリンクが張られる。外したことと**戻す位置**を必ずメモリに残す（笠松→Re-TAiLで実施・2026-08-19）
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
9. **GBP（Googleビジネスプロフィール）にも投稿する（2026-07-31〜）**: `cd ~/sb-auto && node post-gbp.mjs <slug> inthemoment`（記事md→タイトル+冒頭300字+カバー画像+「詳細」ボタンリンク（utm付）を自動充填。**最終「投稿」ボタンはユーザー**）。lightleakと同じスクリプトの2サイト版＝`site`引数で切り替え。見出し・太字・リンクのmarkdown記号はプレーンテキスト化される。コンポーザーは`google.com/local/business/<listing>/promote/updates/add`をトップレベルで直接開く方式が安定（`/n/<listing>/posts`経由リダイレクトは別ビジネスに化けることがある）。inthemomentのlisting=`7092928639124333140`
10. **メモリの公開記事リストを更新する**: `project_inthemoment.md` のJournal欄に記事名を追記（記録漏れの実績あり）
11. **growth-deskに記録する**: `cd ~/Desktop/claude/growth-desk && node growth.mjs articles && node growth.mjs sync` を実行し、`data/articles.json` の当該記事に `scRequested`（登録日）を書き込む（詳細はメモリ `project_growth_desk`）

## 参照

- 文体・コンテンツ柱の詳細: `journal-writing` スキル
- ギャラリーケース追加の手順: `gallery-case-add` スキル
