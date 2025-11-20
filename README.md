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
http://localhost:3000/login
```

## 🔐 デモログイン情報

開発環境でのログインには以下の認証情報を使用してください:

- **メールアドレス**: `admin@example.com`
- **パスワード**: `password`

> **注意**: これはデモ用の認証情報です。本番環境では実際のAPIと連携します。

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
│   ├── login/             # ログイン画面 ✅
│   │   └── page.tsx       # ログインページ
│   ├── search/            # 検索画面（メイン）
│   ├── register/          # ファイル登録画面
│   ├── admin/             # 管理画面
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   └── globals.css        # グローバルスタイル
├── components/             # 再利用可能なコンポーネント
│   └── ui/                # 基本UIコンポーネント ✅
│       ├── Input.tsx      # 入力フィールドコンポーネント
│       └── Button.tsx     # ボタンコンポーネント
├── hooks/                  # カスタムフック
├── store/                  # Zustand状態管理 ✅
│   └── authStore.ts       # 認証状態管理
├── api/                    # API通信ロジック
├── types/                  # TypeScript型定義 ✅
│   └── auth.ts            # 認証関連の型定義
├── utils/                  # ユーティリティ関数
├── doc/                    # ドキュメント
│   ├── テキスト/          # ハンズオンテキスト
│   └── 報告書/            # 実装報告書 ✅
│       └── ログイン機能実装実施報告書.md
└── ref/                    # デザインリファレンス
    └── stitch_/           # UIデザイン画像・HTML
```

> ✅ マークは実装済みの項目を示します

## 🎨 TailwindCSS v4について

このプロジェクトではTailwindCSS v4を使用しています。

### 設定ファイル

- `tailwind.config.ts` - カラーテーマやコンテンツパスの設定
- `postcss.config.mjs` - PostCSS設定（`@tailwindcss/postcss`プラグイン使用）
- `app/globals.css` - `@import "tailwindcss"`でスタイルを読み込み

### カスタムカラー

`tailwind.config.ts`で以下のカスタムカラーを定義:

- `primary` (#007A5A) - メインカラー（緑）
- `secondary` (#D1FAE5) - セカンダリカラー（薄緑）
- `accent` (#3B82F6) - アクセントカラー（青）

使用例:
```tsx
<button className="bg-primary text-white">ボタン</button>
```

### TailwindCSS v4の特徴

- `@import "tailwindcss"` による新しいインポート方式
- `@tailwindcss/postcss` プラグインが必須
- 従来の `@tailwind base/components/utilities` から移行

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

## 🎯 実装進捗

### Chapter 2: ログイン画面 ✅ 完了

- [x] 型定義の作成 (`types/auth.ts`)
- [x] 基本UIコンポーネント (`Input.tsx`, `Button.tsx`)
- [x] 認証ストア (`store/authStore.ts`)
- [x] ログインページ (`app/login/page.tsx`)
- [x] TailwindCSS v4設定 (`tailwind.config.ts`, `postcss.config.mjs`)
- [x] バリデーション機能
- [x] パスワード表示/非表示切替
- [x] ローディング状態表示
- [x] エラーハンドリング

詳細は [ログイン機能実装実施報告書](doc/報告書/ログイン機能実装実施報告書.md) を参照してください。

### Chapter 3: 検索画面（メイン） 🚧 準備中

### Chapter 4: ファイル登録画面 📝 未実装

### Chapter 5: 管理画面 📝 未実装

## 📚 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TailwindCSS v4ドキュメント](https://tailwindcss.com/docs)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Zustand公式ドキュメント](https://zustand-demo.pmnd.rs/)

## 📄 ライセンス

このプロジェクトは社内利用のみを目的としています。
