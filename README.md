# NeuraCraft Frontend

食品開発ナレッジベース - フロントエンドアプリケーション

## 📖 概要

NeuraCraftは、食品開発の知見を蓄積・検索するためのナレッジ管理システムです。
研究開発チームが過去の試作データや開発レポートを簡単に検索・共有できるようにすることを目的としています。

### 主要機能

- **ログイン画面** ✅ - JWT認証によるセキュアなユーザー認証（バックエンドAPI連携済み）
- **検索画面（メイン）** ✅ - バックエンドAPIと連携したナレッジ検索、フィルタリング機能
- **ファイル登録画面** ✅ - 開発レポートやデータをメタ情報と共に登録・Azure Blobにアップロード
- **管理画面** ✅ - 登録済みナレッジのメタデータ一覧表示と管理
- **ダッシュボード** ✅ - 統計情報、ダウンロードランキング、登録トレンドなどの可視化
- **モバイル対応** ✅ - レスポンシブデザインによるモバイル端末対応

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

3. **環境変数の設定**

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください:

```env
NEXT_PUBLIC_API_BASE_URL=https://neuracraft-backend-bwagewerdrbqczch.japaneast-01.azurewebsites.net/api/v1
```

> **注意**: バックエンドAPIのURLは環境に応じて変更してください。

4. **開発サーバーの起動**
```bash
npm run dev
```

5. **ブラウザで確認**
```
http://localhost:3000/login
```

## 🔐 ログイン・ユーザー登録

本アプリケーションはバックエンドAPI（FastAPI）と連携しています。

### ユーザー登録

初回利用時は、ユーザー登録画面からアカウントを作成してください:

1. `/register` ページにアクセス
2. メールアドレス、パスワード、氏名を入力して登録

### ログイン

登録済みのアカウントでログインしてください:

- ログイン画面 (`/login`) からメールアドレスとパスワードを入力
- 認証成功後、JWTトークンがLocalStorageに保存されます
- トークンは自動的にAPIリクエストのAuthorizationヘッダーに付与されます

> **注意**: 401エラー（認証エラー）が発生した場合、自動的にログインページにリダイレクトされます。

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
│   ├── register/          # ファイル登録画面 ✅
│   │   └── page.tsx       # ファイルアップロードページ
│   ├── search/            # 検索画面（メイン） ✅
│   │   └── page.tsx       # ナレッジ検索ページ
│   ├── search-poc/        # 検索POC画面 ✅
│   │   └── page.tsx       # 検索プロトタイプページ
│   ├── admin/             # 管理画面 ✅
│   │   └── page.tsx       # メタデータ管理ページ
│   ├── playground/        # プレイグラウンド機能 ✅
│   │   └── dashboard/     # ダッシュボード
│   │       └── page.tsx   # 統計情報ダッシュボード
│   ├── mobile/            # モバイル対応 ✅
│   │   └── search/        # モバイル検索画面
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   └── globals.css        # グローバルスタイル
├── components/             # 再利用可能なコンポーネント
│   ├── ui/                # 基本UIコンポーネント ✅
│   │   ├── Input.tsx      # 入力フィールドコンポーネント
│   │   ├── Button.tsx     # ボタンコンポーネント
│   │   └── SuccessModal.tsx # 成功モーダル
│   ├── layout/            # レイアウトコンポーネント ✅
│   │   ├── AppHeader.tsx  # アプリケーションヘッダー
│   │   ├── CommonSidebar.tsx # 共通サイドバー
│   │   └── MobileHeader.tsx # モバイルヘッダー
│   ├── dashboard/         # ダッシュボードコンポーネント ✅
│   │   ├── StatCard.tsx   # 統計カード
│   │   ├── DownloadRankingList.tsx # ダウンロードランキング
│   │   └── RegistrationTrendChart.tsx # 登録トレンドチャート
│   ├── DocumentCard.tsx   # ドキュメントカード ✅
│   ├── SearchBar.tsx      # 検索バー ✅
│   └── FilterBar.tsx       # フィルターバー ✅
├── api/                    # API通信ロジック ✅
│   ├── client.ts          # Axiosクライアント設定
│   ├── auth.ts            # 認証API
│   ├── files.ts           # ファイル管理API
│   └── ai.ts              # AI関連API
├── hooks/                  # カスタムフック ✅
│   ├── useFiles.ts        # ファイル管理フック
│   ├── useDebounce.ts     # デバウンスフック
│   └── useFileDownload.ts # ファイルダウンロードフック
├── store/                  # Zustand状態管理 ✅
│   └── authStore.ts       # 認証状態管理
├── types/                  # TypeScript型定義 ✅
│   ├── auth.ts            # 認証関連の型定義
│   ├── files.ts           # ファイル関連の型定義
│   ├── knowledge.ts       # ナレッジ関連の型定義
│   └── ai.ts              # AI関連の型定義
├── utils/                  # ユーティリティ関数 ✅
│   └── performance.ts     # パフォーマンス計測
├── constants/              # 定数定義 ✅
│   └── sortOptions.ts     # ソートオプション
├── doc/                    # ドキュメント
│   ├── 仕様書/            # 仕様書
│   ├── 報告書/            # 実装報告書 ✅
│   │   └── ログイン機能実装実施報告書.md
│   └── 経緯メモ/          # 実装記録 ✅
│       ├── Chapter7実装記録.md
│       └── 文字化け問題.md
└── public/                 # 静的ファイル
    └── logo/              # ロゴ画像
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

### API接続エラーが発生する場合

1. `.env.local` ファイルが正しく設定されているか確認
2. バックエンドAPIが起動しているか確認
3. CORS設定が正しいか確認（バックエンド側）
4. ブラウザの開発者ツール（Networkタブ）でエラー詳細を確認

### 認証エラー（401）が発生する場合

1. ログインページで再度ログイン
2. LocalStorageの `authToken` を確認
3. トークンの有効期限が切れていないか確認

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
- [x] バックエンドAPI連携（JWT認証）

詳細は [ログイン機能実装実施報告書](doc/報告書/ログイン機能実装実施報告書.md) を参照してください。

### Chapter 3: 検索画面（メイン） ✅ 完了

- [x] 検索バーコンポーネント (`components/SearchBar.tsx`)
- [x] ドキュメントカードコンポーネント (`components/DocumentCard.tsx`)
- [x] フィルターバーコンポーネント (`components/FilterBar.tsx`)
- [x] 検索ページ (`app/search/page.tsx`)
- [x] バックエンドAPI連携（ファイル検索・一覧取得）
- [x] ソート機能
- [x] フィルタリング機能
- [x] パフォーマンス計測機能

### Chapter 4: ファイル登録画面 ✅ 完了

- [x] ファイルアップロードフォーム (`app/register/page.tsx`)
- [x] ドラッグ&ドロップ対応
- [x] メタデータ入力（最終製品、課題、原料、顧客、試作ID、開発担当者）
- [x] バックエンドAPI連携（FormData送信）
- [x] Azure Blob Storageへのアップロード
- [x] 成功・エラーメッセージ表示
- [x] UI/UX改善（ファイル選択時と登録完了時のメッセージ分離）

### Chapter 5: 管理画面 ✅ 完了

- [x] メタデータ一覧表示 (`app/admin/page.tsx`)
- [x] ファイル情報の表示
- [x] バックエンドAPI連携

### Chapter 6: ダッシュボード ✅ 完了

- [x] 統計情報表示 (`app/playground/dashboard/page.tsx`)
- [x] ダウンロードランキング
- [x] 登録トレンドチャート
- [x] キーワードクラウド
- [x] バックエンドAPI連携（ダッシュボード統計取得）

### Chapter 7: API連携とデータ管理 ✅ 完了

- [x] Axiosクライアント設定 (`api/client.ts`)
- [x] 認証API実装 (`api/auth.ts`)
- [x] ファイルAPI実装 (`api/files.ts`)
- [x] 型定義の完全対応 (`types/files.ts`)
- [x] カスタムフック実装 (`hooks/useFiles.ts`)
- [x] リクエスト/レスポンスインターセプター
- [x] 自動認証トークン付与
- [x] 401エラー時の自動ログアウト

詳細は [Chapter7実装記録](doc/経緯メモ/Chapter7実装記録.md) を参照してください。

## 🔌 バックエンドAPI連携

### APIエンドポイント

本アプリケーションは以下のバックエンドAPIと連携しています:

**バックエンドURL**: `https://neuracraft-backend-bwagewerdrbqczch.japaneast-01.azurewebsites.net`

**Swagger UI**: https://neuracraft-backend-bwagewerdrbqczch.japaneast-01.azurewebsites.net/docs

### 主要エンドポイント

#### 認証系
- `POST /api/v1/auth/login` - ログイン
- `POST /api/v1/auth/register` - ユーザー登録
- `GET /api/v1/auth/me` - 現在のユーザー情報取得

#### ファイル管理系
- `GET /api/v1/files/dashboard` - ダッシュボード統計
- `GET /api/v1/files/` - ファイル一覧取得（ページネーション対応）
- `GET /api/v1/files/search` - ファイル検索（フィルター対応）
- `GET /api/v1/files/{file_id}` - ファイル詳細取得
- `POST /api/v1/files/` - ファイルアップロード
- `PUT /api/v1/files/{file_id}` - ファイル更新
- `DELETE /api/v1/files/{file_id}` - ファイル削除
- `POST /api/v1/files/{file_id}/download` - ダウンロードURL取得

### 認証方式

- **JWT (JSON Web Token)** を使用
- トークンは `localStorage` に保存
- リクエスト時に自動的に `Authorization: Bearer {token}` ヘッダーを付与
- 401エラー発生時は自動的にログインページにリダイレクト

### メタデータフィールド

ファイル登録時に以下のメタデータを設定できます:

- `final_product` (最終製品)
- `issue` (課題)
- `ingredient` (成分)
- `customer` (顧客)
- `trial_id` (試作ID)
- `author` (著者)
- `status` (ステータス)
- `file_extension` (ファイル拡張子)

## ⚠️ 既知の課題

### 日本語の文字化け問題

**状況**: ファイル名とメタデータの日本語が「???」になる

**原因**: バックエンド側のUTF-8エンコーディング処理の問題

**影響**: データは登録されるが、日本語が正しく保存・表示されない

**対応**: バックエンド側の修正が必要

詳細は [文字化け問題.md](doc/経緯メモ/文字化け問題.md) を参照してください。

## 📚 参考リンク

### フロントエンド技術
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TailwindCSS v4ドキュメント](https://tailwindcss.com/docs)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Zustand公式ドキュメント](https://zustand-demo.pmnd.rs/)
- [Axios公式ドキュメント](https://axios-http.com/docs/intro)

### バックエンドAPI
- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [バックエンドSwagger UI](https://neuracraft-backend-bwagewerdrbqczch.japaneast-01.azurewebsites.net/docs)
- [バックエンドGitHubリポジトリ](https://github.com/n-hayate/Neura-Craft-backend)

## 📄 ライセンス

このプロジェクトは社内利用のみを目的としています。
