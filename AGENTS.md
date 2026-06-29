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
