<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# デプロイ運用ルール（厳守）

**本番にデプロイする前に、必ず git にコミットすること。**

- 本番反映は原則 `git push`（GitHub連携の自動デプロイ）に一本化する。
- `vercel --prod`（ローカルからのCLIデプロイ）を、対応するコミットなしで実行しない。どうしても使う場合は、必ず先に同じ内容をコミットしてから実行する。
- 作業を始める前に `git status` がクリーンか／`origin/main` と本番が一致しているかを確認する。

**理由:** 2026年6月、過去セッションが `vercel --prod` でローカルから本番デプロイしたのに git へコミットせず、本番だけが進んで git が取り残される「ねじれ」が発生した（hero動画圧縮・gallery case-05追加・sitemap/next.config 等）。git が本番の正しい姿を表さなくなると、知らずに本番を上書き・巻き戻す危険がある。二度と起こさないこと。

# ジャーナル下書きのルール（2026-07-11）

**下書きを書いたら、必ず `~/journal-drafts/inthemoment-drafts/`（Obsidian vault）に置くこと。**

- ユーザーのチェックは毎回Obsidian（リーディングビュー）で行う。localhostプレビューのURL案内は不要
- repoの `content/journal/` に置いてよいのは公開が承認された記事のみ（詳細は `.claude/skills/journal-publish/SKILL.md`）

# ジャーナルページの演出ルール（2026-07-23）

**記事ページはページ表示時のフェードインを標準とする。**

- 現行実装: `app/journal/[slug]/page.tsx` — タイトル→カバー→本文の順に `caseFadeIn 0.8s ease forwards`・`animationDelay` 150ms刻みで段階表示
- 一覧 `app/journal/page.tsx` も同様 — ラベル→タブ→カード（60msずらし・`Math.min(i, 8)` で9枚目以降は同時）
- 新規のジャーナル関連ページ・改修時もこの演出を維持する（外さない）
- アニメーションは新しいkeyframesを増やさず、`globals.css` の既存語彙（`caseFadeIn` / `navFadeIn` / `heroFadeIn`）を流用する。透明度中心の穏やかな動きがサイトのトーン。スライドイン等の主張が強い動きは提案しない
