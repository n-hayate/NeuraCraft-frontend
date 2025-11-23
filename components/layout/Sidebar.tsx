import { FileEdit, Users, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// 親コンポーネントから受け取るPropsの型定義
interface SidebarProps {
  activeMenu: 'metadata' | 'users';  // 現在アクティブなメニュー
  onMenuChange: (menu: 'metadata' | 'users') => void;  // メニュー変更時のコールバック
}

export const Sidebar = ({ activeMenu, onMenuChange }: SidebarProps) => {
  // Zustandストアからユーザー情報を取得
  const user = useAuthStore((state) => state.user);

  // メニューアイテムの定義
  const menuItems = [
    { id: 'metadata' as const, label: 'メタデータ編集', icon: FileEdit },
    { id: 'users' as const, label: 'ユーザー管理', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* ユーザー情報エリア */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* ユーザーアイコン */}
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-orange-600" />
          </div>
          {/* ユーザー名とメールアドレス */}
          <div>
            <p className="font-medium text-gray-900">{user?.name || '管理者'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* メニューエリア */}
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;  // アイコンコンポーネントを変数に格納
          const isActive = activeMenu === item.id;  // アクティブ状態を判定

          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2
                transition-colors
                ${isActive
                  ? 'bg-secondary text-primary font-medium'  // アクティブ時のスタイル
                  : 'text-gray-700 hover:bg-gray-100'        // 非アクティブ時のスタイル
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
