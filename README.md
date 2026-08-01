# HHKB Keytop Palette

HHKB（英語配列・日本語配列）のキートップ配色をブラウザ上で試せる、TypeScript製の静的Webアプリです。

## 主な機能

- パレットまたはカスタムカラーを選び、キー単位で配色
- 英語配列と日本語配列の切り替え
- 3種類のプリセット
- ブラウザへの自動保存
- URLによるデザイン共有
- スマートフォン / PC対応のレスポンシブUI

## ローカルで確認

```sh
npm install
npm run dev
```

表示されたローカルURLをブラウザで開いてください。

## GitHub Pagesへの公開

`main` ブランチへpushすると、GitHub Actionsが `npm ci` と `npm run build` を実行し、生成された `dist` をGitHub Pagesへデプロイします。初回のみリポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

このプロジェクトは環境変数を必要としないため、GitHub Pagesのプロジェクトサイト（サブパス）でもそのまま動作します。
