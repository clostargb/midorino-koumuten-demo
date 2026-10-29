# 公開の手順(はじめに1回だけ)

所要時間: 30〜40分。GitHub と Cloudflare のアカウントは、すでにある前提です(なければ先に作ってください)。

## 1. 二段階認証を確かめる

GitHub・Cloudflare・Claude の3つとも、二段階認証がオンになっていることを確かめます。このサイトはアカウントを乗っ取られると書き換えられるので、ここが一番大事です。

## 2. GitHub に専用のリポジトリを作る

1. GitHub で「New repository」を押し、名前を `midorino-koumuten-demo`、**Private** にして作る(README などは追加しない)。
2. 手元で、このフォルダの中身だけを新しいリポジトリとして送る。PowerShell で:

   cd <クロスタ内部のフォルダ>\ai-site-demo
   git init -b main
   git add .
   git commit -m "初版"
   git remote add origin https://github.com/<あなたのユーザー名>/midorino-koumuten-demo.git
   git push -u origin main

## 3. main を直接書き換えられないようにする

1. リポジトリの Settings → Branches → 「Add branch ruleset」(または Branch protection rule)。
2. 対象を `main` にし、「Require a pull request before merging」をオンにする。承認者の人数は 0 のままでよい(1人で運用するため)。
3. 「Block force pushes」をオンにして保存する。

## 4. Cloudflare Pages とつなぐ

1. Cloudflare のダッシュボード → Workers & Pages → 作成 → Pages → 「Git に接続」。
2. GitHub の接続を許可するとき、「Only select repositories」で `midorino-koumuten-demo` **だけ**を選ぶ。
3. ビルドの設定:
   - フレームワーク: Astro
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `dist`
   - 環境変数: `NODE_VERSION` = `22.23.4`
4. 「保存してデプロイ」。数分で `https://midorino-koumuten-demo.pages.dev` のような URL ができる。
5. プロジェクトの設定で、プレビュー(main 以外のブランチ)のデプロイがオンになっていることを確かめる。

(Cloudflare の画面に Pages が見当たらず Workers を勧められた場合は、Workers の「Git リポジトリをインポート」で同じ設定にする)

## 5. Claude Code(Web)からつなぐ

1. https://claude.ai/code を開き、GitHub と接続する。
2. 接続を許可するとき、リポジトリは `midorino-koumuten-demo` **だけ**を選ぶ。
3. 試しに「お知らせに『テストです』という記事を1件追加して」と頼み、プルリクエストと Cloudflare の確認用URLができることを確かめる。確かめたら、そのプルリクエストはマージせずに閉じる。

## 困ったとき

- Cloudflare のビルドが失敗する → ビルドのログの最後を見る。`does not match collection schema` なら原稿の項目の書き損じ、`Node.js` の版のエラーなら `NODE_VERSION` を確かめる。
