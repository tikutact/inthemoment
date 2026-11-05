# www.inthemoment.jp 総点検レポート（2026-11）

- 対象: `tikutact/inthemoment`（ブランチ `review/inthemoment-audit` 作成時点の main = `2cf7d99`）
- 方法: コードを読んで確かめた静的レビュー＋秘密情報なしで動くチェック（`tsc` / `next build` / `npm audit`）＋ビルド結果（`.next/server/app/*.html`）を機械的に調べたもの。本番・外部サービスには接続していない
- 方針: 文章（言い回し・トーン）は書き換えていない。食い違いは「どちらに揃えるのがよいか」の案だけを書いた。直したのは、小さくて安全な明らかなバグだけ（1件1コミット）

---

## 1. 実害につながる問題（優先度順）

### 1-1. 【契約】規約のデータ枚数が「100カット」、ほかのページはすべて「80カット」 — 未修正（店主の判断が要る）
- **何が**: 契約内容そのものである利用規約 第1条の表だけ、写真プランの枚数が **100カット** になっている。プランページ・トップ・ジャーナル記事は **80カット**（「最低保証枚数」）
  - `app/terms/page.tsx:21-24`（PHOTO / PHOTO+MOVIE の4行すべて「お写真100カット」）
  - `app/plan/data.ts:39,52,61,82,96,106`（80 cuts / お写真 80カット）
  - `app/page.tsx:19,23`（80 cuts）、`app/page.tsx:186`・`app/plan/page.tsx:23`（カット数は最低保証枚数）
  - `content/journal/maedori-hiyou-souba.md:13,87`（「撮影したおよそ80カット」）
- **どう壊れるか**: 規約は「本サービスをご利用いただくことで同意したものとみなす」文書なので、お客様は「規約では100カットのはず」と主張できる。80枚納品でトラブルになったとき、店側の根拠が弱くなる
- **案**: 実態が80なら規約を80に揃える。後述 3-x の「1か所の定数から引く」形にすると再発しない
- 付記: 記事の「**およそ**80カット」は「最低保証80」と言い方がずれている（「およそ」だと80を下回る可能性に読める）。言い回しは店主判断

### 1-2. 【契約】MOVIE プランの納品日数が規約だけ「約1ヶ月」、ほかは「6週間」 — 未修正
- `app/terms/page.tsx:25-26`（MOVIE Standard / Hairmake: 撮影後約1ヶ月）
- `app/plan/data.ts:163`（〜6週間後 ムービーデータ納品）、`app/qa/data.ts:61`（動画は約6週間）、`content/journal/toujitsu-no-nagare.md:83`・`content/journal/maedori-junbi.md:35`（ムービーを含むプランは6週間）、`app/tokushoho/page.tsx:47`（1〜1.5ヶ月）
- **どう壊れるか**: 規約上は約4週間で納品義務がある読み方になり、6週間納品が「遅延」と言われうる
- **案**: 実態に合わせて規約を「約1.5ヶ月」に揃える（PHOTO+MOVIE と同じ）
- 付記: PHOTO + MOVIE の「写真」の納品時期も、QA は「写真は約4週間、動画は約6週間」（`app/qa/data.ts:61`）、プラン詳細は「写真・ムービーデータ 〜6週間後」（`app/plan/data.ts:119`）で読み方が分かれる。写真だけ先に届くのか、同時なのかを決めて揃える

### 1-3. 【特商法】「商品代金以外の必要料金」に、決まっている追加料金が書かれていない — 未修正
- `app/tokushoho/page.tsx:36-38` と規約 `app/terms/page.tsx:100` は「ロケーション移動費・衣装費・ヘアメイク会場費等の実費が別途発生する場合があります」だけ
- 一方、トップとプラン一覧には金額の決まった追加料金がある: **土日祝日 +¥10,000 / 交通費（大須観音駅起算）/ 宿泊を伴う出張 +¥18,000**（`app/page.tsx:183-185`、`app/plan/page.tsx:20-22`）
- **どう壊れるか**: 特商法の通信販売の広告では、代金以外にお客様が負担する金額（送料に当たる交通費・追加料金）は具体的に示す必要がある。土日祝の +¥10,000 と宿泊 +¥18,000 は金額が決まっているのに法定表示から抜けている。土日に申し込んだお客様から「表示にない」と言われうる
- **案**: 特商法ページ・規約 第1条の注記に、トップ/プラン一覧と同じ3項目（金額込み）を加える。交通費は「大須観音駅起算の実費」など計算の仕方を書く

### 1-4. 【料金表示】各プラン詳細ページ（/plan/photo など）に追加料金・税込の注記が出ない — 未修正
- `components/PlanDetail.tsx` は料金（`tier.price`）と含まれるもの・当日の流れだけを描画し、`app/plan/page.tsx:19-25` の notes（土日祝 +¥10,000・交通費・宿泊・最低保証・税込）を表示していない
- **どう壊れるか**: 検索・広告・ジャーナル記事から `/plan/photo` に直接来たお客様は「¥100,000」だけを見て、土日祝加算や交通費を知らないまま LINE で申し込む。ページ本文に「税込」の文言もない（meta description にはある）
- **案**: notes を `app/plan/data.ts` 側に移して一覧・詳細・トップの3か所から同じ配列を参照する（3-x 参照）。表示位置・文言は店主判断

### 1-5. 【シェア/SEO】ジャーナル以外の全ページで OGP（LINE・SNS でシェアしたときの見出し）がトップページのものになる — 未修正
- `app/layout.tsx:33-48` が `openGraph` / `twitter` を定義し、各ページは `title` / `description` しか定義していない。Next の metadata は**浅いマージ**で、`openGraph` は丸ごと親のものが使われる（`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` の「Merging」）
- ビルド結果で確認: `/plan`・`/plan/photo`・`/gallery`・`/gallery/case-01`・`/qa`・`/terms`・`/about`・`/journal` の `og:title` はすべて「名古屋・愛知の前撮り／フォトウェディング | in the moment」、`og:url` はすべて `https://www.inthemoment.jp`（トップ）
- ジャーナル記事は `openGraph` を自前で持つが `twitter` は持たないので、`twitter:title` / `twitter:image` はトップのまま（例: `/journal/heiwa-koen`）
- **どう壊れるか**: お客様が料金ページを LINE でパートナーに送ると、カードの見出しも URL もトップページになる。`og:url` がトップを指すため、SNS 側がトップの URL として集計する
- **案**: `lib/` に `pageMetadata({ title, description, path, image? })` のような共通関数を作り、`openGraph`（title/description/url/images/siteName/locale/type）と `twitter` を毎ページ同じ形で返す。全ページに触るので今回は直していない

### 1-6. 【スマホ表示・速度】/gallery 一覧で全ケースの全写真（327枚・約65MB）を一度に読み込む — 未修正
- `app/gallery/page.tsx:49-67` が全ケースの `ShowcaseStrip` を描画し、`components/ShowcaseStrip.tsx:115-130` は `photos` を2周分（`doubled`）すべて `<img>` で出す。`loading="lazy"`・`width/height`・`srcset` なし
- ビルド結果で計測: `/gallery` の HTML に `<img>` 654個（ユニーク 327枚）、ファイル合計 **64.8MB**。表示は高さ160px（`h-40`）なのに元画像は長辺1200px
- さらに `ShowcaseStrip.tsx:86-103` は**全画像の load を待ってから**自動スクロールを始めるので、モバイル回線では帯がなかなか動き出さない
- **注意**: 単純に `loading="lazy"` を足すと、画面外の画像が load しないまま「全部読み込んだら開始」の条件を満たさず、帯が止まったままになる。だから小さな修正にならない
- **案**: (a) 一覧の帯はケースごとに先頭 N 枚だけにする、(b) 一覧用に長辺400px程度のサムネイルを別に用意する、(c) `next/image`（`sizes="160px"` 相当）に置き換え、開始条件を「先頭数枚が読めたら」に変える。どれも見た目・運用（gallery-case-add スキル）に関わるので判断が要る

### 1-7. 【スマホ表示・速度】ギャラリー詳細ページは全写真を即時読み込み、サイズ指定もない — 未修正
- `app/gallery/[id]/page.tsx:60-67`: `loading` 指定なし・`width/height` なし・`srcset` なし
- 計測: case-02 は60枚・**12.3MB**、case-07 は59枚・10.7MB を最初の表示で取りに行く。`width/height` がないので読み込みにつれて段組みが組み直され、レイアウトがずれる（CLS）
- **案**: `next/image` に置き換える（2カラム/4カラムなので `sizes="(min-width:768px) 25vw, 50vw"`）か、少なくとも `width`/`height` を入れてから `loading="lazy"` にする。サイズ未指定のまま lazy にすると、高さ0の画像が全部画面内に入ってしまい効果がない

### 1-8. 【SEO・アクセシビリティ】トップ・PLAN・ギャラリー・Q&A・ABOUT・JOURNAL一覧に `<h1>` が無い — 未修正
- ビルド結果で `<h1` を数えた: `/`, `/plan`, `/plan/photo`（ほか2プラン同じ）, `/gallery`, `/gallery/case-xx`, `/qa`, `/about`, `/journal` は **0個**。`<h1>` があるのはジャーナル記事・規約・特商法だけ
- トップは JOURNAL カードの `<h2>` が3つだけある（`app/page.tsx:212`）。プラン詳細のプラン名は `<p>`（`components/PlanDetail.tsx:23`）
- **どう壊れるか**: 検索エンジン・AI 要約・スクリーンリーダーが「このページは何のページか」をつかむ手がかりが title しかない
- **案**: 見た目を変えずに、既にある見出し役の `<p>`（「PLAN」「GALLERY」ラベルやプラン名）を `<h1>` に変える。デザインに触れるので判断に回す

---

## 2. 条件付きで壊れるもの・軽微なもの

### 料金・契約まわり
- **キャンセル料と日程変更の組み合わせ**: 規約 第3条で7日前〜前日のキャンセルは100%（`app/terms/page.tsx:32`）だが、第6条で1回目の日程変更は「3日前まで無料」（`app/terms/page.tsx:157`）。6〜3日前に「変更」してから後日キャンセルすると、100%を避けられる読み方ができる。意図どおりか確認を
- **「手付金」と「お申し込み金」と「無料キャンセル」**: 特商法・QA は「手付金」（`app/tokushoho/page.tsx:43`、`app/qa/data.ts:13-14`）、規約は「お申し込み金（総額の50%）」（`app/terms/page.tsx:111`）。基準額も「お見積り金額」と「総額」で言い方が違う。さらに規約は31日前まで「無料」（`app/terms/page.tsx:30`）なので、支払い済みの50%を返すのかどうかが書かれていない。法律上「手付」は解約時に放棄する性質のお金と読まれやすく、「無料キャンセル」と矛盾して見える。呼び方を1つに決め、31日前までなら返金するかを明記するのが安全
- **支払い方法**: 特商法・QA は「現金手渡しまたは銀行振込」（`app/tokushoho/page.tsx:40`、`app/qa/data.ts:10`）なのに、手付金の QA は「お振込みいただいております」「残金は…お振込みください」（`app/qa/data.ts:14`）と振込だけに読める
- **天候による延期**: QA「天候による延期は1回まで無料、2回目以降はご相談」（`app/qa/data.ts:48`）。規約は、天候の中止はリスケで対応（第7条 `app/terms/page.tsx:165`、回数制限なし）、不可抗力のキャンセルは別途協議（第3条注記）、1回目無料は**お客様都合**の変更（第6条）。天候の延期にも回数制限があるのか、規約と QA を揃える
- **天候判断のタイミング**: 規約「撮影前日に当方よりご連絡」（`app/terms/page.tsx:165`）、QA「3日前ごろから様子を見て、前日の夜から当日の朝にかけて最終判断」（`app/qa/data.ts:44`）。当日朝の判断もあるなら規約側を広げる
- **宿泊 +¥18,000 の意味**: QA「交通費・宿泊費は別途ご負担…宿泊を伴う場合は+¥18,000」（`app/qa/data.ts:35`）は、宿泊費の実費**に加えて** ¥18,000 なのか、¥18,000 が宿泊費**そのもの**なのか読み分けられない。トップ/プラン一覧の「宿泊を伴う出張は +¥18,000」とも合わせて定義を
- **申込フォーム**: 規約 第2条「当方所定の申込フォームまたはLINE」（`app/terms/page.tsx:108`）。サイト上の窓口は LINE だけで、申込フォームは見当たらない（契約書署名の運用があるなら問題なし）
- **出張範囲**: QA「国内全域への出張撮影が可能」（`app/qa/data.ts:35`）に対し、構造化データの `areaServed` は愛知・岐阜・三重だけ（`lib/structured-data.ts:90-94,113-117`）。検索・AI が「東海三県のみ」と答える可能性がある

### 特商法ページの項目
- 揃っている: 事業者名・メール・販売価格（プランページ参照）・代金以外の費用（ただし 1-3 の不足あり）・支払い方法・支払い時期・提供時期・キャンセル（規約参照）
- **要確認**: 個人事業の場合、「事業者名」に要るのは原則として**氏名**（屋号だけでは足りない）。現状は氏名・住所・電話を「請求があれば遅滞なく開示」で省いている（`app/tokushoho/page.tsx:13-26`）。この省略が認められる条件を満たしているか（請求を受けたとき実際にすぐ出せる体制か）は店主・専門家の確認事項
- **所在地の扱いが食い違う**: 特商法では所在地を「請求により開示」にしているのに、トップの構造化データ（LocalBusiness）には住所を全部載せて公開している（`lib/structured-data.ts:83-90`「大須2-11-18 UI大須ビル3F」）。HTML のソースを見れば誰でも読める。どちらに揃えるか（公開するなら特商法にも書く／伏せるなら構造化データから外す）は判断事項
- 申込みの撤回・解除（キャンセル）は「利用規約 第3条をご確認ください」と参照している。特商法上は参照でも足りるが、主要な条件（何日前から何%）を表の中に1行入れておくと、読み落としや規約改定時のずれを防げる

### 同じ数字が別々に手打ちされている箇所（1か所の定数に寄せられるか）

| 情報 | 手打ちされている場所 |
|---|---|
| プラン料金 ¥100,000 / ¥150,000 / ¥155,000 / ¥205,000 | `app/plan/data.ts`（元データ）、`app/page.tsx:18-28`、`app/terms/page.tsx:21-26`、`app/plan/page.tsx:15`（meta description）、`lib/structured-data.ts:96`（priceRange）、ジャーナル記事 約15本の末尾（「PHOTOプランが¥100,000〜…」）、`content/journal/maedori-hiyou-souba.md`（10万/15万/15〜20万）、`content/journal/maedori-vs-photowedding.md:15` |
| 枚数 80 / 100 | `app/plan/data.ts`、`app/page.tsx:19,23`、`app/terms/page.tsx:21-24`（100）、`content/journal/maedori-hiyou-souba.md` |
| 撮影時間 4時間 | `app/plan/data.ts`（duration と included の2か所ずつ）、`app/page.tsx`、`app/terms/page.tsx` |
| 追加料金（土日祝・交通費・宿泊・最低保証・税込） | `app/page.tsx:183-187`、`app/plan/page.tsx:19-25`、`app/qa/data.ts:35`、`content/journal/maedori-hiyou-souba.md:13`、記事末尾（交通費の一文 約15本） |
| 納品日数 | `app/plan/data.ts:73,119,163`、`app/terms/page.tsx:21-26`、`app/tokushoho/page.tsx:47`、`app/qa/data.ts:61`、`content/journal/toujitsu-no-nagare.md:83`、`content/journal/maedori-junbi.md:35` |
| 支払い（50%・1週間前・方法） | `app/terms/page.tsx:111-113`、`app/tokushoho/page.tsx:40-44`、`app/qa/data.ts:10-14` |
| キャンセル料 | `app/terms/page.tsx:29-34`、`app/qa/data.ts:18` |

- **寄せ方の案**: `app/plan/data.ts` を正（single source）にして、(1) `tiers` に `cuts: 80` / `deliveryWeeks` などを数値で持たせる、(2) `notes`（追加料金）と支払い・キャンセル条件も同じファイル（または `lib/pricing.ts`）に移す、(3) トップの `photoPlan` などと規約の `planRows` はそこから組み立てる。QA の回答文と特商法の値も、数字の部分だけテンプレートで差し込める
- ジャーナル記事（markdown）は定数を参照できないので、記事末尾の料金案内は**数字を書かずにプランページへ誘導する**か、ビルド時に `{{price.photo}}` のような置換をする仕組みが要る。文章の書き方に関わるので店主判断

### 表示・速度（軽微）
- **トップのヒーロー動画にポスター画像がない**: `components/HeroVideo.tsx:30-38`。再生開始（4秒後）まで、または低電力モードの iOS で `play()` が拒否されたとき、ベージュの面だけになる。`muted`・`playsInline`・`loop` は揃っていて（ビルド HTML で `muted=""` `playsInline=""` を確認）、`play()` を JS から呼ぶので通常の iOS Safari では自動再生される。PC 用 `hero2.mp4` は 9.6MB を `preload="auto"` で読む
- **使われていない大きなファイル**: `public/hero.mp4`（12.6MB）はどこからも参照されていない。`components/PortfolioGrid.tsx` もどこからも import されておらず、参照先の `/portfolio-01.jpg`〜`39.jpg` は存在しない（デッドコード）。`public/` の `file.svg` `globe.svg` `next.svg` `vercel.svg` `window.svg` も create-next-app の残りで未使用
- **プランのヒーロー画像が 2400×1800・約1.1MB**（`public/plan/*-hero.jpg`）。表示は高さ45vh なので、モバイルでは大きすぎる
- **`next/image` を1か所も使っていない**（全部 `<img>`）。WebP/AVIF 変換・`srcset`・`sizes`・`priority` の恩恵がない。`/journal` 一覧（22枚・5.0MB）とトップの JOURNAL カード・ABOUT も `loading="lazy"` なし（トップは Instagram 9枚だけ lazy：`app/page.tsx:270`）
- **YouTube 埋め込みに `loading="lazy"` がない** → **修正済み**（下記「直したもの」）

### SEO・AIO（軽微）
- **規約・特商法の title が「… - in the moment | in the moment」と二重** → **修正済み**
- **サイトマップの記事の更新日が公開日（`date`）のまま**: 21本の記事に `dateModified` があり、BlogPosting の構造化データには出ているのに、サイトマップの `lastModified` は `date` を使っていた（`app/sitemap.ts:15`）→ **修正済み**
- 固定ページの `lastModified: new Date()`（`app/sitemap.ts:30-40`）は、再生成のたびに「今更新された」と申告する。検索エンジンが lastmod を信用しなくなる原因になるので、固定日付にするか省くのがよい（判断が要る）
- ジャーナル記事 11本の URL が Notion の ID（例 `/journal/39600e997dfa81818acec9d496bd0b57`）のまま。リンク切れではない（slug として正しく存在）が、URL から内容が読めない。変えるなら旧 URL からの 301 転送（`next.config.ts` の `redirects`）が必須
- 記事ページで `FAQPage` と `BlogPosting` を両方出している。構文は正しい。ただし Google の FAQ リッチリザルトは現在、政府・医療系サイトに限られるので、検索結果での見た目の効果は期待しにくい（AI 向けの構造化としては意味がある）
- 記事ページの `PHOTOGRAPHER` 欄の「サービスを見る」（`<a href="/">`）と、全ページのフッターの `/terms` `/tokushoho` は `next/link` ではなく素の `<a>` なので、押すとページ全体を読み直す。速度上の小さな損だけ

### アクセシビリティ（軽微）
- **モバイルメニューが閉じていてもフォーカスできる**: `components/Navigation.tsx:162-165` のオーバーレイは `opacity:0; pointer-events:none` で隠しているだけで、`aria-hidden`・`inert`・`visibility:hidden` がない。スマホで VoiceOver を使うと、閉じたメニューのリンクが読み上げられる。ハンバーガーボタン（`:147`）に `aria-expanded` がなく、開いたときのフォーカス移動・Esc で閉じる処理もない
- **PC の PLAN ドロップダウンはマウスホバーでしか開かない**（`components/Navigation.tsx:79-80`）。キーボードの Tab では、見えない（opacity 0）リンクにフォーカスが入る
- **Q&A アコーディオン**（`components/QaAccordion.tsx:20-24`）に `aria-expanded` / `aria-controls` がない。回答は DOM に常にあるので検索・AI からは読める
- **コントラスト**: 補足文字色 `#9a9088` は背景 `#faf7f2` に対して **2.92:1**、`#f3f0eb` に対して 2.75:1（WCAG AA の 4.5:1 に届かない）。しかも 8〜10px の小さな文字（ラベル・日付・フッター・Q&A のカテゴリ名・規約の※注記）に使っている。本文色 `#6b6560` は 5.38:1 で合格。トーンに関わるので判断事項
- **alt**: ギャラリーは「Y & H 1」「Y & H 2」…と連番だけ（`components/ShowcaseStrip.tsx:128`、`app/gallery/[id]/page.tsx:64`）。帯は2周分描画するので、alt も「1〜2N」まで続く。ジャーナル本文の画像は 135枚中 121枚に説明的な alt があり、9枚はファイル名がそのまま alt（`maedori-hiyou-souba.md` `maedori-junbi.md`。例 `![20260210%20rina%20syuuhei6604.jpg](…)`）

### セキュリティ・その他（軽微）
- `next.config.ts` のヘッダー: `X-Content-Type-Options` / `X-Frame-Options: SAMEORIGIN` / `Referrer-Policy` / `Permissions-Policy` は全パスに付く。**Content-Security-Policy はない**。外部から読むのは GA4（googletagmanager）と YouTube の iframe だけなので、CSP を入れるならこの2つを許可すればよい（入れるかは判断事項）
- HSTS は設定していない（Vercel が独自ドメインに付けるかは本番のレスポンスヘッダーで確認を。今回は本番に接続していない）
- GA4 は `@next/third-parties/google` の `GoogleAnalytics` で読み込み（ハイドレーション後に読む方式）。測定 ID の直書きは公開値なので問題ない（`app/layout.tsx:8`）
- `marked` で記事 markdown を HTML にして `dangerouslySetInnerHTML` している（`app/journal/[slug]/page.tsx:73-75`）。入力は自分のリポジトリの markdown だけなので現状は問題ない。外部の人が書ける経路を作るときはサニタイズが要る

---

## 3. 調べたが問題なかった箇所

- **リンク切れ**: ビルドした全42ページの `href` / `src` をたどった。内部リンク・画像・ページ内アンカー（目次の `#section-N`、`/#reservation`）に切れはなし。ソース（app / components / lib / content）にある画像パス 475個もすべて `public/` に存在した
- **ジャーナル記事どうしのリンク**: Notion ID 形式の URL も含め、すべて実在の slug に解決する
- **下書きの混入**: `content/journal/` に `draft: true` の記事はなく、`getArticles()` は本番では draft を除く（`lib/notion.ts:30,91-95`）。サイトマップ・一覧・`generateStaticParams` は同じ関数を通るので、下書きが出る経路はない
- **robots / sitemap**: `robots.ts` は全許可＋サイトマップの場所。サイトマップに固定ページ11・ギャラリー8・記事21が載り、漏れなし
- **canonical**: 全ページ `alternates.canonical` があり、ビルド結果でも www 付きの絶対 URL になっている。`inthemoment.jp` → `www` の 301 は `vercel.json` にある
- **旧 URL の転送**: git の履歴でページのルートを削除・改名した形跡はない（Notion→markdown 移行でも slug は不変）。転送が要る旧 URL は見つからなかった
- **title / description の重複**: ページごとに別の文言（重複は規約・特商法の「| in the moment」二重だけで、修正済み）
- **構造化データの形**: BreadcrumbList・LocalBusiness・Service/Offer（価格は数値、JPY）・BlogPosting・FAQPage は構文として正しい。`logo.png`・`ogp.jpg` も存在する
- **キャンセル料率**: 規約（31日前まで無料／30〜8日前 50%／7日前〜当日 100%）と QA（30日前以降50%・7日前以降100%）は一致
- **料金そのもの**: 6つの料金（¥100,000 / ¥155,000 / ¥150,000 / ¥205,000 / ¥100,000 / ¥155,000）はプラン・規約・トップ・構造化データ・記事で一致
- **iOS の自動再生条件**: `muted`・`playsInline` は SSR の HTML にも出ている。モバイルは `hero-mobile-2.mp4`（2.6MB）に分けて読み、判定前は `src` を入れない作りでデスクトップ用を誤って読まない
- **EXIF の位置情報**: `public/` の JPEG/PNG 356枚を調べ、**GPS 情報が残っているものは 0枚**
- **依存の脆弱性**: `npm audit --omit=dev` は 0件
- **localStorage**: チェックリストの読み書きは try/catch で囲んである（`components/JournalChecklist.tsx:23,46,63`）
- **演出ルール**: 記事ページ・一覧・規約・特商法のフェードイン（`caseFadeIn` / `navFadeIn` / `heroFadeIn`）は維持されている。今回の修正でも触っていない

---

## 4. 人間が判断・確認すべきこと

1. **写真の枚数は 80 か 100 か**（1-1）。規約を直すなら、改定日の書き方と既存契約への扱い
2. **MOVIE の納品は4週間か6週間か**、PHOTO+MOVIE の写真は先に届くのか（1-2）
3. **特商法の「代金以外の費用」に土日祝・宿泊・交通費を足す**か（1-3）。あわせて「手付金／お申し込み金」の呼び方と、31日前キャンセル時に50%を返すか
4. **宿泊 +¥18,000 は宿泊費込みか別か**、天候延期の回数制限、日程変更とキャンセル料の関係（第2章）
5. **所在地を公開するか**: 構造化データには住所が出ていて、特商法では伏せている。個人事業で氏名を省略している点も含めて確認（できれば専門家に）
6. **料金データを1か所に寄せる設計**（第2章の表）と、記事末尾の料金の一文をどう扱うか
7. **ギャラリーの画像の出し方**（1-6, 1-7）。サムネイルを別に作るか `next/image` にするか。gallery-case-add スキルの手順も変わる
8. **OGP の共通関数化**（1-5）と **`<h1>` の付与**（1-8）。見た目は変えずにできるが全ページに触る
9. 補足文字色 `#9a9088` のコントラスト（2.92:1）をどこまで上げるか
10. 画像のファイル名にお客様の名前が入っているもの（例 `20251124-rie-tomo6014.jpg`、`20260210 rina syuuhei6604.jpg`）があり、一部は記事の alt にもそのまま出ている。掲載の同意の範囲内か確認を（今回は変更していない）
11. 外部リンク（`lin.ee/OYalLp6`、岡崎市の FAQ ページ、YouTube）は、この環境のネットワーク制限で到達確認ができなかった。手元で一度開いて確認を

---

## 5. 実行したチェックと結果

| チェック | 結果 |
|---|---|
| `npm ci` | 成功 |
| `npx tsc --noEmit` | エラー 0 |
| `npm run build`（Next.js 16.4.3 / Turbopack） | 成功。45ルート生成（記事21・ギャラリー8を含む） |
| `npm audit --omit=dev` | 脆弱性 0件 |
| lint | **未実行**: `package.json` に lint スクリプトも ESLint の設定もない |
| 既存テスト | **なし**: テストランナーもテストファイルもない。修正はビルド結果の HTML / sitemap を見て確かめた |
| ビルド HTML の機械チェック（自作スクリプト） | 内部リンク・画像・アンカーの切れ 0、`<h1>` の数、`og:*` / `twitter:*`、構造化データの型、ページごとの画像枚数と合計サイズ |
| 画像の寸法・EXIF（Pillow） | 長辺1200px が 337枚、2400px が3枚（プランのヒーロー）。GPS 0枚 |
| コントラスト計算 | `#9a9088` / `#faf7f2` = 2.92:1、`#6b6560` / `#faf7f2` = 5.38:1 |
| 外部リンクの到達確認 | **未実行**: 外部への接続がこの環境のネットワーク方針で拒否された |
| 本番のレスポンスヘッダー確認 | **未実行**: 本番には接続しない方針 |

---

## 直したもの（1件1コミット）

| 内容 | ファイル | 確認方法 |
|---|---|---|
| 規約・特商法の title が「… - in the moment \| in the moment」と二重になっていたのを、テンプレートが付ける1回だけにした | `app/terms/page.tsx`, `app/tokushoho/page.tsx` | ビルド後の `<title>` |
| サイトマップの記事の `lastModified` を `dateModified` 優先にした（なければ従来どおり `date`） | `app/sitemap.ts` | ビルド後の `sitemap.xml` の `<lastmod>` |
| YouTube の iframe に `loading="lazy"` を付けた（プラン詳細の SAMPLE MOVIE、記事の MOVIE） | `components/PlanDetail.tsx`, `app/journal/[slug]/page.tsx` | ビルド後の HTML |
