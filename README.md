# NeuraCraft Frontend

食品開発ナレッジベース - フロントエンドアプリケーション

## 📖 概要

NeuraCraftは、食品開発の知見を蓄積・検索するためのナレッジ管理システムです。
研究開発チームが過去の試作データや開発レポートを簡単に検索・共有できるようにすることを目的としています。

### 主要機能

- **ログイン画面** - セキュアなユーザー認証
- **検索画面（メイン）** - 自然言語でナレッジを検索、タグ・フィルターで絞り込み
- **ファイル登録画面** - 新しい開発レポートやデータをメタ情報と共に登録
- **管理画面** - 登録済みナレッジのメタデータ編集・管理

## 🛠️ 技術スタック

- **Next.js 16** - Reactベースのフルスタックフレームワーク（App Router）
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **TailwindCSS v4** - ユーティリティファーストCSSフレームワーク
- **Zustand** - 軽量状態管理
- **React Hook Form + Zod** - フォーム管理・バリデーション
- **Axios** - HTTP通信
- **Lucide React** - アイコンライブラリ

## 🚀 環境構築

### 前提条件

- **Node.js**: v18.0.0 以上
- **npm**: v9.0.0 以上

バージョン確認:
```bash
node --version
npm --version
```

### セットアップ手順

1. **リポジトリのクローン**
```bash
git clone <リポジトリURL>
cd NeuraCraft-frontend
```

2. **依存パッケージのインストール**
```bash
npm install
```

3. **開発サーバーの起動**
```bash
npm run dev
```

4. **ブラウザで確認**
```
http://localhost:3000
```

## 📝 利用可能なコマンド

### 開発サーバー起動
```bash
npm run dev
```
- ホットリロード有効
- デフォルトポート: 3000

### プロダクションビルド
```bash
npm run build
```

### プロダクションサーバー起動
```bash
npm start
```

### ESLintによるコード検証
```bash
npm run lint
```

## 📁 プロジェクト構成

```
NeuraCraft-frontend/
├── app/                    # Next.js App Router
│   ├── login/             # ログイン画面
│   ├── search/            # 検索画面（メイン）
│   ├── register/          # ファイル登録画面
│   ├── admin/             # 管理画面
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   └── globals.css        # グローバルスタイル
├── components/             # 再利用可能なコンポーネント
│   ├── ui/                # 基本UIコンポーネント
│   └── layout/            # レイアウトコンポーネント
├── hooks/                  # カスタムフック
├── store/                  # Zustand状態管理
├── api/                    # API通信ロジック
├── types/                  # TypeScript型定義
├── utils/                  # ユーティリティ関数
└── doc/                    # ドキュメント
```

## 🎨 TailwindCSS v4について

このプロジェクトではTailwindCSS v4を使用しています。

### カスタムカラー

`app/globals.css`で以下のカスタムカラーを定義:

- `primary` (#059669) - メインカラー（緑）
- `secondary` (#D1FAE5) - セカンダリカラー（薄緑）
- `accent` (#3B82F6) - アクセントカラー（青）

使用例:
```tsx
<button className="bg-primary text-white">ボタン</button>
```

## 🔧 トラブルシューティング

### ポート3000が既に使用されている

```bash
PORT=3001 npm run dev
```

### node_modulesの再インストール

```bash
rm -rf node_modules package-lock.json
npm install
```

### スタイルが反映されない場合

1. 開発サーバーを再起動
2. ブラウザのキャッシュをクリア（Ctrl + Shift + R）

## 📚 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TailwindCSS v4ドキュメント](https://tailwindcss.com/docs)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)

## 📄 ライセンス

このプロジェクトは社内利用のみを目的としています。
