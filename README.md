# HHKB Keytop Palette

HHKB（US配列）のキートップ配色をブラウザ上で試せる、依存関係のない静的Webアプリです。

## 主な機能

- パレットまたはカスタムカラーを選び、キー単位で配色
- 3種類のプリセット
- ブラウザへの自動保存
- URLによるデザイン共有
- スマートフォン / PC対応のレスポンシブUI

## ローカルで確認

```sh
python3 -m http.server 8000
```

ブラウザで <http://localhost:8000> を開いてください。

## GitHub Pagesへの公開

`main` ブランチへpushすると、GitHub Actionsが静的ファイルをGitHub Pagesへデプロイします。初回のみリポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

このプロジェクトはビルド処理や環境変数を必要としないため、GitHub Pagesのプロジェクトサイト（サブパス）でもそのまま動作します。
