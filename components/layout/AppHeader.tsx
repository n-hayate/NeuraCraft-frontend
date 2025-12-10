'use client';

import { useRouter } from 'next/navigation';
import { HelpCircle, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/**
 * アプリケーション内画面用のヘッダーコンポーネント
 * 設計書: doc\テキスト\20251209_ヘッダーデザイン統一_詳細設計書.md
 *
 * Figmaデザインに準拠:
 * - 左側: ページアイコン + ページタイトル
 * - 右側: ヘルプ、通知、ユーザー情報、ログアウト
 * - サイドバーと組み合わせたレイアウト
 */

interface AppHeaderProps {
  title: string;          // ページタイトル（例: "食品開発ナレッジ検索"）
  icon?: React.ReactNode; // ページアイコン
}

export const AppHeader = ({ title, icon }: AppHeaderProps) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-8">
        {/* 左側: ページタイトル */}
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* 右側: ユーザー情報とログアウト */}
        <div className="flex items-center gap-4">
          {/* ヘルプボタン */}
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* 通知ボタン */}
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ユーザー情報 */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-700">{user?.name}</span>
          </div>

          {/* ログアウトボタン */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            title="ログアウト"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
