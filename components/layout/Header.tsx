'use client';

import { useRouter } from 'next/navigation';
import { FlaskConical, HelpCircle, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Header = () => {
  // useRouter: プログラムでページ遷移を行うフック（Next.js App Router）
  const router = useRouter();

  // Zustandストアからユーザー情報とログアウト関数を取得
  const { user, logout } = useAuthStore();

  // ログアウト処理
  const handleLogout = () => {
    logout();                 // ストアの状態をクリア
    router.push('/login');    // ログインページへ遷移
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側: ロゴ */}
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-gray-900">
              食品開発ナレッジ検索
            </span>
          </div>

          {/* 中央: ナビゲーションメニュー */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => router.push('/search')}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              ナレッジ検索
            </button>
            <button
              onClick={() => router.push('/register')}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              ナレッジ登録
            </button>
            {/* 管理者のみ管理画面へのリンクを表示 */}
            {user?.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                管理
              </button>
            )}
          </nav>

          {/* 右側: ヘルプ、通知、ユーザー、ログアウト */}
          <div className="flex items-center gap-4">
            {/* ヘルプボタン */}
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* 通知ボタン（未読バッジ付き） */}
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              {/* 未読通知があることを示す赤い点 */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

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
      </div>
    </header>
  );
};
