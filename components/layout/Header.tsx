import { FlaskConical, HelpCircle, Bell, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Header = () => {
  // Zustandストアからログイン中のユーザー情報を取得
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側: ロゴとタイトル */}
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-gray-900">
              食品開発ナレッジ検索
            </span>
          </div>

          {/* 右側: ヘルプ、通知、ユーザーアイコン */}
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

            {/* ユーザー情報 */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              {/* ユーザーアイコン */}
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              {/* ユーザー名 */}
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
