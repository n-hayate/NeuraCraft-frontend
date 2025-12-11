'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Search, FileEdit, BarChart3, Settings, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

// メニュー項目の型定義
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  requiresAdmin?: boolean;  // 管理者のみ表示
}

/**
 * 全ページ共通のサイドバーコンポーネント
 * 設計書: doc\テキスト\20251208_共通サイドバー詳細設計書.md
 */
export const CommonSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // メニュー項目の定義
  const menuItems: MenuItem[] = [
    {
      id: 'search',
      label: '食品開発ナレッジ検索',
      icon: Search,
      path: '/search'
    },
    {
      id: 'register',
      label: '新規ナレッジ登録',
      icon: FileEdit,
      path: '/register'
    },
    {
      id: 'dashboard',
      label: 'ダッシュボード',
      icon: BarChart3,
      path: '/playground/dashboard'
    },
    {
      id: 'admin',
      label: 'メタデータ管理',
      icon: Settings,
      path: '/admin',
      requiresAdmin: true
    },
  ];

  // 現在のページがアクティブかどうかを判定
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-[#F7F7F7] flex flex-col z-10">
      {/* ロゴエリア */}
      <div className="py-[24px] px-[20px] flex items-center justify-center border-b border-[#D9D9D9]">
        <Image
          src="/logo/app_logo.png"
          alt="NeuraCraft"
          width={1377}
          height={1376}
          className="w-full h-auto max-w-[168px]"
          priority
        />
      </div>

      {/* メニューエリア */}
      <nav className="flex-1 py-[30px] px-[10px] space-y-[40px]">
        {menuItems.map((item) => {
          // 管理者限定メニューのフィルタリング
          if (item.requiresAdmin && user?.role !== 'admin') return null;

          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`
                w-full flex items-center gap-[10px] p-[10px] rounded-lg
                transition-colors cursor-pointer
                ${active
                  ? 'bg-[#FFCB06]'
                  : 'hover:bg-[#EFEFEF]'
                }
              `}
            >
              <Icon
                className={`w-[30px] h-[30px] ${active ? 'text-white' : 'text-[#333333]'}`}
              />
              <span
                className={`text-[14px] ${active ? 'font-bold text-white' : 'font-normal text-[#333333]'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* アカウント情報エリア */}
      <div className="h-[100px] p-[20px_10px] border-t border-[#D9D9D9]">
        <div className="flex items-center gap-[10px]">
          {/* アカウントアイコン */}
          <div className="w-[40px] h-[40px] rounded-full bg-[#FFA726] flex items-center justify-center flex-shrink-0">
            <User className="w-[24px] h-[24px] text-white" />
          </div>

          {/* ユーザー情報 */}
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-bold text-[#333333] truncate">
              {user?.name || 'ユーザー'}
            </p>
            <p className="text-[12px] text-[#A5A5A5] truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>

          {/* 開閉ボタン（将来の拡張用） */}
          <ChevronDown className="w-[16px] h-[16px] text-[#A5A5A5] flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
};
