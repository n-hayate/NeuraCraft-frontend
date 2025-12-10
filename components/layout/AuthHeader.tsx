'use client';

import Image from 'next/image';

/**
 * ログイン・登録画面用のシンプルヘッダーコンポーネント
 * 設計書: doc\テキスト\20251209_ヘッダーデザイン統一_詳細設計書.md
 *
 * Figmaデザインに準拠:
 * - 中央配置のロゴとサービス名
 * - シンプルで装飾なし
 */
export const AuthHeader = () => {
  return (
    <header className="bg-white py-6">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* ロゴアイコン */}
        <div className="w-16 h-16">
          <Image
            src="/img/logo.png"
            alt="ロゴ"
            width={64}
            height={64}
            className="mx-auto"
          />
        </div>
        {/* サービス名 */}
        <h1 className="text-xl font-bold text-gray-900">
          食品開発ナレッジベース
        </h1>
      </div>
    </header>
  );
};
