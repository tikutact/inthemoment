---
name: gallery-case-add
description: inthemomentのギャラリーに新ケース（case-XX）を追加する定常フロー。写真の受領からデプロイ・Search Console登録まで
---

# ギャラリー新ケース追加フロー

0. **着手時に「挙式前のカップルか」を確認する**。挙式前なら公開NG — 作業はローカルブランチ（例: `case-XX-<イニシャル>`）にコミットして退避し、**mainにマージしない・pushしない**。式が済んだらマージ→pushで公開（case-07 R&Yで確立・2026-07-08）。ジャーナル記事も画像が本番に無いと書けないため同時に保留。**リマインドが必要なら/scheduleで挙式翌日に一回限りのルーティンを設定**
0.5 **写真セレクト（「重複以外全部入れて」と言われた時の手順・case-07で確立）**:
   - 元フォルダの全枚数を確認し、**320pxサムネイルをscratchpadに生成**して目視する（フルサイズReadの約1/5のコストで判断できる）:
     ```bash
     for f in *.jpg; do sips -Z 320 "$f" --out "$TH/$f" > /dev/null; done
     ```
   - **同シーンの連写・近似カットは1枚に絞る**。残す基準: 表情が一番良いもの／同シーンでワイドと寄りは構図が違えば両方可。カメラ2台体制だと**別ファイル名で同シーンの重複**があるので機材をまたいで判定する
   - **ゲスト・ご家族の顔が写るカットは除外**（掲載同意が不明のため。ユーザーがOKを出したら戻す）
   - 並び順: ユーザー指定の推しカットを先頭に、残りは撮影時刻順。**撮影時刻はEXIFの `DateTimeOriginal` を読む**（2026-08-21訂正）。`sips -g creation` も `mdls -raw -name kMDItemContentCreationDate` も**書き出し日を返すので使わない**——これまで後者を推奨していたが誤りだった:
     ```python
     from PIL import Image, ExifTags
     ex = Image.open(f).getexif().get_ifd(0x8769)
     {ExifTags.TAGS.get(k,k):v for k,v in ex.items()}.get("DateTimeOriginal")
     ```
     書き出し日も1時間ぶんくらいに散らばって順序が撮影順と相関するため、「バラけている＝撮影時刻」と早合点しない（日付を見れば分かる）。**EXIFごと落ちているカメラもある**（2026-05-10の案件では同じ日の110枚のうちα7C IIの50枚が消え、GFX100Sの60枚は残っていた）。詳細はメモリ `reference_exif_shoot_time`
   - 選定結果は「残した数・除外理由の内訳」をユーザーに報告して確認を取る
1. **写真を配置**: `public/gallery/case-XX/` にコピー（XXは連番の次）
2. **`case-XX-NN.jpg` 形式にリネームする**（お客様の名前をURLに露出させないため。2026-07-07追加）:
   ```bash
   cd "public/gallery/case-XX" && i=1; for f in *.jpg; do mv "$f" "case-XX-$(printf '%02d' $i).jpg"; i=$((i+1)); done
   ```
   - 編集ソフトの書き出しファイル名には「日付＋カップル名」が入っていることが多く、`public/` 配下はファイル名がそのまま公開URLになる（case-02/05/06で下の名前がURL露出した実例。既存分はフルネームでないため許容と判断済み・遡及リネームはしない）
   - リネーム直後の一括 `git add` はzshのglob失敗で全体が失敗することがある。コミット後に `git show HEAD --stat` で確認する
3. **必ず1200pxにリサイズ**（元3〜4MB→200〜450KBになる。省略禁止）:
   ```bash
   find "public/gallery/case-XX" -name "*.jpg" | while read f; do sips -Z 1200 "$f" --out "$f" > /dev/null; done
   ```
3.5 **一覧用サムネと寸法表を作る**（2026-11追加）:
   ```bash
   npm run gallery:thumbs
   ```
   - `public/gallery/case-XX/thumb/*.webp`（高さ480px）と `app/gallery/photo-sizes.json`（元写真の幅・高さ）ができる。**両方コミットする**
   - `/gallery` 一覧の帯はこのサムネを遅延読み込みで出し、詳細ページは寸法を `<img width height>` に使う（読み込み前から枠が決まり、ずれない）
   - 作り忘れても `npm run build` の前（prebuild）に同じスクリプトが走るので表示は壊れない。寸法表に無い写真は元写真をそのまま出す（`app/gallery/images.ts`）
3. **`app/gallery/data.ts` にケースを追加**（id / label / location。既存ケースの形式に合わせる）
   - 既存写真を差し替える場合は**上書きせず新しいファイル名**で追加してsrcを更新（Next.jsキャッシュ対策）
4. **ローカルで見た目を確認してユーザーのOKを取る**（見た目変更はいきなりpushしない）
   - **ポート3000が別プロジェクトのdevサーバーのことがある**（TAKUTO SUZUKIが常駐していた実例）。`lsof -p <PID> | grep cwd` で持ち主を確認し、触らずに空きポートで起動: `lsof -nP -iTCP:<port> -sTCP:LISTEN` で3001,3002...と探す
   - 起動確認はcurlのリトライループで（Turbopackの初回コンパイルに数十秒かかる）。確認URLは `/gallery/case-XX` と画像1枚の200
   - Bashのcwdはコマンド間でリセットされることがある。**ファイル操作は絶対パスで書く**。zshは変数の語分割をしないので、リスト変数のループは `${=VAR}` を使う
5. **git commit → push origin main**（Vercel自動デプロイ。ローカル単独デプロイ禁止）
6. **sitemapは自動**: `sitemap.ts` がdata.tsからギャラリーURLを自動生成するので追加作業不要
7. **Search Console登録**: URL検査 → `/gallery/case-XX` のインデックス登録リクエスト

## 注意

- `/gallery` 一覧は2026-11からサムネ（高さ480px・WebP）を遅延読み込みしている（以前は全ケースの元写真を一括ロードしていた）。手順3.5を省くと、そのケースだけ元写真の一括ロードに戻る
- ジャーナル記事でこのケースを使う予定がある場合、**記事を書く前にケースを先にデプロイ**しておくとNotion下書きでも画像が表示される
